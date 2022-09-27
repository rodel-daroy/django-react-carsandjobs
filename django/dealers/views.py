from django.db.models import Q
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from core.utils.utility import IsDealer
from dealers.models import Dealer


class dealerlist(APIView):
    """
    List all Dealers, Requester Should be a Dealer itself
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def get(self,request):
        if request.GET.get('search'):
            search_string = request.GET.get('search').replace('"', '')
            filtered_result = Dealer.objects.filter(Q(dealer_name__icontains=search_string))
            return Response(data=[all_dealer.to_json_dealer for all_dealer in filtered_result.order_by('dealer_name')],status=status.HTTP_200_OK)
        else:
            return Response(
                data=[all_dealer.to_json_dealer for all_dealer in Dealer.objects.all().order_by('dealer_name')],
                status=status.HTTP_200_OK)


class DealerInfo(APIView):
    """
    Retrieve Single Information about Single Dealer based on slug
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def get(self,request,dealer_slug):
       data=Dealer.objects.filter(slug=dealer_slug)
       if data:
            return Response(data=[dealer.to_json_dealer for dealer in data],status=status.HTTP_200_OK)
       else:
            return Response(data={"error": "Dealer not found"}, status=status.HTTP_404_NOT_FOUND)




