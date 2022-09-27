from django.db import models
import datetime
from django.utils.text import slugify

from CarsAndJobs.aws_lib import RandomNumber

# Create your models here.
from core.models import Core
from education.managers import EducationPlaceholderManager, EducationProgrammeManager
from jobs.models import JobDepartment


class EducationProgramme(Core):
    """
    Model for Education programme
    """
    title_en = models.CharField(max_length=255,blank=True,null=True)
    title_fr = models.CharField(max_length=255,blank=True,null=True)
    school_name_en = models.CharField(max_length=255,blank=True,null=True)
    school_name_fr = models.CharField(max_length=255,blank=True,null=True)
    city = models.CharField(max_length=30,blank=True,null=True)
    province = models.CharField(max_length=30)
    url = models.URLField(default="http://")
    scholarship = models.BooleanField(default=False)
    apprenticeship = models.BooleanField(default=False)
    department = models.ForeignKey(JobDepartment, on_delete=models.SET_NULL, null=True)
    coop=models.BooleanField(default=False)
    description=models.TextField(blank=True, null=True)


    objects = EducationProgrammeManager()

    class Meta:
        verbose_name_plural = 'Education Programme'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(
                self.title_en.lower() + '-' + str(datetime.datetime.now().timestamp()))
            if EducationProgramme.objects.filter(slug=self.slug).exists():
                self.slug + "-" + RandomNumber()
        super(EducationProgramme, self).save(*args, **kwargs)

    def __str__(self):
        return self.title_en

    @property
    def education_programme(self):
        return {
            "id":self.slug,
            "title":{"en":self.title_en,"fr":self.title_fr},
            "school_name":{ "en":self.school_name_en,"fr":self.school_name_fr},
            "city": self.city,
            "province": self.province,
            "url": self.url,
            "scholarship": self.scholarship,
            "apprenticeship": self.apprenticeship,
            "department": self.department.slug,
            "coop": self.coop
        }


class EducationPlaceholder(Core):
    """
    Model for education placeholder

    """
    title_en = models.CharField(max_length=255, blank=True, null=True)
    title_fr = models.CharField(max_length=255, blank=True, null=True)
    description_en = models.TextField(blank=True, null=True)
    description_fr = models.TextField(blank=True, null=True)
    department = models.ForeignKey(JobDepartment, on_delete=models.SET_NULL, null=True)

    objects = EducationPlaceholderManager()

    class Meta:
        verbose_name_plural = 'Education Placeholder'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(
                self.title_en.lower() + '-' + str(datetime.datetime.now().timestamp()))
            if EducationPlaceholder.objects.filter(slug=self.slug).exists():
                self.slug + "-" + RandomNumber()
        super(EducationPlaceholder, self).save(*args, **kwargs)

    def __str__(self):
        return self.title_en

    @property
    def to_json(self):
        return {
            "department": self.department.slug,
            "id":self.slug,
            "title":
                {
                    "en": self.title_en,
                    "fr": self.title_fr,
                },
            "description":
                {
                    "en": self.description_en,
                    "fr": self.description_fr,
                }
        }

