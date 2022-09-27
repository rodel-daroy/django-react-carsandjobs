from django.contrib import admin


from users.models import Profile, DealerProfiles, CoverLetter, Resume, ContactAction, ProfilesSummary, ResumesSummary
from users.forms import DealerForm, JobSeekerForm, ProfileForm
from users.models import Profile

class ProfileAdmin(admin.ModelAdmin):
    """
    custom admin dashboard for profile admin
    """
    search_fields = ('username', 'email', 'first_name', 'last_name',)
    list_display = ('username', 'email', 'is_dealer','is_active','is_verified')
    list_filter = ('is_superuser',)
    form = ProfileForm


class CADAProfileAdmin(admin.ModelAdmin):
    """
    CADA profile for admin
    """
    search_fields = ('username','imis_id','dealer__dealer_name')
    list_display = ('imis_id','username','source','dealer','role',)


class CoverLetterAdmin(admin.ModelAdmin):
    """
     cover letter for admin
    """
    search_fields = ('slug','name',)
    list_display = ('name','slug','active',)


class ResumeAdmin(admin.ModelAdmin):
    """
    Resume admin
    """
    search_fields = ('slug','description', 'name')
    list_display = ('slug','name','active','searchable','posted_date',)

class ContactActionAdmin(admin.ModelAdmin):
    """
    Resume admin
    """
    search_fields = ('name', 'email')
    list_display = ('name', 'email', 'short_description', 'created_on')
    readonly_fields = ('created_on',)

class DealerUser(Profile):
    class Meta:
        proxy = True


class DealerProfileInline(admin.StackedInline):
    model = DealerProfiles
    max_num = 1
    search_fields = ('name', 'imis_id', 'username', 'user_id')



class DealerUserAdmin(ProfileAdmin):
    search_fields = ('username', 'email', 'first_name', 'last_name',)
    list_display = ('username', 'is_dealer')
    list_filter = ('is_superuser',)
    form = DealerForm
    inlines = [
        DealerProfileInline
    ]

    def get_queryset(self, request):
        return self.model.objects.filter(is_dealer=True)


class JobSeekerUser(Profile):
    class Meta:
        proxy = True


class JobSeekerAdmin(admin.ModelAdmin):
    search_fields = ('username', 'email', 'first_name', 'last_name',)
    list_display = ('username', 'email', 'is_active', 'is_verified')
    list_filter = ('is_superuser',)
    form = JobSeekerForm

    def get_queryset(self, request):
        return self.model.objects.filter(is_dealer=False)


class ProfilesSummaryAdmin(admin.ModelAdmin):
    list_display = ('slug','month','year','province','users_count',)

class ResumesSummaryAdmin(admin.ModelAdmin):
    list_display = ('slug','month','year','province',)




admin.site.register(Profile, ProfileAdmin)
admin.site.register(CoverLetter, CoverLetterAdmin)
admin.site.register(DealerProfiles, CADAProfileAdmin)
admin.site.register(Resume, ResumeAdmin)
admin.site.register(ContactAction,ContactActionAdmin)
admin.site.register(DealerUser, DealerUserAdmin)
admin.site.register(JobSeekerUser, JobSeekerAdmin)
admin.site.register(ProfilesSummary, ProfilesSummaryAdmin)
admin.site.register(ResumesSummary, ResumesSummaryAdmin)
