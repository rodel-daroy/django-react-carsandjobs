import json
from pprint import pprint
from dateutil.parser import parse

from CarsAndJobs.settings import *

from jobs.models import Job, PositionType, JobDepartment, JobExperience, JobEducation


class SaveEducationType(object):


    def __init__(self):

        with open(BASE_DIR + "/jobs/utility/education.json",encoding='ISO-8859-1') as json_data:
            self.data = json.load(json_data)
            self.data2 = [x for x in self.data['list_education'] if x['status'] == '1']

        self.write_in_db()
        #self.data = json.load(open(BASE_DIR + "/jobs/utility/education.json").encoding("utf-8"))
        #self.data = json.load(open(BASE_DIR + "/core/utils/records.json"))




    def write_in_db(self):
        for value in self.data2:

            experience, is_created = JobEducation.objects.get_or_create(
                english_value=value.get('edu', "N/A"),
                french_value=value.get('fr', "N/A"),
                source_id = value.get('id')
            )
            if not is_created:
                logf = open(BASE_DIR + '/jobs/utility/log_inserteducation.log', "a")

                logf.write("{} The record Education : {}, Id : {} already exists. \n".format(
                    datetime.datetime.now(),
                    str(value.get('edu', "N/A")),
                    str(value.get('id', "N/A")),

                ))
                logf.close()


