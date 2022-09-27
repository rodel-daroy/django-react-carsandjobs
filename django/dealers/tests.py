# Dealer credit and promocode script

from dealers.models import Dealer
from job_credits.models import Invoice,PromoCode,Credits

class CreditDeductionScript(object):

    def __init__(self):
        self.dealerobj = Dealer.objects.all()


    def minuscredit(self):
        print(len(self.dealerobj))


