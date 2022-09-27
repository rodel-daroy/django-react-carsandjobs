"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""

# Forms
from django import forms

from jobs.models import Job


class JobForm(forms.ModelForm):
	"""
	Customized form of Job model
	"""

	class Meta:
		model = Job
		exclude = ('slug', 'parent_job',)
