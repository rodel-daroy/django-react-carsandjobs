#!/bin/bash

source /home/ubuntu/.profile
source /home/ubuntu/env/bin/activate

python /home/ubuntu/carsnjobs/manage.py "send_notification"


# To setup Add this to crontab on Test
# crontab -e
# */1 * * * * /home/ubuntu/carsandjobs/myProjectCrons.sh