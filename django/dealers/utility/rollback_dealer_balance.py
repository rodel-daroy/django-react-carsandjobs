import json, datetime

from django.db.models import Sum

from CarsAndJobs.settings import BASE_DIR
from core.models import ResumeFile
from dealers.models import Dealer
from jobs.models import JobApplication, JobCreditHistory, Job
from  users.models import Resume, Profile


class Rollback(object):


    def seach_dealer(self,start_date,end_date,user_id):

        created_date = datetime.datetime.strptime(start_date, '%Y-%m-%d %H:%M:%S')
        ending_date = datetime.datetime.strptime(end_date, '%Y-%m-%d %H:%M:%S')
        dealers=Dealer.objects.filter(updated_on__gte=created_date,updated_on__lte=ending_date)
        print(dealers.values('id'))



        for dealer in dealers.values('id'):
            print(dealer['id'])
            balance_got_through_script = JobCreditHistory.objects.filter(dealer__id=dealer['id']).filter(created_on__gte=created_date).filter(description__contains="24-hour free job posting event").filter(created_on__lte=ending_date).aggregate(Sum('quantity'))
            print("balance_got_through_script",balance_got_through_script)
            if balance_got_through_script['quantity__sum']!=None:

                jobs_posted_by_dealer_during_promotion=Job.objects.filter(dealer_id=dealer['id']).filter(post_date__gte=created_date,post_date__lte=ending_date,is_published=True).count()
                print("jobs_posted_by_dealer_during_promotion",jobs_posted_by_dealer_during_promotion)

                diff_jobs_and_credits=balance_got_through_script['quantity__sum']-jobs_posted_by_dealer_during_promotion
                if diff_jobs_and_credits>0:
                    dealer=Dealer.objects.get(id=dealer['id'])
                    dealer_actual_balance_with_promocode=dealer.balance
                    print("dealer_actual_balance_with_promocode",dealer_actual_balance_with_promocode)
                    dealer_new_balance = dealer.balance-diff_jobs_and_credits
                    print("dealer new balance",dealer_new_balance)
                    if dealer_new_balance>=0:
                        dealer.balance=dealer_new_balance
                        dealer.save()
                        print("deducted {credits} Job Credits through script of dealer = {id}. Previous Balance: {oldbalance}, Updated Balance: {newbalance}".format(oldbalance=balance_got_through_script['quantity__sum'],id=dealer.id,newbalance=dealer.balance,credits=diff_jobs_and_credits))
                        JobCreditHistory.objects.create(
                            user_id=user_id,
                            description="24-hour free job posting event ends. Previous Balance: {oldbalance}, Updated Balance: {newbalance}".format(oldbalance=dealer_actual_balance_with_promocode,newbalance=dealer.balance),
                            quantity=-diff_jobs_and_credits,
                            dealer_id=dealer.id
                        )
                    else:
                        print("dealer balance updated to 0 as dealer new balance was <0")
                else :
                    print("pass")
            else:
                print("oldbalanceobj is none")










