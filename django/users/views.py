import os
import uuid
import coreapi
from django.contrib import auth
from rest_framework import generics

import json
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.schemas import AutoSchema
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from users import DEALER_SOURCES, DEALER_ROLES, MEMBEE_MAPPED_ROLES, MEMBEE_DEALER_ROLES
import requests
from dealers.models import Dealer
from core.serializers import UploadResumeSerializer
from core.utils.membee import Membee
from core.utils.utility import IsDealer
from jobs.models import JobSearch, Job, JobApplication, JobDepartment
from jobs.serializers import LoginSerializer
from users.models import DealerProfiles, EmailConfirmation
from users.models import DealerProfiles as CADAProfile, Resume, ContactAction, Profile, UserUpdatePassword
from users.serializers import ProfileSerializer, ContactSerializer, ResumeSearchSerializer
from users.utility.utility import Register, ProfileLogin, CADAAuthentication, CreateCoverLetter, DeleteCoverLetter, \
    CoverLetterStatus, SaveUserResume, ResumeStatus, ResumeSearchableStatus, DeleteResume, CreateSearch, \
    EditSavedSearch, SaveProfileInfo, FilterBasedResumeSearch, ContactUsMessage, SearchResume, ProcessUrlParams, \
    UserRelationWithResume, VerifyEmailSend, AuthenticationError
from users.utility.utility import AuthenticationToken
from CarsAndJobs.local_settings import CADA_AUTH_URL, CADA_USERNAME, CADA_PASSWORD, CADA_MEMBER_DETAILS_URL
from CarsAndJobs.settings import LAST_LOGIN_CUTOFF_DATE, \
    CADA_DEALER_INITIAL_BALANCE, TADA_DEALER_INITIAL_BALANCE, CADA_DEALER_INITIAL_BALANCE_ACTIVE, \
    TADA_DEALER_INITIAL_BALANCE_ACTIVE, CADA_AUTH_BASE_URL

from datetime import datetime
from dateutil import parser
import pytz
from users import DEALER_SOURCES, DEALER_ROLES
from CarsAndJobs.local_settings import CADA_AUTH_URL, CADA_USERNAME, CADA_PASSWORD, MEMBEE_APIKEY, MEMBEE_CLIENTID, \
    MEMBEE_APPID, MEMBEE_EXCHANGE_TOKEN_URL, MEMBEE_GET_TADA_DATA_URL
from django.utils import timezone
from django.views.generic import View
from rest_framework.exceptions import APIException, AuthenticationFailed, NotAcceptable, ParseError
from collections import defaultdict, OrderedDict

utc = pytz.UTC
FILTERS = {
    "modifiedDate": "updated_on",
    "-modifiedDate": "-updated_on",
    "lastName": "profile_resume__last_name",
    "-lastName": "-profile_resume__last_name"
}


class Registration(GenericAPIView):
    """
    User Registration using email,  first_name, last_name and password
    :parameters required : \n  *email, \n *password, \n -first_name, \n-last_name
    """
    authentication_classes = ()
    permission_classes = ()
    serializer_class = ProfileSerializer

    def post(self, request):
        try:  # check if the required fields are present
            email = request.data["email"]
            password = request.data["password"]
            first_name = request.data["first_name"]
            last_name = request.data["last_name"]
            province = request.data["province"]
            phone = request.data["phone"]
        except KeyError as e:
            return Response(data={"status": 406, "message": "parameter {e} missing".format(e=str(e))},
                            status=status.HTTP_400_BAD_REQUEST)

        if first_name!="" and last_name!="" and province!="":

            register = Register(request.data)
            if register.status:
                return Response(data={"status": 200, "data": register.response_data}, status=status.HTTP_200_OK)
            else:
                return Response(data={"status": 409, "message": register.message}, status=status.HTTP_409_CONFLICT)
        else:
            return Response(data={"status": 402, "message": "Blank Value not Accepted"}, status=status.HTTP_400_BAD_REQUEST)


class Login(GenericAPIView):
    """
    User Login using email and password
    :parameters(required) : \n -email \n -password
    """
    schema = AutoSchema(
        manual_fields=[
            coreapi.Field("email", description="email"),
            coreapi.Field("password", description="password"),
        ]
    )

    authentication_classes = ()
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        try:
            email = request.data["email"]
            password = request.data["password"]
        except KeyError as e:
            return Response(data={"message": "please pass valid parameters"}, status=status.HTTP_400_BAD_REQUEST)
        user_data = ProfileLogin(email=email, password=password)

        if user_data:
            user = Profile.objects.get(email__iexact=email)

            if user.is_dealer:
                return Response(data={"message": "Oops! You should Login through CADA or TADA Login", "data": {}},
                                status=status.HTTP_401_UNAUTHORIZED)
            if user.is_verified:

                # Updating Last login
                user.last_login = timezone.now()
                user.save()
                return Response(data={"message": "logged in successfully", "data": user_data},
                                    status=status.HTTP_200_OK)
            else:
                return Response(data={"message": "Please Verify your email"}, status=status.HTTP_401_UNAUTHORIZED)

        else:
            return Response(data={"message": "email/password combination failed"},
                            status=status.HTTP_401_UNAUTHORIZED)


