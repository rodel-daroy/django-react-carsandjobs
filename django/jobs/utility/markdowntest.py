import json
import csv
import tomd
from markdownify import markdownify as md

from dateutil.parser import parse

from CarsAndJobs.settings import *

from jobs.models import Job, PositionType, JobDepartment, JobExperience, JobEducation
from users.models import Profile, DealerProfiles
from dealers.models import Dealer
from  bs4 import BeautifulSoup
import  re

class SaveData(object):


    def __init__(self):

        #self.data = json.load(open(BASE_DIR + "/jobs/utility/jobs.json"))

        with open(BASE_DIR + "/jobs/utility/jobs.json", encoding='ISO-8859-1') as json_data:
            self.data2 = json.load(json_data)





    def write_into_db(self):

        logf = open(BASE_DIR + '/jobs/utility/log_Jobs_Import.log', "a")
        exceptions = 0
        createdJobs = 0
        count = 0
        for value in self.data2['job']:




            detail_html = tomd.Tomd(value['detail']).markdown

            html = value['detail']
            detail_html2 = md(value['detail']).strip("\\r\\n").replace("\\r\\n", "")
            print('This is html')
            print(html)
            print('This is markdown')
            print(detail_html2)
            count += 3
            break







