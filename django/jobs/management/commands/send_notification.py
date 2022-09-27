from django.core.management.base import BaseCommand, CommandError

from CarsAndJobs.settings import BASE_DIR
from jobs.models import Job
from jobs.utility.utils import EmailNotification
from jobs.models import JobApplication
import datetime
from django.utils import timezone



class Command(BaseCommand):
    """
    This Cron is Intended to run ones's in a Day, Regularly same time
    """

    help = 'Cron Daily Applicants Notification Email to Dealers'


    def handle(self, *args, **options):
        today_date = timezone.now()
        yesterday = today_date - datetime.timedelta(days=1)

        #GETTING ALL JOBs
        all_jobs = Job.objects.filter()

        for each_job in all_jobs:
            all_applicants_for_today = JobApplication.objects.filter(job=each_job, date_applied__gte= yesterday)
            if all_applicants_for_today.exists() and each_job.email_notification == Job.email_choices[2][0]:
                en = EmailNotification()
                en.dailyMail(job_id = each_job.id, today_applicants = all_applicants_for_today)

        self.stdout.write(self.style.SUCCESS('Successfully Sent Emails to Dealers'))