import decimal
import json

import datetime
import time

import requests
import xmltodict, json

from CarsAndJobs.local_settings import PAYPAL_API_URL, \
    PAYPAL_CADA_API_PASSWORD, PAYPAL_CADA_API_USERNAME, PAYPAL_TADA_API_USERNAME, PAYPAL_TADA_API_PASSWORD, \
    PAYPAL_API_GET_TOKEN_URL, Authorize_API_LOGIN_ID, Authorize_API_TRANSACTION_KEY, Authorize_API_URL, \
    MONERIS_STORE_ID, MONERIS_STORE_KEY, MONERIS_API_URL
from CarsAndJobs.settings import JOB_CREDIT_TAX, PROVINCE_TAX_ENABLED

from dealers.models import Dealer
from job_credits.models import Invoice, PromoCode, ProvinceTax
from jobs.models import JobCreditHistory
from users.models import Profile, DealerProfiles
from collections import OrderedDict


class CreateJobCreditHistory(object):
    """
    Job credit history of a dealer/dealergroup
    """
    def __new__(cls, job, *args, **kwargs):
        pass

class ProcessUrlParams(object):
    """
    This class will process url params and return it as a dictionary
    """

    def __new__(cls, data_dict, *args, **kwargs):
        result_obj = {}
        for key, value in data_dict.items():
            if key == "category":
                if value:
                    result_obj.update({"department__category__slug": value})
            if key in FILTER_DICT.keys():
                if not isinstance(value, dict):  # skip null values
                    if value:
                        result_obj.update({FILTER_DICT[key]: value})

                else:
                    for k, v in value.items():
                        if v :
                            result_obj.update({k: v})
            result_obj.update({"is_published": True})
        return result_obj



class paypal(object):

    def __init__(self):
        pass

    def get_auth_token(self,source):
        if source=="CADA":
            PAYPAL_API_USERNAME=PAYPAL_CADA_API_USERNAME
            PAYPAL_API_PASSWORD=PAYPAL_CADA_API_PASSWORD

        else:
            PAYPAL_API_USERNAME=PAYPAL_TADA_API_USERNAME
            PAYPAL_API_PASSWORD=PAYPAL_TADA_API_PASSWORD

        header = {
                "Content-Type": 'application/x-www-form-urlencoded',
            }
        data = {
                'grant_type': 'client_credentials'
            }
        res = requests.post(
                url= PAYPAL_API_GET_TOKEN_URL,
                auth= (PAYPAL_API_USERNAME,PAYPAL_API_PASSWORD),
                data=data,
                headers= header
            )

        print("url",PAYPAL_API_GET_TOKEN_URL)
            # return json.loads(res.text).get("access_token", None)

        data=res.json()
        return data

    def fetch_details(self,token,user_id,item,unit_cost,qty,dealer,dealer_name,dealer_address,sale_id,payment_gateway):
        dealerobj = Dealer.objects.filter(id=dealer).first()
        userobj = Profile.objects.filter(id=user_id).first()
        print("userobj",userobj)

        header = {
            "Content-Type": 'application/json',
            "Authorization":'Bearer {}'.format(token)
        }


        res2 = requests.get(

            url=PAYPAL_API_URL+sale_id,

            headers=header
        )

        data=res2.json()
        print(data)
        a, is_created = Invoice.objects.get_or_create(

            sale_id = data["id"],
            total = data['amount']['total'],
            tax = data['amount']['details']['tax'],
            quantity=qty,
            unit_cost=unit_cost,
            payment_gateway =payment_gateway,
            user = userobj,
            item = item,
            dealer = dealerobj,
            dealer_name = dealer_name,
            dealer_address = dealer_address,
        )


        return {
            "message":"your transaction is successful"}



