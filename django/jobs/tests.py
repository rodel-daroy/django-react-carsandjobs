import json
import csv

from dateutil.parser import parse

from CarsAndJobs.settings import *

from jobs.models import Job, PositionType, JobDepartment, JobExperience, JobEducation
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

        with open(BASE_DIR + "/jobs/utility/jobs-final.json", encoding='ISO-8859-1') as json_data:
            self.data2 = json.load(json_data)





    def write_into_db(self):

        logf = open(BASE_DIR + '/jobs/utility/log_Jobs_Import.log', "a")
        exceptions = 0
        createdJobs = 0
        signals.post_save.disconnect(JobModel.create_job_credit_history, sender=Job)


        for value in self.data2['job']:
            email = value.get('applyEmail').replace("\\r\\n", "").replace('\\n', "").replace(" ", "").lower() if value['applyEmailYN'] == '1' else None
            city = value.get('city').replace("\\r\\n", "").replace('\\n', "").replace(" ", "").lower()
            print(email)
            print(city)