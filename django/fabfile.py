"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from fabric.api import *
from fabric.context_managers import cd
from fabric.operations import run
import os
import time
from CarsAndJobs.settings import DEV_SERVERS, PEMPATH, PROD_SERVER

env.key_filename = PEMPATH
test_branch = 'develop'
prod_branch = 'master'


def uptime():
    run('uptime')


def test_server_deployment():
    """
    WILL WORK ON LOCAL MACHINE WHICH HAS REGISTERED IDENTITY OF REMOTE MACHINES (.pem file)
    :return:
    """
    local("git checkout {test_branch}".format(test_branch=test_branch))
    local("git pull origin {test_branch}".format(test_branch=test_branch))
    local("git push origin {test_branch}".format(test_branch=test_branch))
    with cd('carsnjobs'):
        run("git checkout {test_branch} && git pull origin {test_branch}".format(test_branch=test_branch))
    run('env/bin/pip install -r carsnjobs/requirements.txt')
    run('env/bin/python carsnjobs/manage.py migrate')
    run('sudo systemctl start gunicorn')
    # time.sleep(5)
    run('sudo systemctl restart gunicorn')
    # run('sudo systemctl enable gunicorn')



def prod_server_deployment():
    """
    WILL WORK ON LOCAL MACHINE WHICH HAS REGISTERED IDENTITY OF REMOTE MACHINES (.pem file)
    :return:
    """
    local("git checkout {prod_branch}".format(prod_branch=prod_branch))
    local("git pull origin {prod_branch}".format(prod_branch=prod_branch))
    local("git push origin {prod_branch}".format(prod_branch=prod_branch))
    with cd('carsnjobs'):
        run("git checkout {prod_branch} && git pull origin {prod_branch}".format(prod_branch=prod_branch))
    run('env/bin/pip install -r carsnjobs/requirements.txt')
    run('env/bin/python carsnjobs/manage.py migrate')
    run('sudo systemctl start gunicorn')
    # time.sleep(5)
    run('sudo systemctl restart gunicorn')
    # run('sudo systemctl enable gunicorn')


def deployIt(task, servers):
    host_string = ''
    for host in servers:
        host_string += host

    local("fab -H {host} {task}".format(
        task=task,
        host=host_string
    ))


def deploy_on_test():
    """
    Deployment on test server
    :return:
    """
    deployIt(task="test_server_deployment", servers=DEV_SERVERS)
    print("Deployed from {test_branch} branch".format(test_branch=test_branch))


def deploy_on_prod():
    deployIt(task="prod_server_deployment", servers=PROD_SERVER)
    print("Deployed from {prod_branch} branch".format(prod_branch=prod_branch))
