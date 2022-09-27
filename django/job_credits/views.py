import datetime

import pytz
from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
import decimal

from CarsAndJobs.settings import PROVINCE_TAX_ENABLED
from core.utils.utility import IsDealer
from dealers.models import Dealer
from job_credits.models import Invoice, Credits, PromoCode, ProvinceTax
from job_credits.serializers import JobCreditHistorySerializer
from job_credits.utility.utils import paypal, FilterTransactionsobj, JobCreditFilter, BuyCreditsWithPromoCode, \
    Authorize, Moneris, write_log
from jobs.models import JobCreditHistory
from rest_framework.response import Response
from rest_framework import status, generics

from users import DEALER_ROLES
from users.models import DealerProfiles
from users.serializers import ResumeSearchSerializer


class InvoiceDetailAPI(APIView):
    """
    api to fetch the info of an invoice
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def get(self, request, invoice_id):
        data=Invoice.objects.filter(slug=invoice_id)
        if data:
            return Response(data=[invoice.to_json for invoice in data], status=status.HTTP_200_OK)
        else:
            return Response(data={"error":"bad request"},status=status.HTTP_400_BAD_REQUEST)



class InvoicesListAPI(APIView):
    """
    api to fetch the all invoices
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def post(self, request):
        count =Invoice.objects.all().count()
        start_index = request.data.get("start_index", 0)
        count = request.data.get("count", count)
        if request.data.get("filter"):
            invoice_data = FilterTransactionsobj(Invoice.objects.all().order_by('-created_on'), request.data.get("filter"))
            filtered_invoices = invoice_data.parsed_results()
            filter_data = [invoice.to_json for invoice in filtered_invoices]
            filtered_invoices = filter_data[int(start_index):int(start_index) + int(count)]
            return Response(
                data={"invoices": filtered_invoices, "total_count": len(filter_data)},
                status=status.HTTP_200_OK if isinstance(filtered_invoices, list) else status.HTTP_400_BAD_REQUEST
            )
        else:
            data = [invoice.to_json for invoice in Invoice.objects.all().order_by('-created_on')]
            filtered_invoices = data[int(start_index):int(start_index) + int(count)]

            return Response(
                data={"invoices": filtered_invoices, "total_count": len(data)},
                status=status.HTTP_200_OK if isinstance(data, list) else status.HTTP_400_BAD_REQUEST
            )

class JobCreditHistoryByDealer(APIView):
    """
    api to JobCreditHistoryBY Dealer
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def post(self,  request):
        start_index = request.data.get("start_index", 0)
        count = request.data.get("count", 50)
        cadaObj = DealerProfiles.objects.filter(user=request.user).first()
        if cadaObj.role != DEALER_ROLES[5][0]:
            if request.data.get("filter"):
                result = JobCreditFilter(request.data.get("filter"), language=request.language)
                filter_data = result[int(start_index):int(start_index) + int(count)]
            else:
                result =JobCreditHistory.objects.all()
                filter_data = [credits.to_meta_json for credits in JobCreditHistory.objects.all().order_by('-created_on')[start_index:start_index+count]]

            return Response(
                    data={"job-credit-history": filter_data, "total_count": len(result)},
                    status=status.HTTP_200_OK if isinstance(filter_data, list) else status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response(data={"error": "You are not authorised"},
                            status=status.HTTP_403_FORBIDDEN)


class JobCreditHistoryByDealerNew(generics.ListCreateAPIView):
    """
    api to JobCreditHistoryBY Dealer
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)
    serializer_class = JobCreditHistorySerializer

    def get_queryset(self):
        start_index = self.request.data.get("start_index", 0)
        count = self.request.data.get("count", 50)
        cadaObj = DealerProfiles.objects.filter(user=self.request.user).first()
        if cadaObj.role != DEALER_ROLES[5][0]:
            if self.request.data.get("filter"):
                filter_data = JobCreditFilter(self.request.data.get("filter"), language=self.request.language)
            else:
                filter_data = JobCreditHistory.objects.all().order_by('-created_on')[start_index:start_index+count]
                print("filter data lenghth",len(filter_data))

            return filter_data
        else:
            return Response(data={"error": "You are not authorised"},
                            status=status.HTTP_403_FORBIDDEN)
    def create(self, request, *args, **kwargs):
        start_index = request.data.get("start_index", 0)
        count = request.data.get("count", 50)
        queryset = self.filter_queryset(self.get_queryset())

        serializer = self.get_serializer(queryset, many=True)
        # data =serializer.data[start_index:count + start_index]

        # data = filter(lambda x: x is not None, data)
        return Response(data={"total_count": len(serializer.data), "data": serializer.data})


