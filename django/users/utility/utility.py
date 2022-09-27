"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
import uuid

import datetime
import json
from random import randint

import requests
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.core.mail import EmailMessage
from django.core.validators import validate_email
from django.db import IntegrityError
from rest_framework_jwt.settings import api_settings

from CarsAndJobs.local_settings import CADA_AUTH_URL, CADA_USERNAME, CADA_PASSWORD
from core.models import ResumeFile
from jobs.constants import RESUME_FILTER
from jobs.models import JobSearch, JobDepartment
from users.models import Profile, CoverLetter, Resume, Address, ContactAction, EmailConfirmation
from users.utility import ERROR_NOT_FOUND, ERROR_PERMISSION
from django.db.models import Q
from rest_framework.exceptions import APIException


FILTERS = {
    "modifiedDate": "updated_on",
    "-modifiedDate": "-updated_on",
    "lastName": "profile_resume__last_name",
    "-lastName": "-profile_resume__last_name"
}


class UserResumeOrNot(object):
    """
    Validates if the resume belongs to particular user or not,
    returns resume and status
    """

    def __new__(cls, user, resume_id, *args, **kwargs):
        try:
            resume_obj = Resume.objects.get(slug=resume_id)
            if resume_obj in user.resume.all():
                return resume_obj, True
            else:
                return resume_obj, False
        except Resume.DoesNotExist:
            return False, False


class Register(object):
    """
    Python class for registering user
    """

    def __init__(self, params):
        self.params = params
        self.status = False
        self.message = None
        self.created_user = None
        self.response_data = None
        self.token = None
        self.email_validate()  # calling method in sequence i.e validate and then register

    def email_validate(self):
        try:  # Email Validation should be done here
            validate_email(self.params['email'])  # Validating Email Format
            try:
                Profile.objects.get(email__iexact=self.params['email'])  # Checking if email already exists
                self.status = False  # Set status False if email already registered
                self.message = "Email Already registered! ."  # set
            except ObjectDoesNotExist as e:  # If objects doesn't exists then status will be true
                self.status = True  # No need of setting message because email does not exists
        except ValidationError as e:
            self.message = "Email is not valid"
            self.status = False
        self.generate_username()  # Generating Username
        if self.status:
            self.register()
            if self.created_user:
                self.response_data = self.created_user.to_json
        else:
            self.message = self.message if self.message else "Email is not valid"

    def register(self):
        """
        After validating the input parameters user will be able to register,
        If user exists than appropriate msg will be added int he response
        :return:
        """
        try:  # Profile creation will go here
            self.created_user = Profile.objects.create_user(
                username=self.params["username"].strip().lower(),
                password=self.params["password"],
                email=self.params["email"].strip().lower(),
                first_name=self.params["first_name"].strip(),
                last_name=self.params["last_name"].strip(),
                province=self.params["province"].strip(),
                phone=self.params["phone"].strip(),
            )  # If registration happened successfully send email verification asynchronously
            # Associating brands added during soft_registration
            # self.add_interests(self.created_user, self.params.get("brands"), self.params.get("lifestyle"))
            # Associating options added during soft_registration
            self.status = True  # If successfully created then status True will be set
            self.message = "Successfully registered"  # And success message too

            # user = Profile.objects.get(email=self.params["email"].strip().lower())
            user = Profile.objects.get(username=self.params["username"].strip().lower())

            token = str(uuid.uuid1())

            EmailConfirmation.objects.get_or_create(
                confirmation_token=token,
                user=self.created_user
            )

            # token_obj = EmailConfirmation.objects.get(user=self.created_user.id)
            # token_obj.token = token
            # token_obj.save()

            EmailConfirmation.objects.send(self.params["email"].strip(), token)


        except Exception as e:  # If username already exists then ask for new username or if input values are invalid
            self.status = False
            self.message = str(e)

    def generate_username(self):
        """
        This method will generate a new username for new user from his/her email,
        if the username  already exists then it will add random integer at the end of the user's username
        extracted from his/her email.
        :return:
        """
        username = self.params["email"].split("@")[0]
        if Profile.objects.filter(username=username).exists():
            username = str(randint(1, 100))
        self.params["username"] = username


