"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
import datetime
import json
import urllib.parse

from m2r import convert
import commonmark
from django.db import IntegrityError
from django.db.models import Q
from django.utils import timezone

from dealers.models import Dealer
from jobs.constants import FILTER_DICT
from jobs.models import Job, JobApplication, JobEducation, PositionType, JobDepartment, JobExperience, JobCreditHistory, \
    create_job_credit_history_if_indeed, create_job_credit_history_if_publish
from users.utility.utility import UserResumeOrNot
import datetime
from django.utils import timezone
from django.core.mail import EmailMessage, send_mail

from CarsAndJobs.settings import BASE_SITE_URL, AWS_S3_CUSTOM_DOMAIN, EMAIL_TEMPLATE_STATICS, DEFAULT_FROM_EMAIL, \
    CHARGE_FOR_INDEED_POSTING, HERE_APP_ID, HERE_APP_CODE
from jobs.models import Job as JobModel
from django.template.loader import get_template

from CarsAndJobs.settings import BASE_DIR

import ast, urllib3

import markdown2

class ProcessUrlParams(object):
    """
    This class will process url params and return it as a dictionary
    """

    def __new__(cls, data_dict, *args, **kwargs):
        result_obj = {}
        for key, value in data_dict.items():
            if key == "category":
                if value:
                    result_obj.update({"department__category__slug": value})
            if key in FILTER_DICT.keys():
                if not isinstance(value, dict):  # skip null values
                    if value:
                        result_obj.update({FILTER_DICT[key]: value})

                else:
                    for k, v in value.items():
                        if v :
                            result_obj.update({k: v})
            result_obj.update({"is_published": True})
        return result_obj


class Search(object):
    """
    This class will return the jobs related to the keyword passed
    """

    def __new__(cls, keyword, language, *args, **kwargs):
        if not language or  "*" in language:
            return Job.objects.filter(
                Q(title_en__icontains=keyword ) |
                Q(description_en__icontains=keyword) |
                Q(title_fr__icontains=keyword) |
                Q(description_fr__icontains=keyword)
            )

        elif "en" in language:
            return Job.objects.filter(
                Q(title_en__icontains=keyword) |
                Q(description_en__icontains=keyword)
            )

        elif "fr" in language:
            return Job.objects.filter(
                Q(title_fr__icontains=keyword) |
                Q(description_fr__icontains=keyword)
            )


class JobApplicationCreate(object):
    """
    Creates job application
    """

    def __new__(cls, user, data, lng_str, job_id, *args, **kwargs):
        resume_obj, user_resume = UserResumeOrNot(user=user, resume_id=data["resume_id"])
        job_obj = Job.objects.get(slug=job_id)
        if user_resume:
            try:
                job_app_obj, is_created = JobApplication.objects.get_or_create(
                    user=user,
                    resume=resume_obj,
                    cover_letter=data.get("cover_letter_text"),
                    cell_phone=data.get("cell_phone"),
                    job=job_obj,

                    video_url=data.get("video_url"),
                )
            except IntegrityError:
                return {"error": "You have already applied for the job"}
            each_job = job_obj.user_job_details(user)

            job_app_data = job_app_obj.to_json
            job_app_data["job"] = each_job
            for key, value in job_app_data.items():
                if isinstance(value, dict):
                    for key_2, val in value.items():
                        if isinstance(val, dict):
                            if "en" in val.keys():
                                if "en" in lng_str:
                                    del val["fr"]
                                elif "fr" in lng_str:
                                    del val["en"]
            if is_created:
                job_app_data.update({"message": "successfully applied"})
                return job_app_data
            else:
                job_app_data.update({"message": "already applied"})
                return job_app_data
        else:
            return {"error": "resume does not belongs to user"}