class ProfileInfo(APIView):
    """
    Retrieves particular profile information
    :parameter : \n -Token is required in the header \n for e.g. JWT <token>
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response(request.user.to_json, status=status.HTTP_200_OK)

    def post(self, request):
        # check whether parameters are passed
        try:
            email = request.data["email"]
        except KeyError as e:
            return Response(data={"message": "please pass valid parameters"}, status=status.HTTP_400_BAD_REQUEST)
        data = SaveProfileInfo(user=request.user, data=request.data)
        return Response(request.user.to_json if not data.get("error", None) else data,
                        status=status.HTTP_200_OK if not data.get("error", None) else status.HTTP_400_BAD_REQUEST)



def update_credits(user, all_dealers, dealerProfile):
    # Give $5 to CADA Users and $1 to TADA

    if dealerProfile is None:
        return False

    dealer = dealerProfile.dealer

    if dealer.is_dealer_group:

        if dealerProfile.source == DEALER_SOURCES[0][0]:
            all_dealers = all_dealers.exclude(is_dealer_group=True).filter(source=DEALER_SOURCES[0][0])
            # CADA Dealer Group
            for sub_dealer in all_dealers:
                if not sub_dealer.initial_balance_credited:
                    sub_dealer.balance += CADA_DEALER_INITIAL_BALANCE
                    sub_dealer.initial_balance_credited = True
                    sub_dealer.save()

        elif dealerProfile.source == DEALER_SOURCES[1][0]:
            # TADA Dealer Group
            for sub_dealer in all_dealers:
                sub_dealer = Dealer.objects.filter(slug=sub_dealer['id'], source=DEALER_SOURCES[1][0]).first()
                if not sub_dealer.initial_balance_credited:
                    sub_dealer.balance += TADA_DEALER_INITIAL_BALANCE
                    sub_dealer.initial_balance_credited = True
                    sub_dealer.save()

        dealer.initial_balance_credited = True
        dealer.save()

    else:
        # CASE: WHEN NONE OF DEALERS IS DEALER GROUP
        if (dealerProfile.source == DEALER_SOURCES[0][0]):
            # CADA Dealer
            for sub_dealer in all_dealers:
                if not sub_dealer.initial_balance_credited:
                    sub_dealer.balance += CADA_DEALER_INITIAL_BALANCE
                    sub_dealer.initial_balance_credited = True
                    sub_dealer.save()

        elif (dealerProfile.source == DEALER_SOURCES[1][0]):
            # TADA Dealer
            for sub_dealer in all_dealers:
                if not sub_dealer.initial_balance_credited:
                    sub_dealer.balance += TADA_DEALER_INITIAL_BALANCE
                    sub_dealer.initial_balance_credited = True
                    sub_dealer.save()

    return True


class CADALogin2(APIView):
    """
    Login to third party  service CADA some changes for test on prod.
    """
    authentication_classes = ()
    permission_classes = ()

    schema = AutoSchema(
        manual_fields=[
            coreapi.Field("username", description="cada username"),
            coreapi.Field("password", description="cada password")]
    )
    isDealerGroup = False

    def post(self, request):
        try:
            email = request.data["username"]
            password = request.data["password"]
            if email:
                email = email.strip().lower()
            else:
                return Response(data={"message": "username cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)
            try:

                user = Profile.objects.get(email=email)
                if user.only_allowed_TADA_login:
                    return Response(data={"error": "Kindly login through TADA.ca"}, status=499)# status= 499 is custome status code
            except:
                pass


        except KeyError as e:
            return Response(data={"message": "please pass valid parameters"}, status=status.HTTP_400_BAD_REQUEST)
        cada_token = CADAAuthentication(username=email, password=password).authenticate_for_login(username=email,
                                                                                                  password=password)

        if cada_token:
            # Checking Entry into Profile Table
            user = self.get_or_create_user_profile(email)

            # Fetch IMIS From Server
            payload = self.fetch_imis_id_from_server(cada_token, email)

            dealer_profile = self.get_or_create_dealer_profile(payload, user, email)
            dealer_data = self.fetch_dealer_data_from_cada(cada_token, dealer_profile)
            retundata = self.manage_dealers(dealer_data, dealer_profile)

            dealers = []
            all_dealers = Dealer.objects.filter(source_dealer_group_id=dealer_profile.imis_id, source=DEALER_SOURCES[0][0])
            for dealer in all_dealers:
                dealerData = {
                    "id": dealer.slug,
                    "name": dealer.dealer_name,
                    "is_suspended":dealer.is_suspended
                }

                dealers.append(dealerData)

            token = AuthenticationToken(user)
            role = dealer_profile.role
            responseData = {
                "data": {
                    "cada_token": cada_token,
                    "token": token,
                    "isDealer": user.is_dealer,
                    "role": role,
                    "dealers": dealers,
                    "usersource": dealer_profile.source,
                    "imis_id": dealer_profile.imis_id,
                    "user_id": dealer_profile.user_id,
                    "isDealerGroup": self.isDealerGroup,
                },
                "message": "Logged in successfully"
            }

            if (not user.is_staff) and (CADA_DEALER_INITIAL_BALANCE_ACTIVE):
                self.cada_update_credits(all_dealers, dealer_profile)


            return Response(data=responseData, status=status.HTTP_200_OK)
        else:
            return Response(data={"message": "email/password combination failed"},
                            status=status.HTTP_401_UNAUTHORIZED)


    def get_or_create_user_profile(self, email):
        """
        Get or Creates New user
        :param email: User Email
        :return: User Object
        """
        try:
            user = Profile.objects.get(email=email)
        except:
            user = Profile.objects.create(email=email, username=email)
            user.password = email
            user.is_dealer = True

        # last_login_cutoff_date = datetime.strptime(LAST_LOGIN_CUTOFF_DATE, '%Y-%m-%d').replace(tzinfo=utc)
        last_login = user.last_login
        user.last_login = timezone.now()
        user.is_dealer = True
        user.is_active = True
        user.save()
        return user


    def fetch_imis_id_from_server(self, cada_token, email):
        """
        This Hits CADA Server, Fetches and returns IMIS_ID
        :param cada_token: CADA Auth Token
        :param email: User Email
        :return: Object of Dealer IMIS_ID
        """
        header = {
            "Content-Type": "application/json",
            "Authorization": "Bearer {}".format(cada_token)
        }
        queryParams = {
            "Parameter" : email
        }
        try:
            server_url = os.path.join(CADA_AUTH_BASE_URL,
                                      "api/IQA?QueryName=$/CADA Custom Queries/CarsAndJobs/Dealeruserinformation")
            res = requests.get(
                url=server_url,
                params=queryParams,
                headers=header)
        except:
            raise APIException("Unable to connect to CADA Servers")

        data = res.json()
        if res.status_code != 200:
            raise APIException("Cada Servers returned Error, Status: {0}".format(res.status_code))

        if data.get("Count") != 1:
            raise APIException("Cada servers returned more than one or zero records. One record expected")


        entity = data.get("Items").get("$values")[0]
        properties = entity.get("Properties")
        payload = {}

        for prop in properties.get("$values"):
            payload["imis_id"] = prop.get("Value") if prop.get(
                "Name") == "Id" else payload.get("imis_id", None)

        return payload

    def get_or_create_dealer_profile(self, payload, user, email):
        """
        Get or Create Dealer
        :param payload: Object of IMIS_ID
        :param user: Profile Object
        :param email: User Email
        :return: Dealer Profile Object
        """
        try:
            dealer_profile = DealerProfiles.objects.get(imis_id=payload["imis_id"])
            dealer_profile.user = user
            dealer_profile.save()

        except:
            # If record with IMIS_ID not found in Table, Create it
            dealer_profile = DealerProfiles.objects.create(
                username=email,
                imis_id=payload["imis_id"],
                user=user,
                role=DEALER_ROLES[3][0]
            )
        return dealer_profile

    def fetch_dealer_data_from_cada(self, cada_token, dealer_profile):
        """
        Hits CADA Server and Fetches Dealer Info from it
        :param cada_token: CADA Server AUTH Token
        :param dealer_profile: Dealer Profile Obj of User
        :return: Dealer Data
        """
        header = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {0}'.format(cada_token)
        }
        queryParams = OrderedDict({
            'QueryName': '$/CADA Custom Queries/CarsAndJobs/Dealerinformation',
            'Parameter': dealer_profile.imis_id
        })
        # url = os.path.join(CADA_AUTH_BASE_URL, 'api/IQA')

        url =CADA_MEMBER_DETAILS_URL+dealer_profile.imis_id
        # res = requests.get(url=url, params=queryParams,
        #                    headers=header)
        res = requests.get(url=url,
                           headers=header)

        if res.status_code != 200:
            # raise APIException("Status: {0}, Queryparam: {1}".format(res.status_code, queryParams))
            logfile = open("/home/ubuntu/carsnjobs/CarsAndJobs/Logs/Cadaloginerrorlogfile.log", "a")
            logfile.write(" Time= "+str(datetime.now())+" Response = "+res.json()['ValidationResults']['Errors']['$values'][0]['Message']+"\n")
            logfile.close()
            raise APIException("{status} Unable to reach CADA Servers, "
                               "Please retry in sometime. "
                               "Please reach support if problem persists.".format(status=res.status_code))

        data = res.json()
        return data


    def manage_dealers(self, dealer_data, dealer_profile):
        """
        Base Function for Dealer Management
        :param dealer_data: Dealer Data Fetched from CADA Server
        :param dealer_profile: DealerProfile Obj of User Trying to signIn
        :return: None
        """

        if dealer_data.get("Count") == 1:
            entity = dealer_data.get("Items").get("$values")[0]
            dealer_payload = self.get_dealer_payload(entity)
            dealer = self.get_or_create_dealer(dealer_payload)

            # ASSOCIATING DEALER WITH DEALER PROFILE
            dealer_profile.dealer = dealer
            dealer_profile.save()

        else:
            # Case of Dealer Group with multiple dealers
            dealer_group = None
            dealer = None
            if len(dealer_data.get("Items").get("$values")) == 0:
                raise APIException("CADA Server returned No Dealers. "
                                   "Please reach support if problem persists.")

            for entity in dealer_data.get("Items").get("$values"):  # list of dealers
                dealer_payload = self.get_dealer_payload(entity)

                if dealer_payload.get("old_dealer_id") is None:
                    continue

                else:
                    dealer = self.get_or_create_dealer(dealer_payload)

                    if dealer.membership_type == "DLRGC":
                        # Case If Dealer Group
                        dealer_profile.dealer_id = dealer.id
                        dealer_group = dealer  # set the dealer group
                        dealer.is_dealer_group = True
                        dealer.save()
                        dealer_profile.save()

                        self.isDealerGroup = True


            if (dealer) and (dealer_profile.dealer is None):
                dealer_profile.dealer = dealer
                dealer_profile.save()

            if dealer_group:
                Dealer.objects.filter(source_dealer_group_id=dealer_group.source_dealer_group_id,
                                      is_dealer_group=False).update(dealer_group_id=dealer_group.id)

        return None



    def get_or_create_dealer(self, dealer_payload):
        """
        Checks for Presence of Dealers, If not Creates new Dealer
        :param dealer_payload: Organised Dealer Payload madeup from Dealer Data
        :return: Dealer Object
        """

        # TO check whether new record is in payload
        dealer = Dealer.objects.filter(
            old_dealer_id=dealer_payload.get("old_dealer_id"),
            source=DEALER_SOURCES[0][0]).first()

        if dealer is None:
            dealer = Dealer.objects.create(**dealer_payload)

        dealer.old_dealer_id = dealer_payload["old_dealer_id"]
        dealer.billing_city = dealer_payload["billing_city"]
        dealer.billing_country = dealer_payload["billing_country"]
        dealer.billing_phone = dealer_payload["billing_phone"]
        dealer.billing_prov = dealer_payload["billing_prov"]
        dealer.billing_postalcode = dealer_payload["billing_postalcode"]
        dealer.billing_address1 = dealer_payload["billing_address1"]
        dealer.billing_address2 = dealer_payload["billing_address2"]
        dealer.franchise_name = dealer_payload["franchise_name"]
        dealer.dealer_name = dealer_payload["dealer_name"]
        dealer.membership_type = dealer_payload["membership_type"]
        dealer.source_dealer_group_id = dealer_payload["source_dealer_group_id"]
        dealer.source = DEALER_SOURCES[0][0]
        dealer.save()

        return dealer


    def get_dealer_payload(self, entity):
        """
        Creates Dealer Payload from Dealer Data
        :param entity: DealerData fetched from CADA Server
        :return: Organized Dealer Payload
        """

        properties = entity.get("Properties")
        payload = {}

        for prop in properties.get("$values"):  # each dealer
            payload["old_dealer_id"] = prop.get("Value") if prop.get(
                "Name") == "DealershipId" else payload.get("old_dealer_id", None)
            payload["billing_city"] = prop.get("Value") if prop.get(
                "Name") == "billingcity" else payload.get("billing_city", None)
            payload["billing_country"] = prop.get("Value") if prop.get(
                "Name") == "billingcountry" else \
                payload.get("billing_country", None)
            payload["billing_phone"] = prop.get("Value") if prop.get(
                "Name") == "billingphone" else payload.get(
                "billing_phone", None)
            payload["billing_prov"] = prop.get("Value") if prop.get("Name") == "billingprov" else \
                payload.get("billing_prov", None)
            payload["billing_postalcode"] = prop.get("Value") if prop.get(
                "Name") == "billingpostcode" else payload.get("billing_postalcode", None)
            payload["billing_address1"] = prop.get("Value") if prop.get(
                "Name") == "billing1" else payload.get(
                "billing_address1", None)
            payload["billing_address2"] = prop.get("Value") if prop.get(
                "Name") == "billing2" else payload.get(
                "billing_address2", None)
            payload["franchise_name"] = prop.get("Value") if prop.get(
                "Name") == "franchiseName" else \
                payload.get("franchise_name", None)
            payload["dealer_name"] = prop.get("Value") if prop.get(
                "Name") == "dealerName" else payload.get(
                "dealer_name", None)
            payload["membership_type"] = prop.get("Value") if prop.get(
                "Name") == "membershipType" else \
                payload.get("membership_type", None)
            payload["source_dealer_group_id"] = prop.get("Value") if prop.get(
                "Name") == "pimarycontact" else payload.get(
                "source_dealer_group_id", None)
            payload["source"] = DEALER_SOURCES[0][0]

        return payload

    def cada_update_credits(self, all_dealers, dealer_profile):
        """
        Give $5 initial_credit to First Login CADA Dealers

        :param all_dealers: QuerySet of All Associated Dealers
        :param dealer_profile: DealerProfile of Dealer Trying to Signin
        :return: True: If Successful, else False
        """

        if dealer_profile is None:
            return False

        dealer_profile_associated_dealer = dealer_profile.dealer

        if dealer_profile_associated_dealer.is_dealer_group:

            all_dealers = all_dealers.exclude(is_dealer_group=True).filter(source=DEALER_SOURCES[0][0])
            # CADA Dealer Group
            for sub_dealer in all_dealers:
                if not sub_dealer.initial_balance_credited:
                    sub_dealer.balance += CADA_DEALER_INITIAL_BALANCE
                    sub_dealer.initial_balance_credited = True
                    sub_dealer.save()

            dealer_profile_associated_dealer.initial_balance_credited = True
            dealer_profile_associated_dealer.save()

        else:
            # CASE: WHEN NONE OF DEALERS IS DEALER GROUP
            for sub_dealer in all_dealers:
                if not sub_dealer.initial_balance_credited:
                    sub_dealer.balance += CADA_DEALER_INITIAL_BALANCE
                    sub_dealer.initial_balance_credited = True
                    sub_dealer.save()

        return True


class TADALogin2(APIView):
    """
    TADA/Membee login view for exchanging token with ID some change in fabfile.
    """

    authentication_classes = ()
    permission_classes = ()
    header = {
        "Content-Type": "application/json",
    }
    is_dealer_group = False

    def get(self, request):
        if request.GET.get("token"):
            membee_obj = Membee(request.GET.get("token"))
            if membee_obj.save_dealer_profile():
                return Response(data={membee_obj.user_data}, status=status.HTTP_200_OK)
            else:
                return Response(data={"error": "bad request"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(data={"message": "token missing"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        saved_dealers = []
        token = self.validate_token(request)
        user_data_from_tada_server = self.fetch_user_details(token)

        if user_data_from_tada_server.get("error"):

            return Response(data={"message": "Please pass valid token"}, status=status.HTTP_401_UNAUTHORIZED)

        else:
            user_id = user_data_from_tada_server.get('UserID', None)
            self.__sync_user_records_with_tada_server(user_data_from_tada_server)

            tada_data_response = self.fetch_dealer_data(user_id)

            dealer_payload = self.set_dealer_payload(tada_data_response)

            user_profile, dealer_profile, saved_dealers = self.manage_dealers(dealer_payload, tada_data_response,
                                                                              user_data_from_tada_server, saved_dealers)

            if (not user_profile.is_staff) and (TADA_DEALER_INITIAL_BALANCE_ACTIVE):
                self.tada_update_credits(user_profile, saved_dealers)

            response_data = {
                "data": {
                    "token": AuthenticationToken(user_profile),
                    "isDealer": user_profile.is_dealer,
                    "role": dealer_profile.role,
                    "dealers": saved_dealers,
                    "usersource": dealer_profile.source,
                    "imis_id": "",
                    "user_id": user_profile.id,
                    "is_dealer_group": self.is_dealer_group,
                },
                "message": "Logged in successfully"
            }
            return Response(data=response_data, status=status.HTTP_200_OK)

    def __sync_user_records_with_tada_server(self,user_data_from_tada_server):
        """
        Sync Django Server roles with TADA Server
        :param user_data_from_tada_server:
        :return: None
        """

        user_id = user_data_from_tada_server.get('UserID', None)
        email = user_data_from_tada_server.get('Email', None).lower()
        membee_role = user_data_from_tada_server.get('Roles', [])

        role = self.__get_dealer_role(membee_role)

        user_obj = Profile.objects.filter(new_id=user_id).first()
        if user_obj is None:
            return

        dealer_profile_obj = DealerProfiles.objects.filter(user=user_obj).first()

        if dealer_profile_obj is None:
            return

        # Updating User Model Data
        user_obj.email = email
        user_obj.username = email
        user_obj.save()

        # Updating DealerProfile Model
        dealer_profile_obj.username = email
        dealer_profile_obj.role = role
        dealer_profile_obj.save()

        return

    @staticmethod
    def __get_dealer_role(membee_role):
        """
        This will map dealer roles from TADA server with our Server defined roles.
        :param membee_role:
        :return: django compatible role
        """

        if isinstance(membee_role, list):
            if MEMBEE_DEALER_ROLES[0] in membee_role:
                membee_role = MEMBEE_DEALER_ROLES[0]
            elif MEMBEE_DEALER_ROLES[1] in membee_role:
                membee_role = MEMBEE_DEALER_ROLES[1]
            elif MEMBEE_DEALER_ROLES[2] in membee_role:
                membee_role = MEMBEE_DEALER_ROLES[2]
            else:
                membee_role = membee_role[0]

        role_dict = defaultdict(lambda : DEALER_ROLES[0][0], MEMBEE_MAPPED_ROLES)
        role = role_dict[membee_role]

        return role

    def validate_token(self, request):
        try:
            token = request.data["token"]
            if token:
                token = token.strip().lower()

        except KeyError as e:
            return Response(data={"message": "please pass valid token"}, status=status.HTTP_400_BAD_REQUEST)

        return token


    def fetch_user_details(self, token):

        queryParams = {
            "APIKey": MEMBEE_APIKEY,
            "ClientID": MEMBEE_CLIENTID,
            "AppID": MEMBEE_APPID,
            "Token": token
        }
        res = requests.get(
            url=MEMBEE_EXCHANGE_TOKEN_URL,
            params=queryParams,
            headers=self.header)

        if res.status_code != 200:
            # return Response(data={"message": "Membee Servers returned Error"},
            #                 status=status.HTTP_400_BAD_REQUEST)
            return {"error": "Invalid token"}

        data = res.json()

        tada_role = data.get('Roles', [])

        # Throw Error on Associate Role
        for role in tada_role:
            if role and role.lower().strip() in ['associate']:
                raise AuthenticationError(
                    detail="Oops! You are not allowed to Login. "
                           "Please reach Support to remove this restriction.")

        return data


    def fetch_dealer_data(self, user_id):
        queryParams = {
            "APIKey": MEMBEE_APIKEY,
            "ClientID": MEMBEE_CLIENTID,
            "AppID": MEMBEE_APPID,
            "UserID": user_id
        }

        tada_data_response = requests.get(
            url=MEMBEE_GET_TADA_DATA_URL,
            params=queryParams,
            headers=self.header)

        if tada_data_response.status_code != 200:
            return Response(data={"message": "Membee Servers returned Error"},
                            status=status.HTTP_400_BAD_REQUEST)
        tada_data_response = json.loads(tada_data_response.text)
        return tada_data_response

    def set_dealer_payload(self, tada_data):
        """
        Make up a organised Payload from Tada Dealer Data received from TADA Server
        :tada_data : All dealers except Dealer Group

        :return : Dealers Payload
        """
        dealer_data = []
        rest = tada_data['<Dealers>k__BackingField']
        for dealer in rest:
            dealer_details = {
                "dealer_name": dealer['DealerName'],
                "dealer_new_id": dealer['DealerID']
            }
            dealer_data.append(dealer_details)
        return dealer_data


    def manage_dealers(self, dealer_payload, tada_data, user_data_from_tada_server, saved_dealers):
        """
        Base Function for Dealer Management
        : dealer_payload: Dealer Data (Except group Dealer) from TADA Server
        : tada_data : Dealer Group Data
        : user_data_from_tada_server : User Info from TADA Server

        :return :
            user_profile : User Object,
            dealer_profile : Dealer Profile Obj,
            saved_dealers[] :
        """

        email = user_data_from_tada_server.get('Email', None).strip().lower()
        membee_role = user_data_from_tada_server.get('Roles', [])
        role = self.__get_dealer_role(membee_role)

        if len(dealer_payload) > 1:
            # CASE OF DEALER GROUP
            main_dealer = self.get_or_create_dealer(
                                dealer_name=tada_data["<DealerGroupName>k__BackingField"],
                                dealer_new_id=tada_data["<DealerGroupId>k__BackingField"])

            self.is_dealer_group = True

            main_dealer.is_dealer_group = True
            main_dealer.source = DEALER_SOURCES[1][0]
            main_dealer.save()
            dealer_group = {
                "id": main_dealer.slug,
                "name": main_dealer.dealer_name,
                "is_suspended":main_dealer.is_suspended
            }
            saved_dealers.append(dealer_group)

        elif len(dealer_payload) == 1:
            # CASE OF SINGLE DEALER
            main_dealer = self.get_or_create_dealer(
                dealer_name=tada_data["<Dealers>k__BackingField"][0]["DealerName"],
                dealer_new_id=tada_data["<Dealers>k__BackingField"][0]["DealerID"])
        else:
            # Return If No Dealer is Found
            raise NotAcceptable( 'Login failed, no dealer is associated with this user.')

        for single_dealer in dealer_payload:
            # ADDING ALL DEALERS
            try:
                dealer = self.get_or_create_dealer(
                    dealer_name=single_dealer["dealer_name"],
                    dealer_new_id=single_dealer["dealer_new_id"])

                if len(dealer_payload) > 1 and main_dealer:
                    dealer.dealer_group_id = main_dealer.id
                    dealer.save()

                associated_dealers = {
                    'id': dealer.slug,
                    'name': dealer.dealer_name,
                    "is_suspended":dealer.is_suspended
                }
                saved_dealers.append(associated_dealers)

            except:
                raise ParseError('Login failed, Unable to Update Dealers')

        user_profile = self.get_or_create_user(user_data_from_tada_server)

        dealer_profile = self.get_or_create_dealer_profile(email=email, user_profile=user_profile, main_dealer=main_dealer, role=role)
        # last_login_cutoff_date = datetime.strptime(LAST_LOGIN_CUTOFF_DATE, '%Y-%m-%d').replace(tzinfo=utc)
        last_login = user_profile.last_login
        user_profile.last_login = timezone.now()
        user_profile.save()

        return user_profile, dealer_profile, saved_dealers


    def get_or_create_user(self, user_data_from_tada_server):
        '''
        Get or Create User

        : user_data_from_tada_server : User Data received from TADA Server
        :return
            User Profile Object
        '''
        first_name = user_data_from_tada_server.get('FirstName', None)
        last_name = user_data_from_tada_server.get('LastName', None)
        user_id = user_data_from_tada_server.get('UserID', None)
        email = user_data_from_tada_server.get('Email', None).strip().lower()

        user_profile = Profile.objects.filter(new_id=user_id).first()

        if user_profile is None:
            try:
                user_profile = Profile.objects.filter(email=email).first()
                if user_profile is None:
                    user_profile = Profile.objects.create(
                        email=email,
                        username=email,
                        is_dealer=True
                    )
                user_profile.new_id = user_id
                user_profile.is_dealer = True
                user_profile.first_name = first_name
                user_profile.last_name = last_name
                user_profile.is_active = True
                user_profile.save()

            except:
                return Response(
                    data={"message": 'Unable to update User Records, Please Try Again'},
                    status=status.HTTP_400_BAD_REQUEST)
        else:
            user_profile.is_active = True
            user_profile.first_name = first_name
            user_profile.last_name = last_name
            user_profile.save()

        return user_profile

    def get_or_create_dealer_profile(self, email, user_profile, main_dealer, role):
        """
        Get or Create Dealer Profile Obj
        : email: User Email
        : user_profile : User Obj
        : main_dealer: Dealer to Associate with Dealer Profile

        return : Dealer Profile Object
        """
        dealer_profile = DealerProfiles.objects.filter(username=email).first()

        if dealer_profile is None:
            dealer_profile = DealerProfiles.objects.create(
                source=DEALER_SOURCES[1][0],
                username=email,
                user=user_profile,
                dealer=main_dealer,
                role=role
            )

        else:
            dealer_profile.source = DEALER_SOURCES[1][0]
            dealer_profile.user = user_profile
            dealer_profile.dealer = main_dealer
            dealer_profile.save()

        return dealer_profile

    def get_or_create_dealer(self, dealer_name, dealer_new_id):
        """
        Get or Create Dealer Object
        : dealer_name : Name of Dealer
        : dealer_new_id : New If of Dealer received from TADA Server
        return :
            dealer_obj : Dealer Object
        """
        dealer_obj = Dealer.objects.filter(new_dealer_id=dealer_new_id, source=DEALER_SOURCES[1][0]).first()
        if dealer_obj is None:
            dealer_obj = Dealer.objects.create(
                new_dealer_id=dealer_new_id,
                source=DEALER_SOURCES[1][0],
                dealer_name=dealer_name,
            )
        else:
            # Syncing Dealer Data with TADA Server
            dealer_obj.dealer_name = dealer_name
            dealer_obj.save()

        return dealer_obj

    def tada_update_credits(self, user, all_dealers):
        """
        Give $1 to TADA Dealers Only, except Dealer Group
        all_dealer : Array of all_dealers except Dealer Group

        : return :
            True , if Balance allocation is successful
        """
        for each_dealer in all_dealers:
            each_dealer = Dealer.objects.filter(slug=each_dealer['id'], source=DEALER_SOURCES[1][0]).first()
            if (not each_dealer.initial_balance_credited) and (not each_dealer.is_dealer_group):
                each_dealer.balance += TADA_DEALER_INITIAL_BALANCE
            each_dealer.initial_balance_credited = True
            each_dealer.save()

        return True

class ProfileCoverLetter(APIView):
    """
    Cover letters related to the user
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response(data=request.user.user_cover_letters, status=status.HTTP_200_OK)


