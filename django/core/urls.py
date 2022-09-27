"""
urls for core api's
"""
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from core import views
from core.views import CarouselList, CarouselOrderUpdate, SetAssetOrder

urlpatterns = [
    path('language/', views.CoreLanguageAPIView.as_view(),name='language-info'),
    path('order-assets/', CarouselList.as_view(), name="carousel_list"),
    path('update-order/<int:asset_id>/', CarouselOrderUpdate.as_view(), name="update-order"),
    path('set-order/', SetAssetOrder.as_view(), name="set-order"),
    path('services/', views.services, name="services"),
]