class UserRelationWithJob(object):
    """
    If job is applied by and saved by user
    """

    def __init__(self, user, data, **kwargs):
        self.user = user
        self.data = data
        self.lang_str = kwargs.get("lang_str")

    def check_data(self):
        all_jobs = []
        for job in self.data:
            all_jobs.append(job.user_job_header(self.user))
            # all_jobs.append(job.job_seeker_dealer(self.user))
        for each_job in all_jobs:
            for key, value in each_job.items():
                if isinstance(value, dict):
                    if "en" in value.keys():
                        if "en" in self.lang_str:
                            del value["fr"]
                        elif "fr" in self.lang_str:
                            del value["en"]
        return all_jobs

class jobToJson(object):
    def __new__(cls, jobs):
        all_jobs=[]
        for job in jobs:
            all_jobs.append(job.to_json)
        return all_jobs

class   UpdateJobByNewParams(object):
    """
        update job with new params
    """
    def __new__(cls, data, user, lang_str, job_id=None, *args, **kwargs):
        post_date = data.get("post_date") if data.get("post_date") != None else timezone.now()
        closing_date = (post_date + datetime.timedelta(days=31)).isoformat()
        dealer = Dealer.objects.filter(slug=Job.objects.get(slug=job_id).dealer.slug).first().id if Dealer.objects.filter(
            slug=Job.objects.get(slug=job_id).dealer.slug).first() else None
        if not dealer:
            return {"error": "Dealer not found"}
        validated_data ={
            "post_on_indeed": data.get("post_on_indeed", Job.objects.get(slug=job_id).post_on_indeed) if isinstance(data.get("post_on_indeed"), bool) else Job.objects.get(slug=job_id).post_on_indeed,
            "is_published": data.get("is_published", Job.objects.get(slug=job_id).is_published) if isinstance(data.get("is_published"), bool) else Job.objects.get(slug=job_id).is_published,
            "post_date": post_date if data.get("is_published")==True else Job.objects.get(slug=job_id).post_date,
            "closing_date": closing_date if data.get("is_published")==True else Job.objects.get(slug=job_id).closing_date
        }

        validated_data.update({"updated_by_id": user.id})

        job = Job.objects.get(slug=job_id)


        if job.is_published != validated_data['is_published'] and validated_data['is_published'] == True:
            dealer_id = job.dealer_id
            dealer = Dealer.objects.get(id=dealer_id)
            if dealer and dealer.balance >= 1 and validated_data["post_on_indeed"]==False:

                job.post_on_indeed = validated_data["post_on_indeed"]
                job.is_published = validated_data["is_published"]
                job.closing_date = validated_data["closing_date"]
                job.post_date = validated_data["post_date"]
                job.is_published_ever = True
                job.save()
                job = Job.objects.get(slug=job_id)

                data = job.job_related
                return data

            elif dealer and dealer.balance > 1 and validated_data["post_on_indeed"]==True and CHARGE_FOR_INDEED_POSTING == True:

                job.post_on_indeed = validated_data["post_on_indeed"]
                job.is_published = validated_data["is_published"]
                job.closing_date = validated_data["closing_date"]
                job.post_date = validated_data["post_date"]
                job.is_published_ever = True
                job.save()
                job = Job.objects.get(slug=job_id)

                data = job.job_related
                return data

            elif dealer and dealer.balance >= 1 and validated_data["post_on_indeed"]==True and CHARGE_FOR_INDEED_POSTING == False:

                job.post_on_indeed = validated_data["post_on_indeed"]
                job.is_published = validated_data["is_published"]
                job.closing_date = validated_data["closing_date"]
                job.post_date = validated_data["post_date"]
                job.is_published_ever = True
                job.save()
                job = Job.objects.get(slug=job_id)

                data = job.job_related
                return data



            else:
                return {"error": "Dealer has not sufficiant balance"}
        elif job.is_published == validated_data['is_published'] and validated_data['is_published'] ==True :
            if job.post_on_indeed!=validated_data["post_on_indeed"] and validated_data["post_on_indeed"] ==True and CHARGE_FOR_INDEED_POSTING == True:
                dealer_id = job.dealer_id
                dealer = Dealer.objects.get(id=dealer_id)
                if dealer and dealer.balance > 0:

                    Job.objects.filter(slug=job_id).update(**validated_data)
                    create_job_credit_history_if_indeed(job=job, dealer=job.dealer)
                    job = Job.objects.get(slug=job_id)
                    data = job.job_related

                    return data
                else:
                    return {"error": "Dealer has not sufficiant balance"}
            else:
                Job.objects.filter(slug=job_id).update(**validated_data)
                job = Job.objects.get(slug=job_id)
                data = job.job_related

                return data






        else:
            Job.objects.filter(slug=job_id).update(**validated_data)
            job = Job.objects.get(slug=job_id)
            data = job.job_related

            return data

