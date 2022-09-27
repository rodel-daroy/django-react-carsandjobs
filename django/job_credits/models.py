import decimal

import datetime
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from CarsAndJobs.settings import JOB_CREDIT_TAX
from dealers.models import Dealer
from core.models import Core
from users.models import Profile


class Invoice(Core):

   """
   invoice table
   """
   sale_id = models.CharField(max_length=255, blank=True, null=True)
   order_id = models.CharField(max_length=255, blank=True, null=True)
   promo_code = models.CharField(max_length=255, blank=True, null=True)
   user= models.ForeignKey(Profile,on_delete=models.SET_NULL,blank=True, null=True)
   paypal_create_time=models.DateTimeField(auto_now_add=True,blank=True)
   dealer=models.ForeignKey(Dealer,on_delete=models.SET_NULL,blank=True,null=True)
   dealer_address=models.CharField(max_length=1000,blank=True,null=True)
   payment_gateway=models.CharField(max_length=1000,blank=True,null=True, help_text="Payment Gateway: Paypal, Moneris or Authorize.net")
   dealer_name=models.CharField(max_length=1000,blank=True,null=True)
   quantity=models.IntegerField()
   item=models.CharField(max_length=250,blank=True,null=True)
   unit_cost=models.DecimalField(max_digits=8, decimal_places=2 )
   tax=models.DecimalField(max_digits=8, decimal_places=2 )
   total=models.DecimalField(max_digits=8, decimal_places=2 )
   payment_status=models.CharField(max_length=250,default="paid")


   def __str__(self):
       return self.slug

   @property
   def to_json(self):
       return {
           "invoice_id": self.slug,
           "paypal_sale_id":self.sale_id,
           "sale_id":self.sale_id,
           "moneris_order_id":self.order_id,
           "promo_code":self.promo_code,
           "user":self.user_id,
           "payment_gateway":self.payment_gateway,
           "date":self.created_on.date(),
           "dealer_id":str(self.dealer.slug) if self.dealer else None,
           "dealer_province":self.dealer.billing_prov if self.dealer else None,
           "dealer_name": self.dealer_name,
           "dealer_address":self.dealer_address,
           "item": self.item,
           "quantity":str(self.quantity),
           "unit_cost":str(self.unit_cost),
           "price":str(round(decimal.Decimal(self.quantity)*self.unit_cost,2)),
           "tax":str(self.tax),
           "total":str(self.total),
           "payment_status":self.payment_status,
       }



class Credits(Core):
   """ credits table"""
   name=models.CharField(max_length=250,blank=True,null=True)
   quantity=models.IntegerField(default=0)
   unit_price = models.DecimalField(max_digits=19, decimal_places=2,blank=True,null=True)
   is_active=models.BooleanField(default=True)

   class Meta:
       verbose_name_plural = 'Credits'

   def __str__(self):
       return self.name

   @property
   def to_json(self):
       return {
           "id":self.slug,
           "name":self.name,
           "quantity":str(self.quantity),
           "unit_price": str(self.unit_price),
           "price":str(self.unit_price*decimal.Decimal(self.quantity)),
           "provincial_tax":0,
           "federal_tax":0,
           "tax":str(round((self.unit_price)*decimal.Decimal(self.quantity)*decimal.Decimal(JOB_CREDIT_TAX),2)),
           "total":str(round((self.unit_price)*decimal.Decimal(self.quantity)*decimal.Decimal(JOB_CREDIT_TAX)+(decimal.Decimal(self.quantity)*self.unit_price),2)),
           "is_active":self.is_active
       }



class PromoCode(Core):

    code = models.CharField(max_length=250)
    quantity = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)
    dealer = models.ManyToManyField(Dealer, related_name="dealer_promocode",blank=True)
    start_date=models.DateTimeField(blank=True,null=True)
    end_date=models.DateTimeField(blank=True,null=True)


    class Meta:
        verbose_name_plural ='Promo Codes'

    def __str__(self):
        return self.code

    @property
    def to_json(self):
        return {
            "id": self.slug,
            "code": self.code,
            "quantity": str(self.quantity),
            "is_active": self.is_active,
            "dealer":[] if not self.dealer else [dealer.meta_json_dealer for dealer in self.dealer.all()],
            "start_date":self.start_date,
            "end_date":self.end_date,
        }

class ProvinceTax(Core):

    province = models.CharField(max_length=250)
    type = models.CharField(max_length=250)
    province_tax_rate = models.FloatField(default=0)
    federal_tax_rate = models.FloatField(default=0)
    is_tax_combined = models.BooleanField(default=False)


    class Meta:
        verbose_name_plural ='Province Taxes'

    def __str__(self):
        return self.province