class ProfileLogin(object):
    """
    validates and authenticates user from email and password
    """

    def __new__(cls, *args, **kwargs):
        email = kwargs["email"]
        password = kwargs["password"]
        try:
            validate_email(email)
            # user = Profile.objects.get(email=email)
            user = Profile.objects.get(email__iexact=email)

            if authenticate(username=user.username.lower(), password=password) is not None:

                return {"token": AuthenticationToken(user),"is-dealer":user.is_dealer,"role":user.role}
            else:
                return None
        except (Profile.DoesNotExist, ValidationError) as e:
            return None


class AuthenticationToken(object):
    """
    Takes user object and returns JW Token
    """

    def __new__(cls, user, *args, **kwargs):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        return token


class CADAAuthentication(object):
    """
    Authenticates from CADA server and responds with Token
    """

    def __init__(self, username, password):
        self.username = username
        self.password = password

    def authenticate(self):
        response = requests.post(url=CADA_AUTH_URL, data={
            "username": CADA_USERNAME,
            "password": CADA_PASSWORD,
            "grant_type": "password"
        })
        return json.loads(response.text).get("access_token", None)

    def authenticate_for_login(self,username, password):
        response = requests.post(url=CADA_AUTH_URL, data={
            "username": username,
            "password": password,
            "grant_type": "password"
        })
        return json.loads(response.text).get("access_token", None)


class CreateCoverLetter(object):
    """
    Create and associates cover letter to particular user
    """

    def __new__(cls, user, data, *args, **kwargs):
        if kwargs.get('cover_letter_id'):  # Over write request
            try:
                cover_letter_obj = CoverLetter.objects.get(slug=kwargs["cover_letter_id"])
                if cover_letter_obj in user.cover_letters.all():
                    cover_letter_obj.name = data["name"]
                    cover_letter_obj.description = data["description"]
                    cover_letter_obj.text = data["text"]
                    cover_letter_obj.active = data["active"]
                    cover_letter_obj.save()
                    return CoverLetter.objects.get(slug=kwargs["cover_letter_id"]).to_json
                else:
                    return ERROR_PERMISSION

            except CoverLetter.DoesNotExist as e:
                return ERROR_NOT_FOUND
        else:  # Creation request
            cover_letter_obj, is_created = CoverLetter.objects.get_or_create(
                name=data["name"],
                description=data["description"],
                text=data["text"],
                active=data["active"]
            )
            user.cover_letters.add(cover_letter_obj)
            return cover_letter_obj.to_json


class DeleteCoverLetter(object):
    """
    deletes particular cover letter
    """

    def __new__(cls, cover_letter_id, user, *args, **kwargs):
        try:
            cover_letter_obj = CoverLetter.objects.get(slug=cover_letter_id)
            if cover_letter_obj in user.cover_letters.all():
                cover_letter_obj.delete()
                return {"message": "deleted!"}
            return ERROR_PERMISSION
        except CoverLetter.DoesNotExist:
            return ERROR_NOT_FOUND


class CoverLetterStatus(object):
    """
    sets active status of cover letter
    """

    def __init__(self, data, user, cover_letter_id):
        try:
            self.cover_letter = CoverLetter.objects.get(slug=cover_letter_id)
        except CoverLetter.DoesNotExist:
            self.cover_letter = None
        self.status = data.get("active")
        self.user = user

    def set_active(self):
        if self.status is not None:
            if self.cover_letter and self.cover_letter in self.user.cover_letters.all():
                self.cover_letter.active = self.status
                self.cover_letter.save()
                return CoverLetter.objects.get(id=self.cover_letter.id).to_json
            else:
                return ERROR_PERMISSION
        else:
            return {"error": "missing active field", "status": 400}

    def unset_active(self):
        if self.cover_letter and self.cover_letter in self.user.cover_letters.all():
            self.cover_letter.active = False
            self.cover_letter.save()
            return CoverLetter.objects.get(id=self.cover_letter.id).to_json
        else:
            return ERROR_PERMISSION