class CreateUpdateJob(object):
    """
    Create a job
    """
    def __new__(cls, data, user, lang_str, job_id=None, *args, **kwargs):
        post_date = timezone.now()
        # post_dateObj = datetime.datetime.strptime(post_date, "%Y-%m-%dT%H:%M:%SZ")
        closing_date = (post_date + datetime.timedelta(days=31))
        education =JobEducation.objects.filter(slug=data["education"])
        position =PositionType.objects.filter(slug=data["position_type"])
        experience =JobExperience.objects.filter(slug=data["experience"])
        if data.get("post_date") and data.get("closing_date"):
            postObj = datetime.datetime.strptime(data.get("post_date"), "%Y-%m-%dT%H:%M:%SZ")
            closingDateObj = datetime.datetime.strptime(data.get("closing_date"), "%Y-%m-%dT%H:%M:%SZ")

            if postObj > closingDateObj:
                return {"error": "Post date can not be less than closing date"}


        try:
            dealer = Dealer.objects.get(slug=data["dealer"])
        except:
            dealer = None

        if not dealer:
            return {"error": "Dealer not found"}

        if dealer.is_suspended:
            return {"error": "Dealer Account has been suspended"}

        if not education:
            return {"error": "Job education not found"}
        if not position:
            return {"error": "Position type not found"}
        if not experience:
            return {"error": "Experience not found"}

        if not data.get("latitude"):
            return {"error":"latitude key is missing"}

        if not data.get("longitude"):
            return {"error":"longitude key is missing"}


        validated_data = {
            "title_en": data.get("title", "") if lang_str.startswith("en") else data.get(
                "title", "") if not lang_str or '*' in lang_str else "" if not job_id else Job.objects.get(slug=job_id).title_en,
            "title_fr": data.get("title", "") if lang_str.startswith("fr") else data.get(
                "title", "") if not lang_str or '*' in lang_str else "" if not job_id else Job.objects.get(slug=job_id).title_fr,
            "description_en": data.get("description", "") if lang_str.startswith("en") else data.get(
                "description", "") if not lang_str or '*' in lang_str else "" if not job_id else Job.objects.get(slug=job_id).description_en,
            "description_fr": data.get("description", "") if lang_str.startswith("fr") else data.get(
                "description", "") if not lang_str or '*' in lang_str else "" if not job_id else Job.objects.get(slug=job_id).description_fr,
            "salary_en": data.get("salary", "") if lang_str.startswith("en") else data.get(
                "salary", "") if not lang_str or '*' in lang_str else "" if not job_id else Job.objects.get(slug=job_id).salary_en,
            "salary_fr": data.get("salary", "") if lang_str.startswith("fr") else data.get(
                "salary", "") if not lang_str or '*' in lang_str else '' if not job_id else Job.objects.get(slug=job_id).salary_fr,
            "city": data.get("city", ""),
            "province": data.get("province", ""),
            "latitude":data.get("latitude",""),
            "longitude":data.get("longitude",""),
            "education_id": JobEducation.objects.get(slug=data["education"]).id,
            "position_type_id": PositionType.objects.get(slug=data["position_type"]).id,
            "experience_id": JobExperience.objects.get(slug=data["experience"]).id,
            "dealer": dealer,
            "address": data.get("address"),
            "mailing_address": data.get("mailing_address"),
            "phone": data.get("phone"),
            "email": data.get("email").split(',') if data.get("apply_by_email") == True and data.get("email")!=None else  None,
            "fax": data.get("fax"),
            "website": data.get("website"),
            "postal_code": data.get("postal_code"),
            "post_date": data.get("post_date") if data.get("post_date") != None else post_date,
            "closing_date": data.get("closing_date") if data.get("closing_date") != None else closing_date,
            "available_for_fr": data.get("available_for_fr", False) if isinstance(data.get("available_for_fr"), bool) else False,
            "available_for_en": data.get("available_for_en", True) if isinstance(data.get("available_for_en"), bool) else True,
            "post_on_indeed": data.get("post_on_indeed", False) if isinstance(data.get("post_on_indeed"), bool) else False,
            "apply_by_mail": data.get("apply_by_mail", False) if isinstance(data.get("apply_by_mail"), bool) else False,
            "confidential": data.get("confidential", False) if isinstance(data.get("confidential"), bool) else False,

            "apply_by_email": data.get("apply_by_email", False) if isinstance(data.get("apply_by_email"),bool) else False,
            "apply_by_fax": data.get("apply_by_fax", False) if isinstance(data.get("apply_by_fax"), bool) else False,
            "apply_by_phone": data.get("apply_by_phone", False) if isinstance(data.get("apply_by_phone"), bool) else False,
            "apply_by_website": data.get("apply_by_website", False) if isinstance(data.get("apply_by_website"), bool) else False,
            "is_published": data.get("is_published", False) if data.get("is_published") else False,
            "email_notification": data.get("email_notification"),
            "notification_email": data.get("notification_email")
        }

        if not job_id:
            # NEW RECORD
            validated_data.update({"created_by_id": user.id})
            # dealer_id = validated_data['dealer_id']
            # print(dealer_id)
            # dealer = Dealer.objects.filter(id=dealer_id).first()
            if validated_data['is_published']== True  and validated_data['post_on_indeed']== True:

                if validated_data['post_on_indeed']== True and CHARGE_FOR_INDEED_POSTING ==True:

                    if dealer.balance > 1:
                        # created_job = Job.objects.filter(**validated_data).first()

                        #if created_job is None:
                        # created_job, is_created = Job.objects.get_or_create(**validated_data, is_published_ever=True)
                        # if data.get("department"):
                        #     for each_dept in data.get("department"):
                        #         try:
                        #             created_job.department.add(JobDepartment.objects.get(slug=each_dept))
                        #         except JobDepartment.DoesNotExist:
                        #             pass
                        #
                        # data = created_job.job_related
                        # return data
                        new_job = create_job(data=data, validated_data=validated_data)
                        return new_job

                    else:
                        return {"error":"add balance"}

                else:
                    if dealer.balance > 0:
                        # created_job = Job.objects.filter(**validated_data).first()

                        # if created_job is None:
                        # created_job, is_created = Job.objects.get_or_create(**validated_data, is_published_ever=True)
                        # if data.get("department"):
                        #     for each_dept in data.get("department"):
                        #         try:
                        #             created_job.department.add(JobDepartment.objects.get(slug=each_dept))
                        #         except JobDepartment.DoesNotExist:
                        #             pass
                        #
                        # data = created_job.job_related
                        # return data
                        new_job = create_job(data=data,validated_data=validated_data)
                        return new_job
                    else:
                        return {"error": "add balance"}

            # NEW RECORD

            elif validated_data['is_published']== False and validated_data['post_on_indeed']== True:
                    # created_job = Job.objects.filter(**validated_data).first()

                    #if created_job is None:
                    # created_job, is_created = Job.objects.get_or_create(**validated_data,is_published_ever=False)
                    # if data.get("department"):
                    #     for each_dept in data.get("department"):
                    #         try:
                    #             created_job.department.add(JobDepartment.objects.get(slug=each_dept))
                    #         except JobDepartment.DoesNotExist:
                    #             pass
                    #
                    # data = created_job.job_related
                    # return data
                    new_job = create_job(data=data, validated_data=validated_data)
                    return new_job
                            # NEW RECORD


            elif validated_data['is_published'] == True and validated_data['post_on_indeed'] == False:
                if dealer.balance > 0:
                    # created_job = Job.objects.filter(**validated_data).first()

                    # if created_job is None:
                    # created_job, is_created = Job.objects.get_or_create(**validated_data, is_published_ever=True)
                    # if data.get("department"):
                    #     for each_dept in data.get("department"):
                    #         try:
                    #             created_job.department.add(JobDepartment.objects.get(slug=each_dept))
                    #         except JobDepartment.DoesNotExist:
                    #             pass
                    #
                    # data = created_job.job_related
                    # return data
                    new_job = create_job(data=data, validated_data=validated_data)
                    return new_job
                else:
                    return {"error": "add balance"}




            elif validated_data['is_published'] == False and validated_data['post_on_indeed'] == False:
                # created_job, is_created = Job.objects.get_or_create(**validated_data, is_published_ever=False)
                # if data.get("department"):
                #     for each_dept in data.get("department"):
                #         try:
                #             created_job.department.add(JobDepartment.objects.get(slug=each_dept))
                #         except JobDepartment.DoesNotExist:
                #             pass
                # data = created_job.job_related
                # return data
                new_job = create_job(data=data, validated_data=validated_data)
                return new_job

        else:
            # UPDATE RECORD
            validated_data.update({"updated_by_id": user.id})
            job=Job.objects.get(slug=job_id)

            if job.is_published==validated_data['is_published'] or validated_data['is_published']== False:

                if job.post_on_indeed!=validated_data['post_on_indeed'] and validated_data['post_on_indeed']==True and CHARGE_FOR_INDEED_POSTING == True and validated_data["is_published"]==True:
                    # dealer_id = validated_data['dealer_id']
                    # dealer = Dealer.objects.get(id=dealer_id)
                    validated_data.update({"updated_by_id": user.id})

                    if dealer and dealer.balance >0 :
                        Job.objects.filter(slug=job_id).update(**validated_data)
                        create_job_credit_history_if_indeed(job=job, dealer=job.dealer)
                        if data.get("department"):
                            job.department.set([])
                            for each_dept in data.get("department"):
                                print(each_dept, "each_dept")
                                try:
                                    job.department.add(JobDepartment.objects.get(slug=each_dept))
                                except JobDepartment.DoesNotExist:
                                    pass
                        job = Job.objects.get(slug=job_id)

                        data = job.job_related
                        return data
                    else:
                        return {"error": "Dealer has not sufficiant balance"}




                else:
                    Job.objects.filter(slug=job_id).update(**validated_data)
                    if data.get("department"):
                        job.department.set([])
                        for each_dept in data.get("department"):
                            try:
                                job.department.add(JobDepartment.objects.get(slug=each_dept))
                            except JobDepartment.DoesNotExist:
                                pass
                    job = Job.objects.get(slug=job_id)

                    data = job.job_related
                    return data




            elif job.is_published != validated_data['is_published'] and validated_data['is_published']== True:

                # dealer_id=validated_data['dealer_id']
                dealer_id=validated_data['dealer']
                # dealer=Dealer.objects.get(id=dealer_id)
                dealer = dealer_id
                validated_data.update({"updated_by_id": user.id})


                if dealer and dealer.balance>=1 and validated_data["post_on_indeed"]==False  :
                    validated_data.update({"dealer_id": dealer.id})
                    job=Job.objects.get(slug=job_id)
                    job.title_en=validated_data["title_en"]
                    job.title_fr=validated_data["title_fr"]

                    job.description_en=validated_data["description_en"]
                    job.description_fr=validated_data["description_fr"]

                    job.salary_en=validated_data["salary_en"]
                    job.salary_fr=validated_data["salary_fr"]

                    job.city=validated_data["city"]
                    job.province=validated_data["province"]

                    job.education_id=validated_data["education_id"]
                    job.position_type_id=validated_data["position_type_id"]
                    job.experience_id=validated_data["experience_id"]

                    job.dealer_id=validated_data["dealer_id"]
                    job.address=validated_data["address"]
                    job.mailing_address=validated_data["mailing_address"]
                    job.phone=validated_data["phone"]
                    job.email=validated_data["email"]
                    job.fax=validated_data["fax"]
                    job.website=validated_data["website"]
                    job.postal_code=validated_data["postal_code"]
                    job.closing_date=validated_data["closing_date"]
                    job.post_date=validated_data["post_date"]

                    job.available_for_fr=validated_data["available_for_fr"]
                    job.available_for_en=validated_data["available_for_en"]

                    job.post_on_indeed=validated_data["post_on_indeed"]
                    job.confidential=validated_data["confidential"]

                    job.apply_by_mail=validated_data["apply_by_mail"]
                    job.apply_by_fax=validated_data["apply_by_fax"]

                    job.apply_by_email=validated_data["apply_by_email"]

                    job.apply_by_phone=validated_data["apply_by_phone"]
                    job.apply_by_website=validated_data["apply_by_website"]

                    job.is_published=validated_data["is_published"]
                    job.email_notification=validated_data["email_notification"]

                    job.notification_email=validated_data["notification_email"]
                    job.is_published_ever=True
                    job.save()
                    job=Job.objects.get(slug=job_id)

                    data=job.job_related

                    return data

                elif dealer and dealer.balance > 1 and validated_data["post_on_indeed"] == True and CHARGE_FOR_INDEED_POSTING ==True:

                    print("job valida data",validated_data)
                    Job.objects.filter(slug=job_id).update(**validated_data)
                    create_job_credit_history_if_publish(job=job, dealer=job.dealer, created=False)
                    create_job_credit_history_if_indeed(job=job, dealer=job.dealer)
                    if data.get("department"):
                        job.department.set([])
                        for each_dept in data.get("department"):
                            print(each_dept, "each_dept")
                            try:
                                job.department.add(JobDepartment.objects.get(slug=each_dept))
                            except JobDepartment.DoesNotExist:
                                pass
                    job = Job.objects.get(slug=job_id)

                    data = job.job_related
                    return data

                elif dealer and dealer.balance > 0 and validated_data["post_on_indeed"] == True and CHARGE_FOR_INDEED_POSTING == False:
                    Job.objects.filter(slug=job_id).update(**validated_data)
                    create_job_credit_history_if_publish(job=job, dealer=job.dealer, created=False)
                    if data.get("department"):
                        job.department.set([])
                        for each_dept in data.get("department"):
                            print(each_dept, "each_dept")
                            try:
                                job.department.add(JobDepartment.objects.get(slug=each_dept))
                            except JobDepartment.DoesNotExist:
                                pass
                    job = Job.objects.get(slug=job_id)

                    data = job.job_related
                    return data





                else:
                    return {"error":"Dealer has not sufficiant balance"}