class AddCoverLetter(APIView):
    """
    Add cover letter to the profile
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, cover_letter_id=None):
        try:
            name = request.data['name']
            description = request.data["description"]
            text = request.data["text"]
            active = request.data["active"]
        except KeyError as e:
            return Response(data={
                "error": "Parameter {e} missing".format(e=str(e))
            }, status=status.HTTP_400_BAD_REQUEST)
        if cover_letter_id:
            response = CreateCoverLetter(request.user, request.data, cover_letter_id=cover_letter_id)
            if not response.get("error"):
                return Response(data=response)
            else:
                return Response(data=response, status=response.get("status"))
        return Response(data=CreateCoverLetter(request.user, request.data), status=status.HTTP_200_OK)

    def delete(self, request, cover_letter_id):
        delete_status = DeleteCoverLetter(cover_letter_id, request.user)
        if delete_status.get("error"):
            return Response(data=delete_status, status=delete_status.get("status", 304))
        return Response(data=delete_status, status=status.HTTP_200_OK)


class SetCoverLetterActive(APIView):
    """
    Set cover letter active status true/false
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, cover_letter_id):
        obj_cover_letter = CoverLetterStatus(request.data, request.user, cover_letter_id)
        active_status = obj_cover_letter.set_active()
        if active_status.get("error"):
            return Response(data=active_status, status=active_status.get("status", status.HTTP_304_NOT_MODIFIED))
        return Response(data=active_status, status=status.HTTP_200_OK)


