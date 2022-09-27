import json

from dateutil.parser import parse
import datetime
from CarsAndJobs.settings import *
from dealers.models import Dealer
from users import DEALER_SOURCES, DEALER_ROLES

from users.models import Profile, DealerProfiles
import pytz
from users import DEALER_ROLES

from django.contrib.auth.models import AbstractUser
import re

class Savedata(object):

    def __init__(self):
        self.data = json.load(open(BASE_DIR + "/users/utility/users.json"))
        #self.data2 = [x for x in self.data['user'] if x['accountType'] == '0']
        self.inserttodatabase()



    def inserttodatabase(self):
        logf = open(BASE_DIR + "/users/utility/Notinsertedrecords.log","a")
        count = 0
        exceptions = 0
        for value in self.data['user']:
            if not ('@cada.ca' or '@cada') in value['email']:
                email = value.get('email', "NA").strip().lower()
            else:
                continue

            try:
                profile = Profile.objects.create(
                        old_id=value.get("id"),
                        first_name = value.get('firstName',''),
                        username = email,
                        last_login = value.get('lastLogin',None),
                        password = "carsnjobs",
                        last_name = value.get('lastName',''),
                        #is_staff = True if value.get('isBoardMember') == '1' else False,

                        is_active  = True if value.get('status') == '1' else False,
                        date_joined = datetime.datetime.now() if value.get('joined') == None else datetime.datetime.strptime(value.get('joined'), '%Y-%m-%d %H:%M:%S'),

                        email=email,
                        is_dealer = True if value.get('accountType') != '0' else False,

                        phone = value.get('phone',None),
                        phone_ext=value.get('phoneExtn', None),
                        cell_phone = value.get('cellphone',None),
                        street=value.get('address', None),

                        city=value.get('city').strip().title() if value.get('city') else None  ,
                        postal_code=value.get('postcode').replace(" ","").strip().upper() if value.get('postcode') else None,
                        province = value.get('prov').strip().upper() if value.get('prov') else None,
                        new_graduate = True if value.get('newgrad') == '1' else False,
                        coop_student = True if  value.get('coop') == '1' else False,
                    )

                source_id = value.get('id') if value['accountType'] == '1' else None

                if value.get('accountType') != '0':


                    try:
                        dp,is_created = DealerProfiles.objects.get_or_create(
                            username=email)

                        dealerId = value.get('dealerid')


                        if is_created:
                            dp.username = email
                            dp.imis_id = value.get('imisid')
                            dp.source = DEALER_SOURCES[0][0]
                            if str(value.get('usersource')) == 'tada':
                                dp.source = DEALER_SOURCES[1][1]


                        dp.user = profile

                        # if dealerId and dealerId != '':
                        #     dealer = Dealer.objects.filter(old_dealer_id=value.get('dealerid')).first()
                        #     dp.dealer = dealer

                        dp.save()

                    except Exception as p:
                        pass
                count += 1


            except Exception as e:
                print("Exceptions Occured")
                exceptions+=1
                logf.write("{} The record user : {}, already exists. \n".format(
                    datetime.datetime.now(),
                    str(e)

                ))
                logf.write("{0} already exists ".format(str(e)))

        print("{} Records Added".format(count))
        print("{} Exceptions Occurred".format(exceptions))

        logf.close()