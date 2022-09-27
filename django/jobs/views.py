import calendar
import datetime

from django.db.models import Sum
from math import sin, cos, sqrt, atan2, radians

import coreapi
from django.db.models.signals import post_save
from django.http import JsonResponse
from django.shortcuts import render_to_response
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.schemas import AutoSchema
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from core.utils.utility import IsDealer
from jobs.models import Job, JobDepartment, JobEducation, JobExperience, PositionType, \
    JobApplication, JobDepartmentCategories, DisableSignals, JobTemplate, JobsSummary
from jobs.utility.utils import ProcessUrlParams, Search, JobApplicationCreate, UserRelationWithJob, CreateUpdateJob, \
    DealerFilteredJobs, JobFilterByLanguage, UpdateJobByNewParams, NearbyCities, convertToHtml
from users import DEALER_ROLES
from users.models import DealerProfiles, Profile, Resume, ProfilesSummary


class JobAPIView(APIView):
    """
    API Endpoint to retrieve list of jobs
    :param:
    \n
        :keyword "will work separately without any filter, i.e if category is provided with keyword then results
        shown will be according to keyword"
    """
    schema = AutoSchema(
        manual_fields=[
            coreapi.Field("keyword", description="job keyword"),
            coreapi.Field("department", description="job department Id"),
            coreapi.Field("positionType", description="job position type Id"),
            coreapi.Field("experience", description="job experience Id"),
            coreapi.Field("education", description="job education"),
            coreapi.Field("departmentCategory", description="Job departmentcategory Id"),
            coreapi.Field("postDate", description="post date"),
            coreapi.Field("location", description="location"),

        ]
    )
    permission_classes = (AllowAny,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def post(self, request):

        start_index = request.data.get("start_index", 0)
        count = request.data.get("count", 50)

        if not request.data.get("filter"):
            filtered_jobs = JobFilterByLanguage(request.language, Job)
            return Response(data={"total_count": len(filtered_jobs),
                                  "jobs": UserRelationWithJob(request.user,
                                                              filtered_jobs[start_index:count + start_index],
                                                              lang_str=request.language).check_data()})
        else:
            cities_nd_distance = None
            today_date = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
            if not request.data.get("filter").get("keywords"):
                filters = request.data.get("filter")
                # res = filters.get("category")
                data_filter = ProcessUrlParams(filters)
                try:
                    data_filter = {k: v for k, v in data_filter.items() if v is not None}
                    if data_filter:
                        departments = data_filter.get("department")
                        category = data_filter.get("department__category__slug")
                        if data_filter.get("department"):
                            del data_filter["department"]
                            data_filter.update({"department__slug__in": departments if isinstance(departments,
                                                                                                  list) else [
                                departments]})
                        if data_filter.get("department__category__slug"):
                            del data_filter["department__category__slug"]
                            categories = JobDepartmentCategories.objects.filter(slug=category).first()
                            filtered_departments = JobDepartment.objects.filter(category__slug=categories.slug)
                            departments_id = []
                            if filtered_departments.exists():
                                for department in filtered_departments:
                                    departments_id.append(department.slug)
                            data_filter.update({"department__slug__in": departments_id if isinstance(departments_id,
                                                                                                  list) else [
                                departments_id]})
                        if data_filter.get("post_date"):
                            data_filter.update({"post_date__gte": data_filter.get("post_date")})
                        if data_filter.get("city") and data_filter.get("province"):


                            objCity = NearbyCities(data_filter.get("city").strip(), data_filter.get("province").strip())
                            lat_and_long = objCity.getNearbyCities()


                            del data_filter["city"]
                            data_filter.update({"province": data_filter.get("province").strip()})

                            job_ids_list = UserRelationWithJob(request.user, Job.objects.filter(**data_filter, closing_date__gte=datetime.date.today(), post_date__lte=today_date,longitude__isnull=False,latitude__isnull=False), lang_str=request.language).check_data()

                            job_ids = [x['id'] for x in job_ids_list if x['city']]
                            distance_bw_jobs = []

                            for i in job_ids:
                                current_job = Job.objects.get(slug=i)

                                latitude2 = current_job.latitude
                                longitude2 = current_job.longitude

                                if latitude2 and longitude2:
                                    R = 6373.0

                                    lat1 = radians(lat_and_long[0])
                                    lon1 = radians(lat_and_long[1])

                                    lat2 = radians(latitude2)
                                    lon2 = radians(longitude2)

                                    dlon = lon2 - lon1
                                    dlat = lat2 - lat1

                                    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
                                    c = 2 * atan2(sqrt(a), sqrt(1 - a))

                                    distance = R * c
                                    # distance_bw_jobs.update({i: round(distance, 2)})
                                    distance_and_jobs_dict = {
                                        'slug': i,
                                        'distance': round(distance, 2),
                                    }
                                    distance_bw_jobs.append(distance_and_jobs_dict)


                            job_slugs = []
                            [job_slugs.append(x['slug']) for x in distance_bw_jobs if x['slug'] not in job_slugs]

                            data_filter.update({"slug__in": job_slugs})

                        if data_filter.get("province"):
                            data_filter.update({"province": data_filter.get("province").strip()})

                    if not request.language or "*" in request.language:
                        filtered_jobs = UserRelationWithJob(request.user, Job.objects.filter(**data_filter, closing_date__gte=datetime.date.today(), post_date__lte=today_date).distinct(),
                                                            lang_str=request.language).check_data()
                    elif request.language.startswith("en"):
                        filtered_jobs = UserRelationWithJob(request.user, Job.objects.filter(**data_filter, closing_date__gte=datetime.date.today(), post_date__lte=today_date).filter(
                            available_for_en=True).distinct().order_by("-post_date"),
                                                            lang_str=request.language).check_data()
                    elif request.language.startswith("fr"):
                        filtered_jobs = UserRelationWithJob(request.user, Job.objects.filter(**data_filter).filter(
                            available_for_fr=True, closing_date__gte=datetime.date.today(), post_date__lte=today_date).distinct().order_by("-post_date"),
                                                            lang_str=request.language).check_data()
                    else:
                        filtered_jobs = UserRelationWithJob(request.user, Job.objects.filter(is_published=True, closing_date__gte=datetime.date.today(), post_date__lte=today_date).distinct().order_by("-post_date"),
                                                            lang_str=request.language).check_data()

                    if data_filter.get('slug__in'):

                        for ftrjobs in filtered_jobs:
                            for data in distance_bw_jobs:
                                if str(data['slug']).strip() == str(ftrjobs['id']):
                                    ftrjobs.update({"distance": float(data['distance'])})
                                    break
                    else:
                        for ftrjobs in filtered_jobs:
                            ftrjobs.update({"distance": float(1)})
                    filtered_jobs = sorted(filtered_jobs, key=lambda d: d['distance'])
                    data_paged = filtered_jobs[start_index:start_index + count]
                    return Response(data={"total_count": len(filtered_jobs),
                                          "jobs": data_paged})
                except ValueError as e:
                    return Response(data={"Exception": str(e)})  # No data will be sent if values are not correct
            else:
                # IF KEYWORD is PRESENT

                filtered_jobs = Search(keyword=request.data.get("filter").get("keywords"), language=request.language,
                                       count=count, start_index=start_index,
                                       data_filter=request.data)

                # FOR DEPARTMENT
                filters = request.data.get("filter")
                data_filter = ProcessUrlParams(filters)

                try:
                    data_filter = {k: v for k, v in data_filter.items() if v is not None}
                    if data_filter:
                        departments = data_filter.get("department")
                        category = data_filter.get("department__category__slug")
                        if data_filter.get("department"):
                            del data_filter["department"]
                            data_filter.update({"department__slug__in": departments if isinstance(departments,
                                                                                                list) else [departments]})
                        if data_filter.get("department__category__slug"):
                            del data_filter["department__category__slug"]
                            categories = JobDepartmentCategories.objects.filter(slug=category).first()
                            filtered_departments = JobDepartment.objects.filter(category__slug=categories.slug)
                            departments_id = []
                            if filtered_departments.exists():
                                for department in filtered_departments:
                                    departments_id.append(department.slug)
                            data_filter.update({"department__slug__in": departments_id if isinstance(departments_id,
                                                                                                list) else [departments_id]})
                        if data_filter.get("post_date"):
                            data_filter.update({"post_date__gte": data_filter.get("post_date")})
                        # if data_filter.get("city"):
                        #     data_filter.update({"city": data_filter.get("city").lstrip().rstrip()})

                        if data_filter.get("city") and data_filter.get("province"):
                            objCity = NearbyCities(data_filter.get("city").strip(), data_filter.get("province").strip())
                            lat_and_long = objCity.getNearbyCities()

                            del data_filter["city"]
                            job_ids_list = UserRelationWithJob(request.user, Job.objects.filter(**data_filter,
                                                                                                closing_date__gte=datetime.date.today(),
                                                                                                post_date__lte=today_date,
                                                                                                longitude__isnull=False,
                                                                                                latitude__isnull=False),
                                                               lang_str=request.language).check_data()

                            job_ids = [x['id'] for x in job_ids_list if x['city']]
                            distance_bw_jobs = []

                            for i in job_ids:
                                print(i)
                                current_job = Job.objects.get(slug=i)

                                latitude2 = current_job.latitude
                                longitude2 = current_job.longitude

                                # if latitude2 and longitude2:
                                R = 6373.0

                                lat1 = radians(lat_and_long[0])
                                lon1 = radians(lat_and_long[1])

                                lat2 = radians(latitude2)
                                lon2 = radians(longitude2)

                                dlon = lon2 - lon1
                                dlat = lat2 - lat1

                                a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
                                c = 2 * atan2(sqrt(a), sqrt(1 - a))

                                distance = R * c
                                # distance_bw_jobs.update({i: round(distance, 2)})
                                distance_and_jobs_dict = {
                                    'slug': i,
                                    'distance': round(distance, 2),
                                }
                                distance_bw_jobs.append(distance_and_jobs_dict)

                            job_slugs = []
                            [job_slugs.append(x['slug']) for x in distance_bw_jobs if x['slug'] not in job_slugs]

                            data_filter.update({"slug__in": job_slugs})
                        if data_filter.get("province"):
                            data_filter.update({"province": data_filter.get("province").strip()})
                        print(data_filter, "data filter")

                        #filter by  available for en/fr
                        if not request.language or "*" in request.language:
                            filtered_jobs = UserRelationWithJob(request.user, filtered_jobs.filter(**data_filter,
                                                closing_date__gte=datetime.date.today(), post_date__lte=today_date).order_by("-post_date"),lang_str=request.language).check_data()

                        elif request.language.startswith("en"):
                            filtered_jobs = UserRelationWithJob(request.user, filtered_jobs.filter(**data_filter,
                                                                                                 closing_date__gte=datetime.date.today(), post_date__lte=today_date).filter(
                                available_for_en=True).order_by("-post_date"),
                                                                lang_str=request.language).check_data()
                        elif request.language.startswith("fr"):
                            filtered_jobs = UserRelationWithJob(request.user, filtered_jobs.filter(**data_filter).filter(
                                available_for_fr=True, closing_date__gte=datetime.date.today(), post_date__lte=today_date).order_by("-post_date"),
                                                                lang_str=request.language).check_data()

                        if data_filter.get('slug__in'):

                            for ftrjobs in filtered_jobs:
                                for data in distance_bw_jobs:
                                    if str(data['slug']).strip() == str(ftrjobs['id']):
                                        ftrjobs.update({"distance": float(data['distance'])})
                                        break
                        else:
                            for ftrjobs in filtered_jobs:
                                ftrjobs.update({"distance": float(1)})
                        filtered_jobs = sorted(filtered_jobs, key=lambda d: d['distance'])
                        data_paged = filtered_jobs[start_index:start_index + count]
                        return Response(data={"total_count": len(filtered_jobs),
                                              "jobs": data_paged})
                except ValueError as e:
                    return Response(
                        data={"Exception Occured": str(e)})  # No data will be sent if values are not correct

                # -----------------------------------
                return Response(data={"total_count": len(filtered_jobs),
                                      "jobs": filtered_jobs[start_index:count + start_index], })


class AllJobAPIView(APIView):
    """
    API to View All Indeed Jobs
    """
    permission_classes = (AllowAny,)

    def get(self, request):
        date = datetime.datetime.now()
        baseDate = date.strftime("%Y-%m-%dT%H:%M:%S+00:00")
        formatfrom = "%Y-%m-%dT%H:%M:%S+00:00"
        formatto = "%a %d %b %Y, %H:%M:%S GMT"
        jobsmarkdown = Job.objects.filter(is_published=True,closing_date__gte=timezone.now()).filter(post_on_indeed=True).order_by("-post_date")
        markdownarray = []
        for jobsmark in jobsmarkdown:
            eng_desc = convertToHtml(str(jobsmark.description_en))
            fre_desc = convertToHtml(str(jobsmark.description_fr))
            markdownarray.append({'title_en':jobsmark.title_en,'title_fr':jobsmark.title_fr,'available_for_en':jobsmark.available_for_en,'available_for_fr':jobsmark.available_for_fr,'slug':jobsmark.slug,'city':jobsmark.city,'province':jobsmark.province,'postal_code':jobsmark.postal_code,'description_en':eng_desc,'description_fr':fre_desc,'dealer':jobsmark.dealer})

        response = render_to_response('jobs.xml',
                                      {'jobs': markdownarray,
                                       'date': datetime.datetime.strptime(baseDate, formatfrom).strftime(formatto)}
                                       )
        response['Content-Type'] = 'application/xml;'
        return response


class JobDetailsAPIView(APIView):
    """
    Job Details API
    """
    permission_classes = (AllowAny,)

    def get(self, request, job_id):
        try:

                job = Job.objects.get(slug=job_id)
                # if not request.user.is_dealer:
                job.views += 1  # increase no of views on each hit
                with DisableSignals([post_save]):
                    job.save()



                each_job = job.user_job_details(request.user)
                for key, value in each_job.items():
                    if isinstance(value, dict):
                        if "en" in value.keys():
                            if "en" in request.language:
                                del value["fr"]
                            elif "fr" in request.language:
                                del value["en"]

                return Response(data=each_job)
        except Job.DoesNotExist:
            return Response(data={"error": "Job not found, Please pass valid Job slug id"}, status=404)


class JobDepartmentAPIView(APIView):
    """
    API Endpoint to retrieve list of job departments
    """
    permission_classes = ()
    authentication_classes = ()

    def get(self, request):
        if request.language.startswith("en"):
            return Response(data=JobDepartment.objects.active("en"))
        else:
            return Response(data=JobDepartment.objects.active(request.language))


class JobEducationAPIView(APIView):
    """
    API Endpoint to retrieve list of job education
    """
    permission_classes = ()
    authentication_classes = ()

    def get(self, request):
        if request.language.startswith("en"):
            return Response(data=JobEducation.objects.active("en"))
        else:
            return Response(data=JobEducation.objects.active(request.language))


class JobExperienceAPIView(APIView):
    """
    API Endpoint to retrieve list of Job Experience
    """
    permission_classes = ()
    authentication_classes = ()

    def get(self, request):
        if request.language.startswith("en"):
            return Response(data=JobExperience.objects.active("en"))
        else:
            return Response(data=JobExperience.objects.active(request.language))


class JobPositionTypeAPIView(APIView):
    """
    API Endpoint to retrieve list of job position type
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        if request.language.startswith("en"):
            return Response(data=PositionType.objects.active("en"))
        else:
            return Response(data=PositionType.objects.active(request.language))


class JobDeapartmentCategoryAPIView(APIView):
    """Job Department Category
    Api view"""
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        if request.language.startswith("en"):
            return Response(data=JobDepartmentCategories.objects.active("en"))
        else:
            return Response(data=JobDepartmentCategories.objects.active(request.language))


class SaveJobAPIView(APIView):
    """
    Save job to user-profile
    """

    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            job_id = request.data["id"]
            job_obj = Job.objects.get(slug=job_id)
            if request.user.is_dealer:
                return Response(data={"message": "Dealer cannot save job"}, status=status.HTTP_403_FORBIDDEN)
            request.user.saved_by_users.add(job_obj)
            each_job = job_obj.user_job_details(request.user)
            for key, value in each_job.items():
                if isinstance(value, dict):
                    if "en" in value.keys():
                        if "en" in request.language:
                            del value["fr"]
                        elif "fr" in request.language:
                            del value["en"]

            return Response(data=each_job, status=status.HTTP_200_OK)
        except KeyError:
            return Response(data={"error": "id parameter missing"}, status=status.HTTP_400_BAD_REQUEST)
        except Job.DoesNotExist:
            return Response(data={"error": "Job Not found"}, status=status.HTTP_404_NOT_FOUND)


class UnSaveJobAPIView(APIView):
    """
    Save job to user-profile
    """

    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            if request.user.is_dealer:
                return Response(data={"message": "Dealer cannot save job"}, status=status.HTTP_403_FORBIDDEN)
            job_id = request.data["id"]
            job_obj = Job.objects.get(slug=job_id)
            request.user.saved_by_users.remove(job_obj)
            each_job = job_obj.user_job_details(request.user)
            for key, value in each_job.items():
                if isinstance(value, dict):
                    if "en" in value.keys():
                        if "en" in request.language:
                            del value["fr"]
                        elif "fr" in request.language:
                            del value["en"]
            return Response(data=each_job, status=status.HTTP_200_OK)
        except KeyError:
            return Response(data={"error": "id parameter missing"}, status=status.HTTP_400_BAD_REQUEST)
        except Job.DoesNotExist:
            return Response(data={"error": "Job Not found"}, status=status.HTTP_404_NOT_FOUND)


class SavedJobsAPIView(APIView):
    """
    Saved jobs of a particular user
    """

    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        data = [job.user_job_header(request.user) for job in Job.objects.filter(saved_by=request.user)]
        return Response(data=data, status=status.HTTP_200_OK)


class JobApplyAPIView(APIView):
    """
    Job Applied by particular user
    """

    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, job_id):
        try:

            resume_id = request.data["resume_id"]  # check whether resume_id available in the request or not
            create_status = JobApplicationCreate(request.user, request.data, request.language, job_id=job_id)
            if create_status.get("error"):
                return Response(data=create_status, status=status.HTTP_409_CONFLICT)
            else:
                return Response(data=create_status, status=status.HTTP_200_OK)
        except KeyError:
            return Response(data={"error": "resume_id parameter is missing "}, status=status.HTTP_400_BAD_REQUEST)


class JobApplicationListAPIView(APIView):
    """
    Job Application history API
    """

    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response(data=[job_app.meta_json for job_app in request.user.jobapplication_set.all()])


class JobApplicationById(APIView):
    """
    Job application by id
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, job_app_id):
        try:
            return Response(data=JobApplication.objects.get(slug=job_app_id).to_json, status=200)
        except JobApplication.DoesNotExist:
            return Response(data={"error": "bad request"}, status=status.HTTP_400_BAD_REQUEST)


