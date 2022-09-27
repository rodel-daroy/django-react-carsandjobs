from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.response import Response

from core.utils.utility import IsDealer
from site_content.models import Asset, Content
from ui_controllers.models import ControllerTile, ControllerCategory
from ui_controllers.utils import CreateUpdateTile, filterCheck
from users import DEALER_ROLES
from users.models import DealerProfiles, Profile


class UITiles(APIView):
    """
		Tiles for frontend
		"""
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        data = ControllerTile.objects.filter(category__category_name="Homepage Default").filter(is_active=True)
        return Response(data=[tiles.to_json for tiles in data], status=status.HTTP_200_OK)


class UITile(APIView):
    """
		Tiles for frontend for logged in user

		"""
    authentication_classes = ()
    permission_classes = ()

    def get(self, request, category_name):
        if request.language.startswith("en"):
            data = ControllerTile.objects.filter(category__category_name=category_name.title()).filter(language="en").filter(is_active=True).order_by('order')
            return Response(data=[tiles.to_json for tiles in data], status=status.HTTP_200_OK)

        elif request.language.startswith("fr"):
            data = ControllerTile.objects.filter(category__category_name=category_name.title()).filter(is_active=True).filter(language="fr").order_by('order')
            return Response(data=[tiles.to_json for tiles in data], status=status.HTTP_200_OK)

        else:
            data = ControllerTile.objects.filter(category__category_name=category_name.title()).filter(is_active=True).order_by('order')
            return Response(data=[tiles.to_json for tiles in data], status=status.HTTP_200_OK)

    def post(self, request, category_name = None):
        province = request.data.get("province", None)

        if request.language.startswith("en"):
            tileQuerySet = ControllerTile.objects.filter(category__category_name=category_name.title(),category__language="en").filter(is_active=True).order_by('order')

        elif request.language.startswith("fr"):
            tileQuerySet = ControllerTile.objects.filter(category__category_name=category_name.title(),category__language="fr").filter(is_active=True).order_by('order')

        else:
            tileQuerySet = ControllerTile.objects.filter(category__category_name=category_name.title()).filter(is_active=True).order_by('order')

        if province:
            province = province.upper().strip()
        data = tileQuerySet.filter(category__province=province)

        if not data:
            # Return Tile with Null Province if there is No Match with Province.
            data = tileQuerySet.filter(category__province__isnull=True)

        return Response(data=[tiles.to_json for tiles in data], status=status.HTTP_200_OK)


