from django.urls import path, include

from users.views import Registration, Login, ProfileInfo, CADALogin2, TADALogin2, ProfileCoverLetter, AddCoverLetter, \
    SetCoverLetterActive, GetAllResumes, ResumeUpload, SaveResume, SaveResumeStatus, SaveResumeSearchableStatus, \
    SaveSearch, SavedSearches, ResumeSearch, JobApplicationsListByJob, ForgotPassword, ResetPassword, Logout, \
    JobApplicationByAppId, VerifyEmail, SendVerificationEmail, Bot, NewResumeSearch

from rest_framework_jwt.views import refresh_jwt_token, verify_jwt_token


app_name = 'users'

urlpatterns = [
    path('register/', Registration.as_view(), name="register"),
    path('refresh/', refresh_jwt_token),
    path('login/', Login.as_view(), name="login"),
    path('bot/', Bot.as_view(), name="bot"),
    path('logout/', Logout.as_view(), name="logout"),
    path('forgot-password/', ForgotPassword.as_view(), name="forgot-password"),
    path('reset-password/', ResetPassword.as_view(), name="reset-password"),

    path('verify-email/', VerifyEmail.as_view(), name="forgot-password"),
    path('send-email-verification-email/', SendVerificationEmail.as_view(), name="send-email-verificaion-email"),

    path('cada-login/', CADALogin2.as_view(), name="cada login"),
    path('tada-login/', TADALogin2.as_view(), name="tada login"),
    path('details/', ProfileInfo.as_view(), name="info"),
    # Cover Letter related APIs
    path('cover-letters/', ProfileCoverLetter.as_view(), name="users_cover_letter"),
    path('cover-letter/', AddCoverLetter.as_view(), name="add_cover_letter"),
    path('cover-letter/<str:cover_letter_id>/', AddCoverLetter.as_view(), name="add_cover_letter"),
    path('cover-letter-active/<str:cover_letter_id>/', SetCoverLetterActive.as_view(), name="add_cover_letter"),
    # Resume related APIs
    path('resumes/', GetAllResumes.as_view(), name="all_resumes"),
    path('resume-file/', ResumeUpload.as_view(), name="resume_upload"),
    path('resume/', SaveResume.as_view(), name="resume_save"),
    path('resume/<str:resume_id>/', SaveResume.as_view(), name="resume_edit_delete"),
    path('resume-active/<str:resume_id>/', SaveResumeStatus.as_view(), name="resume_save_active_status"),
    path('resume-searchable/<str:resume_id>/', SaveResumeSearchableStatus.as_view(),
         name="resume_save_searchable_status"),
    path('search/', SaveSearch.as_view(), name="save_search"),
    path('search/<str:search_id>/', SaveSearch.as_view(), name="save_search"),
    path('searches/', SavedSearches.as_view(), name="saved_searches"),
    # Employer related APIs
    path('resume-search/', ResumeSearch.as_view(), name="resume_search"),
    path('new-resume-search/', NewResumeSearch.as_view(), name="new_resume_search"),
    path('job-posting/<str:job_id>/applications/', JobApplicationsListByJob.as_view(), name="employee"),
    path('job-application/<str:job_app_id>/', JobApplicationByAppId.as_view(), name="job_application"),
]