class GetAllResumes(APIView):
    """
    Retrieves list of resumes
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response(data=[resume.to_json for resume in request.user.resume.all()], status=status.HTTP_200_OK)


class ResumeUpload(APIView):
    """
    Uploads Resume file
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser,)

    def post(self, request):
        try:
            file_obj = None
            for file in request.FILES.items():
                file_obj = file[1]
                print(file_obj)
            if file_obj:
                serializer = UploadResumeSerializer(data={"file": file_obj})
                if serializer.is_valid():
                    serializer.save()
                    return Response(data={
                        "id": serializer.data["slug"],
                        "url": serializer.data["file"]
                    }, status=status.HTTP_200_OK)
            raise ValidationError("Invalid File type")
        except ValidationError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "bad request"})


class SaveResume(APIView):
    """
    Save/Delete Resume for the profile
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, resume_id=None):

        if resume_id:
            save_status = SaveUserResume(request.user, request.data, resume_id=resume_id)
        else:
            save_status = SaveUserResume(request.user, request.data)
        if save_status.get("error"):
            return Response(data={"error": save_status.get("error")}, status=save_status.get("status", 404))
        else:
            return Response(data=save_status, status=status.HTTP_200_OK)

    def delete(self, request, resume_id):
        delete_status = DeleteResume(resume_id, request.user)
        if delete_status.get("error"):
            return Response(data={"error": delete_status.get("error")}, status=delete_status.get("status", 404))
        else:
            return Response(data=delete_status, status=status.HTTP_200_OK)

    def get(self, request, resume_id):
        try:
            return Response(data=Resume.objects.get(slug=resume_id).to_json, status=status.HTTP_200_OK)
        except Resume.DoesNotExist:
            return Response(data={"error": "bad request"}, status=status.HTTP_400_BAD_REQUEST)


class ResumeSearch(APIView):
    """
    Searching Resume according to search criteria
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        start_index = request.data.get("start_index", 0)
        count = request.data.get("count", 50)
        if request.data.get('filter'):
            resume_queryset = Resume.objects.all()
            filters = request.data.get("filter")
            data_filter = ProcessUrlParams(filters)
            data_filter = {k: v for k, v in data_filter.items() if v is not None}
            if data_filter:
                all_user_filters = {}
                new_data_filters = data_filter
                if request.data.get("filter").get("keywords"):
                    resume_queryset = SearchResume(keyword=request.data.get("filter").get("keywords"))
                for user_filter in new_data_filters:
                    # print("User", user_filter)
                    # key, value = user_filter
                    if user_filter == 'province':
                        all_user_filters['province'] = data_filter["province"]
                        # del data_filter['province']

                    if user_filter == 'department__slug':
                        job_dept = data_filter["department__slug"]
                        deptObj = list(JobDepartment.objects.filter(slug=job_dept).values('users'))
                        users_list = [x['users'] for x in deptObj]
                        all_user_filters['id__in'] = users_list
                        # del data_filter['department__slug']

                    if user_filter == 'city':
                        all_user_filters['city'] = data_filter["city"]
                        # del data_filter['city']
                    if user_filter == 'coop_student':
                        all_user_filters['coop_student'] = data_filter["coop_student"]
                        # del data_filter['coop_students']
                    if user_filter == 'new_graduate':
                        all_user_filters['new_graduate'] = data_filter["new_graduate"]
                        # del data_filter['new_graduates']
                users = Profile.objects.filter(**all_user_filters,resume__isnull=False).all()[start_index:count+start_index]
                total_users = Profile.objects.filter(**all_user_filters,resume__isnull=False).all().count()
                all_resume_slugs = [resume.slug for user in users for resume in user.resume.all()]
                if data_filter.get("order"):
                    orders = data_filter.get("order")
                    resume_queryset = resume_queryset.filter(slug__in=all_resume_slugs).order_by(FILTERS[orders])
                else:
                    resume_queryset = resume_queryset.filter(slug__in=all_resume_slugs)

                    # resume_queryset = resume_queryset.profile_resume.all()
                    # resume_queryset = resume_queryset.filter(**data_filter)

            resume_queryset = UserRelationWithResume(resume_queryset).check_data()
            return Response(data={"total_count": len(resume_queryset),
                                  "resumes": resume_queryset[start_index:count + start_index], })

        else:

            data = [resume.resume_search_json for resume in Resume.objects.all()]

            return Response(data={"total_count": len(data), "resumes": data[int(start_index):int(start_index) + count]})


