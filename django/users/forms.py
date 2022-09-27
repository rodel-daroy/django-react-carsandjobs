"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
# Forms
from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from users.models import Profile


class ProfileForm(forms.ModelForm):
    """
	Customized form of Job model
	"""

    class Meta:
        model = Profile
        fields = '__all__'


class DealerForm(forms.ModelForm):
    """
    	Customized form of Job model
    """
    is_dealer = forms.CharField(
        widget=forms.CheckboxInput(), initial=True, disabled=True)

    class Meta:
        model = Profile
        exclude = (
        'slug', 'resume', 'cover_letters', 'new_graduate', 'coop_student', 'is_verified', 'is_featured', 'password',
        'role')


class JobSeekerForm(forms.ModelForm):
    """
	Customized form of Job model
	"""

    class Meta:
        model = Profile
        exclude = ('slug', 'is_dealer', 'is_featured')
