import datetime
import uuid

from django.db import models
from django.db.models.signals import post_save, pre_delete, pre_save
from django.dispatch import receiver
from django.utils.text import slugify
from martor.models import MartorField
from multi_email_field.fields import MultiEmailField
from rest_framework import status
from rest_framework.response import Response

from CarsAndJobs.settings import CHARGE_FOR_INDEED_POSTING
from jobs.emails import instantMail, EmailApplicant
from CarsAndJobs.aws_lib import RandomNumber
from core.models import Core, Language
from dealers.models import Dealer
from job_credits.models import Invoice
from jobs.managers import JobsManager, CategoryManager, DepartmentManager, SpecializationManager, PositionTypeManager, \
    ExperienceManager, EducationManager, DepartmentCategotyManger

from users.models import Profile, CoverLetter, Resume
from CarsAndJobs.middlewares.custom_middlewares import MyRequestMiddleware
from django.db.models import signals, Sum

from collections import defaultdict
from django.db.models.signals import *
import datetime
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.utils import timezone




class DisableSignals(object):
    def __init__(self, disabled_signals=None):
        self.stashed_signals = defaultdict(list)
        self.disabled_signals = disabled_signals or [
            pre_init, post_init,
            pre_save, post_save,
            pre_delete, post_delete,
            pre_migrate, post_migrate,
        ]

    def __enter__(self):
        for signal in self.disabled_signals:
            self.disconnect(signal)

    def __exit__(self, exc_type, exc_val, exc_tb):
        for signal in list(self.stashed_signals):
            self.reconnect(signal)

    def disconnect(self, signal):
        self.stashed_signals[signal] = signal.receivers
        signal.receivers = []

    def reconnect(self, signal):
        signal.receivers = self.stashed_signals.get(signal, [])
        del self.stashed_signals[signal]


class Company(Core):
    """
    Company , who provides job
    """
    name = models.CharField('Dealer Name', max_length=100, blank=True, null=True)
    logo = models.FileField(upload_to='uploads/', blank=True, null=True)

    class Meta:
        verbose_name_plural = 'Dealers'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(
                self.name.lower())
            if Company.objects.filter(slug=self.slug).exists():
                self.slug + "-" + RandomNumber()
        super(Company, self).save(*args, **kwargs)

class JobDepartmentCategories(Core):
    """
    Job Department  Categories
    """
    english_value = models.CharField(max_length=255)
    french_value = models.CharField(max_length=255)
    source_id = models.CharField(max_length=100, blank=True, null=True)

    objects = DepartmentCategotyManger()

    class Meta:
        verbose_name_plural = "Category of Department"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(
                self.english_value.lower() + '-' + str(datetime.datetime.now().timestamp()))
            if JobDepartmentCategories.objects.filter(slug=self.slug).exists():
                self.slug + "-" + RandomNumber()
        super(JobDepartmentCategories, self).save(*args, **kwargs)


    def __str__(self):
        return self.english_value

    @property
    def to_json(self):
        return {
            'id': self.slug,
            "name":
                {
                    "en": self.english_value,
                    "fr": self.french_value
                }
        }




class JobDepartment(Core):

    """
    Job Department
    """
    english_value = models.CharField(max_length=255,unique=True ,blank=True)
    french_value = models.CharField(max_length=255,blank=True, null=True)
    source_id = models.CharField(max_length=255,blank=True,null=True)
    users = models.ManyToManyField(Profile, related_name="user_choice", blank=True)
    category = models.ForeignKey(JobDepartmentCategories, on_delete=models.CASCADE,  blank=True, null=True,help_text="Category")



    objects = DepartmentManager()

    class Meta:
        verbose_name_plural = 'Job Departments'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(
                self.english_value.lower() + '-' + str(datetime.datetime.now().timestamp()))
            if JobDepartment.objects.filter(slug=self.slug).exists():
                self.slug + "-" + RandomNumber()
        super(JobDepartment, self).save(*args, **kwargs)

    def __str__(self):
        return self.english_value

    @property
    def to_json(self):
        return {
            "id": self.slug,
            "name":
                {
                    "en": self.english_value,
                    "fr": self.french_value

                }
        }






