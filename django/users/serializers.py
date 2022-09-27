"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from rest_framework import serializers

from core.models import ResumeFile
from users.models import Profile, ContactAction, Resume


class ProfileSerializer(serializers.ModelSerializer):
	"""
	Serializer class for profile model
	"""
	class Meta:
		model = Profile
		fields = (
			'url',
			'username',
			'email',
			'is_superuser',
			'is_dealer',
			'is_featured',
			'first_name',
			'last_name'
		)

class ContactSerializer(serializers.ModelSerializer):
	class Meta:
		model = ContactAction
		fields = (
			'name',
			'email',
			'text',
			'mobile',

		)

# class ResumeFileSerializer(serializers.ModelSerializer):
# 	url = serializers.FileField(source='file')
#
# 	class Meta:
# 		model = ResumeFile
# 		fields = (
# 			'url',
# 		)


class ResumeSearchSerializer(serializers.ModelSerializer):
	modifiedDate = serializers.CharField(source='updated_on')
	url = serializers.FileField(source='resume.file')

	class Meta:
		model = Resume

		fields = (
			'modifiedDate',
			'url'
		)

	def to_representation(self, instance):
		representation = super().to_representation(instance)
		user_profile = Profile.objects.filter(resume=instance)
		if user_profile.exists():
			user_profile = user_profile.latest('id')
			representation['firstName'] = user_profile.first_name
			representation['lastName'] = user_profile.last_name
			representation['email'] = user_profile.email
			representation['city'] = user_profile.city
			representation['province'] = user_profile.province
			return representation
