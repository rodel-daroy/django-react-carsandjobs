import csv
import os
import requests
import json
from xlrd import open_workbook
import timeit
import datetime
from users.models import Dealer, Profile
from CarsAndJobs.settings import BASE_DIR, CADA_USERNAME, CADA_PASSWORD, CADA_AUTH_URL
from users import DEALER_SOURCES, DEALER_ROLES
from  users.models import DealerProfiles
from users.utility.utility import CADAAuthentication
from users import DEALER_SOURCES, DEALER_ROLES


class FetchData(object):

    def __init__(self):
        self.path = BASE_DIR + "/users/utility/TADA - Final ImportOct03.xlsx"
        self.fetch_user_details()

    def fetch_user_details(self):
        a = datetime.datetime.now()

        logf = open(BASE_DIR + '/users/utility/not_imported_TADA.log', "a")
        logf.write("\n")

        book = open_workbook(self.path)
        sheet = book.sheet_by_index(0)
        keys = [sheet.cell(0, col_index).value for col_index in range(sheet.ncols)]

        print("keys",keys)
        dict_list = []
        for row_index in range(1, sheet.nrows):
            entityValues = {keys[col_index].strip(): sheet.cell(row_index, col_index).value
                 for col_index in range(sheet.ncols)}

            if not entityValues["Person ID"]:
                continue

            if not entityValues["Dealer ID"]:
                continue

            if not entityValues["Person Email"]:
                continue

            profileObj = Profile.objects.filter(old_id = int(entityValues["Person ID"])).first()

            dealer_id = int(entityValues["Dealer ID"])

            if profileObj is None:
                logf.write("{} User TADA Object not Found having email: {} and Dealer Id: {} \n".format(
                    datetime.datetime.now(),
                    str(entityValues["Person Email"]).strip(),
                    dealer_id
                ))
                continue



            dealerProfileObj = DealerProfiles.objects.filter(username=entityValues["Person Email"]).first()

            if dealerProfileObj is None:
                logf.write("{} Dealer Profile TADA Object not Found having email: {} and Dealer Id: {} \n".format(
                    datetime.datetime.now(),
                    str(entityValues["Person Email"]).strip(),
                    dealer_id
                ))
                continue


            dealer = Dealer.objects.filter(old_dealer_id= dealer_id, source=DEALER_SOURCES[1][0]).first()

            if dealer is None:
                logf.write("{} Dealer TADA Object not found having email: {} and Old Dealer Id: {} \n".format(
                    datetime.datetime.now(),
                    str(entityValues["Person Email"]).strip(),
                    dealer_id
                ))
                continue


            # Updating Profile Table.
            try:
                profileObj.new_id = int(entityValues["Person Number"])
                profileObj.save()

            except:
                logf.write("{} Unable to update Username, Already Exists of  email: {} and Old Dealer Id: {} \n".format(
                    datetime.datetime.now(),
                    str(entityValues["Person Email"]).strip(),
                    dealer_id
                ))
                continue


            #Updating DealerProfile Table
            # dealerProfileObj.user = profileObj
            # dealerProfileObj.source = DEALER_SOURCES[1][0]
            # dealerProfileObj.dealer = dealer
            # dealerProfileObj.save()

            #Updating Dealer Table
            try:
                dealer.new_dealer_id = int(entityValues["Org Number"])
                dealer.save()

            except:
                logf.write("{} Unable to update New Dealer Id, Already Exists of  email: {} and Old Dealer Id: {} \n".format(
                    datetime.datetime.now(),
                    str(entityValues["Person Email"]).strip(),
                    dealer_id
                ))
                continue

            print("-------------------STARTTTTTTTTTT-------------------------")
            print("{} /n".format(dealer_id))
            print("-------------------ENDDDDDDDDDD-------------------------")


            dict_list.append(entityValues)

        # print(dict_list)

        logf.write("\n")
        logf.close()
        b = datetime.datetime.now()
        print("Execution Time", b - a)
        return