class JobExperience(Core):
    """
    Job Experience
    """
    english_value = models.CharField(max_length=255)
    french_value = models.CharField(max_length=255)
    source_id = models.CharField(max_length=100 ,blank=True,null=True)




    objects = ExperienceManager()

    class Meta:
        verbose_name_plural = 'Job Experiences'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(
                self.english_value.lower() + '-' + str(datetime.datetime.now().timestamp()))
            if JobExperience.objects.filter(slug=self.slug).exists():
                self.slug + "-" + RandomNumber()
        super(JobExperience, self).save(*args, **kwargs)

    def __str__(self):
        return self.english_value

    @property
    def to_json(self):
        return {
            'id': self.slug,
            "name":
                {
                    "en": self.english_value,
                    "fr": self.french_value
                }
        }


class JobEducation(Core):
    """
    Job Education
    """
    english_value = models.CharField(max_length=255, blank=True,null=True)
    french_value = models.CharField(max_length=255,blank=True,null=True)
    source_id = models.CharField(max_length=255,blank=True,null=True)

    objects = EducationManager()

    class Meta:
        verbose_name_plural = 'Job Educations'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(
                self.english_value.lower() + '-' + str(datetime.datetime.now().timestamp()))
            if JobEducation.objects.filter(slug=self.slug).exists():
                self.slug + "-" + RandomNumber()
        super(JobEducation, self).save(*args, **kwargs)

    def __str__(self):
        return self.english_value

    @property
    def to_json(self):
        return {
            "id": self.slug,
            "name":
                {
                    "en": self.english_value,
                    "fr": self.french_value
                }
        }


class PositionType(Core):
    """
    Models for PostionType
    """
    english_value = models.CharField(max_length=255,blank=True,null=True)
    french_value = models.CharField(max_length=255,blank=True,null=True)
    source_id = models.CharField(max_length=255,blank=True,null=True)

    objects = PositionTypeManager()

    class Meta:
        verbose_name_plural = 'Position Types'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(
                self.english_value.lower() + '-' + str(datetime.datetime.now().timestamp()))
            if PositionType.objects.filter(slug=self.slug).exists():
                self.slug + "-" + RandomNumber()
        super(PositionType, self).save(*args, **kwargs)

    def __str__(self):
        return self.english_value

    @property
    def to_json(self):
        return {
            "id": self.slug,
            "name":
                {
                    "en": self.english_value,
                    "fr": self.french_value
                }
        }


