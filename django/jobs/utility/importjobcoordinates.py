import urllib3
import json
from jobs.models import JobApplication, JobCreditHistory, Job
import urllib.parse


class GetCoordinates:

    def __init__(self):
        self.http_access = urllib3.PoolManager()

    def InsertCoordinates(self):
        # cities=("Sainte-Julie","St. John'S")
        Jobs = Job.objects.filter(latitude__isnull=True)
        print("total-jobs:",len(Jobs))
        count=0
        for job in Jobs.values():
            print(job['slug'])
            city=job['city'] if job['city'] else None
            if city!=None:
                city = urllib.parse.quote_plus(city).replace('+','%20').replace('-',"%20")
                print("city",city)

                province=job['province']
                address = str(city)+"+"+ str(province)
                print("address",address)
            else:
                province = job['province']
                address=str(province)
            try:
                url = "https://geocoder.api.here.com/6.2/geocode.json?app_id=cGqNIsrW7ZTAtmCX1mO0&app_code=XCklbKmnoCO2akLfBNzvYg&searchtext="+str(address)
                print("url=",url)
                if self.http_access.request('GET', url).status == 200:
                    res_url = self.http_access.request('GET', url)
                    resp = str(res_url.data)
                    resp1 = res_url.data
                    # validate_res = resp.replace("b'", '[[')
                    # validate_res = resp.replace("'", ']]')
                    # validate_res = validate_res.replace("]]'", ']]')
                    # validated_res1 = ast.literal_eval(validate_res)
                    # print(validated_res1)


                    # my_bytes_value = resp1

                    # Decode UTF-8 bytes to Unicode, and convert single quotes
                    # to double quotes to make it valid JSON
                    # my_json = my_bytes_value.decode('utf8').replace("'", '"')
                    # print(my_json)
                    # print('- ' * 20)

                    # Load the JSON to a Python list & dump it back out as formatted JSON

                    my_bytes_value = resp1

                    # Decode UTF-8 bytes to Unicode, and convert single quotes
                    # to double quotes to make it valid JSON
                    my_json = my_bytes_value.decode('utf8')
                    data = json.loads(my_json)
                    # s = json.dumps(data, indent=4, sort_keys=True)
                    # print(type(data))
                    # print(data["Response"]["View"][0]["Result"][0]["Location"]["NavigationPosition"])
                    print(data["Response"]["View"][0]["Result"][0]["Location"]["NavigationPosition"][0]['Latitude'])
                    lat = data["Response"]["View"][0]["Result"][0]["Location"]["NavigationPosition"][0]['Latitude']
                    print(data["Response"]["View"][0]["Result"][0]["Location"]["NavigationPosition"][0]['Longitude'])
                    long = data["Response"]["View"][0]["Result"][0]["Location"]["NavigationPosition"][0]['Longitude']
                    current_job = Job.objects.get(slug=job['slug'])
                    current_job.latitude = lat
                    current_job.longitude = long
                    current_job.save()
                     # print("job-updated")
                    count = count + 1
                    print("job-updated=",count)
            except :
                    print("job-skiped")
                    pass
