import uuid

from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.text import slugify

from CarsAndJobs.aws_lib import RandomNumber
from core.utils.utility import PdfToTextExtractor
from functools import wraps


def disable_for_loaddata(signal_handler):
    """
    Decorator that turns off signal handlers when loading fixture data.
    """

    @wraps(signal_handler)
    def wrapper(*args, **kwargs):
        if kwargs.get('raw'):
            return
        signal_handler(*args, **kwargs)

    return wrapper

class Core(models.Model):
    """
    Core model for the whole app,
    This model consists basic fields of the table, this is an Abstract class,
    inherited by the rest of the apps
    """
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    slug = models.SlugField(unique=True, default=uuid.uuid4)

    def __str__(self):
        return str(self.created_on.timestamp())





    class Meta:
        """
        Abstract class definition
        """
        abstract = True



class Language(Core):
    """
    Multilingual support
    """
    language_name = models.CharField(max_length=50, blank=True, null=True)
    language_str = models.CharField(max_length=5, blank=True, null=True)

    def __str__(self):
        return str(self.language_name)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(
                self.language_name.lower())
            if Language.objects.filter(slug=self.slug).exists():
                self.slug + "-" + RandomNumber()
        super(Language, self).save(*args, **kwargs)

    @property
    def to_json(self):
        return {
            "id": self.slug,
            "short_name": self.language_str,
            "name": self.language_name
        }


class ResumeFile(Core):
    """
    Resume file model
    """
    file = models.FileField(upload_to="uploads")
    text = models.TextField(blank=True, null=True)
    processing = models.BooleanField(default=True)

    def __str__(self):
        return self.slug


@receiver(post_save, sender=ResumeFile)
def extract_text(sender, instance, **kwargs):
    if kwargs.get('raw', False):
        return False
    elif kwargs["created"]:
        PdfToTextExtractor(instance.file.url, instance).start()