class ResumeStatus(object):
    """
    sets status of resume of particular user
    """

    def __init__(self, data, user, resume_id):
        try:
            self.resume = Resume.objects.get(slug=resume_id)
        except Resume.DoesNotExist:
            self.resume = None
        self.status = data.get("active")
        self.user = user

    def set_active(self):
        if self.status is not None:
            if self.resume and self.resume in self.user.resume.all():
                self.resume.active = self.status
                self.resume.save()
                return Resume.objects.get(id=self.resume.id).to_json
            else:
                return ERROR_PERMISSION
        else:
            return {"error": "missing active field", "status": 400}


class ResumeSearchableStatus(object):
    """
    sets status of resume of particular user
    """

    def __init__(self, data, user, resume_id):
        try:
            self.resume = Resume.objects.get(slug=resume_id)
        except Resume.DoesNotExist:
            self.resume = None
        self.status = data.get("searchable")
        self.user = user

    def set_active(self):
        if self.status is not None:
            if self.resume and self.resume in self.user.resume.all():
                self.resume.searchable = self.status
                self.resume.save()
                return Resume.objects.get(id=self.resume.id).to_json
            else:
                return ERROR_PERMISSION
        else:
            return {"error": "missing searchable field", "status": 400}


class SaveUserResume(object):
    """
    Saves resume and associate t o particular user
    """

    def __new__(cls, user, data, *args, **kwargs):
        try:
            resume_file = ResumeFile.objects.get(slug=data["file_id"])
        except ResumeFile.DoesNotExist as e:
            resume_file = None
        if resume_file:
            if not kwargs.get("resume_id"):
                try:
                    resume_obj, is_created = Resume.objects.get_or_create(
                        name=data["name"],
                        description=data["description"] if data["description"] !=None else "",
                        searchable=data["searchable"] if 'searchable' in data.keys() and  data["searchable"] !=None and data['searchable']!=""  else False,
                        active=data["active"] if data["active"] !=None else True,
                        resume_id=resume_file.id,
                        posted_date=data["post_date"] if 'post_date' in data.keys() and data["post_date"]!=None  and data['post_date']!="" else datetime.datetime.now()
                    )
                    user.resume.add(resume_obj)
                    return resume_obj.to_json
                except KeyError as e:
                    return {"error": "parameter {e} missing".format(e=str(e)), "status": 400}
            else:
                try:
                    resume_obj = Resume.objects.get(slug=kwargs.get("resume_id"))
                    if resume_obj in user.resume.all():
                        resume_obj.name = data["name"]
                        resume_obj.description = data["description"]
                        resume_obj.searchable = data["searchable"]
                        resume_obj.active = data["active"]
                        resume_obj.resume = resume_file
                        resume_obj.save()
                        return Resume.objects.get(id=resume_obj.id).to_json
                    else:
                        return ERROR_PERMISSION
                except Resume.DoesNotExist:
                    return ERROR_NOT_FOUND
        else:
            return {"error": "resume file not found", "status": 404}


class DeleteResume(object):
    """
    Delete resume from a profile
    """

    def __new__(cls, resume_id, user, *args, **kwargs):
        try:
            resume_obj = Resume.objects.get(slug=resume_id)
            if resume_obj in user.resume.all():
                resume_obj.delete()
                return {"message": "deleted successfully"}
            else:
                return ERROR_PERMISSION
        except Resume.DoesNotExist:
            return ERROR_NOT_FOUND


class CreateSearch(object):
    """
    Create search list for user
    """

    def __new__(cls, user, data, *args, **kwargs):
        job_obj, is_created = JobSearch.objects.get_or_create(
            user=user,
            name=data.get("name"),
            filter_data=data.get('filter')
        )
        return job_obj.to_json