class DealerFilteredJobs(object):
    """
    Dealers filtered job results
    """

    def __init__(self, records, filter_data):
        self.records = records
        self.filter_data = filter_data

    def parsed_results(self):
        filtred_obj = self.records.all()
        filter_list = ["education", "position_type", "experience"]
        validated_data = {k + "__slug": v for k, v in self.filter_data.items() if k in filter_list}
        validated_data = {k: v for k, v in validated_data.items() if v is not None}
        print("va", validated_data)

        if not self.filter_data.get("keywords"):
            departments = validated_data.get("department")
            if departments:
                del self.filter_data["department"]
                self.filter_data["department__slug"] = departments
                validated_data.update({"department__slug__in": [self.filter_data.get("department__slug")]})
            if self.filter_data.get("post_date"):
                validated_data.update({"post_date__gte": self.filter_data.get("post_date")})
            if self.filter_data.get("city"):
                validated_data.update({"city": self.filter_data.get("city")})
            if self.filter_data.get("province"):
                validated_data.update({"province": self.filter_data.get("province")})
            filtred_obj = filtred_obj.filter(**validated_data).order_by("-post_date")
            return filtred_obj

        else:
            if self.filter_data.get("keywords"):
                filtred_obj = self.records.filter(Q(title_en__icontains=self.filter_data.get("keywords")) |Q(description_en__icontains=self.filter_data.get("keywords")))
                departments = validated_data.get("department")
                if departments:
                    del self.filter_data["department"]
                    validated_data.update({"department__slug__in": departments if isinstance(departments,
                                                                                             list) else [
                        departments]})
                if self.filter_data.get("post_date"):
                    validated_data.update({"post_date__gte": self.filter_data.get("post_date")})
                if self.filter_data.get("city"):
                    validated_data.update({"city": self.filter_data.get("city")})
                if self.filter_data.get("province"):
                    validated_data.update({"province": self.filter_data.get("province")})
                filtred_obj = filtred_obj.filter(**validated_data).order_by("-post_date")
                return filtred_obj

