"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from datetime import datetime

from storages.backends.s3boto3 import S3Boto3Storage


class MediaStorage(S3Boto3Storage):
	location = 'media'
	file_overwrite = False


class RandomNumber(object):
	"""
	generates random str
	"""
	def __new__(cls, *args, **kwargs):
		return str(datetime.now().timestamp())