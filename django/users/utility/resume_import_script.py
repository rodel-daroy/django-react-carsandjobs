import json, datetime

from CarsAndJobs.settings import BASE_DIR
from core.models import ResumeFile
from jobs.models import JobApplication
from  users.models import Resume, Profile


class SaveResume(object):
    def __init__(self):
        with open(BASE_DIR + "/users/utility/resumesfinal.json", encoding='ISO-8859-1') as json_data:
            self.data = json.load(json_data)
            self.data2 = [x for x in self.data['resume']]

    def writeinto_db(self):
        for value in self.data2:
            if value.get('pdf') != "":
                json_date = value.get('dateapplied')
                date_applied = datetime.datetime.strptime(json_date, '%Y-%m-%d %H:%M:%S')
                pdf = value.get('pdf')
                email = value.get('email').lower().strip()

                resumeFileObj = ResumeFile.objects.filter(slug=pdf).first()
                if not resumeFileObj:

                        ResumeFile.objects.create(
                        created_on=date_applied,
                        updated_on=date_applied,
                        slug=pdf,
                        file='uploads/' + pdf + '.pdf',
                        processing=True,

                        )
                        print('Resume file record added for pdf__', pdf, 'Email___', email)

                resumeFileObj = ResumeFile.objects.filter(slug=pdf).first()

                resumeObj = Resume.objects.filter(slug=pdf).first()

                if not resumeObj:
                    Resume.objects.create(
                    created_on=date_applied,
                    updated_on=date_applied,
                    slug=pdf,
                    name=email,
                    description=email,
                    active=True,
                    searchable=False,
                    posted_date=date_applied,
                    resume=resumeFileObj,

                    )
                    print('Resume record added for pdf__',pdf,'Email___' , email)

                resumeObj = Resume.objects.get(slug=pdf)
                resumeObj.resume = resumeFileObj
                resumeObj.save()



                UserObj = Profile.objects.filter(email=email).first()

                if UserObj:
                    if not Profile.objects.filter(resume__slug=pdf, email=email).first():
                        UserObj.resume.add(resumeObj)
                        print('Resume added into user profile for pdf__', pdf, 'Email___', email)


                jobAppObjs = JobApplication.objects.filter(user__email=email,job_id__isnull=False)
                for jobAppObj in jobAppObjs:

                    jobAppObj.resume = resumeObj
                    jobAppObj.save()
                    print('Job Application updated for pdf__', pdf, 'Email___', email)


                print("""____________________________________________________________""")