class AllTileCategoriesAPI(APIView):
    """
    List all tile categories
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)


    def get(self,request):

        user = DealerProfiles.objects.filter(user=request.user).first()

        if user.role == DEALER_ROLES[4][0]:
            data = ControllerCategory.objects.all()
            if data:
                return Response(data=[categories.to_json for categories in data], status=status.HTTP_200_OK)
            else:
                return Response(data=[], status=status.HTTP_200_OK)

        else:
            return Response(data={"Message": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)


class AllInactiveTiles(APIView):
    """
    List of all inactive tiles
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def get(self,request):

        user = DealerProfiles.objects.filter(user=request.user).first()

        if user.role == DEALER_ROLES[4][0]:

            data = ControllerTile.objects.filter(is_active= False).order_by('order')

            if data:
                return Response(data=[tiles.to_json for tiles in data], status=status.HTTP_200_OK)
            else:
                return Response(data=[], status=status.HTTP_200_OK)
        else:
            return Response(data={"Message": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)



class AllActiveTiles(APIView):
    """
    List of all active tiles
    """

    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def get(self, request):

        user = DealerProfiles.objects.filter(user=request.user).first()

        if user.role == DEALER_ROLES[4][0]:
            data = ControllerTile.objects.filter(is_active=True).order_by('order')

            if data:
                return Response(data=[tiles.to_json for tiles in data], status=status.HTTP_200_OK)
            else:
                return Response(data=[], status=status.HTTP_200_OK)
        else:
            return Response(data={"Message": "You do not have permission to perform this action."},
                            status=status.HTTP_403_FORBIDDEN)


class SetTileOrder(APIView):
    """
    Set order of tile
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def post(self,request):
        user = DealerProfiles.objects.filter(user=request.user).first()

        if user.role == DEALER_ROLES[4][0]:
            category = request.data.get("category")
            categoryobj =ControllerCategory.objects.get(slug=category)
            tiles = ControllerTile.objects.filter(category__slug=category)
            tiles.update(category=None)

            tiles =request.data.get('tiles')
            #
            for tile in range(len(tiles)):
                tileobj =ControllerTile.objects.get(slug=tiles[tile])
                tileobj.order =tile
                tileobj.category =categoryobj
                tileobj.is_active = True
                tileobj.save()
            return Response(data={"Message": "Tile order and category has been updated"}, status=status.HTTP_200_OK)
        else:
            return Response(data={"Message": "You do not have permission to perform this action."},
                            status=status.HTTP_403_FORBIDDEN)

class AllAssets(APIView):

    """
    List all assets
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def post(self,request):
        user = DealerProfiles.objects.filter(user=request.user).first()
        start_index = request.data.get("start_index",0)
        count = request.data.get("count",50)

        if user.role == DEALER_ROLES[4][0]:
                if filterCheck(request.data):
                    assets = Asset.objects.all().order_by('-updated_on')
                    data =assets[start_index:count+start_index]
                    return Response(data={"assets":[asset.to_json for asset in data],"total_count":len(assets)}, status=status.HTTP_200_OK)
                elif not filterCheck(request.data):
                    asset_filter = request.data.get("filter")['name']
                    assets = Asset.objects.filter(name__icontains=asset_filter)
                    data =assets[start_index:count+start_index]
                    return Response(data={"assets":[asset.to_json for asset in data],"total_count":len(assets)}, status=status.HTTP_200_OK)
        else:
            return Response(data={"Message": "You do not have permission to perform this action."},status=status.HTTP_403_FORBIDDEN)


class CreateAsset(APIView):

    """
    Create an asset
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)
    parser_classes = (MultiPartParser, FormParser,)

    def post(self,request):
        user = DealerProfiles.objects.filter(user=request.user).first()

        if user.role == DEALER_ROLES[4][0]:
            try:
                file_obj =request.data['file']
            except:
                file_obj=None

            try:
                name =request.data['name']
            except:
                name =None

            if  file_obj is not None:

                if name is not None and name !="" :

                    if Content.objects.filter(file_name=name).exists():

                        Already_exist =True
                    else:
                        Already_exist =False

                    if not Already_exist:

                        contentobj, is_created = Content.objects.get_or_create(
                            file_name =name,
                            file = file_obj)

                        if contentobj.file.url.endswith("mp4") or contentobj.file.url.endswith("webm") or contentobj.file.url.endswith('swf'):
                            asset_type= "Video"
                        else:
                            asset_type = "Image"

                        assetobj,is_created =Asset.objects.get_or_create(
                            name =name,
                            asset_type =asset_type
                        )
                        assetobj.content.add(contentobj)

                        if is_created:
                            return Response(data=[assetobj.to_json], status=status.HTTP_200_OK)
                    else:
                        return Response(data={"Message": "Asset With this name is already exist."},status=status.HTTP_409_CONFLICT)
                else:
                    return Response(data={"Message": "Name is missing"},
                                    status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(data={"Message": "File is not selected"},
                                status=status.HTTP_400_BAD_REQUEST)


        else:
            return Response(data={"Message": "You do not have permission to perform this action."},status=status.HTTP_403_FORBIDDEN)



class CreateTile(APIView):
    """
    Api to create tile
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def post(self,request):
        user = DealerProfiles.objects.filter(user=request.user).first()

        if user.role == DEALER_ROLES[4][0]:
                create_tile =CreateUpdateTile(request.data,request.user,request.language)

                return Response(data=create_tile,status=status.HTTP_200_OK)
        else:
            return Response(data={"Message": "You do not have permission to perform this action."},status=status.HTTP_403_FORBIDDEN)

class UpdateTile(APIView):
    """
    API to update a tile
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def post(self,request,tile_id):

        user = DealerProfiles.objects.filter(user=request.user).first()

        if user.role == DEALER_ROLES[4][0]:
            try:
                tile =ControllerTile.objects.get(slug=tile_id)
            except:
                tile =None

            if tile:

                    update_tile =CreateUpdateTile(request.data,request.user,request.language,tile_id)

                    return Response(data=update_tile, status=status.HTTP_200_OK)

            else:
                return Response(data={"Error": "Tile Not found"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data={"Message": "You do not have permission to perform this action."},
                        status=status.HTTP_403_FORBIDDEN)


class FetchTiles(APIView):
    """
    Api to fetch tiles as per category
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def post(self, request, ):
        user = DealerProfiles.objects.filter(user=request.user).first()

        if user.role == DEALER_ROLES[4][0]:
            category = request.data.get("category",None)
            queryset =ControllerTile.objects.filter(category__slug=category).order_by('order')
            return Response(data=[tiles.to_json for tiles in queryset],status=status.HTTP_200_OK)
        return Response(data={"Message": "You do not have permission to perform this action."},
                        status=status.HTTP_403_FORBIDDEN)


class TilesWithNoCategory(APIView):
    """
    Api to fetch all active tiles with Null category
    """

    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def get(self,request):
        user = DealerProfiles.objects.filter(user=request.user).first()

        if user.role == DEALER_ROLES[4][0]:
            try:
                data = ControllerTile.objects.filter(category__isnull=True,is_active=True).order_by('order')
            except :
                data =None
            if data:
                return Response(data=[tiles.to_json for tiles in data], status=status.HTTP_200_OK)
            else:
                return Response(data=[], status=status.HTTP_200_OK)
        return Response(data={"Message": "You do not have permission to perform this action."},
                        status=status.HTTP_403_FORBIDDEN)


class UnusedTiles(APIView):
    """
    Api to fetch unused tiles
    """

    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def get(self, request):
        user = DealerProfiles.objects.filter(user=request.user).first()

        if user.role == DEALER_ROLES[4][0]:
            data = ControllerTile.objects.filter(category__isnull=True) | ControllerTile.objects.filter (is_active=False).order_by('-updated_on')
            if data:
                return Response(data=[tiles.to_json for tiles in data], status=status.HTTP_200_OK)
            else:
                return Response(data=[], status=status.HTTP_200_OK)

        return Response(data={"Message": "You do not have permission to perform this action."},
                        status=status.HTTP_403_FORBIDDEN)


class DeleteTile(APIView):
    """
    Api to delete tile
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsDealer,)

    def post(self, request,tile_id):
        user = DealerProfiles.objects.filter(user=request.user).first()

        if user.role == DEALER_ROLES[4][0]:
            try:
                tile =ControllerTile.objects.get(slug=tile_id)
            except:
                tile =None

            if tile:
                tile.delete()
                return Response(data={"Message": "Tile deleted Successfully."},
                                status=status.HTTP_200_OK)
            else:
                return Response(data={"Error": "Tile Not found"}, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response(data={"Message": "You do not have permission to perform this action."},
                                status=status.HTTP_403_FORBIDDEN)


