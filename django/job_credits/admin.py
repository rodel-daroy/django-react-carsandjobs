from django.contrib import admin
from import_export.admin import  ExportMixin
from import_export.formats import base_formats

from job_credits.models import Invoice, Credits, PromoCode, ProvinceTax


class creditsadmin(admin.ModelAdmin):

    search_fields = ('slug','name',)
    list_display = ('slug','name','quantity','is_active',)

class ProvinceTaxadmin(admin.ModelAdmin):

    search_fields = ('slug','province',)
    list_display = ('slug','province','province_tax_rate','federal_tax_rate',)



class Invoiceadmin(ExportMixin, admin.ModelAdmin):

    readonly_fields=('created_on','updated_on',)
    search_fields = ('slug','sale_id','dealer__dealer_name','user__email',)
    list_display = ('dealer_name','user','created_on','sale_id','order_id','quantity','item','total','updated_on',)

    def get_export_formats(self):
        """
        Returns available export formats.
        """
        formats = (
            base_formats.XLS,
            base_formats.CSV,
           )
        return [f for f in formats if f().can_export()]



class Promocodeadmin(admin.ModelAdmin):

    search_fields = ('dealer_name','quantity','code',)
    list_display = ('code','quantity','start_date','end_date','is_active',)

admin.site.register(Invoice,Invoiceadmin)
admin.site.register(Credits,creditsadmin)
admin.site.register(PromoCode,Promocodeadmin)
admin.site.register(ProvinceTax,ProvinceTaxadmin)