class NewResumeSearch(generics.ListCreateAPIView):
    """
    Searching Resume according to search criteria
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = ResumeSearchSerializer

    def get_queryset(self):
        start_index = self.request.data.get("start_index", 0)
        count = self.request.data.get("count", 50)
        all_resume_slugs = Resume.objects.all().count()
        if self.request.data.get('filter'):
            resume_queryset = Resume.objects.all()
            filters = self.request.data.get("filter")
            data_filter = ProcessUrlParams(filters)
            data_filter = {k: v for k, v in data_filter.items() if v is not None}

            if data_filter:
                all_user_filters = {}
                new_data_filters = data_filter
                if self.request.data.get("filter").get("keywords"):
                    all_user_filters['resume__resume__text__icontains'] = self.request.data.get("filter").get("keywords")
                    # resume_queryset = SearchResume(keyword=self.request.data.get("filter").get("keywords")).values('slug')
                for user_filter in new_data_filters:

                    if user_filter == 'province':
                        all_user_filters['province'] = data_filter["province"]

                    if user_filter == 'department__slug':
                        job_dept = data_filter["department__slug"]
                        deptObj = list(JobDepartment.objects.filter(slug=job_dept).values('users'))
                        users_list = [x['users'] for x in deptObj]
                        all_user_filters['id__in'] = users_list

                    if user_filter == 'city':
                        all_user_filters['city'] = data_filter["city"]
                    if user_filter == 'coop_student':
                        all_user_filters['coop_student'] = data_filter["coop_student"]
                    if user_filter == 'new_graduate':
                        all_user_filters['new_graduate'] = data_filter["new_graduate"]
                users = Profile.objects.filter(**all_user_filters,resume__isnull=False).distinct()
                all_resume_slugs = [resume.slug for user in users for resume in user.resume.all()]

                if data_filter.get("order"):
                    orders = data_filter.get("order")
                    resume_queryset = resume_queryset.filter(slug__in=all_resume_slugs).order_by(FILTERS[orders])[start_index:start_index+count]
                else:
                    resume_queryset = resume_queryset.filter(slug__in=all_resume_slugs)[start_index:start_index+count]
        else:
            resume_queryset = Resume.objects.all()[start_index:count + start_index]
        return [resume_queryset,len(all_resume_slugs)]

    def create(self, request, *args, **kwargs):

        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset[0], many=True)
        data =serializer.data
        data = filter(lambda x: x is not None, data)
        return Response(data={"total_count": queryset[1], "resumes": data})

class JobApplicationsListByJob(APIView):
    """
    Listing of job application of a particular job
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def get(self, request, job_id):
        try:
            job_obj = Job.objects.get(slug=job_id)
            print(job_obj)

            data = [job_app.job_posting for job_app in job_obj.jobapplication_set.all()]
            return Response(data=data, status=status.HTTP_200_OK)
        except Job.DoesNotExist:
            return Response(data={"error": "Job Posting not found!"}, status=status.HTTP_404_NOT_FOUND)