class FilterTransactionsobj(object):
    """
    Dealers filtered job results
    """

    def __init__(self, records, filter_data):
        self.records = records
        self.filter_data = filter_data

    def parsed_results(self):
        filtered_obj = self.records.all()
        dealer = self.filter_data.get("dealer") if self.filter_data.get("dealer") else None
        province = self.filter_data.get("province") if self.filter_data.get("province") else None
        from_date = self.filter_data.get("from") if self.filter_data.get("from") else None
        to_date= self.filter_data.get("to") if self.filter_data.get("to") else None
        sale= self.filter_data.get("sale-id") if self.filter_data.get("sale-id") else None
        invoice= self.filter_data.get("invoice-slug") if self.filter_data.get("invoice-slug") else None
        paid_only = self.filter_data.get("paid-only") if self.filter_data.get("paid-only") else None

        filter_list = []
        # if dealer:
        #     filter_list.append("dealer")
        if from_date:
            filter_list.append("from")
        if to_date:
            filter_list.append("to")
        if sale:
            filter_list.append("sale-id")
        if invoice:
            filter_list.append("invoice-slug")
        if paid_only:
            filter_list.append("paid-only")
        if province:
            filter_list.append("province")

        print(filter_list, "filter")
        validated_data = {k: v for k, v in self.filter_data.items() if k in filter_list}
        # if dealer != None and filter_list.__contains__("dealer"):
        #     del validated_data["dealer"]
        #     validated_data.update({"dealer__slug": self.filter_data["dealer"]})
        # else:
        #     if filter_list.__contains__("dealer"):
        #         del validated_data["dealer"]
        if from_date !=None and filter_list.__contains__("from") :
            del validated_data["from"]
            validated_data.update({"created_on__gte": self.filter_data["from"]})
        else:
            if filter_list.__contains__("from"):
                del validated_data["from"]

        if to_date != None and filter_list.__contains__("to"):
            del validated_data["to"]
            validated_data.update({"created_on__lte": self.filter_data["to"]})
        else:
            if filter_list.__contains__("to"):
                del validated_data["to"]

        if sale != None and filter_list.__contains__("sale-id"):
            del validated_data["sale-id"]
            validated_data.update({"sale_id": self.filter_data["sale-id"]})
        else:
            if filter_list.__contains__("sale-id"):
                del validated_data["sale-id"]


        if invoice !=None and filter_list.__contains__("invoice-slug"):
            del validated_data["invoice-slug"]
            validated_data.update({'slug': self.filter_data["invoice-slug"]})
        else:
            if filter_list.__contains__("invoice-slug"):
                del validated_data["invoice-slug"]

        if paid_only != None and filter_list.__contains__("paid-only"):
            del validated_data["paid-only"]
            filtered_obj = filtered_obj.exclude(sale_id=None)
        else:
            if filter_list.__contains__("paid-only"):
                del validated_data["paid-only"]

        if province != None and filter_list.__contains__("province"):
            del validated_data["province"]

            province_dealers =Dealer.objects.filter(billing_prov=province).values('slug')
            print("province dealers",province_dealers)
            validated_data.update({'dealer__slug__in':province_dealers})

        else:
            if filter_list.__contains__("province"):
                del validated_data["province"]

        if not self.filter_data.get("dealer"):
            print("validatedate",validated_data)
            filtered_obj = filtered_obj.filter(**validated_data)
        else:
            # filtered_obj = filtered_obj.filter(**validated_data).filter(dealer__slug__in=self.filter_data.get("dealer"))
            filtered_obj = filtered_obj.filter(**validated_data).filter(dealer__slug__in=dealer)
        return filtered_obj

import json
class JobCreditFilter(object):
    """
    Filtered results of job credit history by dealer
    """
    def __new__(cls, filters,*args, **kwargs):
        data=JobCreditHistory.objects.none()
        try:
            if not filters.get("dealer"):
                validated_data = {
                }
                data=JobCreditHistory.objects.all().order_by('-created_on')
            else:
                validated_data = filters.get("dealer")
            for slug in validated_data:
                data = data | JobCreditHistory.objects.filter(dealer__slug=slug).order_by('-created_on')



            return [credit.to_meta_json for credit in data]
        except (Dealer.DoesNotExist):
            return {"bad request"}


