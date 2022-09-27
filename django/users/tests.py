from django.test import TestCase
import datetime
from django.utils import timezone
from rest_framework import status

from CarsAndJobs.settings import CADA_DEALER_INITIAL_BALANCE
from users import DEALER_SOURCES
from users.models import Profile, DealerProfiles
from dealers.models import Dealer
from django.test.utils import setup_test_environment
from django.test import Client
from rest_framework.test import APIRequestFactory
import json
from rest_framework.test import APITestCase
from django.urls import reverse
from users.utility.utility import AuthenticationToken
from rest_framework.test import APIClient
from dealers.models import Dealer
from jobs.models import JobCreditHistory


class CadaSingleTestCase(APITestCase):
    url = reverse("users:cada login")
    data = {
        "username": 'vishal.a@smartbuzz.net',
        "password": '1234cada'
    }
    imis_id = 13592
    total_expected_dealers = 1
    response = None

    def setUp(self):
        client_class = APIClient()
        self.response = client_class.post(path=self.url, data=self.data, format='json')
        self.assertEqual(self.response.status_code, 200, msg="CADA Login Returned Error")

    def test_one_dealer_returned_payload(self):
        """
        CADA Login: 1 Dealer Test Case
        """
        data = self.response.data
        message = self.response.data["message"]
        data = data.get("data", None)

        self.assertNotEqual(data, None, msg="No Data returned for CADALogin API")

        payload = {
            "userId" : data.get("userId", data.get("user_id", None)),
            "imisId" : data.get("imisId", data.get("imis_id", None)),
            "token" : data.get("token", None),
            "cadaToken" : data.get("cadaToken",  data.get("cada_token", None)),
            "isDealer" : data.get("isDealer", data.get("is_dealer", None)),
            "usersource": data.get("usersource", None),
            "role": data.get("role", None),
            "dealers": data.get("dealers", []),
        }
        for key, value in payload.items(): self.isValueEmpty(key, value)

        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        print("Passed: Login Returned Payload Check, Email: {0}".format(self.data["username"]))


    def isValueEmpty(self, key, value):

        self.assertNotEqual(value, None, msg="Empty Data returned for {}".format(key))

        if (key == 'dealers'):
            self.assertNotEqual(len(value), 0, msg="Empty Data returned for {}".format(key))

            for dealer in value:
                self.assertNotEqual(dealer.get("id", None), None, msg="Missing Parameters dealerId in Dealers Array")
                self.assertNotEqual(dealer.get("name", None), None, msg="Missing Parameters Dealer Name in Dealers Array")

        if (key == 'usersource'):
            self.assertEqual(value, "CADA", msg="Source Must be CADA")

        return True

    def test_delete_user(self):
        """
        This Deletes and Recreates User
        :return: None
        """
        user = Profile.objects.filter(email=self.data["username"])
        self.assertNotEqual(user, None, msg="User with email: {0} Not Created.".format(self.data["username"]))
        self.assertEqual(user.count(), 1, msg="Multiple Users with email: {0} exists.".format(self.data["username"]))

        # Deleting User
        user.delete()
        self.setUp()
        user = Profile.objects.filter(email=self.data["username"]).first()
        self.assertNotEqual(user, None, msg="User with email: {0} Not Created.".format(self.data["username"]))

        self.assertFalse(user.is_staff, msg="User has staff Access, No Credit")
        print("Passed: Delete User, Email: {0}".format(self.data["username"]))





    def test_delete_dealer(self):
        """
        This Test Deletes a Dealer

        :return: None
        """
        dealer = Dealer.objects.filter(source_dealer_group_id=self.imis_id)
        self.assertEqual(dealer.count(), self.total_expected_dealers,
                         msg="Dealer Count is More than {0}, Imis_id={1}".format(self.imis_id,
                                                                                 self.total_expected_dealers))
        delete_obj = dealer.delete()
        self.assertEqual(delete_obj[0], self.total_expected_dealers,
                         msg="Deleted Dealers {0}, Total Dealers {1}, Unmatch!".format(delete_obj[0],
                                                                                       self.total_expected_dealers))
        # Recreating Dealer
        self.setUp()
        dealer = Dealer.objects.filter(source_dealer_group_id=self.imis_id, source=DEALER_SOURCES[0][0])
        self.assertEqual(dealer.count(), self.total_expected_dealers,
                         msg="After Delete: Dealer Count is More than {0}, Imis_id={1}".format(self.total_expected_dealers,
                                                                                 self.imis_id))
        print("Passed: Delete dealer, Email: {0}".format(self.data["username"]))

    def test_dealer_profile_association(self):
        """
        Checks Association with Dealer Profiles
        :return: None
        """
        dealerProfile = DealerProfiles.objects.filter(imis_id=self.imis_id, source=DEALER_SOURCES[0][0])
        self.assertEqual(dealerProfile.count(), 1,
                         msg="DealerProfile Count is not equal to 1, Imis_id={0}".format(self.imis_id))

        dealerProfile.delete()

        # Recreating Dealer
        self.setUp()
        dealerProfile = DealerProfiles.objects.filter(imis_id=self.imis_id, source=DEALER_SOURCES[0][0])
        self.assertEqual(dealerProfile.count(), 1,
                         msg="DealerProfile Count is not equal to 1, Imis_id={0}".format(self.imis_id))

        # Dealer Should be Associated
        dealerProfile = dealerProfile.first()
        self.assertNotEqual(dealerProfile.dealer, None,
                         msg="DealerProfile Count is not equal to 1, Imis_id={0}".format(self.imis_id))

        # Association should not be with Dealer Group for this case
        self.assertFalse(dealerProfile.dealer.is_dealer_group,
                         msg="DealerProfile is Associated with dealer group, Imis_id={0}".format(self.imis_id))
        print("Passed: Dealer Profile Association, Email: {0}".format(self.data["username"]))


    def test_check_initial_balance(self):
        """
        Checks Initial Balance for CADA Dealers
        :return: None
        """
        dealers = Dealer.objects.filter(source_dealer_group_id=self.imis_id, source=DEALER_SOURCES[0][0])
        without_initial_balance = dealers.filter(initial_balance_credited=False).count()
        self.assertEqual(without_initial_balance, 0,msg="Initial Balance not Credited to Some Dealers with imis_id {0}"
                              .format(self.imis_id))

        # No Dealer should be alloted other than Initial Balance
        dealers_with_no_initial_balance = list(filter(lambda dealer: dealer.balance != CADA_DEALER_INITIAL_BALANCE, dealers))
        self.assertEqual(len(dealers_with_no_initial_balance), 0, msg="Some Dealers are not alloted Initial Balance")
        print("Passed: Check Initial Balance, Email: {0}".format(self.data["username"]))

    def test_check_job_credit_history(self):
        """
        Checks for Credit History
        :return: None
        """
        jc = JobCreditHistory.objects.all()
        self.assertNotEqual(jc.count(), 0, msg="Job Credit History not Created")
        #Check for Quantity other than 0
        dealers_having_history_other_than_initial_balance = jc.exclude(quantity = CADA_DEALER_INITIAL_BALANCE).count()
        self.assertEqual(dealers_having_history_other_than_initial_balance, 0, msg="Job Credit History created for Balance other than CADA Initial Balance.")
        print("Passed: Check Job Credit History, Email: {0}".format(self.data["username"]))



