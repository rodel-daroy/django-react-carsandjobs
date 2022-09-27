from django.urls import path

from site_content.views import ArticleView, ArticleById, AssetInfo, AllArticles

urlpatterns = [
    # path('', include(router.urls)),

    path('all/', AllArticles.as_view()),
    path('', ArticleView.as_view()),
    path('<str:article_id>/', ArticleById.as_view()),
    path('asset/<str:assest_name>/', AssetInfo.as_view()),

]