class BuyCreditsWithPromoCode(object):
    """
    class to buy credits with promocode
    """
    def __init__(self):
        pass

    def buy_credits(self,dealer,code,user,date):
        promocode = PromoCode.objects.get(code=code)

        if date<=promocode.end_date and date>=promocode.start_date and promocode.is_active==True:

            userobj=Profile.objects.filter(id=user).first()
            Promocode = PromoCode.objects.filter(code=code)
            dealerobj = Dealer.objects.get(slug=dealer)
            dealer_match =   Promocode.values('dealer').filter(dealer__id=dealerobj.id).first()
            if dealer_match != None or Promocode.values('dealer')[0]['dealer']==None:

                        a, is_created = Invoice.objects.get_or_create(

                            promo_code=promocode,
                            quantity=promocode.quantity,
                            unit_cost=0,
                            tax=0,
                            total=0,
                            user=userobj,
                            item=promocode.code,
                            dealer=dealerobj,
                            dealer_name=dealerobj.dealer_name,
                            dealer_address=dealerobj.billing_address1,
                        )
                        if is_created:
                            return {"message":"your transaction is successful","credit_applied":promocode.quantity,"updated_dealer_balance":dealerobj.balance+promocode.quantity}
                        else:
                            return {"error":"you have already avail this offer"}

            else:
                        return {
                            "error": "you are not authorized for this promocode"}

        else:
            return {
                "error": "this promocode is not valid"}



class Authorize(object):

    def __init__(self):
        pass

    def fetch_transaction_details(self,txn_id,user_id,dealer,dealer_name,dealer_address,item,unit_cost,qty,payment_gateway):



        dealerobj = Dealer.objects.filter(id=dealer).first()
        userobj = Profile.objects.filter(id=user_id).first()



        tries =0
        max_retries =5

        while tries<max_retries:
            my_dictionary = OrderedDict()
            my_dictionary1 = OrderedDict()
            my_dictionary1['name'] = Authorize_API_LOGIN_ID
            my_dictionary1['transactionKey'] = Authorize_API_TRANSACTION_KEY
            my_dictionary['merchantAuthentication'] = OrderedDict(my_dictionary1),
            my_dictionary['transId'] = txn_id
            new_dictionary = OrderedDict()
            new_dictionary['getTransactionDetailsRequest'] = my_dictionary
            data = dict(new_dictionary)
            res2 = requests.post(
                url=Authorize_API_URL,
                json=data
            )

            data = res2.json()
            if data['messages']['message'][0]['code'] == "I00001":
                tax = round(unit_cost * decimal.Decimal(qty) * decimal.Decimal(JOB_CREDIT_TAX), 2)
                if float(data['transaction']['settleAmount'])== float(tax)+float(qty*unit_cost):


                    Invoice.objects.get_or_create(

                        sale_id=txn_id,
                        payment_gateway =payment_gateway,
                        total=data['transaction']['settleAmount'],
                        tax=data['transaction']['tax']['amount'],
                        quantity=qty,
                        unit_cost=unit_cost,
                        user=userobj,
                        item=item,
                        dealer=dealerobj,
                        dealer_name=dealer_name,
                        dealer_address=dealer_address
                    )

                    return {"Message":"Your Transaction has been Successful"}
                else:

                    # logfile = open("/home/aakash/Documents/projects/carsandjobs-backend/CarsAndJobs/Logs/Authorizationerrorlogfile.log", "a")
                    logfile = open("/home/ubuntu/carsnjobs/CarsAndJobs/Logs/Authorizationerrorlogfile.log", "a")
                    logfile.write(" Time=" + str(datetime.datetime.now()) + "  saleid = " + txn_id + " Dealer =" + dealer_name + " with Dealer_id = " + dealerobj.slug + " buying Credits =" + str(qty) + " Transaction failed as settle amount " + str(data['transaction']['settleAmount']) + " does not match with credit total " + str(float(tax)+float(qty*unit_cost)) + "\n")
                    logfile.close()
                    return {"Error": "Transaction failed because quantity and total do not match."}
            else:
                time.sleep(10)
                tries +=1
                if tries==max_retries:
                    # logfile =open("/home/aakash/Documents/projects/carsandjobs-backend/CarsAndJobs/Logs/Authorizationerrorlogfile.log", "a")
                    logfile = open("/home/ubuntu/carsnjobs/CarsAndJobs/Logs/Authorizationerrorlogfile.log", "a")
                    logfile.write(" Time=" + str(datetime.datetime.now()) + "  saleid = " + txn_id + " code= " + str(
                        data['messages']['message'][0]['code']) + " error =" + str(
                        data['messages']['message'][0]['text']) + " Dealer =" + dealer_name + " with Dealer_id = "+dealerobj.slug +" buying Credits ="+str(qty) + "\n")
                    logfile.close()

                    return {"Error": "Some error has been occured"}








