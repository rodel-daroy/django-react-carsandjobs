from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from import_export.formats import base_formats
from rest_framework import request

from jobs.models import Job, JobDepartment, JobEducation, JobExperience, \
    PositionType, JobApplication, JobCreditHistory, JobDepartmentCategories, JobTemplate, JobsSummary, \
    JobApplicationsSummary
from django import forms
from django.utils import timezone
import datetime


class JobForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = '__all__'


    def clean_dealer(self):
        dealer = self.cleaned_data['dealer']
        if (dealer) and (self.cleaned_data['is_published']) and (dealer.balance) <= 0 :
            raise forms.ValidationError("Dealer has too low credits to make this change.")
        return self.cleaned_data['dealer']


# ModelAdmin classes
class JobAdmin(admin.ModelAdmin):
    """
    custom Job details
    """
    search_fields = ('slug', 'title_en','title_fr','dealer__dealer_name','created_by__username',)
    list_display = ('slug', 'title_en','title_fr', 'dealer','created_by','is_published','post_on_indeed',)

    form = JobForm

    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return self.readonly_fields + ('saved_by','post_date')
        return self.readonly_fields





class JobPropertyAdmin(admin.ModelAdmin):
    """
    Job details for admin
    """
    search_fields = ('str_value',)
    list_display = ('str_value', 'language',)
    exclude = ('slug',)


class DepartmentPropertyAdmin(admin.ModelAdmin):
    """
    Job department details for admin
    """
    search_fields = ('slug','english_value', 'french_value',)
    list_display = ('english_value', 'french_value')
    exclude = ('parent_department',)


class EducationPropertyAdmin(admin.ModelAdmin):
    """
    Job Education details for admin
    """
    search_fields = ('slug','english_value', 'french_value',)
    list_display = ('english_value', 'french_value',)
    exclude = ('parent_education',)


class ExperiencePropertyAdmin(admin.ModelAdmin):
    """
    Job experience details for admin
    """
    search_fields = ('slug','english_value', 'french_value',)
    list_display = ('english_value', 'french_value',)
    exclude = ('parent_experience',)


class CompanyPropertyAdmin(admin.ModelAdmin):
    """
    Job company details for admin
    """
    search_fields = ('name',)
    list_display = ('name',)

class JobDepartmentCategoryAdmin(admin.ModelAdmin):
    search_fields = ('slug','english_value','french_value')
    list_display = ('english_value','french_value')


class JobApplicationAdmin(admin.ModelAdmin):
    """
    Job application details for admin
    """
    search_fields = ('slug','job__title_en','user__username','cell_phone',)
    list_display = ('job','user','date_applied',)



class PositionTypePropertyAdmin(admin.ModelAdmin):
    """
    Job Position Type details for admin
    """
    search_fields = ('slug', 'english_value', 'french_value',)
    list_display = ('english_value', 'french_value',)


class JobCreditHistoryAdmin(admin.ModelAdmin):
    search_fields = ('slug','job__title_en','dealer__dealer_name','user__username',)
    list_display = ('slug','job','dealer','user','created_on','description','quantity',)


class JobTemplateResource(ImportExportModelAdmin):

    search_fields = ('slug', 'title',)
    list_display = ('slug', 'title', 'language', 'is_active',)

    def get_export_formats(self):
        """
        Returns available export formats.
        """
        formats =(
            base_formats.CSV,
            base_formats.JSON,
            base_formats.XLS,
            base_formats.HTML,
        )

        return [f for f in formats if f().can_export()]

    def get_import_formats(self):
        """
                Returns available export formats.
                """
        formats = (
            base_formats.CSV,
            base_formats.XLS,
            base_formats.JSON,
            base_formats.HTML,
        )
        return [f for f in formats if f().can_import()]


class JobsSummaryAdmin(admin.ModelAdmin):
    """
    JOb summary admin
    """
    list_display = ('slug','month','year','province','jobs_count',)


class JobApplicationsSummaryAdmin(admin.ModelAdmin):
    """
    JOb summary admin
    """
    list_display = ('slug','month','year','province',)


class JobTemplateAdmin(admin.ModelAdmin):
    search_fields = ('slug','title',)
    list_display = ('slug','title','language','is_active',)


admin.site.register(Job, JobAdmin)
admin.site.register(JobCreditHistory,JobCreditHistoryAdmin)
admin.site.register(JobDepartment, DepartmentPropertyAdmin)
admin.site.register(JobEducation, EducationPropertyAdmin)
admin.site.register(JobExperience, ExperiencePropertyAdmin)
admin.site.register(JobApplication, JobApplicationAdmin)
admin.site.register(PositionType, PositionTypePropertyAdmin)
admin.site.register(JobDepartmentCategories,JobDepartmentCategoryAdmin)
admin.site.register(JobTemplate,JobTemplateResource)
admin.site.register(JobsSummary,JobsSummaryAdmin)
admin.site.register(JobApplicationsSummary,JobApplicationsSummaryAdmin)
