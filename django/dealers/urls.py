"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.urls import path

from dealers.views import dealerlist, DealerInfo

urlpatterns = [
    path('dealer/<slug:dealer_slug>/', DealerInfo.as_view()),
    path('all-dealers/', dealerlist.as_view()),

]