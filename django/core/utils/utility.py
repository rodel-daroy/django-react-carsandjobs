import io
import threading

import requests
from PyPDF2 import PdfFileReader
from rest_framework.permissions import BasePermission

from CarsAndJobs.settings import BASE_DIR

'''Test purpose library'''
import urllib.request
import os
import time

class IsDealer(BasePermission):
    """
    Permission class for Dealers
    """
    message = "You don't have dealer privileges"

    def has_permission(self, request, view):
        try:
            return True if request.user.is_dealer else False
        except AttributeError:
            return False


# class PdfToTextExtractor(threading.Thread):
#     """
#     Extracts Text from pdf
#     """
#     def __init__(self, url, instance):
#         threading.Thread.__init__(self)
#         self.url = url
#         self.instance = instance
#
#     def run(self):
#         text = ""
#         remote_file = requests.get(self.url)
#         memory_file = io.BytesIO(remote_file.content)
#         pdf_file = PdfFileReader(memory_file)
#         for pageNum in range(pdf_file.getNumPages()):
#             currentPage = pdf_file.getPage(pageNum)
#             print(currentPage.extractText().encode("utf-8"))
#             text += str(currentPage.extractText().encode("utf-8"))
#         self.instance.text = text.replace("\\n", ' ')
#         self.instance.processing = False
#         self.instance.save()


'''This is Trial code for pdf to extract text'''

class PdfToTextExtractor(threading.Thread):
    """
    Extracts Text from pdf
    """
    def __init__(self, url, instance):
        threading.Thread.__init__(self)
        self.url = url
        self.instance = instance

    def run(self):

        print("This is url........",self.url)
        print(self.instance.slug)
        urllib.request.urlretrieve(self.url, BASE_DIR + "/core/utils/temp_pdf/" + str(self.instance.slug) + ".pdf")
        os.system('pdftotext -layout ' + BASE_DIR +"/core/utils/temp_pdf/" + str(self.instance.slug) + ".pdf")
        file_open = open(BASE_DIR +"/core/utils/temp_pdf/" + str(self.instance.slug) + ".txt",'r')
        file_read = file_open.read()
        self.instance.text = file_read.replace("\\n", ' ')
        self.instance.processing = False
        self.instance.save()

