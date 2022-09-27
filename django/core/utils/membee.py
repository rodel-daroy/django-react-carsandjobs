"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
import json

import requests

from users import DEALER_ROLES
from users.models import DealerProfiles as CADAProfile, Profile
#
# URL = "https://memberservices.membee.com/feeds/Profile/ExchangeTokenForID/?APIKey=ba9fae31-e8c4-47ba-971c-4567bd5593eb&ClientID=501&AppID=2086&Token="
#
#
# class Membee(object):
#     """
#     Membee API calls and permissions
#     """
#     def __init__(self, token):
#         self.token = token
#         self.get_user_details()
#
#     def get_user_details(self):
#         response = requests.get(URL+self.token)
#         self.user_data = json.loads(response.text)
#         print(self.user_data)
#
#     def save_dealer_profile(self):
#         if self.is_authenticated:
#             CADAProfile.objects.get_or_create(
#                 data=self.user_data,
#                 username=self.user_data.get("Email"),
#                 role=DEALER_ROLES[0][0] if not self.is_board_member else DEALER_ROLES[1][0]
#             )
#             try:
#                 Profile.objects.get(username=self.user_data.get("Email"))
#             except:
#                 Profile.objects.create(
#                     username=self.user_data.get("Email"),
#                 )
#             return True
#         return False
#
#
#     @property
#     def is_board_member(self):
#         try:
#             if "MSSO Board Member" in self.user_data.get("Roles"):
#                 return True
#             else:
#                 return False
#         except AttributeError:
#             return False
#
#     @property
#     def is_authenticated(self):
#         try:
#             if self.user_data.get("UserID"):
#                 return True
#             else:
#                 return False
#         except AttributeError:
#             return False


URL = "https://memberservices.membee.com/feeds/Profile/ExchangeTokenForID/?APIKey=ba9fae31-e8c4-47ba-971c-4567bd5593eb&ClientID=501&AppID=2086&Token="


class Membee(object):
    """
    Membee API calls and permissions
    """
    def __init__(self, token):
        self.token = token
        self.get_user_details()

    def get_user_details(self):
        response = requests.get(URL+self.token)
        self.user_data = json.loads(response.text)
        print(self.user_data)

    def save_dealer_profile(self):
        if self.is_authenticated:
            CADAProfile.objects.get_or_create(
                data=self.user_data,
                username=self.user_data.get("Email"),
                role=DEALER_ROLES[0][0] if not self.is_board_member else DEALER_ROLES[1][0]
            )
            try:
                Profile.objects.get(username=self.user_data.get("Email"))
            except:
                Profile.objects.create(
                    username=self.user_data.get("Email"),
                )
            return True
        return False


    @property
    def is_board_member(self):
        try:
            if "MSSO Board Member" in self.user_data.get("Roles"):
                return True
            else:
                return False
        except AttributeError:
            return False

    @property
    def is_authenticated(self):
        try:
            if self.user_data.get("UserID"):
                return True
            else:
                return False
        except AttributeError:
            return False