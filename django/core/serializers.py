"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from rest_framework.serializers import ModelSerializer

from core.models import ResumeFile


class UploadResumeSerializer(ModelSerializer):
    """
    Serializer for Resume file
    """

    def __init__(self, *args, **kwargs):
        super().__init__(**kwargs)

    class Meta:
        model = ResumeFile
        fields = ('slug', 'file')