class Job(Core):

    """
    Model for Job
    """
    email_choices=(
        ('Do not email','Do not email'),
        ('Instant email','Instant email'),
        ('Daily email','Daily email'),

    )
    #active = models.BooleanField(default=True)
    is_published = models.BooleanField(default=False)
    post_on_indeed = models.BooleanField(default=False)


    post_date = models.DateTimeField(null=True,help_text="<h2 style='color:red;'>Note: Saving a job and keeping is_published = true will always deduct 1 job credit</h2>")
    closing_date = models.DateTimeField(null=True)

     # django.utils.timezone.now
    available_for_en = models.BooleanField(default=True)
    available_for_fr = models.BooleanField(default=False)

    title_en = models.CharField(max_length=255, help_text="Job Title", blank=True)
    title_fr = models.CharField(max_length=255, help_text="Job Title", blank=True)
    description_en = MartorField(blank=True, null=True,
                                  help_text="<b style='color:red;'>Do not use \"upload an image\" icon, use \"insert "
                                            "image link\" instead and provide the relative path of uploaded assets (in "
                                            "S3 bucket).</b>")
    description_fr = MartorField(blank=True, null=True,
                                 help_text="<b style='color:red;'>Do not use \"upload an image\" icon, use \"insert "
                                           "image link\" instead and provide the relative path of uploaded assets (in "
                                           "S3 bucket).</b>")
    salary_en = models.CharField(max_length=255, blank=True, null=True)
    salary_fr = models.CharField(max_length=255, blank=True, null=True)
    dealer = models.ForeignKey(Dealer, blank=True, null=True, on_delete=models.CASCADE)
    confidential=models.BooleanField(default=False)
    department = models.ManyToManyField(JobDepartment, help_text="Job Department", blank=True)
    experience = models.ForeignKey(JobExperience, on_delete=models.CASCADE, help_text="Job Experience")
    education = models.ForeignKey(JobEducation, on_delete=models.CASCADE, help_text="Qualification Required")
    position_type = models.ForeignKey(PositionType, on_delete=models.CASCADE,
                                      help_text="Job Position Type", blank=True, null=True)
    # Job Location
    city = models.CharField(max_length=100, blank=True, null=True)
    province = models.CharField(max_length=50, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    postal_code = models.CharField(max_length=10, blank=True, null=True)
    # Job Contact
    apply_by_mail = models.BooleanField(default=False)
    mailing_address = models.CharField(max_length=255, blank=True, null=True)
    apply_by_email = models.BooleanField(default=False)
    # email = models.EmailField(blank=True, null=True)
    email = MultiEmailField(blank=True, null=True)
    apply_by_fax = models.BooleanField(default=False)
    is_published_ever = models.BooleanField(default=False)
    fax = models.CharField(max_length=255, blank=True, null=True)
    apply_by_phone = models.BooleanField(default=False)
    phone = models.CharField(max_length=255, blank=True, null=True)
    apply_by_website = models.BooleanField(default=False)
    website = models.URLField(null=True, blank=True)
    email_notification = models.CharField(max_length=500, choices=email_choices, blank=True, null=True)
    notification_email = models.EmailField(blank=True, null=True)
    # notification_email = MultiEmailField(blank=True, null=True)
    saved_by = models.ManyToManyField(Profile, related_name="saved_by_users", blank=True)
    #applied_by = models.ManyToManyField(Profile, related_name="applied_by_users", blank=True)

    created_by = models.ForeignKey(Profile, on_delete=models.CASCADE, blank=True, null=True, related_name="job_created")
    updated_by = models.ForeignKey(Profile, on_delete=models.CASCADE, blank=True, null=True, related_name="job_updated")

    old_job_id = models.CharField(max_length=255, help_text="Old Job Id", blank=True)
    longitude = models.DecimalField(max_digits=20, decimal_places=12, null=True, blank=True)
    latitude = models.DecimalField(max_digits=20, decimal_places=12, null=True, blank=True)

    views = models.IntegerField(default=0)

    objects = JobsManager()

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title_en.lower() + '-' + "")
            if Job.objects.filter(slug=self.slug).exists():
                self.slug + "-" + RandomNumber()

        if not self.post_date:
            self.post_date = timezone.now()

        if not self.is_published_ever:
            self.is_published_ever = False

        if self.is_published ==True:
            self.is_published_ever = True

        if not self.closing_date:
            # post_dateObj = datetime.datetime.strptime(self.post_date, "%Y-%m-%dT%H:%M:%SZ")

            self.closing_date = (self.post_date + datetime.timedelta(days=31) )
        super(Job, self).save(*args, **kwargs)

    def __str__(self):
        return self.title_en

    def dealer_of_job(self):
        return self.dealer

    @property
    def to_json(self):
        return {
            "id": self.slug,
            "is_published": self.is_published,
            "post_on_indeed": self.post_on_indeed if self.post_on_indeed else False,
            "post_date": self.post_date,
            "closing_date": self.closing_date,
            "available_for_en": self.available_for_en ,
            "available_for_fr": self.available_for_fr if self.available_for_fr else False,
            "is_published_ever": self.is_published_ever,
            "title": {"en": self.title_en, "fr": self.title_fr},
            "description": {"en": self.description_en, "fr": self.description_fr},
            "salary": {"en": self.salary_en, "fr": self.salary_fr},

            "department": [dept.slug for dept in self.department.all()],
            "experience": None if not self.experience else self.experience.slug,
            "education": None if not self.education else self.education.slug,
            "position_type": None if not self.position_type else self.position_type.slug,
            "city": self.city,
            "province": self.province,

            "confidential": self.confidential if self.confidential else False,
            "apply_by_mail": self.apply_by_mail if self.apply_by_mail else False,
            "apply_by_email": self.apply_by_email if self.apply_by_email else False,
            "apply_by_fax": self.apply_by_fax if self.apply_by_fax else False,
            "apply_by_phone": self.apply_by_phone if self.apply_by_phone else False,
            "apply_by_website": self.apply_by_website if self.apply_by_website else False,

            "email_notification": self.email_notification,
            "notification_email": self.notification_email,
        }

    def user_job_header(self, user):
        obj = self.to_json

        if not self.confidential:
            obj.update(
                {
                    "dealer": {
                        "name": self.dealer.dealer_name,
                        "id": self.dealer.slug,
                        "logo": self.dealer.logo.url if self.dealer.logo else None
                    } if self.dealer else {},
                })
        else:
            obj.update({"dealer": {}})

        if user.is_authenticated and not user.is_dealer:
            appliedDate = None
            jobApplication=user.jobapplication_set
            if jobApplication:
                filteredJobApplication = jobApplication.filter(job_id=self.id)
                if filteredJobApplication:
                    appliedDate = filteredJobApplication[0].created_on
            obj.update({"appliedDate": appliedDate})
            if user in self.saved_by.all():
                obj.update({"saved": True})
            else:
                obj.update({"saved": False})
            return obj

        else:
            return obj

    def user_job_details(self, user):
        if user.is_authenticated and not user.is_dealer:
            obj = self.full_details
            appliedDate = None
            jobApplication = user.jobapplication_set
            if jobApplication:
                filteredJobApplication = jobApplication.filter(job_id=self.id)
                if filteredJobApplication:
                    appliedDate = filteredJobApplication[0].created_on


            obj.update({"appliedDate": appliedDate})
            if user in self.saved_by.all():
                obj.update({"saved": True})
            else:
                obj.update({"saved": False})
            return obj
        else:
            return self.full_details

    @property
    def full_details(self):
        data = self.to_json
        if not self.confidential:
            data.update(
                {
                    "dealer": {
                        "name": self.dealer.dealer_name,
                        "id": self.dealer.slug,
                        "logo": self.dealer.logo.url if self.dealer.logo else None
                    } if self.dealer else {},
                })
        else:
            data.update({"dealer": {}})
        data.update(
            {
                "description": {"en": self.description_en, "fr": self.description_fr},
                "contact": {
                    "mailing_address": self.mailing_address,
                    "fax": self.fax,
                    "phone": self.phone,
                    "email": ",".join(self.email) if self.email else None,
                    "website": self.website
                },
                "location": {
                    "address": self.address,
                    "city": self.city,
                    "province": self.province,
                    "postal_code": self.postal_code,
                    "latitude": str(self.latitude) if self.latitude else "",
                    "longitude": str(self.longitude) if self.longitude else "",
                },
            }
        )
        return data

    @property
    def job_related(self):
        data = self.full_details
        data.update({"views": self.views, "job_applications": self.jobapplication_set.count()})
        data.update({"dealer": {
                        "name": self.dealer.dealer_name,
                        "id": self.dealer.slug,
                        "logo": self.dealer.logo.url if self.dealer.logo else None
                    } if self.dealer else {}})
        return data

    # Django jet method for auto-completion of text
    @staticmethod
    def autocomplete_search_fields():
        return 'title', 'city'

    def clean_fields(self, exclude=None):
        super().clean_fields(exclude=exclude)
        if self.post_date and self.closing_date and (self.post_date > self.closing_date):
            raise ValidationError({
                'closing_date': _(
                    'Closing date cannot be less than Post date.'
                ),
            })




