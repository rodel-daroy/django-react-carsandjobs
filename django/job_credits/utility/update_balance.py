import json
import csv

from dateutil.parser import parse

from CarsAndJobs.settings import *

from jobs.models import Job, PositionType, JobDepartment, JobExperience, JobEducation, JobCreditHistory
from users import DEALER_SOURCES
from users.models import Profile, DealerProfiles
from  bs4 import BeautifulSoup
import  re
from markdownify import markdownify as md
from django.db.models import signals
from dealers.models import Dealer
from jobs import models as JobModel
from django.core.exceptions import ObjectDoesNotExist



class SaveData(object):

    def __init__(self):
        with open(BASE_DIR + "/job_credits/utility/credits_for_users.json", encoding='ISO-8859-1') as json_data:
            self.data2 = json.load(json_data)
        signals.post_save.disconnect(JobModel.create_job_credit_history_on_updated, sender=Dealer)
        self.write_into_db()
        signals.post_save.connect(JobModel.create_job_credit_history_on_updated, sender=Dealer)



    def write_into_db(self):

        logf = open(BASE_DIR + '/CarsAndJobs/Logs/credits_for_users.log', "w")
        exceptions = 0
        updatedBalances = 0
        user = Profile.objects.filter(is_superuser=True).first()
        signals.post_save.disconnect(JobModel.manage_balance, sender=JobCreditHistory)

        for value in self.data2:
            try:

                dealerObj = Dealer.objects.filter(
                    old_dealer_id=value.get('dealerid'),
                )

                if dealerObj.exists() and dealerObj.count() > 1:
                    tada_dealer_found = False

                    for dealer in dealerObj.all():
                        dp = DealerProfiles.objects.filter(dealer = dealer).first()

                        if dp is None:
                            continue

                        if dp.source == DEALER_SOURCES[1][0]:
                            dealerObj = dealer
                            tada_dealer_found = True

                        if not tada_dealer_found:
                            dealerObj = dealerObj.first()


                elif dealerObj.exists():
                    dealerObj = dealerObj.first()


                else:
                    print("Dealer Not Exists")
                    exceptions += 1
                    print("Exception Recorded for Dealer Id {}".format(value.get('dealerid')))

                    logf.write("{} Unable to update Dealer Balance of Id : {}, dealerId not found. \n".format(
                        datetime.datetime.now(),
                        str(value.get('dealerid')),
                    ))
                    continue

                dealerObj.balance = value.get('sum(credit_plus - credit_minus)')
                dealerObj.save()

                updatedBalances += 1

                JobCreditHistory.objects.create(
                    quantity=dealerObj.balance,
                    description="Added Balance from Imports",
                    dealer=dealerObj,
                    user=user
                )

                print("Updated Balance for Dealer {} by {} having Id: {}".format(
                        dealerObj.dealer_name,
                        dealerObj.balance,
                        dealerObj.id
                ))

            except:
                print("Dealer Not Exists")
                exceptions += 1
                print("Exception Recorded for Dealer Id {}".format(value.get('dealerid')))

                logf.write("{} Unable to update Dealer Balance of Id : {}, dealerId not found. \n".format(
                    datetime.datetime.now(),
                    str(value.get('dealerid')),
                ))
                continue

        signals.post_save.disconnect(JobModel.manage_balance, sender=JobCreditHistory)
        print("Exceptions: {}".format(exceptions))
        print("Updated Balances: {}".format(updatedBalances))

        logf.close()




