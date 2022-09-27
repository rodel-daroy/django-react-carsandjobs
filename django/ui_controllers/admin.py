from django import forms
from django.contrib import admin

# Register your models here.
from site_content.models import Article
from ui_controllers.forms import TileForm
from .models import ControllerTile, ControllerCategory


class ControllerTileAdmin(admin.ModelAdmin):
    """
    Model admin for controller tile
    """
    form = TileForm
    search_fields = ('tile_name',)
    list_display = ('tile_name','category_id','is_active','order',)

class ControllerCategoryAdmin(admin.ModelAdmin):
    """
    Model admin for controller category
    """
    search_fields = ('category_name',)
    list_display = ('category_name', 'province','language')

admin.site.register(ControllerTile, ControllerTileAdmin)
admin.site.register(ControllerCategory, ControllerCategoryAdmin)