class CreditBuy(object):
    """
    Buying credit
    """

    def __new__(cls, data, *args, **kwargs):
        job_credits = JobCreditHistory.objects.create(
            invoice_id=data.get("invoice_id"),
            quantity=data.get("quantity"),
            description="{qty} credits bought",
            dealer_id=data.get("dealer_id")
        )
        return job_credits.to_meta_json

class JobFilterByLanguage(object):

    def __new__(self, language, jobs):
        today_date = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
        if not language or "*" in language:
            filtered_jobs = jobs.objects.filter(is_published=True, closing_date__gte=datetime.date.today(), post_date__lte=today_date).order_by('-post_date')
        elif language.startswith("en"):
            filtered_jobs = jobs.objects.filter(is_published=True, closing_date__gte=datetime.date.today(), post_date__lte=today_date).filter(available_for_en=True).order_by('-post_date')
        elif language.startswith("fr"):
            filtered_jobs = jobs.objects.filter(is_published=True, closing_date__gte=datetime.date.today(), post_date__lte=today_date).filter(available_for_fr=True).order_by('-post_date')
        return filtered_jobs




class EmailNotification(object):


    def dailyMail(self, job_id, today_applicants):
        logf = open(BASE_DIR + '/CarsAndJobs/Logs/daily_notification_cron.log', "a")

        jobObj = Job.objects.filter(id=job_id).first()

        if jobObj is None:
            return "Job Not Found, Invalid Job Id"

        application_date = datetime.datetime.today() - datetime.timedelta(days=1)

        job_title = jobObj.title_en
        if job_title is None or job_title == '':
            job_title = jobObj.title_fr

        receiver_email = jobObj.notification_email
        total_applicants = today_applicants.count()

        template = get_template('email/dealer/daily_email_to_dealer.html')

        applicants_data = []

        for each_applicant in iter(today_applicants):
            applicant = {}

            cover_url = "{base_url}/employer/application/{application_id}/".format(
                base_url=BASE_SITE_URL,
                application_id=each_applicant.slug,
            )
            try:
                resume_link = "https://{mys3base_url}/media/{user_resume}".format(
                    mys3base_url=AWS_S3_CUSTOM_DOMAIN,
                    user_resume=each_applicant.resume.resume.file
                )
            except:
                resume_link = 'javascript:void(0);'

            applicant['resume_link'] = resume_link
            applicant['cover_letter_url'] = cover_url
            applicant['applicant_name'] = each_applicant.user.get_full_name()

            applicants_data.append(applicant)

        context = {
            'base_url_for_static': EMAIL_TEMPLATE_STATICS,
            'job_title': job_title,
            'total_applicants': total_applicants,
            'dealer_name': jobObj.dealer.dealer_name,
            'total_applicant': today_applicants,
            'applicants_data': applicants_data
        }
        html_message = template.render(context)

        message_plain = "{job_title} \n \n" \
                        "Applicants : {total_applicants} \n \n" \
                        "List of Applicants for {date}: \n \n" \
            .format(
            job_title=job_title,
            total_applicants=total_applicants,
            date=application_date.date(),
        )

        if total_applicants:
            # Send Email only if there's at least 1 Applicant'
            subject = '{job_title}'.format(
                    job_title=job_title,
                    applicant_count=today_applicants.count()
            )

            logf.write("\n {date} Daily Email sent to: {email} . \n".format(
                date=datetime.datetime.now(),
                email=receiver_email,
            ))

            send_mail(
                subject=subject,
                html_message=html_message,
                recipient_list=[jobObj.notification_email],
                from_email=DEFAULT_FROM_EMAIL,
                message=message_plain
            )
        logf.close()

