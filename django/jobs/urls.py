"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""

from django.urls import path

from jobs.views import JobAPIView, JobDetailsAPIView, JobPositionTypeAPIView, \
    JobDepartmentAPIView, JobEducationAPIView, JobExperienceAPIView, SaveJobAPIView, \
    UnSaveJobAPIView, SavedJobsAPIView, JobApplyAPIView, JobApplicationListAPIView, JobPost, JobUpdate, AllJobAPIView, \
    JobDeapartmentCategoryAPIView, JobStatus, Applicationstatics, JobUpdateWithNewParams, ValidJobs, \
    NewApplicationstatics, NewJobStatus

from .views import JobPostingByDealer, JobApplicationById, SingleJobPostingDealer

urlpatterns = [
    # path('', include(router.urls)),
    path('job-search/', JobAPIView.as_view()),
    path('all_published_jobs/', ValidJobs.as_view()),
    path('indeed-jobs/', AllJobAPIView.as_view()),
    # path('application-stats/',Applicationstatics.as_view()),
    path('application-stats/',NewApplicationstatics.as_view()),
    # path('job-stats/', JobStatus.as_view()),
    path('job-stats/', NewJobStatus.as_view()),
    path('job-details/<str:job_id>/', JobDetailsAPIView.as_view()),
    path('departments/', JobDepartmentAPIView.as_view()),
    path('educations/', JobEducationAPIView.as_view()),
    path('department-category/', JobDeapartmentCategoryAPIView.as_view()),
    path('experiences/', JobExperienceAPIView.as_view()),
    path('position-types/', JobPositionTypeAPIView.as_view()),
    path('save/', SaveJobAPIView.as_view()),
    path('create/', JobPost.as_view()),
    path('delete/<str:job_id>/', JobPost.as_view()),
    path('update/<str:job_id>/', JobUpdate.as_view()),
    path('publish/<str:job_id>/', JobUpdateWithNewParams.as_view()),
    path('unsave/', UnSaveJobAPIView.as_view()),
    path('saved/', SavedJobsAPIView.as_view()),
    path('<str:job_id>/apply/', JobApplyAPIView.as_view()),
    path('applications/', JobApplicationListAPIView.as_view()),
    path('application/<str:job_app_id>/', JobApplicationById.as_view()),
    path('by-dealer/', JobPostingByDealer.as_view()),
    path('by-dealer/<str:job_id>/', SingleJobPostingDealer.as_view()),

]
