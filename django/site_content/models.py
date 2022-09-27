from django.db import DataError
from django.db import models

# Create your models here.
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from django.utils.text import slugify
from martor.models import MartorField

from core.models import Core
from site_content import ASSET_TYPES, ARTICLE_PUBLISH_STATE
from site_content.managers import ArticleManager
from site_content.utils import file_size


class Content(Core):
    """
    Content files
    """
    file_name = models.CharField(max_length=50)
    file = models.FileField(upload_to='uploads/', validators=[file_size],
                            help_text="File size should not be greater than 100MB")
    order = models.IntegerField(default=0)
    alternate_text = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ('order',)

    def __str__(self):
        return self.file_name

    @property
    def get_file_url(self):
        return {
            "file_url":self.file.url,
            "alternate_text":self.alternate_text
        }




class ContentProvider(Core):
    """
    Content Provider
    """
    name = models.CharField(max_length=255)
    url = models.URLField()

    def __str__(self):
        return self.name

    @property
    def to_json(self):
        return {
            "id": self.slug,
            "name": self.name,
        }


class Sponsor(Core):
    """
    Sponsors of content
    """
    name = models.CharField(max_length=255, null=True)
    url = models.URLField()

    def __str__(self):
        return self.name

    @property
    def to_json(self):
        return {
            "name": self.name,
            "url": self.url,
        }


class Asset(Core):
    """
    Assets containing file
    """
    name = models.CharField(max_length=50)
    asset_type = models.CharField(max_length=10, choices=ASSET_TYPES)
    content = models.ManyToManyField(Content, blank=True, related_name='content_of_assets')

    def __str__(self):
        return self.name

    @property
    def to_json(self):
        return {
            "id": self.slug,
            "asset_type": self.asset_type,
            "name":self.name,
            "content": [content.get_file_url for content in self.content.all()]
        }




class ArticleLayout(Core):
    """
    Layout containing file
    """
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

    @property
    def to_json(self):
        return {
            "id": self.slug,
            "name": self.name
        }


class Article(Core):
    """
    Article of the website
    """

    def __init__(self, *args, **kwargs):
        super(Article, self).__init__(*args, **kwargs)
        self.publish_status = self.publish_state_en

    heading_en = models.CharField(max_length=255, blank=True)
    heading_fr = models.CharField(max_length=255, blank=True)
    sub_heading_en = models.CharField(max_length=255, blank=True, null=True)
    sub_heading_fr = models.CharField(max_length=255, blank=True, null=True)
    publish_state_en = models.CharField(max_length=20, choices=ARTICLE_PUBLISH_STATE,
                                        default=ARTICLE_PUBLISH_STATE[0][0])
    publish_state_fr = models.CharField(max_length=20, choices=ARTICLE_PUBLISH_STATE,
                                        default=ARTICLE_PUBLISH_STATE[0][0])
    synopsis_en = models.TextField(blank=True, null=True)
    synopsis_fr = models.TextField(blank=True, null=True)
    article_layout = models.ForeignKey(ArticleLayout, on_delete=models.SET_NULL, related_name="article_layout",
                                       blank=True, null=True)
    publish_date = models.DateTimeField(blank=True, null=True)
    spot_a_asset = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name="spot_a")
    spot_b_asset = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name="spot_b")
    related_articles = models.ManyToManyField("self", blank=True, related_name="article_related")
    secondary_navigation = models.ManyToManyField("self", blank=True, related_name="other_related")
    content_provider_en = models.ForeignKey(ContentProvider, on_delete=models.SET_NULL, blank=True, null=True,
                                            related_name="content_provider_en")
    content_provider_fr = models.ForeignKey(ContentProvider, on_delete=models.SET_NULL, blank=True, null=True,
                                            related_name="content_provider_fr")
    sponsor_en = models.ForeignKey(Sponsor, on_delete=models.SET_NULL, blank=True, null=True, related_name="sponsor_en")
    sponsor_fr = models.ForeignKey(Sponsor, on_delete=models.SET_NULL, blank=True, null=True, related_name="sponsor_fr")
    article_body_en = MartorField(blank=True,
                                  help_text="<b style='color:red;'>Do not use \"upload an image\" icon, use \"insert "
                                            "image link\" instead and provide the relative path of uploaded assets (in "
                                            "S3 bucket).</b>")
    article_body_fr = MartorField(blank=True,
                                  help_text="<b style='color:red;'>Do not use \"upload an image\" icon, use \"insert "
                                            "image link\" instead and provide the relative path of uploaded assets (in "
                                            "S3 bucket).</b>")

    objects = ArticleManager()

    def save(self, *args, **kwargs):
        if self.publish_state_en == ARTICLE_PUBLISH_STATE[1][0] != self.publish_status:
            self.publish_date = timezone.now()
        super(Article, self).save(*args, **kwargs)

    def __str__(self):
        return self.heading_en

    @property
    def article_header(self):
        return {
            "heading": self.heading_en,
            "sub_heading": self.sub_heading_en,
            "id": self.slug,
            #"asset":  self.spot_a_asset['content'] ,

        }

    @property
    def to_json(self):
        return {
            "content_provider": {} if not self.content_provider_en and not self.content_provider_fr else
            {"en": self.content_provider_en.to_json, "fr": self.content_provider_fr.to_json},
            "layout": {} if not self.article_layout else self.article_layout.to_json,
            "sponsor": None if not self.sponsor_en and not self.sponsor_fr else {"en": self.sponsor_en.to_json,
                                                                            "fr": self.sponsor_fr.to_json},
            "article_body": {"en": self.article_body_en, "fr": self.article_body_fr},
            "id": self.slug,
            "heading": {"en": self.heading_en, "fr": self.heading_fr},
            "sub_heading": {"en": self.sub_heading_en, "fr": self.sub_heading_fr},
            "publish_state": {"en": self.publish_state_en, "fr": self.publish_state_fr},
            "synopsis": {"en": self.synopsis_en, "fr": self.synopsis_fr},
            "publish_date": self.publish_date,
            "spot_a": {} if not self.spot_a_asset else self.spot_a_asset.to_json,
            "spot_b": {} if not self.spot_b_asset else self.spot_b_asset.to_json,
            "related_articles": [] if not self.related_articles else [article.article_header for article in
                                                                      self.related_articles.all()],
            "secondary_navigation": [] if not self.secondary_navigation else [article.article_header for article in
                                                                              self.secondary_navigation.all()]
        }


@receiver(post_save, sender=Article)
def update_slug_of_article(sender, instance, **kwargs):
    if kwargs.get('raw', False):
        return False


    elif kwargs["created"]:

        heading = ""
        if len(instance.heading_en) > 0:
            heading = instance.heading_en
        elif len(instance.heading_fr) > 0:
            heading = instance.heading_fr
        else:
            heading = "Article"

        if len(heading) > 50:
            instance.slug = slugify(heading[:40])
        else:
            instance.slug = slugify(heading)
        if Article.objects.filter(slug=instance.slug).exists():
            instance.slug += str(instance.id)
        instance.save()

@receiver(post_save, sender=Article)
def update_slug_of_article(sender, instance, **kwargs):
   if kwargs.get('raw', False):
       return False
   elif kwargs["created"]:
       if len(instance.heading_en) > 50:
           instance.slug = slugify(instance.heading_en[:40])
       if len(instance.heading_fr) > 50:
           instance.slug = slugify(instance.heading_fr[:40])
       else:
           instance.slug = slugify(instance.heading_en)
       if Article.objects.filter(slug=instance.slug).exists():
           instance.slug += str(instance.id)
       instance.save()