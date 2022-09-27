import re
import json
import csv
from CarsAndJobs.settings import BASE_DIR

data = json.load(open(BASE_DIR + "/users/utility/users.json"))

data2 = path = BASE_DIR + "/users/utility/_ExportData.csv"

for value in data['user']:

    # email = value.get('email', "NA").replace(" ", "").lower() if value['email'] != re.match(r'417fleetservices@gmail.com',
    #                                                                                         value['email']) else None
    #print(email)
    if not ("@cada") in value["email"]:
        email = value.get('email', "NA").replace(" ", "").lower()
        #print(email)

with open(data2) as csvfile:
    read = csv.DictReader(csvfile)

    for rows in read:
        if  ('@cada') in rows['Email']:
            print(len(rows))
           # email2 = rows['Email'].replace(" ", "").lower()
           # print(email2)