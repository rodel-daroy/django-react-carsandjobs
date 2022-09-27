import json
import csv

from dateutil.parser import parse

from CarsAndJobs.settings import *

from jobs.models import Job, PositionType, JobDepartment, JobExperience, JobEducation
from users import DEALER_SOURCES
from users.models import Profile, DealerProfiles
from dealers.models import Dealer
from  bs4 import BeautifulSoup
import  re
from markdownify import markdownify as md
from django.db.models import signals
from jobs import models as JobModel

class SaveData(object):


    def __init__(self):
        with open(BASE_DIR + "/users/utility/dealers.json", encoding='ISO-8859-1') as json_data:
            self.data = json.load(json_data)
            self.data2= [x for x in self.data['dealer']]

        self.write_into_db()





    def write_into_db(self):

        for value in self.data2:
            print("Inserting Dealer {name} having {id}".format(name = value.get('dealerName').strip(), id = value.get('id')))
            if not value.get('dealerName').strip():
                continue

            is_created =  Dealer.objects.get_or_create(
                old_dealer_id = value.get('id'),
                billing_city = value.get('billingcity').strip().title() if value.get('billingcity') else None,
                billing_country = value.get('billingcountry').strip().capitalize() if value.get('billingcountry') else None,
                billing_prov = value.get('billingprov').strip().upper() if value.get('billingprov') else None,
                billing_address1 = value.get('billing1') if value.get('billing1') else None,
                billing_address2 = value.get('billing2') if value.get('billing2') else None,
                dealer_name = value.get('dealerName').strip() if value.get('dealerName') else None,
                billing_phone = value.get('billingphone') if value.get('billingphone') else None,
                billing_postalcode = value.get('billingpostcode').strip().replace(" ","").upper() if value.get('billingpostcode') else None,
                source = DEALER_SOURCES[1][0] if value.get('source') == 'tada' else DEALER_SOURCES[0][0],
            )

            if not is_created:
                print('Invalid')