class EditSavedSearch(object):
    """
    Edit/Overwrite earlier search
    """

    def __new__(cls, search_id, user, data, *args, **kwargs):
        try:
            job_search_obj = JobSearch.objects.get(slug=search_id)
            if job_search_obj in user.jobsearch_set.all():
                job_search_obj.name = data.get("name")
                job_search_obj.filter = data.get("filter")
                job_search_obj.save()
                return JobSearch.objects.get(id=job_search_obj.id).to_json
            else:
                return ERROR_PERMISSION
        except JobSearch.DoesNotExist:
            return ERROR_NOT_FOUND


class SaveProfileInfo(object):
    """
    Saves Profile Info
    """

    def __new__(cls, user, data, *args, **kwargs):
        user.first_name = data.get("first_name")
        user.last_name = data.get("last_name")
        user.email = data.get("email")
        if data.get("password"):
            if user.check_password(data.get("old_password")):
                user.set_password(data.get("password"))
            else:
                return {"error": "old password didn't matched"}
        user.phone = data.get("phone")
        user.phone_ext = data.get("phone_ext")
        user.cell_phone = data.get("cell_phone")
        user.new_graduate = data.get("new_graduate")
        user.coop_student = data.get("coop_student")
        if isinstance(data.get("choices"), list):
            user.user_choice.clear()
            for each_choice in data.get("choices"):

                try:
                    job_dept = JobDepartment.objects.get(slug=each_choice)
                    job_dept.users.add(user)
                except JobDepartment.DoesNotExist:
                    pass
        if data.get("address"):
            user.province = data.get("address").get("province")
            user.postal_code = data.get("address").get("postal_code")
            user.street = data.get("address").get("street")
            user.city = data.get("address").get("city")
        try:
            user.save()
        except IntegrityError:
            return {"error": "integrity error"}
        return {}


class ProcessUrlParams(object):
    """
    This class will process url params and return it as a dictionary
    """

    def __new__(cls, data_dict, *args, **kwargs):
        result_obj = {}
        for key, value in data_dict.items():
            if key in RESUME_FILTER.keys():
                if not isinstance(value, dict):  # skip null values
                    if value or isinstance(value, bool):
                        result_obj.update({RESUME_FILTER[key]: value})
                else:
                    result_obj.update({k: v for k, v in value.items() if RESUME_FILTER.keys()})
        return result_obj


class SearchResume(object):
    """
    This class will return the jobs related to the keyword passed
    """

    def __new__(cls, keyword, *args, **kwargs):
        return Resume.objects.filter(
            resume__text__icontains=keyword
        )

class UserRelationWithResume(object):

    def __init__(self,data, **kwargs):
        self.data = data

    def check_data(self):
        all_resumes = []
        for resume in self.data:
            all_resumes.append(resume.resume_search_json)

        return all_resumes



class FilterBasedResumeSearch(object):
    pass