class Moneris(object):

    def __init__(self):
        pass

    def fetch_transaction_details(self,txn_id,user_id,dealer,dealer_name,dealer_address,item,unit_cost,qty,payment_gateway,order_id):
        """fetch transcation details from moneris"""

        dealerobj = Dealer.objects.filter(id=dealer).first()
        userobj = Profile.objects.filter(id=user_id).first()
        tax =calculatetax(unit_cost,qty,dealerobj)
        data={
            "ps_store_id":MONERIS_STORE_ID,
            "hpp_key":MONERIS_STORE_KEY,
            "transactionKey":txn_id
        }


        res2 = requests.post(
            url=MONERIS_API_URL,
            data=data
        )

        xml_response = xmltodict.parse(res2.text)
        json_response =dict((xml_response)['response'])

        if json_response["response_code"]=="27":
            if float(json_response["amount"]) == float(tax+(unit_cost*qty)):

                Invoice.objects.get_or_create(

                    sale_id=txn_id,
                    order_id=order_id,
                    payment_gateway=payment_gateway,
                    total=json_response["amount"],
                    tax=tax,
                    quantity=qty,
                    unit_cost=unit_cost,
                    user=userobj,
                    item=item,
                    dealer=dealerobj,
                    dealer_name=dealer_name,
                    dealer_address=dealer_address
                )

                return {"Message": "Your Transaction has been Successful"}
            else:
                logfile = open("/home/ubuntu/carsnjobs/CarsAndJobs/Logs/Moneirslogfile.log", "a")
                # logfile = open("/home/aakash/Documents/projects/carsandjobs-backend/CarsAndJobs/Logs/Moneirslogfile.log", "a")
                logfile.write("Time={time} Dealer={dealer} with transcation-key={key} got total amount from moneris ={moneris_total} which does not match with credit total {credit_total}".format(time=str(datetime.datetime.now()), dealer=dealer_name, key=txn_id,moneris_total=str(json_response["amount"]),credit_total= str(tax+(qty*unit_cost)) + "\n"))
                logfile.close()
                return {"Error": "Transaction failed because quantity and total do not match."}



        else:
            logfile =open("/home/ubuntu/carsnjobs/CarsAndJobs/Logs/Moneirslogfile.log", "a")
            logfile.write("Time={time} Dealer={dealer} with transcation-key={key} got response-code {response} from moneris with status {status}".format(time=str(datetime.datetime.now()),dealer =dealer_name,key =txn_id,response =json_response['response_code'],status=json_response['status'])+"\n")
            logfile.close()
            return {"Error": "Some error has been occured"}



def calculatetax(unit_cost,qty,dealerobj):
        if PROVINCE_TAX_ENABLED:
            province = dealerobj.billing_prov
            provincetax_obj = ProvinceTax.objects.filter(province=province).first()
            if provincetax_obj is not None:
                combined_tax = provincetax_obj.province_tax_rate + provincetax_obj.federal_tax_rate
                tax = round(unit_cost*decimal.Decimal(qty)*decimal.Decimal(combined_tax),2)

            else:
                combined_tax = JOB_CREDIT_TAX
                tax = round(unit_cost * decimal.Decimal(qty) * decimal.Decimal(combined_tax), 2)

        else:
            combined_tax = JOB_CREDIT_TAX
            tax = round(unit_cost * decimal.Decimal(qty) * decimal.Decimal(combined_tax), 2)

        return tax


def write_log(request,response):
    # logfile = open("/home/aakash/Documents/projects/carsandjobs-backend/CarsAndJobs/Logs/Capture_transaction.log", "a")
    logfile = open("/home/ubuntu/carsnjobs/CarsAndJobs/Logs/Capture_transaction.log", "a")
    logfile.write(" Time=" + str(datetime.datetime.now()) + "  request = " + str(request.data) + " Got Response ="+str(response)+"\n")
    logfile.close()

