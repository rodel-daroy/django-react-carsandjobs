import csv
import os
import requests
import json
import timeit
import datetime
from users.models import Dealer
from CarsAndJobs.settings import BASE_DIR, CADA_USERNAME, CADA_PASSWORD, CADA_AUTH_URL
from users import DEALER_SOURCES, DEALER_ROLES
from  users.models import DealerProfiles
from users.utility.utility import CADAAuthentication

class FetchData(object):

    def __init__(self):
        token = CADAAuthentication(username=CADA_USERNAME, password=CADA_PASSWORD).authenticate()
        print(token)
        self.fetch_user_details(token)

    def fetch_user_details(self, token):
        a = datetime.datetime.now()
        header = {
            "Content-Type" : "application/json",
            "Authorization": 'Bearer {}'.format(token)
        }
        queryParams = {
            "QueryName" : "$/CADA Custom Queries/CarsAndJobs/Dealerinformation"
        }
        dealers_profiles = DealerProfiles.objects.all()
        for dealer_profile in dealers_profiles:
            print("Checking for IMISID: ", dealer_profile.imis_id)
            queryParams["Parameter"] = dealer_profile.imis_id
            res = requests.get(url="https://www.cada.ca/Asi.Scheduler_WEB/api/IQA", params=queryParams, headers = header)
            data = res.json()
            if res.status_code == 200:
                if data.get("Count") == 1:
                    entity = data.get("Items").get("$values")[0]
                    properties = entity.get("Properties")
                    payload = {}
                    for prop in properties.get("$values"):
                        payload["old_dealer_id"] = prop.get("Value") if prop.get(
                            "Name") == "DealershipId" else payload.get("old_dealer_id", None)
                        payload["billing_city"] = prop.get("Value") if prop.get(
                            "Name") == "billingcity" else payload.get("billing_city", None)
                        payload["billing_country"] = prop.get("Value") if prop.get("Name") == "billingcountry" else \
                            payload.get("billing_country", None)
                        payload["billing_phone"] = prop.get("Value") if prop.get("Name") == "billingphone" else payload.get(
                            "billing_phone", None)
                        payload["billing_prov"] = prop.get("Value") if prop.get("Name") == "billingprov" else payload.get(
                            "billing_prov", None)
                        payload["billing_postalcode"] = prop.get("Value") if prop.get(
                            "Name") == "billingpostcode" else payload.get("billing_postalcode", None)
                        payload["billing_address1"] = prop.get("Value") if prop.get("Name") == "billing1" else payload.get(
                            "billing_address1", None)
                        payload["billing_address2"] = prop.get("Value") if prop.get("Name") == "billing2" else payload.get(
                            "billing_address2", None)
                        payload["franchise_name"] = prop.get("Value") if prop.get("Name") == "franchiseName" else \
                            payload.get("franchise_name", None)
                        payload["dealer_name"] = prop.get("Value") if prop.get("Name") == "dealerName" else payload.get(
                            "dealer_name", None)
                        payload["membership_type"] = prop.get("Value") if prop.get("Name") == "membershipType" else \
                            payload.get("membership_type", None)
                        payload["source"] = DEALER_SOURCES[0][0]

                    # try:
                    # created_dealer, is_created = (None, None) if not payload.get(
                    #     "old_dealer_id") else Dealer.objects.get_or_create(
                    #     old_dealer_id=payload["old_dealer_id"], source=DEALER_SOURCES[0][0])  # TO check whether new record is in payload

                    if not payload.get("old_dealer_id"):
                        dealer, is_created = None, None
                    else:
                        dealer = Dealer.objects.filter(old_dealer_id=payload["old_dealer_id"], source=DEALER_SOURCES[0][0]).first()
                        if dealer is None:
                            dealer = Dealer.objects.create(**payload)


                    if dealer:
                        # ASSOCIATING DEALER WITH DEALER PROFILE
                        dealer_profile.dealer_id=dealer.id
                        dealer_profile.save()
                    # except:
                    #     pass

                else:
                    # Case of Dealer Group with multiple dealers
                    dealer_group = None
                    for entity in data.get("Items").get("$values"): # list of dealers
                        properties = entity.get("Properties")
                        payload = {}
                        for prop in properties.get("$values"):  # each dealer
                            payload["old_dealer_id"] = prop.get("Value") if prop.get(
                                "Name") == "DealershipId" else payload.get("old_dealer_id", None)
                            payload["billing_city"] = prop.get("Value") if prop.get(
                                "Name") == "billingcity" else payload.get("billing_city", None)
                            payload["billing_country"] = prop.get("Value") if prop.get("Name") == "billingcountry" else \
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
                            payload["franchise_name"] = prop.get("Value") if prop.get("Name") == "franchiseName" else \
                                payload.get("franchise_name", None)
                            payload["dealer_name"] = prop.get("Value") if prop.get(
                                "Name") == "dealerName" else payload.get(
                                "dealer_name", None)
                            payload["membership_type"] = prop.get("Value") if prop.get("Name") == "membershipType" else \
                                payload.get("membership_type", None)
                            payload["source_dealer_group_id"] = prop.get("Value") if prop.get(
                                "Name") == "pimarycontact" else payload.get(
                                "source_dealer_group_id", None)
                            payload["source"] = DEALER_SOURCES[0][0]


                        # try:
                        # created_dealer, is_created = (None, None) if not payload else Dealer.objects.get_or_create(old_dealer_id=payload["old_dealer_id"], source=DEALER_SOURCES[0][0])
                        dealer = None

                        dealer = Dealer.objects.filter(old_dealer_id=payload["old_dealer_id"],
                                                       source=DEALER_SOURCES[0][0]).first()
                        if dealer is None:
                            print("Dealer Saved")
                            dealer = Dealer.objects.create(**payload)

                        if dealer:
                            print("Dealer Found")
                            print(payload)
                            # print("Dealer", dealer)
                            dealer_profile.dealer_id = dealer.id
                            if dealer.membership_type=="DLRGC":
                                print("Dealer Group Found")

                                dealer_group = dealer   # set the dealer group
                                dealer.is_dealer_group = True
                                dealer.save()
                        # except:
                        #     pass

                    if dealer_group:
                        Dealer.objects.filter(source_dealer_group_id=dealer_group.source_dealer_group_id, is_dealer_group=False).update(dealer_group_id=dealer_group.id)
            else:
                print("API endpoint Offline, Please Try Again")
                print(res.json())
                print(res.json()['IsValid'])
                return
        b = datetime.datetime.now()
        delta = b - a
        print("Execution Time", delta)
        return

