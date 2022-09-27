from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from localization.models import Localization, LocalizedGroup, Navitem


class LocalizedGroupAPIView(APIView):
    """
    Localization API
    """

    authentication_classes = ()
    permission_classes = ()

    def get(self, request, group_name):
        return Response(data=Localization.objects.by_group(group_name, request.language), status=status.HTTP_200_OK)


class LocalizedNavigationName(APIView):

    """
    returns a name navigation value
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        navname = request.GET.get('navname')
        return Response(data=[name.to_json for name in Navitem.objects.filter(name=navname)], status=status.HTTP_200_OK)


class ExportAsJSON(APIView):
    """
    Exporting localisation details as JSON
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        pass


class Navitems(APIView):
    """
API for education placeholder
    """
    permission_classes = ()
    authentication_classes = ()

    def post(self, request):
        name=request.data.get("name")

        province=request.data.get("province")
        if name and province:
            try:
                if request.language.startswith("en"):
                    return Response(data=Navitem.objects.active("en",name,province))

                else:
                    return Response(data=Navitem.objects.active(request.language,name,province))

            except:
                return Response(data={"Message": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response(data={"Message":"Invalid request"},status=status.HTTP_400_BAD_REQUEST)

