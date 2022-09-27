import json, datetime

from django.db.models import Sum

from CarsAndJobs.settings import BASE_DIR
from core.models import ResumeFile
from dealers.models import Dealer
from jobs.models import JobApplication, JobCreditHistory, Job
from  users.models import Resume, Profile

class TadaDealerAddBalance(object):
    def addbalance(self,user_id):



        dealers=Dealer.objects.filter(source="TADA")
        print(dealers.values('id'))
        for dealer in dealers.values('id'):

            tada_dealer=Dealer.objects.get(id=dealer['id'])
            old_balance=tada_dealer.balance
            new_balance=old_balance+10
            tada_dealer.balance=new_balance
            tada_dealer.save()
            print("Added {credits} Job Credits through script of dealer = {id} . Previous Balance: {oldbalance}, Updated Balance: {newbalance}".format(
                    oldbalance=old_balance, newbalance=new_balance,credits=10,id=dealer['id']))

            JobCreditHistory.objects.create(
                user_id=user_id,
                description="24-hour free job posting event. Previous Balance: {oldbalance}, Updated Balance: {newbalance}".format(
                    oldbalance=old_balance, newbalance=new_balance,credits=10),
                quantity=10,
                dealer_id=dealer['id']
            )






