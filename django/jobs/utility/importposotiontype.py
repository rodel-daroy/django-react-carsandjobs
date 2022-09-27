import json
from pprint import pprint
from dateutil.parser import parse

from CarsAndJobs.settings import *

from jobs.models import Job, PositionType, JobDepartment, JobExperience, JobEducation
import datetime

class SavePositiontype(object):


    def __init__(self):
        with open(BASE_DIR + "/jobs/utility/positiontype.json",encoding="ISO-8859-1") as Json_file:
            self.data = json.load(Json_file)
            self.data2 = [x for x in self.data['list_positionTypes'] if x['status'] == '1']

        self.write_in_db()


            #self.data = json.load(open(BASE_DIR + "/jobs/utility/positiontype.json"))
        #self.data = json.load(open(BASE_DIR + "/core/utils/records.json"))




    def write_in_db(self):
        logf = open(BASE_DIR + '/jobs/utility/log_insertposition.log', "a")
        for value in self.data2:

            experience, is_created = PositionType.objects.get_or_create(
                english_value=value.get('posType', "N/A"),
                french_value=value.get('fr', "N/A"),
                source_id = value.get('id')

            )
            if not is_created:
                logf.write("{} The record posType : {}, Id : {} already exists. \n".format(
                    datetime.datetime.now(),
                    str(value.get('posType', "N/A")),
                    str(value.get('id', "N/A")),

                ))

        logf.close()