class JobApplication(Core):
    """
    Job Application of a user
    """
    old_id = models.CharField("Old Job Id", max_length=25, blank=True, null=True, unique=True)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    date_applied = models.DateTimeField(blank = True, null=True)
    cover_letter = models.TextField(blank=True, null=True)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, null=True)
    video_url = models.URLField(blank=True, null=True)
    #personality_test = models.CharField(max_length=255, blank=True, null=True)
    #on_short_list = models.CharField(max_length=255, blank=True, null=True)
    #rejected = models.CharField(max_length=255, blank=True, null=True)
    #rejection_reason = models.CharField(max_length=255, blank=True, null=True)
    #notes = models.CharField(max_length=255, blank=True, null=True)
    #status = models.CharField(max_length=255, blank=True, null=True)
    #email_sent = models.CharField(max_length=255, blank=True, null=True)
    #email_sent_date = models.DateTimeField(max_length=255, blank=True, null=True)
    #personality_sent = models.CharField(max_length=255, blank=True, null=True)
    #personality_sent_date = models.CharField(max_length=255, blank=True, null=True)
    #phone = models.CharField(max_length=25, blank=True, null=True)
    cell_phone = models.CharField(max_length=25, blank=True, null=True)
    #uniqueness = models.CharField(max_length=255, blank=True, null=True)
    #external_application = models.CharField(max_length=255, blank=True, null=True)
    #resumeText = models.CharField(max_length=255, blank=True, null=True)
    #cover_letter_text = models.TextField(blank=True, null=True)


    class Meta:
        unique_together = ('job', 'user',)
        verbose_name_plural ='Job Applications'

    def __str__(self):
        return self.job.title_en + " applied by " + self.user.email

    @property
    def to_json(self):
        job = self.job.user_job_header(self.user)
        job.update({"appliedDate": self.created_on, "applied": True})
        return {
            "cell_phone": self.cell_phone,
            "resume_id": self.resume.slug,
            "job": job,
            "id": self.slug,
            "video_url": self.video_url,
        }

    @property
    def job_posting(self):
        return {
            "resume_url": None if not self.resume else self.resume.resume.file.url,
            "first_name": self.user.first_name,
            "email": self.user.email,
            "last_name": self.user.last_name,
            "id": self.slug,
            "video_url": self.video_url,
            "cover_letter": self.cover_letter
        }

    @property
    def meta_json(self):
        job = self.job.user_job_header(self.user)
        job.update({"appliedDate": self.created_on})
        return {
            "id": self.slug,
            "job": job,
        }

    def save(self, *args, **kwargs):

        if not self.date_applied:
            self.date_applied = datetime.datetime.now()

        super(JobApplication, self).save(*args, **kwargs)