class JobCreditHistoryByUser(APIView):
    """
    api to fetch JobCreditHistoryByUser
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def post(self,  request):
        start_index = request.data.get("start_index", 0)
        count = request.data.get("count", 50)
        try:
            total = [credits.to_meta_json for credits in JobCreditHistory.objects.filter(user=request.user).order_by('-created_on')]
            if isinstance(total, list):
                data = total[int(start_index):int(start_index) + int(count)]
            return Response(
                data={"job-credit-history": data, "total_count": len(total)},
                status=status.HTTP_200_OK if isinstance(data, list) else status.HTTP_400_BAD_REQUEST
            )
        except:
            return Response(data={"message":"bad request"},status=status.HTTP_401_UNAUTHORIZED)


class creditslist(APIView):
    """
    Lists out Credits Information for Signed In Dealer
    """
    def get(self,request):
        province = None
        credit_data = Credits.objects.filter(is_active=True)

        if request.user.is_authenticated and PROVINCE_TAX_ENABLED:
            dealer_profile = DealerProfiles.objects.filter(user=request.user).first()
            if dealer_profile:
                province = dealer_profile.dealer.billing_prov
                provincetax_obj = ProvinceTax.objects.filter(province=province).first()
                if provincetax_obj is not None:
                    data = [self.get_payload_data(provincetax_obj, credit) for credit in credit_data]
                    return Response(data=data, status=status.HTTP_200_OK)

        data = [credit.to_json for credit in credit_data]
        return Response(data=data,status=status.HTTP_200_OK)

    @staticmethod
    def get_payload_data(provincetax_obj, credit_obj):
        job_credit_tax = provincetax_obj.province_tax_rate + provincetax_obj.federal_tax_rate

        return {
            "id": credit_obj.slug,
            "name": credit_obj.name,
            "quantity": str(credit_obj.quantity),
            "unit_price": str(credit_obj.unit_price),
            "price": str(credit_obj.unit_price * decimal.Decimal(credit_obj.quantity)),
            "provincial_tax":provincetax_obj.province_tax_rate,
            "federal_tax":provincetax_obj.federal_tax_rate,
            "tax": str(round((credit_obj.unit_price) * decimal.Decimal(credit_obj.quantity) * decimal.Decimal(job_credit_tax), 2)),
            "total": str(round((credit_obj.unit_price) * decimal.Decimal(credit_obj.quantity) * decimal.Decimal(job_credit_tax) + (
                    decimal.Decimal(credit_obj.quantity) * credit_obj.unit_price), 2)),
            "is_active": credit_obj.is_active
        }


class BuyCredits(APIView):
    """
    API to Buy credits without any Promo
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (AllowAny,)
    def post(self, request):
        credit_id=request.data.get("credit_id")
        dealer=request.data.get("dealer")
        dealer = Dealer.objects.get(slug=dealer)
        print("source",dealer.source)
        sale_id=request.data.get("sale_id")
        payment_gateway =request.data.get("payment_gateway")

        if credit_id and dealer and sale_id:
            token=paypal().get_auth_token(source=dealer.source)
            user=request.user
            credit=Credits.objects.get(slug=credit_id)
            # dealer.id
            auth_token=token["access_token"]


            data=paypal().fetch_details(token=auth_token,user_id=user.id,item=credit.name,unit_cost=credit.unit_price,qty=int(credit.quantity),dealer=dealer.id,dealer_name=dealer.dealer_name,dealer_address=dealer.billing_address1,sale_id=sale_id,payment_gateway = payment_gateway)

            # print(token)
            return Response(data=data)
        else:
            return Response(data={"error":"bad request"})
            # return Response(data=token,status=status.HTTP_200_OK)



