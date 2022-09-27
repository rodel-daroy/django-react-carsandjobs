#!/usr/bin/python3

from django.core.management.base import BaseCommand, CommandError

import os

from CarsAndJobs.settings import BASE_DIR
from jobs.models import Job
from jobs.utility.utils import EmailNotification
from jobs.models import JobApplication
import time
from django.utils import timezone



class Command(BaseCommand):
    """
    This  is Intended to run ones's in a Day, Regularly same time
    """

    help = ' Restart Gunicorn'


    def handle(self, *args, **options):
        os.system("sudo systemctl restart gunicorn")
        time.sleep(5)
        os.system("sudo systemctl restart gunicorn")
        self.stdout.write(self.style.SUCCESS('Gunicorn Restarted Successfully'))