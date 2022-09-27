"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.db.models import Manager
from django.db import models



class LocalizationManager(Manager):
    """
    Localization model manager
    """

    def by_group(self, group_name, lng="*"):
        data = {}
        if lng.isalpha():
            [
                data.update(
                    {
                        obj.key: obj.english_value if lng.startswith("en") else obj.french_value
                    }
                ) for obj in super().get_queryset().filter(group__icontains=group_name)
                ]
            return data
        else:
            return {
                obj.key: {
                    "english_value": obj.english_value, "french_value": obj.french_value
                }
                for obj in super().get_queryset().filter(group__icontains=group_name)
                }


class NavItemManager(models.Manager):
    """
    Manager for Education placeholder
    """
    def active(self, lng_str,name,province):
        if not lng_str or '*' in lng_str:
            return [obj.to_json for obj in super().get_queryset().filter(name=name.title(),province=province.title())]
        if lng_str.startswith("en"):

            return [{"caption": {"en": obj.caption_en},"id":obj.slug,"name":obj.name,"to":obj.to,"external":obj.external,"signedIn":obj.signedIn,"type":obj.type,"province":obj.province,"items":[] if not obj.items else [item.item_tojson for item in obj.items.all().order_by("order")]} for obj in super().get_queryset().filter(name=name.title(),province=province.title())]
        else:
            return [{"caption": {"fr": obj.caption_fr},"id":obj.slug,"name":obj.name,"to":obj.to,"external":obj.external,"signedIn":obj.signedIn,"type":obj.type,"province":obj.province,"items":[] if not obj.items else [item.item_tojson for item in obj.items.all().order_by("order")]} for obj in super().get_queryset().filter(name=name.title(),province=province.title())]