class DealerBalanceAPI(APIView):
    """
    Retrieves Dealer Info fetched from dealer_id
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def get(self, request, dealer_id):
        data = Dealer.objects.filter(slug=dealer_id)
        if data:
            return Response(data=[dealer.to_json for dealer in data], status=status.HTTP_200_OK)
        else:
            return Response(data={"error": "bad request"}, status=status.HTTP_400_BAD_REQUEST)



class BuyCreditsWithPromoCodeAPI(APIView):
    """
    API for Credits Buying with Promocode
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)
    def post(self, request):
        user = request.user
        promocode=request.data.get("promocode")
        promo_code=PromoCode.objects.filter(code=promocode)
        dealer=request.data.get("dealer")
        currentdateobj=datetime.datetime.now().replace(tzinfo=pytz.utc)
        if dealer and promo_code:
            data=BuyCreditsWithPromoCode().buy_credits(dealer=dealer,code=promocode,user=user.id,date=currentdateobj)
            return Response(data=data,
                            status=status.HTTP_400_BAD_REQUEST if data.get("error") else status.HTTP_200_OK )
        else:
            return Response(data="bad request",
                            status=status.HTTP_400_BAD_REQUEST )







class Promolist(APIView):

    def get(self,request):

        return Response(data=[promo.to_json for promo in PromoCode.objects.filter(is_active=True)],status=status.HTTP_200_OK)




class BuyCreditsNewAPI(APIView):
    """
    Buy credits through Authorize and paypal
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def post(self, request):
        credit_id = request.data.get("credit_id")
        try:
            credit = Credits.objects.get(slug=credit_id)
        except Credits.DoesNotExist as e:
            return Response(data={"Message":"credit does not exist".format(e=(str(e)))},status=status.HTTP_400_BAD_REQUEST)

        requestedDealer = request.data.get("dealer")
        try:
            dealer = Dealer.objects.get(slug=requestedDealer)
        except Dealer.DoesNotExist as e:
            return Response(data={"Message": "{e}".format(e=(str(e)))}, status=status.HTTP_400_BAD_REQUEST)

        sale_id = request.data.get("sale_id")
        payment_gateway =request.data.get("payment_gateway")


        if not dealer.is_suspended:
            if credit_id and sale_id and payment_gateway:
                user = request.user
                if request.data.get("payment_gateway")== "authorize":
                    data = Authorize().fetch_transaction_details(txn_id=sale_id, user_id=user.id, dealer=dealer.id,
                                                                 dealer_name=dealer.dealer_name,
                                                                 dealer_address=dealer.billing_address1, item=credit.name,
                                                                 unit_cost=credit.unit_price, qty=int(credit.quantity),
                                                                 payment_gateway=payment_gateway)

                elif request.data.get("payment_gateway") == "moneris":
                    data =Moneris().fetch_transaction_details(txn_id=sale_id, user_id=user.id, dealer=dealer.id,
                                                                 dealer_name=dealer.dealer_name,
                                                                 dealer_address=dealer.billing_address1, item=credit.name,
                                                                 unit_cost=credit.unit_price, qty=int(credit.quantity),
                                                                 payment_gateway=payment_gateway,order_id=request.data.get('result')['response_order_id'])


                elif request.data.get("payment_gateway") == "paypal":
                    token = paypal().get_auth_token(source=dealer.source)
                    auth_token = token["access_token"]
                    data = paypal().fetch_details(token=auth_token, user_id=user.id, item=credit.name,
                                                  unit_cost=credit.unit_price, qty=int(credit.quantity), dealer=dealer.id,
                                                  dealer_name=dealer.dealer_name, dealer_address=dealer.billing_address1,
                                                  sale_id=sale_id,payment_gateway =payment_gateway)
                else:
                    data={"error":"Invalid payment gateway"}
                write_log(request=request, response =data)
                return Response(data=data, status=status.HTTP_200_OK if not data.get('Error') else status.HTTP_400_BAD_REQUEST)
            else:
                return Response(data={"error": "Parameter missing"},status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(data={"error": "Dealer Account has been suspended"}, status=status.HTTP_402_PAYMENT_REQUIRED)
