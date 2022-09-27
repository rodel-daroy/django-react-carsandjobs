from django.db import models

from site_content import ARTICLE_PUBLISH_STATE


class ArticleManager(models.Manager):
    """
    Model Manger for articles
    """

    def published(self):
        return super().get_queryset().filter(
            publish_state_en=ARTICLE_PUBLISH_STATE[1][0]
        )

    def active(self, lng_str, article_id):
        if not lng_str or '*' in lng_str:
            return [obj.to_json for obj in super().get_queryset().filter(slug=article_id)]
        if lng_str.startswith("en"):
            return [
                {
                    "content_provider": {} if not obj.content_provider_en else {"en": obj.content_provider_en.to_json},
                    "layout": {} if not obj.article_layout else obj.article_layout.to_json,
                    "sponsor": None if not obj.sponsor_en else {"en": obj.sponsor_en.to_json},
                    "article_body": {"en": obj.article_body_en},
                    "id": obj.slug,
                    "heading": {"en": obj.heading_en},
                    "sub_heading": {"en": obj.sub_heading_en},
                    "publish_state": {"en": obj.publish_state_en},
                    "synopsis": {"en": obj.synopsis_en},
                    "publish_date": obj.publish_date,
                    "spot_a": {} if not obj.spot_a_asset else obj.spot_a_asset.to_json,
                    "spot_b": {} if not obj.spot_b_asset else obj.spot_b_asset.to_json,
                    "related_articles": [] if not obj.related_articles else [article.article_header for article in
                                                                             obj.related_articles.all()],
                    "secondary_navigation": [] if not obj.secondary_navigation else [article.article_header for article
                                                                                     in
                                                                                     obj.secondary_navigation.all()]
                }
                for obj in
                super().get_queryset().filter(slug=article_id)]
        else:
            return [{
                "content_provider": {} if not obj.content_provider_en else {"fr": obj.content_provider_fr.to_json},
                "layout": {} if not obj.article_layout else obj.article_layout.to_json,
                "sponsor": None if not obj.sponsor_fr else {"fr": obj.sponsor_fr.to_json},
                "article_body": {"fr": obj.article_body_fr},
                "id": obj.slug,
                "heading": {"fr": obj.heading_fr},
                "sub_heading": {"fr": obj.sub_heading_fr},
                "publish_state": {"fr": obj.publish_state_fr},
                "synopsis": {"fr": obj.synopsis_fr},
                "publish_date": obj.publish_date,
                "spot_a": {} if not obj.spot_a_asset else obj.spot_a_asset.to_json,
                "spot_b": {} if not obj.spot_b_asset else obj.spot_b_asset.to_json,
                "related_articles": [] if not obj.related_articles else [article.article_header for article in
                                                                         obj.related_articles.all()],
                "secondary_navigation": [] if not obj.secondary_navigation else [article.article_header for article in
                                                                                 obj.secondary_navigation.all()]
            }
                for obj in
                super().get_queryset().filter(slug=article_id)]



    def active2(self, lng_str,articles):
        # if not lng_str or '*' in lng_str:
            # return [obj.to_json for obj in super().get_queryset()]
        if lng_str.startswith("en"):
            return [
                {
                    "id": self.slug,
                    "heading": None if not self.heading_en else self.heading_en,
                    "sub_heading": self.sub_heading_en,
                    "publish_state": self.publish_state_en,
                    "publish_date": self.publish_date,
                }
                for self in
                articles]
        else:
            return [{
                "id": self.slug,
                "heading": None if not self.heading_fr else self.heading_fr,
                "sub_heading": self.sub_heading_fr,
                "publish_state":self.publish_state_fr,
                "publish_date": self.publish_date,
            }
                for self in
                articles]
