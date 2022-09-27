"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.db import models
from django.db.models import QuerySet
from django.db.models.manager import BaseManager


class JobsManager(models.Manager):
    """
    Manager for jobs
    """

    def active(self, lng_str, dealer_id):
        if not lng_str or '*' in lng_str:
            return [obj.to_json for obj in super().get_queryset().filter(dealer__slug=dealer_id)]
        if lng_str.startswith("en"):
            return [
                {
                    "id": obj.slug,
                    "title": {"en": obj.title_en},
                    "salary": {"en": obj.salary_en},
                    "description": {"en": obj.description_en},
                    "city": obj.city,
                    "company": {
                        "name": obj.dealer.dealer_name,
                        "id": obj.dealer.slug,
                        "logo": obj.dealer.logo.url if obj.dealer.logo else None
                    } if obj.dealer else {},
                    "department": [dept.slug for dept in obj.department.all()],
                    "position_type": None if not obj.position_type else obj.position_type.slug,
                    "experience": None if not obj.experience else obj.experience.slug,
                    "education": None if not obj.education else obj.education.slug,
                    "province": obj.province,
                    "post_date": obj.post_date,
                    "closing_date": obj.closing_date,
                    "saved": False,
                    "applied": False,
                    "appliedDate": None,
                    "available_for_fr": obj.available_for_fr if obj.available_for_fr else False,
                    "available_for_en": obj.available_for_en if obj.available_for_en else True,
                    "apply_by_mail": obj.apply_by_mail if obj.apply_by_mail else False,
                    "apply_by_fax": obj.apply_by_fax if obj.apply_by_fax else False,
                    "apply_by_phone": obj.apply_by_phone if obj.apply_by_phone else False,
                    "apply_by_website": obj.apply_by_website if obj.apply_by_website else False,
                    "post_on_indeed": obj.post_on_indeed if obj.post_on_indeed else False,
                    "is_published": obj.is_published if obj.is_published else False,
                    "email_notification": obj.email_notification if obj.email_notification else False
                }
                for obj in
                super().get_queryset().filter(dealer__slug=dealer_id)]
        else:
            return [{
                "id": obj.slug,
                    "title": {"fr": obj.title_fr},
                    "salary": {"fr": obj.salary_fr},
                    "description": {"fr": obj.description_fr},
                    "city": obj.city,
                    "company": {
                        "name": obj.dealer.dealer_name,
                        "id": obj.dealer.slug,
                        "logo": obj.dealer.logo.url if obj.dealer.logo else None
                    } if obj.dealer else {},
                    "department": [dept.slug for dept in obj.department.all()],
                    "position_type": None if not obj.position_type else obj.position_type.slug,
                    "experience": None if not obj.experience else obj.experience.slug,
                    "education": None if not obj.education else obj.education.slug,
                    "province": obj.province,
                    "post_date": obj.post_date,
                    "closing_date": obj.closing_date,
                    "saved": False,
                    "applied": False,
                    "appliedDate": None,
                    "available_for_fr": obj.available_for_fr if obj.available_for_fr else False,
                    "available_for_en": obj.available_for_en if obj.available_for_en else False,
                    "post_on_indeed": obj.post_on_indeed if obj.post_on_indeed else False,
                    "apply_by_mail": obj.apply_by_mail if obj.apply_by_mail else False,
                    "apply_by_fax": obj.apply_by_fax if obj.apply_by_fax else False,
                    "apply_by_phone": obj.apply_by_phone if obj.apply_by_phone else False,
                    "apply_by_website": obj.apply_by_website if obj.apply_by_website else False,
                    "email_notification": obj.email_notification if obj.email_notification else False,
                    "is_published": obj.is_published  if obj.is_published else False
            }
                for obj in
                super().get_queryset().filter(dealer__slug=dealer_id)]


    def activeByRole(self, lng_str, dealer_id,user):
        if not lng_str or '*' in lng_str:
            return [obj.to_json for obj in
                    super().get_queryset().filter(dealer__slug=dealer_id).filter(created_by=user)]
        if lng_str.startswith("en"):
            return [
                {
                    "id": obj.slug,
                    "title": {"en": obj.title_en},
                    "salary": {"en": obj.salary_en},
                    "description": {"en": obj.description_en},
                    "city": obj.city,
                    "company": {
                        "name": obj.dealer.dealer_name,
                        "id": obj.dealer.slug,
                        "logo": obj.dealer.logo.url if obj.dealer.logo else None
                    } if obj.dealer else {},
                    "department": [dept.slug for dept in obj.department.all()],
                    "position_type": None if not obj.position_type else obj.position_type.slug,
                    "experience": None if not obj.experience else obj.experience.slug,
                    "education": None if not obj.education else obj.education.slug,
                    "province": obj.province,
                    "post_date": obj.post_date,
                    "closing_date": obj.closing_date,
                    "saved": False,
                    "applied": False,
                    "appliedDate": None,
                    "available_for_fr": obj.available_for_fr if obj.available_for_fr else False,
                    "available_for_en": obj.available_for_en if obj.available_for_en else False,
                    "post_on_indeed": obj.post_on_indeed if obj.post_on_indeed else False,
                    "apply_by_mail": obj.apply_by_mail if obj.apply_by_mail else False,
                    "apply_by_fax": obj.apply_by_fax if obj.apply_by_fax else False,
                    "apply_by_phone": obj.apply_by_phone if obj.apply_by_phone else False,
                    "apply_by_website": obj.apply_by_website if obj.apply_by_website else False,
                    "email_notification": obj.email_notification if obj.email_notification else False,
                    "is_published": obj.is_published if obj.is_published else False
                }
                for obj in
                super().get_queryset().filter(dealer__slug=dealer_id).filter(created_by=user)]
        else:
            return [{
                "id": obj.slug,
                    "title": {"fr": obj.title_fr},
                    "salary": {"fr": obj.salary_fr},
                    "description": {"fr": obj.description_fr},
                    "city": obj.city,
                    "company": {
                        "name": obj.dealer.dealer_name,
                        "id": obj.dealer.slug,
                        "logo": obj.dealer.logo.url if obj.dealer.logo else None
                    } if obj.dealer else {},
                    "department": [dept.slug for dept in obj.department.all()],
                    "position_type": None if not obj.position_type else obj.position_type.slug,
                    "experience": None if not obj.experience else obj.experience.slug,
                    "education": None if not obj.education else obj.education.slug,
                    "province": obj.province,
                    "post_date": obj.post_date,
                    "closing_date": obj.closing_date,
                    "saved": False,
                    "applied": False,
                    "appliedDate": None,
                    "available_for_fr": obj.available_for_fr if obj.available_for_fr else False,
                    "available_for_en": obj.available_for_en if obj.available_for_en else False,
                    "post_on_indeed": obj.post_on_indeed if obj.post_on_indeed else False,
                    "apply_by_mail": obj.apply_by_mail if obj.apply_by_mail else False,
                    "apply_by_fax": obj.apply_by_fax if obj.apply_by_fax else False,
                    "apply_by_phone": obj.apply_by_phone if obj.apply_by_phone else False,
                    "apply_by_website": obj.apply_by_website if obj.apply_by_website else False,
                    "email_notification": obj.email_notification if obj.email_notification else False,
                    "is_published": obj.is_published if obj.is_published else False
            }
                for obj in
                super().get_queryset().filter(dealer__slug=dealer_id).filter(created_by=user)]


    def all(self):
        return super().get_queryset().filter(is_published=True)


