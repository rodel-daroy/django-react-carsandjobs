import csv
import datetime

from CarsAndJobs.settings import BASE_DIR
from users import DEALER_SOURCES, DEALER_ROLES
from  users.models import DealerProfiles
from dealers.models import Dealer


class SaveData(object):

    def __init__(self):
        self.path = BASE_DIR + "/users/utility/CADA_Profiles_ExportData-not_included_in_TADA.csv"
        self.writedata()


    def writedata(self):
        logf = open(BASE_DIR + '/jobs/utility/log_CADADealer.log', "w")

        with open(self.path) as csvfile:
            read = csv.DictReader(csvfile)

            for row in read:
                if not ('@cada.ca' or '@cada') in row['Email']:
                    email = row["Email"].strip().lower()

                    try:
                        p, is_created = DealerProfiles.objects.get_or_create(
                        username = email
                        )
                    except:
                        continue

                    p.imis_id = row["iMIS"]
                    p.source = DEALER_SOURCES[0][0]
                    p.role= DEALER_ROLES[0][0]
                    p.save()

                    if not is_created:
                        logf.write("{} The record Email : {}, IMIS_Id : {} already exists. \n".format(
                            datetime.datetime.now(),
                            str(email),
                            str(row["iMIS"]),
                        ))
                    print("Saving records ")
            print("All Records Entered")





