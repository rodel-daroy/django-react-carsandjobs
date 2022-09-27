from site_content.models import Asset, Article, Sponsor
from ui_controllers.models import ControllerTile, ControllerCategory


class CreateUpdateTile(object):
    """
    create a tile
    """
    def __new__(cls,data,user,lng_str,tile_id=None, *args, **kwargs):

        category = ControllerCategory.objects.get(slug=data.get('category')) if data.get('category') else None
        asset = Asset.objects.get(slug=data.get('tile_asset')) if data.get('tile_asset') else None
        article = Article.objects.get(slug=data.get('tile_cta_article')) if data.get('tile_cta_article') else None
        sponsor = Sponsor.objects.get(name=data.get('sponsor')) if data.get('sponsor') else None

        validated_data = {
            "tile_name":data.get('name') if data.get('name')!=None else "",
            "order":data.get('order') if data.get('order')!="" else 0,
            "columns":data.get('columns') if data.get('columns')!="" and data.get('columns')!=None else 1,
            "category":category,
            "poll_id":data.get('poll_id'),
            "tile_headline":data.get('tile_headline'),
            "tile_subheadline":data.get('tile_subheading'),
            "tile_asset":asset,
            "tile_CTA_text":data.get('tile_cta_text') if data.get('tile_cta_text')!=None else " " ,
            "tile_CTA_link":data.get('tile_cta_link'),
            "tile_CTA_article":article,
            "is_active":data.get('active')if data.get('active')!=None else True,
            "sponsors":sponsor,
            "language":data.get('language') if data.get('language')!=None and data.get('language')!="" else "en"
        }

        # New Record
        if not tile_id:
            created_tile, is_created = ControllerTile.objects.get_or_create(**validated_data)

            if is_created:
                data =created_tile.to_json

                return data
            else:
                data = created_tile.to_json
                return data
        # Update Record
        else:

            tileobj = ControllerTile.objects.get(slug=tile_id)

            category = ControllerCategory.objects.get(slug=data.get('category')) if data.get('category') else data.get('category')
            asset = Asset.objects.get(slug=data.get('tile_asset')) if data.get('tile_asset') else data.get('tile_asset')
            article = Article.objects.get(slug=data.get('tile_cta_article')) if data.get('tile_cta_article') else data.get('tile_cta_article')
            sponsor = Sponsor.objects.get(name=data.get('sponsor')) if data.get('sponsor') else data.get('sponsor')

            validated_data = {
                "tile_name": data.get('name') if data.get('name') != None else tileobj.tile_name,
                "order": data.get('order') if data.get('order') != "" and data.get('order')!= None else tileobj.order,
                "columns":data.get('columns') if data.get('columns')!="" and data.get('columns')!=None else tileobj.columns,
                "category": category if category!=None else tileobj.category,
                "poll_id": data.get('poll_id') if data.get('poll_id')!=None else tileobj.poll_id,
                "tile_headline": data.get('tile_headline') if data.get('tile_headline')!=None else tileobj.tile_headline,
                "tile_subheadline": data.get('tile_subheading') if data.get('tile_subheading')!=None else tileobj.tile_subheadline ,
                "tile_asset": asset if asset !=None else tileobj.tile_asset,
                "tile_CTA_text": data.get('tile_cta_text') if data.get('tile_cta_text') != None else tileobj.tile_CTA_text,
                "tile_CTA_link": data.get('tile_cta_link') if data.get('tile_cta_link')!=None else tileobj.tile_CTA_link,
                "tile_CTA_article": article if article !=None else tileobj.tile_CTA_article,
                "is_active": data.get('active') if data.get('active') != None and data.get('active') !="" else True,
                "sponsors": sponsor if sponsor!=None else tileobj.sponsors,
                "language": data.get('language') if data.get('language') != None and data.get('language') != "" else tileobj.language
            }

            ControllerTile.objects.filter(slug=tile_id).update(**validated_data)

            data = ControllerTile.objects.get(slug=tile_id).to_json

            return data

def filterCheck(request):
    if(request.get("filter") is None or len(request.get("filter")) == 0 or request.get("filter")['name'] == "" or request.get("filter")['name'] is None):
        return True
    else:
        return False


class MatchingArticles(object):

    def __init__(self):
        pass

    def matchedenglisharticles(self,article_filter):
        articles = Article.objects.filter(heading_en__icontains=article_filter['article'],publish_state_en ='Published') | Article.objects.filter(
            sub_heading_en__icontains=article_filter['article'],publish_state_en ='Published') | Article.objects.filter(slug=article_filter['article'] , publish_state_en ='Published')

        return articles

    def matchedfrencharticles(self,article_filter):
        articles = Article.objects.filter(heading_fr__icontains=article_filter['article'],publish_state_fr ='Published') | Article.objects.filter(
            sub_heading_fr__icontains=article_filter['article'], publish_state_fr ='Published') | Article.objects.filter(slug=article_filter['article'], publish_state_fr ='Published')

        return articles

def checkarticlefilter(article_filter):
    if (article_filter is None or len(article_filter) == 0 or article_filter['article'] == "" or article_filter['article'] is None):
        return True
    else:
        return False