"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.urls import path

from education.views import EducationProgrammeList, EducationPlaceholder, EducationPlaceholders, EducationPrograms

urlpatterns = [
    path('programmes/', EducationProgrammeList.as_view()),
    path('placeholders/', EducationPlaceholders.as_view()),
]