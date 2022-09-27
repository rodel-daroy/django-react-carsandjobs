from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from education.models import EducationProgramme, EducationPlaceholder
from education.utility.utils import FilteredResultProgramme
from django.db.models import Q


class EducationProgrammeList(APIView):
    """
    Education programme list API View
    """
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        start_index = request.data.get("start_index", 0)
        count = request.data.get("count", 50)
        if request.data.get("filter"):
            filter_data = FilteredResultProgramme(request.data.get("filter"), language=request.language)
        elif   request.language.startswith("en") :
            filter_data=EducationProgramme.objects.active("en")
        else:
            filter_data = EducationProgramme.objects.active(request.language)
        if isinstance(filter_data, list):
            data = filter_data[int(start_index):int(start_index) + int(count)]
            return Response(
                data={"programmes": data, "total_count": len(filter_data)},
                status=status.HTTP_200_OK if isinstance(data, list) else status.HTTP_400_BAD_REQUEST
            )


class EducationPlaceholders(APIView):
    """
API for education placeholder
    """
    permission_classes = ()
    authentication_classes = ()

    def get(self, request):
        if request.language.startswith("en"):
            return Response(data=EducationPlaceholder.objects.active("en"))
        else:
            return Response(data=EducationPlaceholder.objects.active(request.language))


class EducationPrograms(APIView):
    """
API for education placeholder
    """
    permission_classes = ()
    authentication_classes = ()

    def get(self, request):
        if request.language.startswith("en"):
            return Response(data=EducationProgramme.objects.active("en"))
        else:
            return Response(data=EducationProgramme.objects.active(request.language))
