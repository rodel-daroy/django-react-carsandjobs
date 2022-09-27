import json

from CarsAndJobs.settings import BASE_DIR
from jobs.models import Job


class ImportJobsInUs(object):
    def __init__(self):
        with open(BASE_DIR + "/jobs/utility/Us-states-capitals-with-Postalcode.json",
                  encoding='ISO-8859-1') as json_data:
            self.data2 = json.load(json_data)

    def Insert(self):
        jobs = Job.objects.all()

        for eachjob in jobs:
            print(eachjob)
            get_each_job = Job.objects.get(slug=eachjob.slug)
            for data in self.data2:
                if data['STATE'] == "Alabama":
                    # ('Montgomery',)

                    get_each_job.province=str(data['STATE'])
                    get_each_job.city=str(data['CAPITAL'])
                    get_each_job.postal_code=str(data['POSTALCODE'])
                    get_each_job.save()
                else:
                    Job.objects.create(
                        title_en=get_each_job.title_en,
                        title_fr=get_each_job.title_fr,

                        description_en=get_each_job.description_en,
                        description_fr=get_each_job.description_fr,

                        salary_en=get_each_job.salary_en,
                        salary_fr=get_each_job.salary_fr,

                        education_id=get_each_job.education_id,
                        position_type_id=get_each_job.position_type_id,
                        experience_id=get_each_job.experience_id,

                        dealer_id=get_each_job.dealer_id,
                        address=get_each_job.address,
                        mailing_address=get_each_job.mailing_address,
                        phone=get_each_job.phone,
                        email=get_each_job.email,
                        fax=get_each_job.fax,
                        website=get_each_job.website,
                        closing_date=get_each_job.closing_date,
                        post_date=get_each_job.post_date,

                        available_for_fr=get_each_job.available_for_fr,
                        available_for_en=get_each_job.available_for_en,

                        post_on_indeed=get_each_job.post_on_indeed,
                        confidential=get_each_job.confidential,

                        apply_by_mail=get_each_job.apply_by_mail,
                        apply_by_fax=get_each_job.apply_by_fax,

                        apply_by_email=get_each_job.apply_by_email,

                        apply_by_phone=get_each_job.apply_by_phone,
                        apply_by_website=get_each_job.apply_by_website,

                        is_published=get_each_job.is_published,
                        email_notification=get_each_job.email_notification,

                        notification_email=get_each_job.notification_email,
                        is_published_ever=True,
                        province=data['Abbreviated state name'],
                        city=data['CAPITAL'],
                        postal_code=data['POSTALCODE'],
                    )
