from django.contrib import admin

# Register your models here.
from django.utils.html import format_html

from site_content.forms import ArticleForm
from site_content.models import *


class ArticleAdmin(admin.ModelAdmin):
    search_fields = ('heading_en', 'heading_fr','article_body_en','sub_heading_en',)
    list_display = ('heading_en','heading_fr',"publish_state_en","publish_state_fr",)
    form = ArticleForm

    def preview(self, obj):
        return format_html('<a href="#" target="_blank">Preview on website</a>')

class ArticleLayoutAdmin(admin.ModelAdmin):
    """
    article layout admin
    """
    search_fields = ('name',)
    list_display = ('name',)

class AssetInline(admin.TabularInline):
    model = Asset

class ContentAdmin(admin.ModelAdmin):
    search_fields = ('id', 'file_name',)
    list_display = ('id', 'file_name',)
    exclude = ('order',)


class SponsorAdmin(admin.ModelAdmin):
    search_fields = ('id', 'name',)
    list_display = ('id', 'name',)
    exclude = ('slug',)


class ContentProviderAdmin(admin.ModelAdmin):
    search_fields = ('id', 'name',)
    list_display = ('id', 'name')
    exclude = ('slug',)


class ContentInline(admin.StackedInline):
    model = Asset.content.through
    extra = 0

class AssetAdmin(admin.ModelAdmin):
    search_fields = ('name', 'asset_type',)
    list_display = ('name', 'asset_type',)
    inlines = [
        ContentInline,
    ]


admin.site.register(Article, ArticleAdmin)
admin.site.register(Content, ContentAdmin)
admin.site.register(ContentProvider, ContentProviderAdmin)
admin.site.register(Sponsor, SponsorAdmin)
admin.site.register(Asset, AssetAdmin)
admin.site.register(ArticleLayout, ArticleLayoutAdmin)
