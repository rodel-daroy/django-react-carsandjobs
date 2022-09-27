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

        #self.data = json.load(open(BASE_DIR + "/jobs/utility/jobs.json"))

        with open(BASE_DIR + "/users/utility/dealers.json", encoding='ISO-8859-1') as json_data:
            self.data = json.load(json_data)


            self.data2= [x for x in self.data['dealer'] if x['source'] == 'tada'  and x['status'] == '1']
            print(len(self.data2))





    def write_into_db(self):

        for value in self.data2:
            print("Inserting {}".format(value.get('id')))
            is_created =  Dealer.objects.get_or_create(
                old_dealer_id = value.get('id'),
                billing_city = value.get('billingcity').strip().title(),
                billing_country = value.get('billingcountry').strip().capitalize(),
                billing_prov = value.get('billingprov').strip().upper(),
                billing_address1 = value.get('billing1'),
                billing_address2 = value.get('billing2'),
                dealer_name = value.get('dealerName').strip(),
                billing_phone = value.get('billingphone'),
                billing_postalcode = value.get('billingpostcode').strip().replace(" ","").upper(),
                source = DEALER_SOURCES[1][0] if value.get('source') == 'tada' else DEALER_SOURCES[0][0],
            )

            if not is_created:
                print('Invalid')











