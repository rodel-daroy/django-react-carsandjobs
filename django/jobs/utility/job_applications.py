import json
import csv

from dateutil.parser import parse

from CarsAndJobs.settings import *

from jobs.models import Job, PositionType, JobDepartment, JobExperience, JobApplication
from users.models import Profile, DealerProfiles
from dealers.models import Dealer
from  bs4 import BeautifulSoup
import  re

class SaveData(object):


    def __init__(self):
        self.data = json.load(open(BASE_DIR + "/jobs/utility/jobapplication-final.json"))
        self.write_into_db()





    def write_into_db(self):

        logf = open(BASE_DIR + '/jobs/utility/Job_applications.log', "w")
        exceptions = 0
        createdJobApplications = 0
        skippedApplications = 0

        for value in self.data['job_application']:
            jobObject = Job.objects.filter(old_job_id =value.get("jobid")).first()
            if jobObject is None:
                skippedApplications += 1
                continue


            user = Profile.objects.filter(old_id = value.get("userid")).first()

            try:
                application, is_created = JobApplication.objects.get_or_create(
                    old_id=value.get('id'),
                    user=user,
                    job=jobObject,
                    date_applied = value.get('dateApplied', datetime.datetime.now()),
                    #cover_letter=value.get('coverLetter'),
                    resume=None,
                    video_url=value.get('videoLink'),
                    cell_phone=value.get('cellphone'),



                )
                if is_created:
                    print("Inserted Job {}".format(value.get('positionTitle')))
                    createdJobApplications +=1

            except:
                exceptions +=1
                # print(e)
                print("Exception Recorded for Applicant Id {}".format(value.get('id')))

                logf.write("{} The JobApplication of  Old Id : {} can not be added to Database. \n".format(
                    datetime.datetime.now(),
                    str(value.get('id', "N/A")),

                ))

        print("Exceptions: {}".format(exceptions))
        print("Added JobsApplications: {}".format(createdJobApplications))

        logf.close()