#     FilterBasedResumeSearch(object):
#     """
#     Return resumes according to search criteria
#     """
#
#
# -
#
#
# def __new__(cls, filter_data, *args, **kwargs):
#     -
#     if filter_data.get("keywords"):
#         -
#
#
# -
# return [
#     -                resume.resume_search_json for resume in Resume.objects.filter(
#         -                    resume__text__icontains=filter_data.get("keywords"),
#                                                      -                ).order_by(
#     FILTERS[filter_data.get("order")] if filter_data.get("order") else "id")
#                                                                         -]
# -        else:
# -
# try:
#     -
#     if filter_data.get("department"):
#         -                    job_department_id = JobDepartment.objects.get(slug=filter_data.get("department")).id
#
#
#
# def __new__(cls, data_dict, *args, **kwargs):
#             result_obj = {}
#
#
#
# for key, value in data_dict.items():
#
#     if key in RESUME_FILTER.keys():
#
#     if not isinstance(value, dict):  # skip null values
#                             result_obj.update({RESUME_FILTER[key]: value})
# else:
#     -                    job_department_id = None
# -                validated_data = {
#     -                    "profile_resume__coop_student": filter_data.get('coop_students', False),
#     -                    "profile_resume__new_graduate": filter_data.get("new_graduate", False),
#     -                    "resume": job_department_id,
#     -
#     -  # "profile_resume__specialized_in__department_id": job_department_id
#     -}
# -
# return [resume.resume_search_json for resume in Resume.objects.filter(**validated_data).order_by(
#     -                    FILTERS[filter_data.get("order")] if filter_data.get("order") else "id")]
# -            except JobDepartment.DoesNotExist:
# -
# return {"error": "Job department not found"}
#                     result_obj.update({k: v for k, v in value.items() if RESUME_FILTER.keys()})
#
# return result_obj
  # if filter_data.get("keywords"):
  #
  # return [
  # resume.resume_search_json for resume in Resume.objects.filter(
  # resume__text__icontains=filter_data.get("keywords"),
  # ).order_by(FILTERS[filter_data.get("order")] if filter_data.get("order") else "id")
  # ]
  # if filter_data.get("city"):
  # return [
  # resume.resume_search_json for resume in Resume.objects.filter(
  # resume__text__icontains=filter_data.get("city"),
  # ).order_by(FILTERS[filter_data.get("order")] if filter_data.get("order") else "id")
  # ]
  # elif filter_data.get("province"):
  # return [
  # resume.resume_search_json for resume in Resume.objects.filter(
  # resume__text__icontains=filter_data.get("province"),
  # ).order_by(FILTERS[filter_data.get("order")] if filter_data.get("order") else "id")
  # ]
  #
  # elif filter_data.get("coopStudents"):
  # elif filter_data.get("coopStudents"):
  # return [
  # resume.resume_search_json for resume in Resume.objects.filter(
  # resume__text__icontains=filter_data.get("coopStudents"),
  # ).order_by(FILTERS[filter_data.get("order")] if filter_data.get("order") else "id")
  # ]
  # elif filter_data.get("newGraduates"):
  # return [
  # resume.resume_search_json for resume in Resume.objects.filter(
  # resume__text__icontains=filter_data.get("newGraduates"),
  # ).order_by(FILTERS[filter_data.get("order")] if filter_data.get("order") else "id")
  # ]
  #
  #
  #
  #
  # else:
  # try:
  # if filter_data.get("department"):
  # job_department_id = JobDepartment.objects.get(slug=filter_data.get("department")).id
  # else:
  # job_department_id = None
  # validated_data = {
  # "profile_resume__coop_student": filter_data.get('coop_students', False),
  # "profile_resume__new_graduate": filter_data.get("new_graduate", False),
  # "resume": job_department_id,
  #
  # #"profile_resume__specialized_in__department_id": job_department_id
  # }
  # return [resume.resume_search_json for resume in Resume.objects.filter(**validated_data).order_by(
  # FILTERS[filter_data.get("order")] if filter_data.get("order") else "id")]
  # except JobDepartment.DoesNotExist:
 # return {"error": "Job department not found"}


class ContactUsMessage(object):
    """
    process contact us query
    """
    def __new__(cls, data, *args, **kwargs):
        message = data.get("text")
        mobile = data.get("mobile")
        email = data.get("email")
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        fullname= "{first_name} {last_name}".format(first_name=first_name, last_name=last_name) if first_name and last_name else "Unknown"
        if message and email:
            ContactAction.objects.get_or_create(
                text=message,
                email=email,
                name=fullname,
                mobile=mobile
            )
        # Sending acknowledgement message to the user

class VerifyEmailSend(object):
    """
    send verification email to any user or dealer with staff acess
    """
    def __init__(self,email,token):
        self.email=email
        self.token=token

        msg = 'hey user please verify your email= ' +email+ " token=" +token.format(
            email=email,
            token=token
        )

        subject = 'Cars and jobs'
        email = EmailMessage(
            subject=subject,
            body=msg,
            to=[email],
            from_email='info@carsandjobs.com',
        )
        email.send()



class AuthenticationError(APIException):
    status_code = 401
    default_detail = 'Service temporarily unavailable, try again later.'
    default_code = 'service_unavailable'