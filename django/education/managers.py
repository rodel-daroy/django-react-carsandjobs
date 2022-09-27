from django.db import models


class EducationPlaceholderManager(models.Manager):
    """
    Manager for Education placeholder
    """

    def active(self, lng_str):
        if not lng_str or '*' in lng_str:
            return [obj.to_json for obj in super().get_queryset().filter()]
        if lng_str.startswith("en"):
            return [{"title": {"en": obj.title_en}, "description":{"en":obj.description_en},"id": obj.slug,"department": obj.department.slug,} for obj in super().get_queryset().filter()]
        else:
            return [{"title": {"fr": obj.title_fr},"description":{"fr":obj.description_fr}, "id": obj.slug,"department": obj.department.slug} for obj in super().get_queryset().filter()]


class EducationProgrammeManager(models.Manager):
    """
    Manager for Education placeholder
    """

    def active(self, lng_str):
        if not lng_str or '*' in lng_str:
            return [obj.education_programme for obj in super().get_queryset().filter().order_by("title_en")]
        if lng_str.startswith("en"):
            return [{"title": {"en": obj.title_en}, "school_name":{"en":obj.school_name_en},"id":obj.slug,"city": obj.city,"province": obj.province,"url": obj.url,"scholarship": obj.scholarship,"apprenticeship": obj.apprenticeship,"department": obj.department.slug,"coop": obj.coop} for obj in super().get_queryset().filter().order_by("title_en")]
        else:
            return [{"title": {"fr": obj.title_fr},"description":{"fr":obj.school_name_fr},"id":obj.slug,"city": obj.city,"province": obj.province,"url": obj.url,"scholarship": obj.scholarship,"apprenticeship": obj.apprenticeship,"department": obj.department.slug,"coop": obj.coop} for obj in super().get_queryset().filter().order_by("title_fr")]

