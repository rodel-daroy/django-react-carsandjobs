from django.urls import path

from localization.views import LocalizedGroupAPIView, LocalizedNavigationName, Navitems

urlpatterns = [
    # path('', include(router.urls)
    path('navigation/', Navitems.as_view()),
    path('<str:group_name>/', LocalizedGroupAPIView.as_view()),
   ]