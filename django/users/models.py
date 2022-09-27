from threading import Thread

from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models

# Create your models here.
from django.template.defaultfilters import truncatechars

from users import DEALER_SOURCES, DEALER_ROLES

from core.models import Core, ResumeFile
from dealers.models import Dealer
from users.managers import UpdatePasswordManager, ContactUsManager, EmailVerifactionManager
from dealers.models import Dealer
import datetime
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.utils import timezone


class CoverLetter(Core):
    """
    Cover letters for particular user
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    text = models.TextField(blank=True, null=True)
    active = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    @property
    def to_json(self):
        return {
            "name": self.name,
            "description": self.description,
            "text": self.text,
            "active": self.active,
            "id": self.slug,
            "modified_date": self.updated_on
        }


class Resume(Core):
    """
    Resumes of users
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    active = models.BooleanField(default=False,)
    searchable = models.BooleanField(default=False)
    resume = models.ForeignKey(ResumeFile, on_delete=models.CASCADE)
    posted_date = models.DateTimeField(blank=True, null=True)

    def clean_fields(self, exclude=None):
        super().clean_fields(exclude=exclude)

        if self.posted_date:
            posted_date_obj = self.posted_date
            now = timezone.now()

            if posted_date_obj < now:
                raise ValidationError({
                    'posted_date': _(
                        'Post date is already past'
                    ),
                })

    def __str__(self):
        return self.name

    @property
    def to_json(self):
        return {
            "name": self.name,
            "description": self.description,
            "active": self.active,
            "searchable": self.searchable,
            "text": self.resume.text,
            "processing": self.resume.processing,
            "file_id": self.resume.slug,
            "modified_date": self.updated_on,
            "id": self.slug,
            "url": self.resume.file.url,
            "posted_date":self.posted_date,
        }

    @property

    def resume_search_json(self):

            try:
                return {
                    "first_name": self.profile_resume.latest('id').first_name,
                    "last_name": self.profile_resume.latest('id').last_name,
                    "email": self.profile_resume.latest('id').email,
                    "city": self.profile_resume.latest('id').city,
                    "province": self.profile_resume.latest('id').province,
                    "url": self.resume.file.url,
                     "modified_date": self.updated_on
                }
            except:
                pass



class Address(Core):
    """
    Users address
    """
    street = models.CharField(max_length=500, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    postal_code = models.CharField(max_length=10, blank=True, null=True)
    province = models.CharField(max_length=30, blank=True, null=True)

    @property
    def to_json(self):
        return {
            "street": self.street,
            "city": self.city,
            "postal_code": self.postal_code,
            "province": self.province
        }


class Profile(AbstractUser):
    """
    Custom user model for the whole ap
    """
    is_featured = models.BooleanField(default=False)
    email = models.EmailField(unique=True)
    is_dealer = models.BooleanField(default=False)
    cover_letters = models.ManyToManyField(CoverLetter, related_name="user_cover_letters", blank=True)
    resume = models.ManyToManyField(Resume, related_name="profile_resume", blank=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    phone_ext = models.CharField(max_length=100, blank=True, null=True)
    cell_phone = models.CharField(max_length=200, blank=True, null=True)
    street = models.CharField(max_length=200, blank=True, null=True)
    city = models.CharField(max_length=200, blank=True, null=True)
    postal_code = models.CharField(max_length=200, blank=True, null=True)
    province = models.CharField(max_length=255, blank=True, null=True)
    new_graduate = models.BooleanField(default=False)
    coop_student = models.BooleanField(default=False)
    role = models.CharField(max_length=100, blank=True,null=True)
    old_id = models.CharField(max_length=50, blank=True, null=True)
    new_id = models.CharField(max_length=50, blank=True, null=True)

    is_verified = models.BooleanField(default=False)
    only_allowed_TADA_login = models.BooleanField(default=False)





    objects = UserManager()

    def __str__(self):
        return self.username

    @property
    def searches(self):
        return [obj.to_json for obj in self.jobsearch_set.all()]

    def save(self, *args, **kwargs):
        if self.email:
            self.email = self.email.strip().lower()
        if self.username:
            self.username = self.username.strip().lower()

        super(Profile, self).save(*args, **kwargs)


    @property
    def to_json(self):
        return {
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "cell_phone": self.cell_phone,
            "new_graduate": self.new_graduate,
            "coop_student": self.coop_student,
            "phone": self.phone,
            "phone_ext": self.phone_ext,
            "choices": self.specialized,
            "address": {
                "street": self.street,
                "city": self.city,
                "postal_code": self.postal_code,
                "province": self.province
            }
        }

    @property
    def specialized(self):
        return [dept.slug for dept in self.user_choice.all()]

    @property
    def saved_jobs(self):
        # will contain job header only, according to documentation
        return [job.to_json for job in self.saved_by_users.all()]

    @property
    def user_cover_letters(self):
        data = [cv_letter.to_json for cv_letter in self.cover_letters.all()]
        return data


class DealerProfiles(models.Model):
    """
    CADA Profiles model
    """
    source = models.CharField(max_length=50, choices=DEALER_SOURCES, default=DEALER_SOURCES[0][0])
    data = models.TextField(blank=True, null=True)
    imis_id = models.CharField(max_length=225, blank=True, null=True)
    username = models.CharField(max_length=225, blank=True, null=True)
    user = models.ForeignKey(Profile, related_name="dealer_profile", on_delete=models.SET_NULL, blank=True, null=True)
    dealer = models.ForeignKey(Dealer, blank=True, null=True, on_delete=models.SET_NULL)
    role = models.CharField(max_length=100, choices=DEALER_ROLES, default=DEALER_ROLES[0][0])
    person_number = models.CharField(max_length=100, null=True, blank=True)


    def __str__(self):
        if self.username is None:
            return self.source
        return self.username

    class Meta:
        verbose_name = "Dealer Profile"
        verbose_name_plural = "Dealer Profiles"


class ContactAction(models.Model):
    """
    Contact us form action
    """
    name = models.CharField(max_length=50, blank=False, null=True)
    email = models.EmailField(blank=False, null=True)
    text = models.TextField(blank=False, null=True)

    mobile = models.CharField(max_length=20, blank=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    objects=ContactUsManager()

    def __str__(self):
        return self.name

    @property
    def short_description(self):
        return truncatechars(self.text, 60)


class UserUpdatePassword(Core):
    """
    When User updates password
    """
    user = models.ForeignKey(Profile, blank=True, null=True,on_delete=models.CASCADE)
    token = models.CharField(max_length=255, blank=True, null=True)

    objects=UpdatePasswordManager()

    def __str__(self):
        return self.user.username


class EmailConfirmation(Core):
    """
    Model for confirmation link
    """
    user = models.ForeignKey(Profile, blank=True, null=True, on_delete=models.CASCADE)
    confirmation_token = models.CharField(max_length=255, blank=True, null=True)

    objects=EmailVerifactionManager()

    def __str__(self):
        return self.user.username


class ProfilesSummary(Core):
    """
    job summary
    """
    month = models.IntegerField()
    year = models.IntegerField()
    province = models.CharField(blank=True,null=True,max_length=250)
    users_count = models.IntegerField()

    def __str__(self):
        return self.slug


class ResumesSummary(Core):
    """
    job summary
    """
    month = models.IntegerField()
    year = models.IntegerField()
    province = models.CharField(blank=True, null=True, max_length=250)
    resumes_count = models.IntegerField()

    def __str__(self):
        return self.slug
