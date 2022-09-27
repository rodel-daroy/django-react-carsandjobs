from django.db import models


# Create your models here.
from core.models import Core
from site_content.models import Article, Asset, Sponsor
from ui_controllers.managers import TileManager, TileCategoryManager


HOME_1 = "Homepage Default"
HOME_2 = "Homepage Logged In User"

FEATURED_HOME_1 = "Homepage Featured Default"
FEATURED_HOME_2 = "Homepage Featured Logged In User"


class ControllerCategory(Core):
    language_choices = (
        ("en", "en"),
        ("fr", "fr"),

    )
    category_name = models.CharField(max_length=100)
    province = models.CharField(max_length=100, null=True, blank=True)
    language = models.CharField(choices=language_choices, default="en", max_length=100)
    objects = TileCategoryManager()

    def __str__(self):
        return self.category_name

    def clean(self):
        self.category_name = self.category_name.title()

    @property
    def to_json(self):
        return {
            "slug":self.slug,
            "category_name":self.category_name,
            "province":self.province,
            "language":self.language
            }

    class Meta:
        verbose_name = 'Controller Category'
        verbose_name_plural = 'Controller Categories'
        unique_together = ("category_name","province","language",)

    def save(self, *args, **kwargs):

        if self.province:
           self.province = self.province.upper()

        super(ControllerCategory, self).save(*args, **kwargs)


class ControllerTile(Core):
    """
    Tiles of the UI, e.g : Sirus tile, etc.
    """
    language_choices = (
        ("en", "en"),
        ("fr", "fr"),

    )
    order = models.IntegerField(blank=True, null=True)
    tile_name = models.CharField(max_length=100)
    category = models.ForeignKey(ControllerCategory, on_delete=models.CASCADE, null=True, blank=True)
    columns = models.IntegerField(choices=((1, 1), (2, 2), (3, 3), (4, 4)), default=1)
    poll_id = models.CharField(max_length=100, blank=True, null=True)
    language = models.CharField(choices=language_choices, default="en", max_length=100)
    tile_headline = models.CharField(max_length=100, null=True)
    tile_subheadline = models.CharField(max_length=500, blank=True, null=True)
    tile_asset = models.ForeignKey(Asset, blank=True, null=True, on_delete=models.CASCADE)
    tile_CTA_text = models.CharField(max_length=50, blank=True)
    tile_CTA_link = models.CharField(max_length=255, blank=True, null=True)
    tile_CTA_article = models.ForeignKey(Article, blank=True, null=True, on_delete=models.CASCADE)
    linked_outside = models.BooleanField("Open link in new tab", default=True)
    is_active = models.BooleanField("Active", default=False, help_text="If not selected, Preview value will be True")
    sponsors = models.ForeignKey(Sponsor, blank=True, related_name="sponsors_english", null=True, on_delete=models.CASCADE)

    objects = TileManager()

    def __str__(self):
        return self.tile_name

    def save(self, *args, **kwargs):
         super(ControllerTile, self).save(*args, **kwargs)

    @property
    def preview(self):
        return not self.is_active

    @property
    def to_json(self):
        return {
            "id": self.slug,
            "order": self.order,
            "name": self.tile_name if self.tile_name!="" else None,
            "category": None if not self.category else self.category.category_name,
            "province":self.category.province if self.category else None,
            "columns": 4 if self.category and self.category.category_name == FEATURED_HOME_1 or self.category and self.category.category_name == FEATURED_HOME_2 else self.columns,
            "tile_headline": self.tile_headline,
            "tile_subheading": self.tile_subheadline,
            "tile_asset": None if not self.tile_asset else self.tile_asset.to_json,
            "tile_cta_text": self.tile_CTA_text if self.tile_CTA_text!=" " else None,
            "tile_cta_link": self.tile_CTA_link,
            "tile_cta_article": None if not self.tile_CTA_article else self.tile_CTA_article.slug,
            "linked_outside": self.linked_outside,
            "sponsor": None if not self.sponsors else self.sponsors.to_json,
            "active": self.is_active,
            "language": self.language
        }