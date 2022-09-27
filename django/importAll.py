from dateutil.parser import parse
import json
from CarsAndJobs.settings import *

from jobs.models import Job, PositionType, JobDepartment, JobExperience, JobEducation
from users.models import Profile, DealerProfiles
from dealers.models import Dealer
from  bs4 import BeautifulSoup
import  re
from markdownify import markdownify as md
from django.db.models import signals
from jobs import models as JobModel
from users.utility.cadadealers import SaveData as ImportDealerProfiles
from users.models import DealerProfiles
from users.utility.importjobapplicants import Savedata as ImportUsers
from users.utility.dealerimport import SaveData as ImportDealers
from users.utility.tadawrapper import FetchData as TADADealersWrapper
from jobs.models import JobApplication, Job
from jobs.utility.insertjob import SaveData as InsertJob
from jobs.utility.job_applications import SaveData as InsertJobApplications
from jobs.utility.importposotiontype import SavePositiontype as InsertPositionType
from jobs.utility.importeducation import SaveEducationType as InsertEducationType
from jobs.utility.importdepartments import SaveDepartment as InsertJobDepartment
from jobs.utility.importexperince import SaveExperince as InsertExperience



class StartImport(object):


    def __init__(self):
        self.DealerProfile()

    def ClearingTables(self):
        print("Clearing Job Application Table...")
        JobApplication.objects.filter().all().delete()

        print("Clearing Jobs Table...")
        Job.objects.filter().all().delete()

        print("Clearing Users Table...")
        Profile.objects.filter().delete()

        print("Clearing Dealer Profile Table...")
        DealerProfiles.objects.filter().delete()

        print("Clearing Dealers Table...")
        Dealer.objects.filter().delete()

        # self.PositionType()

    # def PositionType(self):
    #     InsertPositionType()
    #     self.EducationType()
    #
    #
    # def EducationType(self):
    #     InsertEducationType()
    #     self.JobDepartment()
    #
    #
    # def JobDepartment(self):
    #     InsertJobDepartment()
    #     self.JobExperience()
    #
    #
    # def JobExperience(self):
    #     InsertExperience()
    #     self.DealerProfile()


    def DealerProfile(self):
        print("Populating Dealer Profile Table...from {file}".format(file="CADA_Profiles_ExportData-not_included_in_TADA.csv"))
        ImportDealerProfiles()
        self.Dealer()


    def Dealer(self):
        print("Populating Dealers Table from {file}...".format(file="dealer.json"))
        ImportDealers()
        print("Linking TADA Dealer Profiles from {file}...".format(file="TADA_-_Final_ImportSept29.xlsx"))
        TADADealersWrapper()
        self.User()


    def User(self):
        print("Populating Profile (Users) Table from {file}...".format(file="user-final.json"))
        ImportUsers()
        self.Job()


    def Job(self):
        print("Populating Job Tables from {file}...".format(file="jobs-final.json"))
        InsertJob()
        self.JobApplication()


    def JobApplication(self):
        print("Populating JobApplication Tables from {file}...".format(file="jobapplication-final.json"))
        InsertJobApplications()




