from django.db import models

# Create your models here.
from core.models import Core
from django.dispatch import receiver
from django.db.models.signals import pre_save


class Dealer(Core):
    """
    Dealer under dealer-groups 'dealers'
    """


    # name = models.CharField("Dealer Name", max_length=255)
    dealer_group = models.ForeignKey("self", on_delete=models.SET_NULL, blank=True, null=True)
    source = models.CharField(max_length=50, null=True)
    source_dealer_group_id = models.CharField(max_length=10, blank=True, null=True)
    logo = models.FileField(upload_to="uploads/", blank=True, null=True)
    is_dealer_group = models.BooleanField(default=False)
    old_dealer_id = models.CharField(max_length=255, blank=True, null=True)
    new_dealer_id = models.CharField(max_length=255, blank=True, null=True)
    billing_city = models.CharField(max_length=255, blank=True, null=True)
    billing_country = models.CharField(max_length=255, blank=True, null=True)
    billing_prov = models.CharField(max_length=255, blank=True, null=True)
    billing_address1 = models.CharField(max_length=255, blank=True, null=True)
    billing_address2 = models.CharField(max_length=255, blank=True, null=True)
    franchise_name = models.CharField(max_length=255, blank=True, null=True)
    dealer_name = models.CharField("Dealer Name", max_length=255)
    billing_phone = models.CharField(max_length=255, blank=True, null=True)
    billing_postalcode = models.CharField(max_length=255, blank=True, null=True)
    membership_type = models.CharField(max_length=255, blank=True, null=True)
    initial_balance_credited = models.BooleanField(default=False)
    is_suspended = models.BooleanField(default=False)
    # dealer_email = models.CharField(max_length=50, blank=True, null=True)
    # imis_id = models.CharField(max_length=50, blank=True, null=True)
    balance = models.IntegerField(default=0)



    def __str__(self):
        return self.dealer_name

    class Meta:
        unique_together = ('old_dealer_id', 'source',)

    @property
    def to_json(self):
        return {
        "balance":str(self.balance)
        }
    @property
    def to_json_dealer(self):
        return {
            "id": self.slug,
            "name": self.dealer_name,
            "balance": self.balance,
            "is_dealer_group":self.is_dealer_group,
            "dealer_province":self.billing_prov,
            "is_suspended":self.is_suspended

        }

    @property
    def meta_json_dealer(self):
        return {
            "id": self.slug,
            "name": self.dealer_name,


        }


@receiver(pre_save, sender=Dealer)
def set_dealer_group(sender, instance, **kwargs):

    if kwargs.get('raw', False):
        return False

    elif instance.is_dealer_group:
        instance.dealer_group = None
