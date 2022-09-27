from django.db import models

# Create your models here.
from CarsAndJobs.aws_lib import RandomNumber
from core.models import Core
from localization.managers import LocalizationManager, NavItemManager
import datetime
from django.utils.text import slugify



class LocalizedGroup(Core):
    """
    groups for localization
    """
    group_name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.group_name


class Localization(Core):
    """
    localization model
    """
    key = models.CharField(max_length=255)
    english_value = models.TextField()
    french_value = models.TextField()
    group = models.CharField(max_length=255)

    objects = LocalizationManager()

    def __str__(self):
        return self.english_value

    def get_data_by_group(self, group_name, lng):
        pass


class Navitem(Core):
    """
    Navitem model

    """
    Choices=(('MenuItem','MenuItem'),('Separator','Separator'))
    SignedIN_choice=(( 'Display for all users','Display for all users'), ('Only signed in users','Only signed in users'), ('Only users not signed in','Only users not signed in'))
    name = models.CharField(max_length=255,)
    caption_en = models.CharField(max_length=500,blank=True,null=True)
    caption_fr = models.CharField(max_length=500,blank=True,null=True)
    to = models.CharField(max_length=500)
    external = models.BooleanField(default=False)
    signedIn = models.CharField(max_length=255,choices=SignedIN_choice)
    type = models.CharField( max_length=255,choices=Choices)
    items = models.ManyToManyField('Navitem', related_name='items+', blank=True)
    province = models.CharField(max_length=50, blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)




    objects = NavItemManager()

    class Meta:
        verbose_name_plural = 'Navitems'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(
                self.caption_en.lower() + '-' + str(datetime.datetime.now().timestamp()))
            if Navitem.objects.filter(slug=self.slug).exists():
                self.slug + "-" + RandomNumber()
        super(Navitem, self).save(*args, **kwargs)

    def __str__(self):
        return self.name
    def clean(self):
       self.name= self.name.title()
       self.province=self.province.title()

    @property
    def to_json(self):



        return {
             "id":self.slug,
            "name":self.name,
            "caption":{"en":self.caption_en,"fr":self.caption_fr},
             "to":self.to,
             "external":self.external,
             "signedIn":self.signedIn,
             "type":self.type,
            "province":self.province,
            "items":[] if not self.items else [item.item_tojson for item in self.items.all().order_by("order")],
            "order":self.order


        }

    @property
    def item_tojson(self):
        return {
             "id": self.slug,
            "name": self.name,
             "caption": {"en": self.caption_en, "fr": self.caption_fr},
             "to": self.to,
             "external": self.external,
             "signedIn": self.signedIn,
             "type": self.type,
             "province": self.province,
            "items":[] if not self.items else [item.item_tojson for item in self.items.all().order_by("order")],


        }





