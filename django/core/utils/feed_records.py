import json

from dateutil.parser import parse

from CarsAndJobs.settings import *

from jobs.models import Job, PositionType, JobDepartment, JobExperience, JobEducation


class SaveData(object):
    """

    """

    def __init__(self):
        self.data = json.load(open(BASE_DIR + "/core/utils/records.json"))

    def write_into_db(self):
        for value in self.data['job']:
            department, is_created = JobDepartment.objects.get_or_create(
                english_value=value.get('Department', "N/A"),
                french_value=value.get('Department', "N/A")
            )
            postion_type, is_created = PositionType.objects.get_or_create(
                english_value=value.get('PositionType', "N/A"),
                french_value=value.get('PositionType', "N/A")
            )
            experience, is_created = JobExperience.objects.get_or_create(
                english_value=value.get('Experiance', "N/A"),
                french_value=value.get('Experiance', "N/A")
            )
            education, is_created = JobEducation.objects.get_or_create(
                english_value=value.get('Education', "N/A"),
                french_value=value.get('Education', "N/A")
            )
            category, is_created = JobCategory.objects.get_or_create(
                english_value=value.get('jobtype', "N/A"),
                french_value=value.get('jobtype', "N/A"),
            )


            Job.objects.create(
                title=value.get('jobtitle'),
                post_date=parse(value.get('JobPostingDate', "August 25, 2018")),
                description=value.get('JobDescription'),
                department_id=department.id,
                province=value.get('Location'),
                position_type_id=postion_type.id,
                salary=value.get('Salary', 'NA'),
                experience_id=experience.id,
                education_id=education.id,
                closing_date=parse(value.get('ClosingDate', "August 25, 2018")),
                city=value.get('city'),
                category_id=category.id,
                #specialization_id=specialization.id
            )
            print("*****************saving record ************************")