class JobSearch(Core):
    """
    Job Search of a user
    """
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    filter_data = models.TextField()

    def __str__(self):
        return self.name

    @property
    def to_json(self):
        return {
            "id": self.slug,
            "name": self.name,
            "filter": {} if not self.filter_data else eval(str(self.filter_data)),
            "created_date": self.created_on
        }


class JobCreditHistory(Core):
    """
    Job credit related history model
    """
    invoice = models.ForeignKey(Invoice, on_delete=models.SET_NULL, blank=True, null=True)
    job = models.ForeignKey(Job, on_delete=models.SET_NULL, blank=True, null=True)
    dealer = models.ForeignKey(Dealer, on_delete=models.SET_NULL, blank=True, null=True)
    user = models.ForeignKey(Profile, on_delete=models.SET_NULL, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    quantity = models.IntegerField(default=0)
    remarks = models.TextField(blank=True, null=True)



    class Meta:
        verbose_name_plural='Job Credit Histories'

    @property
    def to_meta_json(self):
        return {
            "id": self.slug,
            "transaction_date": self.created_on,
            "invoice_id": self.invoice.slug if self.invoice and self.invoice.sale_id != None else None,
            "payment_gateway":self.invoice.payment_gateway if self.invoice else None,
            "dealer_id": self.dealer.slug if self.dealer else None,
            "dealer_name": self.dealer.dealer_name if self.dealer else None,
            "user_id": str(self.user_id) if self.user else None,
            "job_id": str(self.job.slug) if self.job else None,
            "quantity": str(self.quantity),
            "description": self.description,
            "remarks": self.remarks,
        }


class JobTemplate(Core):
    """
    Job templates Model
    """

    language_choices = (
        ("en", "en"),
        ("fr", "fr"),

    )
    title = models.CharField(max_length=255,null=True,blank=True)
    language = models.CharField(choices=language_choices, default="en", max_length=100)
    description = MartorField(blank=True,null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural ='Job Templates'


    def __str__(self):
        return self.title

    @property
    def to_json(self):
        return {
            "id":self.slug,
            "title":self.title,
            "language":self.language,
            "description":self.description
            }


class JobsSummary(Core):
    """
    job summary
    """
    month = models.IntegerField()
    year = models.IntegerField()
    province = models.CharField(blank=True,null=True,max_length=250)
    jobs_count = models.IntegerField()

    def __str__(self):
        return self.slug


class JobApplicationsSummary(Core):
    """
    job summary
    """
    month = models.IntegerField()
    year = models.IntegerField()
    province = models.CharField(blank=True,null=True,max_length=250)
    applications_count = models.IntegerField()

    def __str__(self):
        return self.slug











# signals off during resume import#

@receiver(post_save, sender=JobApplication)
def update_appllied_user(sender, instance, **kwargs):
    if kwargs.get('raw', False):
        return False

    # Send Notification Email to Dealer
    if instance.job.email_notification == Job.email_choices[1][0]:
        instantMail(
            applicationObj=instance,
            jobObj = instance.job
        )
    # Send Notification Email to Applicant
    EmailApplicant(applicationObj=instance, jobObj=instance.job)





@receiver(post_save, sender=Dealer)
def create_job_credit_history_on_updated(sender, instance, **kwargs):
    if kwargs.get('raw', False):
        return False
    request = MyRequestMiddleware(get_response=None)
    request = request.thread_local.current_request
    if kwargs["created"]:
        old_balance=0

    else:
        old_balance=0
        old_balanceobj =(JobCreditHistory.objects.filter(dealer__id=instance.id).aggregate(Sum('quantity')))['quantity__sum']
        if old_balanceobj:
            old_balance=old_balanceobj

    if request.user.is_staff:
        description = "Admin updated balance from {old_balance} to {new_balance}".format(
            old_balance=old_balance ,
            new_balance=instance.balance)

    else:
        description = "First Login balance Added, Previous Balance: {old_balance}, Updated Balance: {new_balance}".format(
            old_balance=old_balance,
            new_balance=instance.balance)


    # Executing If Admin Updated Record
    with DisableSignals([post_save]):
        if instance.balance != old_balance:
            JobCreditHistory.objects.create(
                user_id=request.user.id,
                description=description,
                quantity=instance.balance - old_balance,
                dealer_id=instance.id
            )

    return True


@receiver(post_save, sender=Job)
def create_jobs_summary(instance,raw=False, **kwargs):
    month =datetime.datetime.now().month
    year =datetime.datetime.now().year
    try:
        jobsummaryobj = JobsSummary.objects.get(
            month =month,
            year= year,
            province=instance.province,
        )
        jobsummaryobj.jobs_count +=1
        jobsummaryobj.save()
    except:

        max_id  = JobsSummary.objects.latest('id').id
        JobsSummary.objects.create(
            id=max_id+1,
            month=month,
            year=year,
            province=instance.province,
            jobs_count=1
        )







@receiver(post_save, sender=Job)
def create_job_credit_history( instance, raw=False, **kwargs):
    if kwargs.get('raw', False):
        return False

    if kwargs['created']:
        dealer = instance.dealer
        if instance.is_published ==True:
            if instance.post_on_indeed == True and CHARGE_FOR_INDEED_POSTING == True:
                if dealer and dealer.balance >= 2:
                    create_job_credit_history_if_publish(job=instance, dealer=instance.dealer,created=True)
                    create_job_credit_history_if_indeed(job=instance, dealer=instance.dealer)
                else:
                    raise ValueError("Credits too low to create job")
            else:
                if dealer and dealer.balance >= 1:
                    create_job_credit_history_if_publish(job=instance, dealer=instance.dealer,created=True)
                else:
                    raise ValueError("Credits too low to create job")
        else:
            return {"message":"job-posted successfully"}


    else:
        print(instance.__dict__)
        if timezone.now() - instance.post_date > datetime.timedelta(hours=72):
            dealer = instance.dealer
            if instance.is_published == True :

                if instance.post_on_indeed == True and CHARGE_FOR_INDEED_POSTING == True:
                    if dealer and dealer.balance >= 2:
                        create_job_credit_history_if_publish(job=instance, dealer=instance.dealer,created=False)
                        create_job_credit_history_if_indeed(job=instance, dealer=instance.dealer)
                    else:
                        raise ValueError("Credits too low to create job")
                else:
                    if dealer and dealer.balance >= 1:
                        create_job_credit_history_if_publish(job=instance, dealer=instance.dealer,created=False)
                    else:
                        raise ValueError("Credits too low to create job")
            else:
                    return {"message": "job-posted successfully"}
        else:
            dealer = instance.dealer
            if instance.is_published == True:

                if instance.post_on_indeed == True and CHARGE_FOR_INDEED_POSTING == True:
                    if dealer and dealer.balance >= 2:
                        create_job_credit_history_if_publish(job=instance, dealer=instance.dealer, created=False)
                        create_job_credit_history_if_indeed(job=instance, dealer=instance.dealer)
                    else:
                        raise ValueError("Credits too low to create job")
                else:
                    if dealer and dealer.balance >= 1:
                        create_job_credit_history_if_publish(job=instance, dealer=instance.dealer, created=False)
                    else:
                        raise ValueError("Credits too low to create job")
            else:
                return {"message": "job-posted successfully"}


@receiver(post_save, sender=JobCreditHistory)
def manage_balance(sender, instance, **kwargs):
    if kwargs.get('raw', False):
        return False

    elif kwargs["created"]:
        dealer = instance.dealer
        dealer.balance += instance.quantity
        dealer.save()




@receiver(post_save, sender=Invoice)
def create_job_credit_historys(sender, instance, **kwargs):
    if kwargs.get('raw', False):
        return False

    if kwargs["created"]:
        if instance.total!=0:
            description="{credits} purchased by {user} on {date}".format(credits=instance.item, date=instance.created_on.date(), user=instance.dealer)
        else:
            description="{user} got {credits} credits on {date} with promocode {promocode}".format(credits=instance.quantity, date=instance.created_on.date(),
                                                             user=instance.dealer,promocode=instance.promo_code)

        try:
            print(instance.__dict__)
            dealer = instance.dealer
            print(dealer)
            JobCreditHistory.objects.create(
                    invoice_id=instance.id,
                    user_id=instance.user.id,
                    description= description,
                    quantity= instance.quantity,
                    dealer_id=dealer.id
                )

        except KeyError:
            pass

@receiver(post_save, sender=JobCreditHistory)
def manage_balance(sender, instance, **kwargs):
    if kwargs.get('raw', False):
        return False

    elif kwargs["created"]:
        dealer = instance.dealer
        dealer.balance += instance.quantity
        dealer.save()




def create_job_credit_history_if_publish(job,dealer,created):
    if created ==True:
        description = "{job} created on {date} by {user}".format(job=job.title_en, date=job.created_on.date(),
                                                                 user=job.created_by.first_name),
    else:
        description = "{job} updated on {date} by {user}".format(job=job.title_en, date=job.created_on.date(),
                                                                 user=job.created_by.first_name),
    JobCreditHistory.objects.create(
        job_id=job.id,
        user_id=job.created_by.id,
        description=description,
        quantity=-1,
        dealer_id=dealer.id
    )

def create_job_credit_history_if_indeed(job,dealer):
    JobCreditHistory.objects.create(
        job_id=job.id,
        user_id=job.created_by.id,
        description="{job} posted on indeed on {date} by {user}".format(job=job.title_en,
                                                                        date=job.created_on.date(),
                                                                        user=job.created_by.first_name),
        quantity=-1,
        dealer_id=dealer.id
    )