class JobPost(APIView):
        """
        Job posting API, can be posted by dealers only
        """
        authentication_classes = (JSONWebTokenAuthentication,)
        permission_classes = (IsDealer,)
        # signals.post_save.connect(JobModel.create_job_credit_history, sender=JobModel)

        def post(self, request):
            cadaObj = DealerProfiles.objects.filter(user=request.user).first()
            if cadaObj.role != DEALER_ROLES[5][0]:

                create_status = CreateUpdateJob(request.data, request.user, request.language)

                return Response(
                        data=create_status,
                        status=status.HTTP_402_PAYMENT_REQUIRED if create_status.get("error") else status.HTTP_200_OK
                    )
            else:
                return Response(data={"error": "Your role is View Resume & Job posting and you are not authorised to make this change"},
                                status=status.HTTP_403_FORBIDDEN)


        def delete(self, request, job_id):
            try:
                cadaObj = DealerProfiles.objects.filter(user=request.user).first()
                if cadaObj.role != DEALER_ROLES[5][0]:
                    job_obj = Job.objects.get(slug=job_id)
                    dealer_name = DealerProfiles.objects.get(user=request.user)
                    # if str(dealer_name) == str(request.user):
                    job_obj.delete()
                    return Response(data={"message": "deleted successfully"}, status=status.HTTP_200_OK)
                else:
                    return Response(data={"error": "Your role is View Resume & Job posting and you are not authorised to make this change"},
                                    status=status.HTTP_403_FORBIDDEN)
            except Job.DoesNotExist:
                return Response(data={"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)


class JobUpdate(APIView):
    """
    Update existing Job
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def post(self, request, job_id):
        try:
            cadaObj = DealerProfiles.objects.filter(user=request.user).first()
            print(request.data)
            if cadaObj.role != DEALER_ROLES[5][0]:
                job = Job.objects.get(slug=job_id)
                published = request.data["is_published"] if isinstance(request.data.get("is_published"),bool) else job.is_published
                if timezone.now() - job.post_date > datetime.timedelta(hours=72) and job.is_published==True and published==True:
                    return Response(data={"Message":"you are not authorized to update this job. If you want to update this job make it unpublish"},status=status.HTTP_400_BAD_REQUEST)
                data = CreateUpdateJob(request.data, request.user, request.language, job_id)
                return Response(
                    data=data,
                    status=status.HTTP_402_PAYMENT_REQUIRED if data.get("error") else status.HTTP_200_OK
                )
            else:
                return Response(data={"error": "Your role is View Resume & Job posting and you are not authorised to make this change"},
                                status=status.HTTP_403_FORBIDDEN)

        except (Job.DoesNotExist, AttributeError) as e:
            return Response(data={"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

class JobUpdateWithNewParams(APIView):
    """
    Update existing Job with published state and post on indeed
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def post(self, request, job_id):
        try:
            cadaObj = DealerProfiles.objects.filter(user=request.user).first()
            if cadaObj.role != DEALER_ROLES[5][0]:
                job = Job.objects.get(slug=job_id)
                published = request.data["is_published"] if isinstance(request.data.get("is_published"), bool) else job.is_published
                if timezone.now() - job.post_date > datetime.timedelta(hours=72) and job.is_published == True and published == True:
                    return Response(data={
                        "Message": "you are not authorized to update this job. If you want to update this job make it unpublish"},
                                    status=status.HTTP_400_BAD_REQUEST)
                data = UpdateJobByNewParams(request.data, request.user, request.language, job_id)
                return Response(
                    data=data,
                    status=status.HTTP_402_PAYMENT_REQUIRED if data.get("error") else status.HTTP_200_OK
                )
            else:
                return Response(data={"error": "Your role is View Resume & Job posting and you are not authorised to make this change"},
                                status=status.HTTP_403_FORBIDDEN)
        except (Job.DoesNotExist, AttributeError) as e:
            return Response(data={"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


class JobPostingByDealer(APIView):
    """
    API to list out all Jobs posted by Dealer
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def post(self, request):
        start_index = int(request.data.get("start_index", 0))
        count = int(request.data.get("count", 50))
        dealer_slug = request.data.get("dealer_id")
        if not dealer_slug:
            return Response(data={"Message":"dealer_id parameter is missing "},status=status.HTTP_400_BAD_REQUEST)

        total= Job.objects.none()
        try:
            pass
        except:
            data = {
                "message": "Invalid Dealer Slug id",
                "total_count": 0,
                "jobs": [],
            }
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)

        cadaObj = DealerProfiles.objects.filter(user=request.user).first()
        if cadaObj is None:
            data = {
                "message": "Dealer Profile not Found",
                "total_count": 0,
                "jobs": [],
            }
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)

        if cadaObj.role == "2" or cadaObj.role == "3" or cadaObj.role =="4" or cadaObj.role =="5":
            print("step1")
            # For Role2, Requester can view his group posted jobs
            for slug in dealer_slug:
                total=total | Job.objects.filter(dealer__slug=slug).order_by("-post_date")

        elif cadaObj.role == "0":
            for slug in dealer_slug:
                total = total | Job.objects.filter(dealer__slug=slug).filter(created_by=request.user).order_by("-post_date")

        if request.data.get("filter"):
            dealer_result_obj = DealerFilteredJobs(total, request.data.get("filter"))

            total = dealer_result_obj.parsed_results()


        data = {
            "total_count": len(total),
            "jobs": [job.job_related for job in total[start_index:start_index + count]],
        }
        return Response(data=data, status=status.HTTP_200_OK)


class SingleJobPostingDealer(APIView):
    """
    Get details about Perticular Job Based on Job Slug
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def get(self, request, job_id):
        try:
            job_object = Job.objects.get(slug=job_id)
            dealer_name = DealerProfiles.objects.get(user=request.user)
            if str(dealer_name) == str(request.user):
                return Response(data=job_object.job_related, status=status.HTTP_200_OK)

            elif job_object.created_by == request.user:
                return Response(data=job_object.job_related, status=status.HTTP_200_OK)

            else:
                return Response(data={"error": "Bad Request, You are not allowed here."},
                                status=status.HTTP_400_BAD_REQUEST)
        except Job.DoesNotExist:
            return Response(data={"error": "Not Job Found"}, status=status.HTTP_404_NOT_FOUND)


class JobStatus(APIView):
    """
    Api to fetch number of records per year and per month
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def get(self,request):

        myobj={}
        monthobj={}

        now =datetime.datetime.now()


        for monthNumber in range(1,13):
            month= Job.objects.filter(post_date__month=monthNumber)

            monthName = calendar.month_name[monthNumber]
            yearObj = {}
            totalCount = 0
            for year in range(2015,now.year+1):
                yearCount = month.filter(post_date__year=year).count()
                monthcount=Job.objects.filter(post_date__year=year).count()
                monthobj[year]=monthcount

                totalCount += yearCount
                yearObj[year] = yearCount
            yearObj["Total"] = totalCount
            myobj["Grandtotal"] = yearCount + monthcount
            myobj["Total"]=monthobj




            myobj[monthName] = yearObj


        return JsonResponse(myobj)

class NewJobStatus(APIView):
    """
    Api to fetch number of records per year and per month
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def get(self,request):

        myobj={}
        monthobj={}

        now =datetime.datetime.now()


        for monthNumber in range(1,13):
            month= JobsSummary.objects.filter(month=monthNumber)

            monthName = calendar.month_name[monthNumber]
            yearObj = {}
            totalCount = 0
            for year in range(2015,now.year+1):
                yearCount = month.filter(year=year).aggregate(Sum('jobs_count'))
                yearCount =yearCount['jobs_count__sum'] if yearCount['jobs_count__sum'] !=None else 0
                monthcount=JobsSummary.objects.filter(year=year).aggregate(Sum('jobs_count'))
                monthcount = monthcount['jobs_count__sum'] if monthcount['jobs_count__sum'] != None else 0
                monthobj[year]=monthcount

                totalCount += yearCount
                yearObj[year] = yearCount
            yearObj["Total"] = totalCount
            myobj["Grandtotal"] = yearCount + monthcount
            myobj["Total"]=monthobj




            myobj[monthName] = yearObj


        return JsonResponse(myobj)




class Applicationstatics(APIView):
    """
    Api to fetch number of users,jobs posted,new resumes,job applications by providing year and province
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def post(self,request):
        province=request.data.get("province")
        year=request.data.get("year")
        if  province and year:
            try:
                myobj = {}
                monthobj = {}
                jobs = Job.objects.filter(post_date__year=year).filter(province=province)
                users = Profile.objects.filter(date_joined__year=year).filter(province=province)
                resumes = Resume.objects.filter(posted_date__year=year).filter(profile_resume__province=province)
                applications = JobApplication.objects.filter(date_applied__year=year).filter(job__province=province)

                for monthNumber in range(1,13):
                    userobj = {}
                    job=jobs.filter(post_date__month=monthNumber).count()
                    user=users.filter(date_joined__month=monthNumber).count()
                    resume=resumes.filter(posted_date__month=monthNumber).count()
                    application=applications.filter(date_applied__month=monthNumber).count()
                    monthName = calendar.month_name[monthNumber]
                    userobj["New Resumes"]=resume
                    userobj["Applications"]=application
                    userobj["Accounts Created"]=user
                    userobj["Jobs Posted"]=job
                    monthobj[monthName] = userobj
                    myobj["Total Jobs Posted"]=jobs.count()
                    myobj["Total Accounts Created"]=users.count()
                    myobj["Total New Resumes"]=resumes.count()
                    myobj["Total Job Applications"]=applications.count()
                    myobj[year] = monthobj

                return JsonResponse(myobj)
            except:
                return Response(data={"error":"invalid request"},status=status.HTTP_400_BAD_REQUEST)

        elif  year:
            try:
                myobj = {}
                monthobj = {}
                jobs = Job.objects.filter(post_date__year=year)
                users = Profile.objects.filter(date_joined__year=year)
                resumes = Resume.objects.filter(posted_date__year=year)
                print("resumes-count",resumes.count())
                applications = JobApplication.objects.filter(date_applied__year=year)

                for monthNumber in range(1, 13):
                    userobj = {}
                    job = jobs.filter(post_date__month=monthNumber).count()
                    user = users.filter(date_joined__month=monthNumber).count()
                    resume = resumes.filter(posted_date__month=monthNumber).count()
                    application = applications.filter(date_applied__month=monthNumber).count()
                    monthName = calendar.month_name[monthNumber]
                    userobj["New Resumes"] = resume
                    userobj["Applications"] = application
                    userobj["Accounts Created"] = user
                    userobj["Jobs Posted"] = job
                    monthobj[monthName] = userobj
                    myobj["Total Jobs Posted"] = jobs.count()
                    myobj["Total Accounts Created"] = users.count()
                    myobj["Total New Resumes"] = resumes.count()
                    myobj["Total Job Applications"] = applications.count()
                    myobj[year] = monthobj
                return JsonResponse(myobj)
            except:
                return Response(data={"error": "invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        else:

            return Response(data={"error": "bad request"}, status=status.HTTP_400_BAD_REQUEST)


class NewApplicationstatics(APIView):
    """
    Api to fetch number of users,jobs posted,new resumes,job applications by providing year and province
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def post(self,request):
        province=request.data.get("province")
        year=request.data.get("year")
        if  province and year:
            try:
                myobj = {}
                monthobj = {}
                jobs = JobsSummary.objects.filter(year=year).filter(province=province)
                users = Profile.objects.filter(date_joined__year=year).filter(province=province)
                resumes = Resume.objects.filter(posted_date__year=year).filter(profile_resume__province=province)
                applications = JobApplication.objects.filter(date_applied__year=year).filter(job__province=province)

                for monthNumber in range(1,13):
                    userobj = {}
                    job = jobs.filter(month=monthNumber).aggregate(Sum('jobs_count'))
                    user=users.filter(date_joined__month=monthNumber).count()
                    resume=resumes.filter(posted_date__month=monthNumber).count()
                    application=applications.filter(date_applied__month=monthNumber).count()
                    monthName = calendar.month_name[monthNumber]
                    userobj["New Resumes"]=resume
                    userobj["Applications"]=application
                    userobj["Accounts Created"]=user
                    userobj["Jobs Posted"]=job['jobs_count__sum'] if job['jobs_count__sum'] !=None else 0
                    monthobj[monthName] = userobj
                    myobj["Total Jobs Posted"]=jobs.aggregate(Sum('jobs_count'))['jobs_count__sum']
                    myobj["Total Accounts Created"]=users.count()
                    myobj["Total New Resumes"]=resumes.count()
                    myobj["Total Job Applications"]=applications.count()
                    myobj[year] = monthobj

                return JsonResponse(myobj)
            except:
                return Response(data={"error":"invalid request"},status=status.HTTP_400_BAD_REQUEST)

        elif  year:
            try:
                myobj = {}
                monthobj = {}
                jobs = JobsSummary.objects.filter(year=year)
                users = Profile.objects.filter(date_joined__year=year)
                resumes = Resume.objects.filter(posted_date__year=year)
                applications = JobApplication.objects.filter(date_applied__year=year)

                for monthNumber in range(1, 13):
                    userobj = {}
                    job = jobs.filter(month=monthNumber).aggregate(Sum('jobs_count'))
                    user = users.filter(date_joined__month=monthNumber).count()
                    resume = resumes.filter(posted_date__month=monthNumber).count()
                    application = applications.filter(date_applied__month=monthNumber).count()
                    monthName = calendar.month_name[monthNumber]
                    userobj["New Resumes"] = resume
                    userobj["Applications"] = application
                    userobj["Accounts Created"] = user
                    userobj["Jobs Posted"] = job['jobs_count__sum'] if job['jobs_count__sum'] !=None else 0
                    monthobj[monthName] = userobj
                    myobj["Total Jobs Posted"] = jobs.aggregate(Sum('jobs_count'))['jobs_count__sum']
                    myobj["Total Accounts Created"] = users.count()
                    myobj["Total New Resumes"] = resumes.count()
                    myobj["Total Job Applications"] = applications.count()
                    myobj[year] = monthobj
                return JsonResponse(myobj)
            except:
                return Response(data={"error": "invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        else:

            return Response(data={"error": "bad request"}, status=status.HTTP_400_BAD_REQUEST)




class ValidJobs(APIView):
    """
    Api to get all valid and published jobs
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self,request):
        today_date = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
        data=[jobs.to_json for jobs in Job.objects.filter(is_published=True,closing_date__gte=datetime.date.today(), post_date__lte=today_date).order_by('-post_date')]
        return Response(data=data, status=status.HTTP_200_OK)


class ListJobTemplates(APIView):
    """
    Api tp list all active job templates
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def get(self,request):
        lng_str =request.language
        if lng_str =='en' or lng_str =='fr' or lng_str =='*' or lng_str =="":
            if lng_str =='en' or lng_str =='fr':
                templates =JobTemplate.objects.filter(is_active=True,language=lng_str).order_by('title')
            else:
                templates = JobTemplate.objects.filter(is_active=True).order_by('title')
            return Response(data=[template.to_json for template in templates],status=status.HTTP_200_OK)
        else:
            return Response(data={"error":" Invalid language parameter! Accepted language parameters is en or fr "}, status=status.HTTP_400_BAD_REQUEST)


class JobTemplateDetail(APIView):
    """
    APi to fetch particular job template
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def get(self,request,template_id):
        try:
            template = JobTemplate.objects.get(slug=template_id)
        except:
            template =None
        if template:
            return Response(data=template.to_json,status=status.HTTP_200_OK)
        else:
            return Response(data={"error":"Job Template not found"}, status=status.HTTP_400_BAD_REQUEST)