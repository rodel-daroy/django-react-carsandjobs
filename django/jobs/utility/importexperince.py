import json
from pprint import pprint
from dateutil.parser import parse

from CarsAndJobs.settings import *

from jobs.models import Job, PositionType, JobDepartment, JobExperience, JobEducation


class SaveExperince(object):


    def __init__(self):

        with open(BASE_DIR + "/jobs/utility/listexperiance.json", encoding="ISO-8859-1") as json_file:
            self.data = json.load(json_file)
            self.data2 = [x for x in self.data['list_experience'] if x['status'] == '1']

        self.write_in_db()

    def write_in_db(self):
            logf = open(BASE_DIR + '/jobs/utility/log_insertExperince.log', "w")
            for value in self.data2:
                experience, is_created = JobExperience.objects.get_or_create(
                    english_value=value.get('exp', "N/A"),
                    french_value=value.get('fr', "N/A"),
                    source_id = value.get('id')

                )


                if not is_created:
                    logf.write("{} The record exp : {}, Id : {} already exists. \n".format(
                        datetime.datetime.now(),
                        str(value.get('exp', "N/A")),
                        str(value.get('id', "N/A")),

                    ))


            logf.close()