class CategoryManager(models.Manager):
    """
    Manager for Category
    """

    def active(self, lng_str):
        if not lng_str or '*' in lng_str:
            return [obj.to_json for obj in super().get_queryset().all()]
        if lng_str.startswith("en"):
            return [{"name": {"en": obj.english_value}, "id": obj.slug} for obj in super().get_queryset().filter()]
        elif lng_str.startswith("fr"):
            return [{"name": {"fr": obj.french_value}, "id": obj.slug} for obj in super().get_queryset().filter()]


class DepartmentManager(models.Manager):
    """
    Manager for Department
    """

    def active(self, lng_str):
        if not lng_str or '*' in lng_str:
            return [obj.to_json for obj in super().get_queryset().filter()]
        if lng_str.startswith("en"):
            return [{"name": {"en": obj.english_value}, "id": obj.slug} for obj in super().get_queryset().filter()]
        else:
            return [{"name": {"fr": obj.french_value}, "id": obj.slug} for obj in super().get_queryset().filter()]


class SpecializationManager(models.Manager):
    """
    Manager for Specialization
    """

    def active(self, lng_str):
        if not lng_str or '*' in lng_str:
            return [obj.to_json for obj in super().get_queryset().filter()]
        if lng_str.startswith("en"):
            return [{"name": {"en": obj.english_value}, "id": obj.slug} for obj in super().get_queryset().filter()]
        else:
            return [{"name": {"fr": obj.french_value}, "id": obj.slug} for obj in super().get_queryset().filter()]


class PositionTypeManager(models.Manager):
    """
    Manager for PositionType
    """

    def active(self, lng_str):
        if not lng_str or '*' in lng_str:
            return [obj.to_json for obj in super().get_queryset().filter()]
        if lng_str.startswith("en"):
            return [{"name": {"en": obj.english_value}, "id": obj.slug} for obj in super().get_queryset().filter()]
        else:
            return [{"name": {"fr": obj.french_value}, "id": obj.slug} for obj in super().get_queryset().filter()]


class ExperienceManager(models.Manager):
    """
    Manager for Experience
    """

    def active(self, lng_str):
        if not lng_str or '*' in lng_str:
            return [obj.to_json for obj in super().get_queryset().filter()]
        if lng_str.startswith("en"):
            return [{"name": {"en": obj.english_value}, "id": obj.slug} for obj in super().get_queryset().filter()]
        else:
            return [{"name": {"fr": obj.french_value}, "id": obj.slug} for obj in super().get_queryset().filter()]


class EducationManager(models.Manager):
    """
    Manager for Education
    """

    def active(self, lng_str):
        if not lng_str or '*' in lng_str:
            return [obj.to_json for obj in super().get_queryset().filter()]
        if lng_str.startswith("en"):
            return [{"name": {"en": obj.english_value}, "id": obj.slug} for obj in super().get_queryset().filter()]
        else:
            return [{"name": {"fr": obj.french_value}, "id": obj.slug} for obj in super().get_queryset().filter()]


class DepartmentCategotyManger(models.Manager):

    def active(self ,lng_str):
        if lng_str.startswith("e"):
            return [{"name": {"en": obj.english_value}, "id": obj.slug} for obj in super().get_queryset().filter()]
        elif lng_str.startswith("f"):
            return [{"name": {"fr": obj.french_value}, "id": obj.slug} for obj in super().get_queryset().filter()]
        else:
            return [obj.to_json for obj in super().get_queryset().filter()]
