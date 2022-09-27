import json
from pprint import pprint
from dateutil.parser import parse

from CarsAndJobs.settings import *

from jobs.models import Job, PositionType, JobDepartment, JobExperience, JobEducation


class SaveDepartment(object):


    def __init__(self):
        with open(BASE_DIR + "/jobs/utility/departments.json", encoding='ISO-8859-1') as json_data:
            self.data = json.load(json_data)
            self.data2 = [x for x in self.data['list_departments'] if x['status'] == '1']

        self.write_in_db()



    def write_in_db(self):
        logf = open(BASE_DIR + '/jobs/utility/log_department.log', "a")

        for value in self.data2:

            experience, is_created = JobDepartment.objects.get_or_create(
                english_value=value.get('dept', "N/A"),
                french_value=value.get('fr', "N/A"),
                source_id = value.get('id')


            )
            if not is_created:
                logf.write("{} The record Education : {}, Id : {} already exists. \n".format(
                    datetime.datetime.now(),
                    str(value.get('dept', "N/A")),
                    str(value.get('id', "N/A")),

                ))
        logf.close()


