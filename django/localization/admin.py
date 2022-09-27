from import_export import resources
from django.contrib import admin
from localization.models import Localization,Navitem
from import_export.formats import base_formats

# Register your models here.
from import_export.admin import ImportExportModelAdmin


class LocalResourceImportExport(resources.ModelResource):
    class Meta:
        model = Localization


class LocalizationAdmin(ImportExportModelAdmin):
    """
    localization list for admin
    """
    resource_class = LocalResourceImportExport
    search_fields = ('slug','english_value',)
    list_display = ('key','english_value','french_value','group',)

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
    # search_fields = ('english_value', 'french_value',)
class NavitemResourceImportExport(resources.ModelResource):
    class Meta:
        model = Navitem




class Navitemadmin(ImportExportModelAdmin):
    """
    Navitem for admin
    """

class NavitemLocalResourceImportExport(resources.ModelResource):
    class Meta:
        model = Navitem

class NavItemAdmin(ImportExportModelAdmin):
    resource_class = NavitemLocalResourceImportExport
    search_fields = ('slug','name',)
    list_display = ('name','caption_en','caption_fr','province','type','signedIn',)

#
admin.site.register(Localization,LocalizationAdmin)
admin.site.register(Navitem,NavItemAdmin)

# admin.site.register(LocalizedGroupAdmin)
#admin.site.register(Navitem,NavitemAdmin)
