import datetime

from django.core.mail import EmailMessage, send_mail
from django.template.loader import get_template
from CarsAndJobs.settings import BASE_SITE_URL, AWS_S3_CUSTOM_DOMAIN, EMAIL_TEMPLATE_STATICS, DEFAULT_FROM_EMAIL


def instantMail(applicationObj, jobObj):
    # Sends Instant Email to Dealer on new Job Applicant, If Notifications are activated
    try:
        resume_link = "https://{mys3base_url}/media/{user_resume}".format(
                mys3base_url = AWS_S3_CUSTOM_DOMAIN,
                user_resume = applicationObj.resume.resume.file
        )
    except:
        resume_link = 'javascript:void(0);'

    job_description = jobObj.description_en
    if job_description is None or job_description == '':
        job_description = jobObj.description_fr

    job_title = jobObj.title_en
    if job_title is None or job_title == '':
        job_title = jobObj.title_fr

    template = get_template('email/dealer/instant_email_to_dealer.html')
    context = {
        'base_url_for_static': EMAIL_TEMPLATE_STATICS,
        'applicant_name': applicationObj.user.get_full_name(),
        'resume_link': resume_link,
        'job_title': job_title,
        'dealer_name': jobObj.dealer.dealer_name,
        'job_description': job_description,
        'cover_letter_text': applicationObj.cover_letter
    }
    html_message = template.render(context)
    message_plain = "{job_title} \n \n" \
                    "Applicant Details:- \n \n" \
                    "{applicant_name} \n " \
                    "Resume: {resume_link} \n \n" \
        .format(
        job_title=job_title,
        applicant_name=applicationObj.user.get_full_name(),
        resume_link=resume_link
    )
    subject = '{job_title}'.format(job_title=job_title)
    send_mail(
        subject=subject,
        html_message=html_message,
        recipient_list=[jobObj.notification_email],
        from_email=DEFAULT_FROM_EMAIL,
        message=message_plain
    )


def EmailApplicant(jobObj, applicationObj):
    # Sends Instant Email to Job Applicant on success of Applying.


    email_id = applicationObj.user.email

    job_title = jobObj.title_en
    if not job_title:
        job_title = jobObj.title_fr

    job_description = jobObj.description_en
    if job_description is None:
        job_description = jobObj.description_fr

    try:
        resume_link = "https://{mys3base_url}/media/{user_resume}".format(
            mys3base_url=AWS_S3_CUSTOM_DOMAIN,
            user_resume=applicationObj.resume.resume.file
        )
    except:
        resume_link = 'javascript:void(0);'

    message_plain = "{job_title} \n \n" \
                    "{job_description} \n \n" \
                    "Job Details: \n" \
                    "{base_url}/jobs/applications?id={job_id}&detail=1 \n \n" \
                    "Resume: {resume_link} - {coverletter_text} \n \n" \
        .format(
        job_title=job_title,
        job_description=job_description,
        base_url=BASE_SITE_URL,
        job_id=jobObj.slug,
        applicant_id=applicationObj.slug,
        resume_link=resume_link,
        coverletter_text=applicationObj.cover_letter
    )

    job_link = "{base_url}/jobs/detail?id={job_slug}".format(
        base_url=BASE_SITE_URL,
        job_slug=jobObj.slug

    )
    template = get_template('email/applicant_confirmation.html')
    context = {
        'base_url_for_static': EMAIL_TEMPLATE_STATICS,
        'applicant_name': applicationObj.user.get_full_name(),
        'resume_link': resume_link,
        'job_title': job_title,
        'job_link': job_link,
        'cover_letter_text': applicationObj.cover_letter
    }
    html_message = template.render(context)

    subject = 'You have successfully applied for {job_title}'.format(job_title=job_title)

    send_mail(
        subject=subject,
        html_message=html_message,
        recipient_list=[email_id],
        from_email=DEFAULT_FROM_EMAIL,
        message=message_plain
    )