class CadaDealerGroupTestCase(APITestCase):
    url = reverse("users:cada login")
    data = {
        "username": 'karine.mathieu@excellence-peterbilt.com',
        "password": 'Cada567'
    }
    imis_id = 13605
    total_expected_dealers = 3
    response = None

    def setUp(self):
        client_class = APIClient()
        self.response = client_class.post(path=self.url, data=self.data, format='json')
        self.assertEqual(self.response.status_code, 200, msg="CADA Login Returned Error")

    def test_multiple_dealers_returned_payload(self):
        """
        CADA Login: Multiple Dealer Test Case
        """
        data = self.response.data
        message = self.response.data["message"]
        data = data.get("data", None)

        self.assertNotEqual(data, None, msg="No Data returned for CADALogin API")

        payload = {
            "userId" : data.get("userId", data.get("user_id", None)),
            "imisId" : data.get("imisId", data.get("imis_id", None)),
            "token" : data.get("token", None),
            "cadaToken" : data.get("cadaToken",  data.get("cada_token", None)),
            "isDealer" : data.get("isDealer", data.get("is_dealer", None)),
            "usersource": data.get("usersource", None),
            "role": data.get("role", None),
            "dealers": data.get("dealers", []),
        }
        for key, value in payload.items(): self.isValueEmpty(key, value)

        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        print("Passed: Returned Payload Check, Email: {0}".format(self.data["username"]))


    def isValueEmpty(self, key, value):

        self.assertNotEqual(value, None, msg="Empty Data returned for {}".format(key))

        if (key == 'dealers'):
            self.assertNotEqual(len(value), 0, msg="Empty Data returned for {}".format(key))

            for dealer in value:
                self.assertNotEqual(dealer.get("id", None), None, msg="Missing Parameters dealerId in Dealers Array")
                self.assertNotEqual(dealer.get("name", None), None, msg="Missing Parameters Dealer Name in Dealers Array")

        if (key == 'usersource'):
            self.assertEqual(value, "CADA", msg="Source Must be CADA")

        return True

    def test_delete_user(self):
        """
        This Deletes and Recreates User
        :return: None
        """
        user = Profile.objects.filter(email=self.data["username"])
        self.assertNotEqual(user, None, msg="User with email: {0} Not Created.".format(self.data["username"]))
        self.assertEqual(user.count(), 1, msg="Multiple Users with email: {0} exists.".format(self.data["username"]))

        # Deleting User
        user.delete()
        self.setUp()
        user = Profile.objects.filter(email=self.data["username"]).first()
        self.assertNotEqual(user, None, msg="User with email: {0} Not Created.".format(self.data["username"]))

        self.assertFalse(user.is_staff, msg="User has staff Access, No Credit")
        print("Passed: Delete User Check, Email: {0}".format(self.data["username"]))

    def test_delete_dealer(self):
        """
        This Test Deletes a Dealer
        :return: None
        """
        dealer = Dealer.objects.filter(source_dealer_group_id=self.imis_id, source=DEALER_SOURCES[0][0])
        self.assertEqual(dealer.count(), self.total_expected_dealers,
                         msg="Dealer Count is More than {0}, Imis_id={1}".format(self.total_expected_dealers,
                                                                                 self.imis_id))
        # Deleting ALL Associated Dealers
        deleted_count, _ = dealer.delete()

        # Matching Delete Numbers with Actual Dealers
        self.assertEqual(deleted_count, self.total_expected_dealers,
                         msg="Deleted Dealers {0}, Total Dealers {1}, Unmatch!".format(deleted_count,
                                                                                       self.total_expected_dealers))
        # Recreating Dealer
        self.setUp()
        dealer = Dealer.objects.filter(source_dealer_group_id=self.imis_id, source=DEALER_SOURCES[0][0])

        #NEW ADDED DEALERS After Delete
        self.assertEqual(dealer.count(), self.total_expected_dealers,
                         msg="After Delete: Dealer Count is more than {0}, Imis_id={1}".format(self.total_expected_dealers,
                                                                                 self.imis_id))
        print("Passed: Delete Dealer Check, Email: {0}".format(self.data["username"]))

    def test_dealer_group_association(self):
        """
        This Tests Dealer Group Association with Dealers
        :return: None
        """
        dealer = Dealer.objects.filter(source_dealer_group_id=self.imis_id, source=DEALER_SOURCES[0][0])
        dealer_group = dealer.filter(is_dealer_group=True)
        self.assertEqual(dealer_group.count(), 1,
                         msg="Dealer Group is more than {0} or 0, Should be 1 Only Imis_id={1}".format(
                             self.total_expected_dealers, self.imis_id))

        dealer_group = dealer_group.first()
        self.assertEqual(dealer_group.dealer_group, None,
                         msg="Dealer Group should not be associated with any dealer, Imis_id={0}".format(
                             self.imis_id))

        dealers = dealer.filter(is_dealer_group=False)
        self.assertEqual(dealers.count(), 2,
                         msg="Dealer Count is more than {0}, Imis_id={1}".format(self.total_expected_dealers,
                                                                                 self.imis_id))
        for dealer in dealers:
            self.assertNotEqual(dealer.dealer_group, None, msg="Not Associated with Dealer Group")

        print("Passed: Dealer Group Association, Email: {0}".format(self.data["username"]))



    def test_dealer_profile_association(self):
        """
        Checks Association with Dealer Profiles
        :return: None
        """
        dealerProfile = DealerProfiles.objects.filter(imis_id=self.imis_id, source=DEALER_SOURCES[0][0])
        self.assertEqual(dealerProfile.count(), 1,
                         msg="DealerProfile Count is not equal to 1, Imis_id={0}".format(self.imis_id))

        dealerProfile.delete()

        # Recreating Dealer
        self.setUp()
        dealerProfile = DealerProfiles.objects.filter(imis_id=self.imis_id, source=DEALER_SOURCES[0][0])
        self.assertEqual(dealerProfile.count(), 1,
                         msg="DealerProfile Count is not equal to 1, Imis_id={0}".format(self.imis_id))

        # Dealer Should be Associated
        dealerProfile = dealerProfile.first()
        self.assertNotEqual(dealerProfile.dealer, None,
                         msg="DealerProfile Count is not equal to 1, Imis_id={0}".format(self.imis_id))

        # Association should be with Dealer Group for this case
        self.assertTrue(dealerProfile.dealer.is_dealer_group,
                         msg="DealerProfile is not Associated with dealer group, Imis_id={0}".format(self.imis_id))

        print("Passed: Dealer Profile Association, Email: {0}".format(self.data["username"]))


    def test_check_initial_balance(self):
        """
        Checks Initial Balance for CADA Dealers
        :return: None
        """
        dealers = Dealer.objects.filter(source_dealer_group_id=self.imis_id, source=DEALER_SOURCES[0][0])
        without_initial_balance = dealers.filter(initial_balance_credited=False).count()
        self.assertEqual(without_initial_balance, 0,msg="Initial Balance not Credited to Some Dealers with imis_id {0}"
                              .format(self.imis_id))

        # Filtering Dealers with No Initial Balance
        dealers_with_no_initial_balance = list(filter(lambda dealer: (dealer.balance != CADA_DEALER_INITIAL_BALANCE and dealer.is_dealer_group == False) , dealers))
        self.assertEqual(len(dealers_with_no_initial_balance), 0, msg="Some Dealers are not alloted Initial Balance")
        print("Passed: Initial Balance Check, Email: {0}".format(self.data["username"]))


    def test_dealer_group_in_credit_history(self):
        """
        Checks if Dealer Group Has Credit History
        :return: None
        """
        dealer_group = Dealer.objects.filter(source_dealer_group_id=self.imis_id, source=DEALER_SOURCES[0][0]).first()
        dealer_group_credit_history = JobCreditHistory.objects.filter(dealer_id=dealer_group.id)

        self.assertEqual(dealer_group_credit_history.count(), 0, msg="Credit history entry found for Dealer Group.")
        print("Passed: Dealer Group in Credit History Check, Email: {0}".format(self.data["username"]))

    def test_check_job_credit_history(self):
        """
        Checks for Credit History
        :return: None
        """
        jc = JobCreditHistory.objects.all()
        self.assertNotEqual(jc.count(), 0, msg="Job Credit History not Created")
        #Check for Quantity other than 0
        dealers_having_history_other_than_initial_balance = jc.exclude(quantity = CADA_DEALER_INITIAL_BALANCE).count()
        self.assertEqual(dealers_having_history_other_than_initial_balance, 0, msg="Job Credit History created for Balance other than CADA Initial Balance.")
        print("Passed: Check Job Credit History, Email: {0}".format(self.data["username"]))