class JobApplicationByAppId(APIView):
    """
    Job application by id
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request, job_app_id):
        try:
            print(job_app_id)
            data = JobApplication.objects.get(slug=job_app_id).job_posting
            return Response(data=data, status=status.HTTP_200_OK)
        except JobApplication.DoesNotExist:
            return Response(data={"error": "application doesn't exist"}, status=status.HTTP_404_NOT_FOUND)


class SaveResumeStatus(APIView):
    """
    Sets resume active status true/false
    """

    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, resume_id):
        obj_resume = ResumeStatus(request.data, request.user, resume_id)
        active_status = obj_resume.set_active()
        if active_status.get("error"):
            return Response(data=active_status, status=active_status.get("status", status.HTTP_304_NOT_MODIFIED))
        return Response(data=active_status, status=status.HTTP_200_OK)


class SaveResumeSearchableStatus(APIView):
    """
    Sets resume searchable status
    """

    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, resume_id):
        obj_resume = ResumeSearchableStatus(request.data, request.user, resume_id)
        active_status = obj_resume.set_active()
        if active_status.get("error"):
            return Response(data=active_status, status=active_status.get("status", status.HTTP_304_NOT_MODIFIED))
        return Response(data=active_status, status=status.HTTP_200_OK)


class SaveSearch(APIView):
    """
    Saves/Deletes user search
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, search_id=None):
        try:
            name = request.data["name"]
            filter = request.data["filter"]
        except KeyError as e:
            return Response(data={"error": "parameter {e} missing".format(e=str(e))},
                            status=status.HTTP_400_BAD_REQUEST)
        if not search_id:
            create_status = CreateSearch(request.user, request.data)
        else:
            create_status = EditSavedSearch(search_id, request.user, request.data)
        if create_status.get("error"):
            return Response(data=create_status, status=create_status.get("status", 404))
        return Response(data=create_status, status=status.HTTP_200_OK)

    def delete(self, request, search_id=None):
        try:
            job_obj = JobSearch.objects.get(slug=search_id)
            job_obj.delete()
            return Response(data={"message": "deleted successfully"}, status=status.HTTP_200_OK)
        except JobSearch.DoesNotExist:
            return Response(data={"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)


class SavedSearches(APIView):
    """
    List of saved searches
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response(data=request.user.searches, status=status.HTTP_200_OK)


class ContactUs(APIView):
    """
    Sends Email Message to Admin and Receipient from User
    """
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        try:
            first_name = request.data["first_name"]
            last_name = request.data["last_name"]
            email = request.data["email"].strip().lower()
            text = request.data["text"]
            mobile = request.data["mobile"]

        except KeyError as e:
            return Response(data={"status": 400, "message": "parameter {e} missing".format(e=str(e))},
                            status=status.HTTP_400_BAD_REQUEST)
        if email and text:

            ContactUsMessage(request.data)
            ContactAction.objects.sendemail(email=email, first_name=first_name, last_name=last_name, data= request.data)
            return Response(data={"message": "Ok"}, status=status.HTTP_200_OK)
        else:
            return Response(data={"message": "Fill all the columns"}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPassword(APIView):
    """
    Forgot your password
    """
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        email = request.data.get("email", None).lower()
        if email:
            try:
                user = Profile.objects.get(email=email)
            except ObjectDoesNotExist as e:
                user = None
            if user:
                if (not user.is_dealer) or (user.is_staff and user.is_dealer):
                    try:
                        token = str(uuid.uuid1())
                        token_obj = UserUpdatePassword.objects.get(user_id=user.id)
                        token_obj.token = token
                        token_obj.save()

                        UserUpdatePassword.objects.sendemail(email, token)
                    except ObjectDoesNotExist as e:
                        token_obj = UserUpdatePassword.objects.create(
                            user_id=user.id,
                            token=str(uuid.uuid1()))
                        UserUpdatePassword.objects.sendemail(email, token_obj.token)

                    return Response(data={"email": email, "message": "Check your email to update your password", },
                                    status=status.HTTP_200_OK)
                else:
                    return Response(data={"message": "jobseeker email does not exists."},
                                    status=status.HTTP_404_NOT_FOUND)
        return Response(data={"message": "Provide registered email to update your password"},
                        status=status.HTTP_400_BAD_REQUEST)


class ResetPassword(APIView):
    """
    Reset Password
    """
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        token = request.data.get("token", None)
        email = request.data.get("email", None).lower()
        new_password = request.data.get("new-password", None)
        print(new_password)
        if token and email and new_password:
            try:
                user = Profile.objects.get(email=email)
                user_obj = UserUpdatePassword.objects.get(token=token, user_id=user.id)
                user.set_password(new_password)
                user.save()
                user_obj.delete()
                user = Profile.objects.get(email=email)
                user.is_verified= True
                user.save()
                return Response(data={"message": "Password reset successfully"}, status=status.HTTP_200_OK)
            except ObjectDoesNotExist as e:
                pass
        return Response(data={"message": "Invalid Request"}, status=status.HTTP_400_BAD_REQUEST)


class Logout(APIView):
    """
    Invalidate token
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        # request.user.token.delete()
        auth.logout(request)
        return Response(data={"message": "logout successfully"}, status=status.HTTP_200_OK)




class VerifyEmail(APIView):
    """
    Reset Password
    """
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        token = request.data.get("token", None)
        email = request.data.get("email", None).lower()
        user = Profile.objects.get(email=email)
        if user.is_verified!=True:
            if token and email:
                try:
                    user = Profile.objects.get(email=email)
                    confirm_token = EmailConfirmation.objects.get(confirmation_token=token, user_id=user.id)
                    if confirm_token and user.is_verified == False:
                        user.is_verified = True
                        user.save()

                        return Response(data={"message": "Email verified successfully"}, status=status.HTTP_200_OK)
                except ObjectDoesNotExist as e:
                    pass
        else:
            return Response(data={"message": "Email already Verified"}, status=status.HTTP_200_OK)

        return Response(data={"message": "Invalid Request"}, status=status.HTTP_400_BAD_REQUEST)


class SendVerificationEmail(APIView):
    """
    verification email will be sent to user and dealer whose staff access =True
    """
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        email = request.data.get("email", None).lower()
        if email:
            try:
                user = Profile.objects.get(email=email)
            except ObjectDoesNotExist as e:
                # user = None
                return Response(data={"message": "Provide registered email"},
                                status=status.HTTP_400_BAD_REQUEST)

            if user.is_verified != True:
                if (not user.is_dealer) or (user.is_staff and user.is_dealer):
                    try:
                        token = str(uuid.uuid1())
                        token_obj = EmailConfirmation.objects.get(user_id=user.id)
                        token_obj.confirmation_token = token
                        token_obj.save()

                        EmailConfirmation.objects.send(email, token)
                    except ObjectDoesNotExist as e:
                        token_obj = EmailConfirmation.objects.create(
                            user_id=user.id,
                            confirmation_token=str(uuid.uuid1()))
                        EmailConfirmation.objects.send(email, token_obj.confirmation_token)

                    return Response(data={"email": email, "message": "verify your email", },
                                    status=status.HTTP_200_OK)
                else:
                    return Response(data={"message": "Dealer user has not staff access."},
                                    status=status.HTTP_401_UNAUTHORIZED)

            else:
                return Response(data={"message": "Email is already verified"},
                                status=status.HTTP_409_CONFLICT)
        return Response(data={"message": "Provide registered email"},
                        status=status.HTTP_400_BAD_REQUEST)



class Bot(View):

    def get(self, request):
        return render(template_name='users/bot.html', request=request)
