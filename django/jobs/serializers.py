"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from rest_framework import serializers

from jobs.models import Job, JobDepartment, JobEducation, JobExperience, PositionType


class JobDepartmentSerializer(serializers.ModelSerializer):
    """
    Job department model serializer class
    """
    name = serializers.SerializerMethodField('department_name')

    def department_name(self, obj):
        return obj.str_value

    class Meta:
        model = JobDepartment
        fields = (
            'name',
            'id',
            'slug',
        )


class JobEducationSerializer(serializers.HyperlinkedModelSerializer):
    """
    Job Education model serializer class
    """
    name = serializers.SerializerMethodField('education_name')

    def education_name(self, obj):
        return obj.str_value

    class Meta:
        model = JobEducation
        fields = (
            'name',
            'id',
            'slug',
        )


class JobExperienceSerializer(serializers.ModelSerializer):
    """
    Job Education model serializer class
    """
    name = serializers.SerializerMethodField('experience_name')

    def experience_name(self, obj):
        return obj.str_value

    class Meta:
        model = JobExperience
        fields = (
            'name',
            'id',
            'slug',
        )


class JobPositionTypeSerializer(serializers.ModelSerializer):
    """
    Job Specialization model serializer class
    """
    name = serializers.SerializerMethodField('position_name')

    def position_name(self, obj):
        return obj.str_value

    class Meta:
        model = PositionType
        fields = (
            'name',
            'id',
            'slug',
        )


class JobSerializer(serializers.ModelSerializer):
    """
    Serializer class for Job
    """
    saved = serializers.SerializerMethodField('saved_by_user')
    applied = serializers.SerializerMethodField('applied_by_user')
    category = serializers.SerializerMethodField('job_category')
    department = serializers.SerializerMethodField('job_department')
    specialization = serializers.SerializerMethodField('job_specialization')
    experience = serializers.SerializerMethodField('job_experience')
    education = serializers.SerializerMethodField('job_education')
    job_id = serializers.SerializerMethodField('job_primary_key')
    company = serializers.SerializerMethodField('job_company')
    position_type = serializers.SerializerMethodField('job_position_type')

    def saved_by_user(self, obj):
        request = self.context['request']
        if request.user in obj.saved_by.all():
            return True
        return False

    def applied_by_user(self, obj):
        request = self.context["request"]
        if request.user in obj.applied_by.all():
            return True
        return False

    def job_category(self, obj):
        return obj.category.slug

    def job_department(self, obj):
        return obj.department.slug

    def job_specialization(self, obj):
        return obj.specialized.slug

    def job_experience(self, obj):
        return obj.experience.slug

    def job_education(self, obj):
        return obj.education.slug

    def job_primary_key(self, obj):
        return obj.id

    def job_providing_company(self, obj):
        return {"id": obj.company_id, "name": obj.company.name, "logo": obj.company.logo}

    def job_company(self, obj):
        return {}

    def job_position_type(self, obj):
        return obj.slug

    class Meta:
        model = Job
        fields = (
            'job_id',
            'title',
            'company',
            'category',
            'department',
            'specialized',
            'experience',
            'education',
            'location',
            'post_date',
            'closing_date',
            'applied',
            'saved',
            'salary',
            'description',
            'position_type',
            'slug',
        )


class LoginSerializer(serializers.Serializer):
    """
    Login Serializer
    """

    class Meta:
        fields = ('username', 'password',)
