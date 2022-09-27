from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from core.utils.utility import IsDealer
from ui_controllers.utils import MatchingArticles, checkarticlefilter
from users import DEALER_ROLES
from users.models import DealerProfiles
from .models import Article, Asset


class ArticleView(APIView):
    """
    Api for articles listing

    """

    permission_classes = ()
    authentication_classes = ()

    def get(self, request):
        return Response(data=[article.to_json for article in Article.objects.published()], status=status.HTTP_200_OK)


class ArticleById(APIView):
    """
    Retrieve single article by id
    """
    permission_classes = ()
    authentication_classes = ()

    def get(self, request, article_id):
        if request.language.startswith("en"):
                return Response(data=Article.objects.active("en", article_id), status=status.HTTP_200_OK)

        elif request.language.startswith(request.language):
            return Response(data=Article.objects.active(request.language, article_id), status=status.HTTP_200_OK)


class AssetInfo(APIView):
    """
    Retrieve asset detail
    """
    permission_classes = ()
    authentication_classes = ()

    def get(self, request, assest_name):

        data=Asset.objects.filter(name__iexact=assest_name)
        if data:
            return Response(data=[dealer.to_json for dealer in data], status=status.HTTP_200_OK)
        else:
            return Response(data={"error": "asset not found"}, status=status.HTTP_404_NOT_FOUND)



class AllArticles(APIView):
    """
    APi to filter articles
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def post(self,request):
        user = DealerProfiles.objects.filter(user=request.user).first()
        start_index = request.data.get("start_index",0)
        count = request.data.get("count",50)
        article_filter = request.data.get("filter")

        if user.role == DEALER_ROLES[4][0]:

            if request.language.startswith("en"):
                    if not checkarticlefilter(article_filter):

                        filtered_articles =MatchingArticles().matchedenglisharticles(article_filter=article_filter)
                    else:
                        filtered_articles =Article.objects.filter(publish_state_en ='Published')
                    articles = filtered_articles[start_index:start_index + count]
                    data = Article.objects.active2("en", articles)

                    return Response(data={"articles":data,"totalCount":len(filtered_articles)}, status=status.HTTP_200_OK)

            elif request.language.startswith("fr"):
                    if not checkarticlefilter(article_filter):

                        filtered_articles =MatchingArticles().matchedenglisharticles(article_filter=article_filter)
                    else:
                        filtered_articles =Article.objects.filter(publish_state_fr ='Published')
                    articles = filtered_articles[start_index:start_index + count]
                    data = Article.objects.active2("fr", articles)

                    return Response(data={"articles":data,"totalCount":len(filtered_articles)}, status=status.HTTP_200_OK)

            else:
                return Response(data={"Error":"Invalid language parameter"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(data={"Message": "You do not have permission to perform this action."},status=status.HTTP_403_FORBIDDEN)

