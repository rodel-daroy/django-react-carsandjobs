from django.contrib import admin

# Register your models here.
from dealers.models import Dealer

class DealerAdmin(admin.ModelAdmin):
    """
    dealer admin
    """
    search_fields = ('dealer_name','slug',)
    list_display = ('dealer_name','dealer_group','is_dealer_group','balance','source','billing_prov',)


admin.site.register(Dealer, DealerAdmin)
