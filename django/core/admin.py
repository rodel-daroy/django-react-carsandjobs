from django.contrib import admin

# Register your models here.
from core.models import Language, ResumeFile


class LanguageAdmin(admin.ModelAdmin):
    search_fields = ('language_name', 'language_str')
    exclude = ('slug',)


class ResumeFileAdmin(admin.ModelAdmin):
    search_fields = ('slug','text', )


admin.site.register(Language, LanguageAdmin)
admin.site.register(ResumeFile, ResumeFileAdmin)
