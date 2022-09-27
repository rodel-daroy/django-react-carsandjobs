"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.contrib.auth.middleware import get_user
from django.utils.functional import SimpleLazyObject
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
import threading


class AuthenticationMiddlewareJWT(object):
    def __init__(self, get_response):
        self.get_response = get_response
        self.user = None

    def __call__(self, request):
        request.user = SimpleLazyObject(lambda: self.__class__.get_jwt_user(request))
        try:
            request.language = request.META.get("HTTP_ACCEPT_LANGUAGE", "")
        except TypeError:
            request.language = ""
            return Response(data={"message": "Provide Accept-Language Header"}, status=406)

        return self.get_response(request)

    @staticmethod
    def get_jwt_user(request):
        user = get_user(request)
        if user.is_authenticated:
            return user
        jwt_authentication = JSONWebTokenAuthentication()
        if jwt_authentication.get_jwt_value(request):
            user, jwt = jwt_authentication.authenticate(request)
        return user


class MyRequestMiddleware:

    def __init__(self, get_response, thread_local=threading.local()):
        self.get_response = get_response
        self.thread_local = thread_local
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        self.thread_local.current_request = request

        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response
