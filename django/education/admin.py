from django.contrib import admin

# Register your models here.
from import_export.admin import ImportExportModelAdmin
from import_export.formats import base_formats

from education.models import EducationProgramme,EducationPlaceholder





class EducationPlaceholderAdmin(ImportExportModelAdmin):
    search_fields = ('slug','title_en','title_fr' )
    list_display = ('title_en','department',)
    def get_export_formats(self):
        """
        Returns available export formats.
        """
        formats = (
            base_formats.CSV,
            base_formats.XLS,
            base_formats.JSON,
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





class EducationProgrammeAdmin(ImportExportModelAdmin):
    search_fields = ('slug','title_en','title_fr')
    list_display = ('title_en','department','scholarship','coop')

    def get_export_formats(self):
        """
        Returns available export formats.
        """
        formats = (
            base_formats.CSV,
            base_formats.XLS,
            base_formats.JSON,
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


admin.site.register(EducationProgramme,EducationProgrammeAdmin)
admin.site.register(EducationPlaceholder,EducationPlaceholderAdmin)