class CadaDealersNoGroupTestCase(APITestCase):
    url = reverse("users:cada login")
    data = {
        "username": 'dtibbo@capitalautogroup.ca',
        "password": 'Cada123'
    }
    imis_id = 13328
    total_expected_dealers = 4
    response = None

    def setUp(self):
        client_class = APIClient()
        self.response = client_class.post(path=self.url, data=self.data, format='json')
        self.assertEqual(self.response.status_code, 200, msg="CADA Login Returned Error")

    def test_multiple_dealers_returned_payload(self):
        """
        CADA Login: Multiple Dealer, No Dealer Group Test Case
        """
        data = self.response.data
        message = self.response.data["message"]
        data = data.get("data", None)

        # Returned Data should not be Empty/None
        self.assertNotEqual(data, None, msg="No Data returned for CADALogin API")

        payload = {
            "userId" : data.get("userId", data.get("user_id", None)),
            "imisId" : data.get("imisId", data.get("imis_id", None)),
            "token" : data.get("token", None),
            "cadaToken" : data.get("cadaToken",  data.get("cada_token", None)),
            "isDealer" : data.get("isDealer", data.get("is_dealer", None)),
            "usersource": data.get("usersource", None),
            "role": data.get("role", None),
            "dealers": data.get("dealers", []),
        }
        for key, value in payload.items(): self.isValueEmpty(key, value)

        # Status Should be 200
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        print("Passed: Returned Payload Check, Email: {0}".format(self.data["username"]))


    def isValueEmpty(self, key, value):

        self.assertNotEqual(value, None, msg="Empty Data returned for {}".format(key))

        if (key == 'dealers'):
            self.assertNotEqual(len(value), 0, msg="Empty Data returned for {}".format(key))

            for dealer in value:
                self.assertNotEqual(dealer.get("id", None), None, msg="Missing Parameters dealerId in Dealers Array")
                self.assertNotEqual(dealer.get("name", None), None, msg="Missing Parameters Dealer Name in Dealers Array")

        if (key == 'usersource'):
            self.assertEqual(value, "CADA", msg="Source Must be CADA")

        return True

    def test_delete_user(self):
        """
        This Deletes and Recreates User
        :return: None
        """
        user = Profile.objects.filter(email=self.data["username"])
        self.assertNotEqual(user, None, msg="User with email: {0} Not Created.".format(self.data["username"]))
        self.assertEqual(user.count(), 1, msg="Multiple Users with email: {0} exists.".format(self.data["username"]))

        # Deleting User
        user.delete()
        self.setUp()
        user = Profile.objects.filter(email=self.data["username"]).first()
        self.assertNotEqual(user, None, msg="User with email: {0} Not Created.".format(self.data["username"]))

        self.assertFalse(user.is_staff, msg="User has staff Access, No Credit")
        print("Passed: Delete User Check, Email: {0}".format(self.data["username"]))


    def test_delete_dealer(self):
        """
        This Test Deletes a Dealer
        :return: None
        """
        dealer = Dealer.objects.filter(source_dealer_group_id=self.imis_id, source=DEALER_SOURCES[0][0])
        self.assertEqual(dealer.count(), self.total_expected_dealers,
                         msg="Dealer Count is More than {0}, Imis_id={1}".format(self.total_expected_dealers,
                                                                                 self.imis_id))
        # Deleting ALL Associated Dealers
        deleted_count, _ = dealer.delete()

        # Matching Delete Numbers with Actual Dealers
        self.assertEqual(deleted_count, self.total_expected_dealers,
                         msg="Deleted Dealers {0}, Total Dealers {1}, Unmatch!".format(deleted_count,
                                                                                       self.total_expected_dealers))
        # Recreating Dealer
        self.setUp()
        dealer = Dealer.objects.filter(source_dealer_group_id=self.imis_id, source=DEALER_SOURCES[0][0])

        #Matching NEW ADDED DEALERS After Delete with Actual Numbers
        self.assertEqual(dealer.count(), self.total_expected_dealers,
                         msg="After Delete: Dealer Count is more than {0}, Imis_id={1}".format(self.total_expected_dealers,
                                                                                 self.imis_id))
        print("Passed: Delete Dealer Check, Email: {0}".format(self.data["username"]))

    def test_dealer_group_association(self):
        """
        This Tests Dealer Group Association with Dealers
        :return: None
        """
        dealer = Dealer.objects.filter(source_dealer_group_id=self.imis_id, source=DEALER_SOURCES[0][0])
        dealer_group = dealer.filter(is_dealer_group=True)
        # Checking Dealer Group Count
        self.assertEqual(dealer_group.count(), 0,
                         msg="Dealer Group is {0}, Should be 0 Only Imis_id={1}".format(
                             dealer_group.count(),self.imis_id))

        dealer_group = dealer_group.first()

        # Checking Saved Dealers Count with Expected Dealers
        dealers = dealer.filter(is_dealer_group=False)
        self.assertEqual(dealers.count(), self.total_expected_dealers,
                         msg="Dealer Count is more than {0}, Imis_id={1}".format(self.total_expected_dealers,
                                                                                 self.imis_id))
        for dealer in dealers:
            # All SubDealers Should not have a Dealer Group
            self.assertEqual(dealer.dealer_group, None, msg="Not Associated with Dealer Group")

        print("Passed: Dealer Group Association Check, Email:{0}".format(self.data["username"]))



    def test_dealer_profile_association(self):
        """
        Checks Association with Dealer Profiles
        :return: None
        """
        dealerProfile = DealerProfiles.objects.filter(imis_id=self.imis_id, source=DEALER_SOURCES[0][0])
        self.assertEqual(dealerProfile.count(), 1,
                         msg="DealerProfile Count is not equal to 1, Imis_id={0}".format(self.imis_id))

        dealerProfile.delete()

        # Recreating Dealer
        self.setUp()
        dealerProfile = DealerProfiles.objects.filter(imis_id=self.imis_id, source=DEALER_SOURCES[0][0])
        self.assertEqual(dealerProfile.count(), 1,
                         msg="DealerProfile Count is not equal to 1, Imis_id={0}".format(self.imis_id))

        # Dealer Should be Associated
        dealerProfile = dealerProfile.first()
        self.assertNotEqual(dealerProfile.dealer, None,
                         msg="DealerProfile Count is not equal to 1, Imis_id={0}".format(self.imis_id))

        print("Passed: Dealer Profile Association, Email: {0}".format(self.data["username"]))



    def test_check_initial_balance(self):
        """
        Checks Initial Balance for CADA Dealers
        :return: None
        """
        dealers = Dealer.objects.filter(source_dealer_group_id=self.imis_id, source=DEALER_SOURCES[0][0])
        without_initial_balance = dealers.filter(initial_balance_credited=False).count()
        self.assertEqual(without_initial_balance, 0,msg="Initial Balance not Credited to Some Dealers with imis_id {0}"
                              .format(self.imis_id))

        # No Dealer Should be Alloted other than Initial Balance
        dealers_with_no_initial_balance = list(filter(lambda dealer: (dealer.balance != CADA_DEALER_INITIAL_BALANCE and dealer.is_dealer_group == False) , dealers))
        self.assertEqual(len(dealers_with_no_initial_balance), 0, msg="Some Dealers are not alloted Initial Balance, {0}".format(dealers_with_no_initial_balance))
        print("Passed: Check Initial Balance, Email: {0}".format(self.data["username"]))


    def test_check_job_credit_history(self):
        """
        Checks for Credit History
        :return: None
        """
        jc = JobCreditHistory.objects.all()
        self.assertNotEqual(jc.count(), 0, msg="Job Credit History not Created")
        #Check for Quantity other than 0
        dealers_having_history_other_than_initial_balance = jc.exclude(quantity = CADA_DEALER_INITIAL_BALANCE).count()
        self.assertEqual(dealers_having_history_other_than_initial_balance, 0, msg="Job Credit History created for Balance other than CADA Initial Balance.")
        print("Passed: Check Job Credit History, Email: {0}".format(self.data["username"]))