class NearbyCities:

    def __init__(self, city, province):
        self.city = city
        self.province = province
        self.VIP_access_key = "d4a118f23c9eee38dde4029e4c254cd1"
        self.http_access = urllib3.PoolManager()

    def getNearbyCities(self):
        city = self.city.replace(' ', '+')
        city = urllib.parse.quote_plus(city).replace('+', '%20').replace('-', "%20")
        address = str(city) + ',%20' + str(self.province)
        # url = "https://geocoder.api.here.com/6.2/geocode.json?app_id=1QcV7ti1oBLFIRAP2AuB&app_code=rSL1W0Qu1rmlwRAOxWFW8A&searchtext=" + str(address)
        url = "https://geocoder.api.here.com/6.2/geocode.json?app_id={HERE_APP_ID}&app_code={HERE_APP_CODE}&searchtext=".format(
            HERE_APP_ID=HERE_APP_ID, HERE_APP_CODE=HERE_APP_CODE) + str(address)
        if self.http_access.request('GET', url).status == 200:
            res_url = self.http_access.request('GET', url)
            resp = str(res_url.data)
            resp1 = res_url.data
            # Load the JSON to a Python list & dump it back out as formatted JSON

            my_bytes_value = resp1

            # Decode UTF-8 bytes to Unicode, and convert single quotes
            # to double quotes to make it valid JSON
            my_json = my_bytes_value.decode('utf8')
            data = json.loads(my_json)

            if data['Response']['View'] != []:
                lat = data["Response"]["View"][0]["Result"][0]["Location"]["NavigationPosition"][0]['Latitude']
                long = data["Response"]["View"][0]["Result"][0]["Location"]["NavigationPosition"][0]['Longitude']
                return lat, long
            else:
                address = str(self.province)

                # url = "https://secure.geobytes.com/GetNearbyCities?after=-1&key=" + str(self.VIP_access_key) + "&radius=100&locationcode=" + str(address)
                url = "https://geocoder.api.here.com/6.2/geocode.json?app_id={HERE_APP_ID}&app_code={HERE_APP_CODE}&searchtext=".format(
                    HERE_APP_ID=HERE_APP_ID, HERE_APP_CODE=HERE_APP_CODE) + str(address)

                if self.http_access.request('GET', url).status == 200:
                    res_url = self.http_access.request('GET', url)
                    resp = str(res_url.data)
                    resp1 = res_url.data
                    # Load the JSON to a Python list & dump it back out as formatted JSON

                    my_bytes_value = resp1

                    # Decode UTF-8 bytes to Unicode, and convert single quotes
                    # to double quotes to make it valid JSON
                    my_json = my_bytes_value.decode('utf8')
                    data = json.loads(my_json)
                    if data['Response']['View'] != []:
                        lat = data["Response"]["View"][0]["Result"][0]["Location"]["NavigationPosition"][0]['Latitude']
                        long = data["Response"]["View"][0]["Result"][0]["Location"]["NavigationPosition"][0][
                            'Longitude']
                        return lat, long






def create_job(data,validated_data):
    if validated_data['is_published']==False:
        is_published_ever=False
    else:
        is_published_ever = True

    created_job, is_created = Job.objects.get_or_create(**validated_data, is_published_ever=is_published_ever)
    if data.get("department"):
        for each_dept in data.get("department"):
            try:
                created_job.department.add(JobDepartment.objects.get(slug=each_dept))
            except JobDepartment.DoesNotExist:
                pass

    data = created_job.job_related
    return data

def convertToHtml(jobdescription):
    htmldescription = commonmark.commonmark(jobdescription)
    return htmldescription

def convertToMarkdown(jobdescription):
    markdownDescription = convert(jobdescription)
    return markdownDescription