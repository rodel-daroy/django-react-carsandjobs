"""
This file was created at Smartbuzz Inc__
For more information visit http://www__smartbuzzinc__com
"""

FILTER = [
    "department__category__slug",
    "department__slug",
    "specialization__slug",
    "experience__slug",
    "position_type__slug",
    "city",
    "province",
    "post_date__gte",
    "education__slug",
    "departmentCategory__slug",
    "order",
    "new_graduate",
    "coop_student"
]

FILTER_DICT = {
    "category": FILTER[0],
    "department": FILTER[1],
    "specialized": FILTER[2],
    "experience": FILTER[3],
    "position_type": FILTER[4],
    "city": FILTER[5],
    "province": FILTER[6],
    "post_date": FILTER[7],
    "education": FILTER[8],
    "location": FILTER[5],
    "departmentCategory":FILTER[9],
}

RESUME_FILTER = {
    "department": FILTER[1],
    "coop_student": FILTER[12],
    "new_graduate": FILTER[11],
    "city": FILTER[5],
    "province": FILTER[6],
    "order": FILTER[10],
}

