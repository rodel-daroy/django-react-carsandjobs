"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
import smtplib
from email.mime.text import MIMEText

from CarsAndJobs.settings import DEFAULT_FROM_EMAIL, BASE_SITE_URL, RESET_PASSWORD_LINK, EMAIL_TEMPLATE_STATICS, \
     CONTACT_MESSAGE_RECIPIENT
from django.db import models
from django.core.mail import EmailMessage, send_mail
from django.template.loader import get_template

class UpdatePasswordManager(models.Manager):

    def sendemail(self,email,token_obj):
        subject = 'So you forgot your password...'
        template = get_template('email/forgot_password.html')
        reset_link = "{BASE_SITE_URL}/?update-password={email}&utoken={token}".format(
            email=email,
            BASE_SITE_URL=BASE_SITE_URL,
            token=token_obj
        )
        context = {
            'base_url_for_static': EMAIL_TEMPLATE_STATICS,
            'reset_link': reset_link,
        }
        html_message = template.render(context)
        message_plain = '<p><a href="' + RESET_PASSWORD_LINK + '=' + email + '&utoken=' + token_obj + '">Click here</a> to verify your email.</p>'
        send_mail(
            subject=subject,
            html_message=html_message,
            recipient_list=[email],
            from_email=DEFAULT_FROM_EMAIL,
            message=message_plain
        )


class EmailVerifactionManager(models.Manager):
    def send(self,email,token_obj):
        verify_email_link = "{BASE_URL}/verify?email={VERIFY_EMAIL}&utoken={VERIFY_EMAIL_TOKEN}".format(
            VERIFY_EMAIL=email,
            BASE_URL=BASE_SITE_URL,
            VERIFY_EMAIL_TOKEN=token_obj
        )
        message_plain = '<p><a href="' + verify_email_link + '">Click here</a> to verify your email.</p>'


        template = get_template('email/email-verification.html')

        context = {
            'base_url_for_static': EMAIL_TEMPLATE_STATICS,
            'verify_email_link': verify_email_link,
            'BASE_URL' : BASE_SITE_URL,
        }

        html_message = template.render(context)

        subject = 'Confirm your email address'
        send_mail(
            subject=subject,
            html_message=html_message,
            recipient_list=[email],
            from_email=DEFAULT_FROM_EMAIL,
            message=message_plain
        )


class ContactUsManager(models.Manager):

    def sendemail(self,email,first_name,last_name, data):
        msg = 'Thank you {first_name} {last_name} for contacting us. We will get back to you soon'.format(
            first_name=first_name,
            last_name=last_name
        )
        subject = 'Thank You for contacting CarsandJobs Support'
        email = EmailMessage(
            subject=subject,
            body=msg,
            to=[email]
        )
        email.send()

        #---------------------ADMIN MSG------------------
        user_message = data.get("text")
        user_mobile = data.get("mobile")
        user_email = data.get("email")
        msg_to_admin = "Hi Admin, \t\n " \
                       "\n {first_name} {last_name}, has tried contacting you via CarsandJobs Support." \
                       "\n\n User wrote: \t\n" \
                       " {user_message}," \
                       "\n\n\n You can reach out to him/her on replying this email or on following provided contact details:\t\n" \
                       "Email: {user_email} \n Mobile: {user_mobile}" \
                       "\n\n\n Have a Great Day! :)\n" \
                       "Team CarsandJobs".format(
                        first_name=first_name.title(),
                        last_name=last_name.title(),
                        user_message=user_message,
                        user_mobile=user_mobile,
                        user_email=user_email
                        )
        subject = 'CarsandJobs Support Message'
        email = EmailMessage(
            subject=subject,
            body=msg_to_admin,
            to=[CONTACT_MESSAGE_RECIPIENT],
            reply_to=[user_email]
        )
        email.send()


