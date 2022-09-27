"""CarsAndJobs URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework_swagger.views import get_swagger_view

from CarsAndJobs.settings import DEBUG
from core import views
from core.views import GunicornRestart
from core.views import gunicorn_restart
from jobs.views import ListJobTemplates, JobTemplateDetail
from users.views import ContactUs
from ui_controllers.views import AllAssets,CreateAsset

schema_view = get_swagger_view(title='Cars & Jobs API')

urlpatterns = [
    path('', schema_view),  # Docs
    path('jet/', include('jet.urls', 'jet')),  # Django JET URLS
    path('jet/dashboard/', include('jet.dashboard.urls', 'jet-dashboard')),  # Django JET dashboard URLS
    path('admin/', admin.site.urls),
    path('jobs/', include('jobs.urls')),
    path('profile/', include('users.urls', namespace='users')),
    path('education/', include('education.urls')),
    path('martor/', include('martor.urls')),
    path('admin/', include('core.urls')),
    path('localized/', include('localization.urls')),
    path('articles/', include('site_content.urls')),
    path('dealers/',include('dealers.urls')),
    path('tiles/', include('ui_controllers.urls')),
    path('job-credits/', include('job_credits.urls')),
    path('assets/all/', AllAssets.as_view(),name="all-assets"),
    path('employer/templates/', ListJobTemplates.as_view(),name="all_job_templates"),
    path('employer/templates/<str:template_id>/', JobTemplateDetail.as_view(),name="job_template_detail"),
    path('assets/create/', CreateAsset.as_view(), name="create-asset"),
    path('membee/', views.MembeeAuthorize.as_view(), ),
    path('membee/employee/', views.MembeeTemplate1.as_view()),
    path('membee/board-members/', views.MembeeTemplate2.as_view()),
    path('contact-us/', ContactUs.as_view(),),
    path('restart-gunicorn/', views.gunicorn_restart, name="restart_gunicorn"),
    path('gunicorn-restart/', GunicornRestart.as_view(), name="Gunicorn Restart API"),
    path('restart-nginx/', views.nginx_restart, name="restart_nginx"),

]
if DEBUG:
    urlpatterns += [
        url(r'^drf_api_docs/', include_docs_urls(title="Cars and Jobs Api Docs", authentication_classes=[],
                                                 permission_classes=[])),
    ]