"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from education.models import EducationProgramme
from jobs.models import  JobDepartment
from rest_framework.response import Response


class LanguageBasedEducationProgramme(object):
    """
    returns language based
    """
    def __new__(cls, lang, data, *args, **kwargs):
        results = []
        for ed_prgrm in data:
            obj = ed_prgrm.education_programme
            if lang.startswith("fr"):
                obj.update({
                    "title": {"fr": ed_prgrm.title_fr},
                    "school_name": {"fr": ed_prgrm.school_name_fr},
                })
            elif lang.startswith("en"):
                obj.update({
                    "title": {"en": ed_prgrm.title_en},
                    "school_name": {"en": ed_prgrm.school_name_en},
                })
            else:
                pass
            results.append(obj)

        return results


class FilteredResultProgramme(object):
    """
    Filtered results of education programme
    """
    def __new__(cls, filters, *args, **kwargs):
        try:
            if not filters.get("department") :
                validated_data = {
                }
            else:
                validated_data = {
                    "department": JobDepartment.objects.get(slug=filters.get("department")).id,
                }
            if filters.get("city"):
                validated_data.update({"city__icontains": filters.get("city")})
            if filters.get("province"):
                validated_data.update({"province__icontains": filters.get("province")})
            EducationbasedProgram = EducationProgramme.objects.filter(**validated_data).order_by("title_fr") if kwargs.get("language") =="fr" else EducationProgramme.objects.filter(**validated_data).order_by("title_en")
            return LanguageBasedEducationProgramme(kwargs.get("language", "en"),EducationbasedProgram)
        except (JobDepartment.DoesNotExist):
            return (EducationProgramme.objects.active("en"))




