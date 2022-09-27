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
        with open(BASE_DIR + "/jobs/utility/jobs-final.json", encoding='ISO-8859-1') as json_data:
            self.data2 = json.load(json_data)
        self.write_into_db()


    def write_into_db(self):

        logf = open(BASE_DIR + '/jobs/utility/log_Jobs_Import.log', "a")
        exceptions = 0
        createdJobs = 0
        skippedJobs = 0
        signals.post_save.disconnect(JobModel.create_job_credit_history, sender=Job)


        for value in self.data2['job']:
            CreatedByObj = Profile.objects.filter(old_id = value.get("postedBy")).first()
            if CreatedByObj is None:
                skippedJobs += 1
                continue
            source = DealerProfiles.objects.filter(user=CreatedByObj).first().source
            dealerObj = Dealer.objects.filter(old_dealer_id=value.get("dealerid"), source = source).first()
            JobExperienceObj = JobExperience.objects.filter(source_id=value.get("expRequired")).first()
            JobEducationObj = JobEducation.objects.filter(source_id=value.get("eduRequired")).first()
            JobDepartmentObj = JobDepartment.objects.filter(source_id=value.get("dept")).first()
            PositionTypeObj = PositionType.objects.filter(source_id=value.get("positionType")).first()

            if value.get('notifyBy') == 'noemail':
                email_notifaction_frequency = 'Do not email'
            elif value.get('notifyBy') == 'instantly':
                email_notifaction_frequency = 'Instant email'
            elif value.get('notifyBy') == 'daily':
                email_notifaction_frequency = 'Daily email'
            else:
                email_notifaction_frequency = None

            detail_html2 = md(value['detail']).strip("\\r\\n").replace("\\r\\n", "")
            # detail_html = value['detail']
            # self.html_ = BeautifulSoup(detail_html,"lxml")
            # self.text_ = self.html_.text.strip("\\r\\n").replace("\\r\\n", "")
            # self.text_1 = re.sub("\s\s\s+" , "", self.text_)



            try:
                a, is_created = Job.objects.get_or_create(
                    old_job_id=value.get('id'),
                    confidential = True if value.get('confidentialYN') == '1' else False,
                    is_published=True if value.get('status') == '1' else False,
                    post_on_indeed=True if value.get('postOnIndeed') == '1' else False,

                    title_en=value.get('positionTitle'),
                    description_en=detail_html2,
                    salary_en=value.get('salaryHiddenFreeText', 'N/A'),

                    city = value.get('city').replace("\\r\\n", "").replace('\\n', "").strip().title(),
                    address = value.get('address'),
                    postal_code = value.get('postcode').strip().replace(" ","").upper(),
                    province=value.get('prov').strip().upper(),

                    apply_by_email=True if value.get('applyEmailYN') == '1' else False,
                    email = value.get('applyEmail').replace("\\r\\n", "").replace('\\n', "").strip().lower() if value['applyEmailYN'] == '1' else None,

                    apply_by_mail=True if value.get('applyMailYN') == '1' else False,
                    mailing_address = value.get('applyMail').replace("\\r\\n", "").replace('\\n', "").replace("<BR>","") if value['applyMailYN'] == '1' else None ,

                    apply_by_fax=True if value.get('applyFaxYN') == '1' else False,
                    fax = value.get('applyFax') if value['applyFaxYN'] == '1' else None,

                    apply_by_phone=True if value.get('applyPhoneYN') == '1' else False,
                    phone = value.get('applyPhone') if value['applyPhoneYN'] == '1' else None,

                    apply_by_website=True if value.get('applyWebsiteYN') == '1' else False,
                    website=value.get('applyWebsite') if value['applyWebsiteYN'] == '1' else None,

                    post_date=parse(value.get('datePosted', None)),
                    closing_date=parse(value.get('closingDate', None)),

                    experience = JobExperienceObj,
                    dealer=dealerObj,
                    education = JobEducationObj,
                    position_type = PositionTypeObj,
                    created_by = CreatedByObj,

                    email_notification = email_notifaction_frequency,
                    notification_email=value.get('notificationEmail', None)
                )
                if is_created:
                    print("Inserted Job {}".format(value.get('positionTitle')))
                    createdJobs +=1
                    a.department.add(JobDepartmentObj)
            except :


                exceptions +=1
                print("Exception Recorded for {}".format(value.get('positionTitle')))

                logf.write("{} The Job of Title en : {}, Id : {} already exists. \n".format(
                    datetime.datetime.now(),
                    str(value.get('positionTitle')),
                    str(value.get('id', "N/A")),

                ))

        signals.post_save.connect(JobModel.create_job_credit_history, sender=JobModel)

        print("Exceptions: {}".format(exceptions))
        print("Added Jobs: {}".format(createdJobs))
        print("Skipped Jobs: {}".format(skippedJobs))

        logf.close()




