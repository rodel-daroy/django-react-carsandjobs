import json
import os
import time

from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse
from django.shortcuts import render, render_to_response

# Create your views here.
from django.template.context_processors import csrf
from django.utils.decorators import method_decorator
from django.views import View, generic
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from core.models import Language
from core.utils.membee import Membee
from core.utils.utility import IsDealer
from site_content import ASSET_TYPES
from site_content.models import Asset, Content
from ui_controllers.models import ControllerTile, ControllerCategory


class CoreLanguageAPIView(APIView):
    """
     Language listing API
    """
    permission_classes = ()
    authentication_classes = ()

    def get(self, request):
        return Response(data=[obj.to_json for obj in Language.objects.all()])


class CarouselList(View):
    """
    Listing of carousel assets
    """
    template = 'admin/carousel_ordering.html'

    def get(self, request):
        return render(request, self.template, {"assets": Asset.objects.filter(asset_type=ASSET_TYPES[2][1])})


class CarouselOrderUpdate(View):
    """
    Carousel order update
    """

    template = 'admin/set_order.html'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(CarouselOrderUpdate, self).dispatch(request, *args, **kwargs)

    def get(self, request, asset_id):
        asset = Asset.objects.get(id=asset_id)
        return render(request, self.template, {
            "asset": Asset.objects.get(id=asset_id),
            "asset_content": asset.content.all().order_by("order")
        })


class SetAssetOrder(APIView):
    """
    Setting order of the Carousel Asset only
    """

    authentication_classes = ()
    permission_classes = (AllowAny, )

    def post(self, request):
        order = request.data['order']
        for content_id in order:
            obj = Content.objects.get(id=int(content_id))
            obj.order = order.index(content_id)
            obj.save()
        return Response(data={"message": "sequence updated successfully"}, status=status.HTTP_200_OK)


class TilesByCategory(LoginRequiredMixin, View):
    """
    Login Required mixin
    """
    login_url = '/admin/'
    template = "tile-by-category.html"

    def get(self, request):
        categorized_tiles = []
        category_list = []
        for category in ControllerCategory.objects.all():
            obj = {
                "name": category.category_name,
                "id": category.id,
                "tiles": ControllerTile.objects.filter(category_id=category.id).order_by("order"),
                "slug":category.slug,
                "province":category.province
            }
            categorized_tiles.append(obj)
        for category in ControllerCategory.objects.all():
                obj2 = {
                    "name": category.category_name,
                    "slug": category.slug,
                    "province":category.province

                }
                category_list.append(obj2)
        context = {"tiles": categorized_tiles,"categories":category_list}
        return render(request, self.template, context)


class UpdateOrder(APIView):
    """
    API to Update Tile Order
    """

    authentication_classes = ( )
    permission_classes = (AllowAny,)


    def post(self, request):
        order = request.data.get("ui_tile_order")
        try:
            for each_order in order:
                tile = ControllerTile.objects.get(id=int(each_order))
                tile.order = order.index(each_order)
                tile.save()
            return Response(data={"message": "order updated"}, status=200)
        except Exception as e:
            return Response(data={"message": "error"}, status=404)


class CopyTile(APIView):
    """
    API to copy tiles from tile_slug
    """
    authentication_classes = ( )
    permission_classes = (AllowAny,)


    def post(self,request):
        tile_slug=request.data.get("tile_slug")
        category_slug=request.data.get("category_slug")
        if tile_slug:
            try:
                tile = ControllerTile.objects.get(slug=tile_slug)
            except ControllerTile.DoesNotExist as e:
                tile = None

        if category_slug:
            try:
                category = ControllerCategory.objects.get(slug=category_slug)
            except ControllerCategory.DoesNotExist as e:
                category = None

        if tile and category:

            a, is_created =ControllerTile.objects.get_or_create(
                order=tile.order,
                tile_name=tile.tile_name,
                category=category,
                columns=tile.columns,
                poll_id=tile.poll_id,
                language=tile.language,
                tile_headline=tile.tile_headline,
                tile_subheadline=tile.tile_subheadline,
                tile_asset=tile.tile_asset,
                tile_CTA_text=tile.tile_CTA_text,
                tile_CTA_link=tile.tile_CTA_link,
                tile_CTA_article=tile.tile_CTA_article,
                linked_outside=tile.linked_outside,
                is_active=tile.is_active,
                sponsors=tile.sponsors,
            )
            if is_created==True:
                return Response(data={"message": "Tile copied"}, status=200)
            else:
                return Response(data={"message": "error"}, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response(data={"error": "Bad request"}, status=status.HTTP_400_BAD_REQUEST)



class MoveTile(APIView):
    """
    API to update category of a Controller tile based on tile slug
    """
    authentication_classes = ( )
    permission_classes = (AllowAny,)

    def post(self, request):
        tile_slug = request.data.get("tile_slug")
        category_slug = request.data.get("category_slug")
        if tile_slug:
            try:
                tile = ControllerTile.objects.get(slug=tile_slug)
            except ControllerTile.DoesNotExist as e:
                tile = None

        if category_slug:
            try:
                category = ControllerCategory.objects.get(slug=category_slug)
            except ControllerCategory.DoesNotExist as e:
                category = None

        if tile and category:
            ControllerTile.objects.filter(slug=tile_slug).update(category=category)
            return Response(data={"message": "Tile moved"}, status=200)
        else:
            return Response(data={"error": "Bad request"}, status=status.HTTP_400_BAD_REQUEST)


class CategoryList(APIView):
    """
    API to have Category Listing
    """


    login_url = '/admin/'
    template = "tile-by-category.html"

    def get(self, request):
        categoryData = []
        for category in ControllerCategory.objects.all():
            print(category.category_name)
            obj = {
                "name": category.category_name,
                "slug": category.slug,
                # "tiles": ControllerTile.objects.filter(category_id=category.id).order_by("order")
            }
            categoryData.append(obj)
        context = {"category": categoryData}
        return render(request, self.template, context)


class MembeeTemplate1(View):
    template_name = "Template_1.html"

    def get(self, request):
        if request.GET.get("token"):
            membee_obj = Membee(request.GET.get("token"))
            return render(request, self.template_name, {
                "is_authenticated": membee_obj.is_authenticated,
                "is_board_member": membee_obj.is_board_member,
                "member_user": membee_obj.user_data
            })
        return render(request, self.template_name, {"is_board_member": False})


class MembeeTemplate2(View):
    template_name = "Template_2.html"

    def get(self, request):
        if request.GET.get("token"):
            membee_obj = Membee(request.GET.get("token"))
            return render(request, self.template_name, {
                "is_authenticated": membee_obj.is_authenticated,
                "is_board_member": membee_obj.is_board_member,
                "member_user": membee_obj.user_data
            })
        return render(request, self.template_name, {"is_board_member": False})


class MembeeAuthorize(View):
    """
    Authorize membee user using token
    """
    template_name = "Template_1.html"

    def get(self, request):
        if request.GET.get("token"):
            membee_obj = Membee(request.GET.get("token"))
            return render(request, self.template_name, {
                "is_authenticated": membee_obj.is_authenticated,
                "is_board_member": membee_obj.is_board_member
            })
        return render(request, self.template_name, {"is_board_member": False})

def services(request):
    if request.user.is_superuser:
            return render(request, 'admin/services.html')
    else:
        return HttpResponse(
            content_type="application/json",
            content=json.dumps(
                {
                    "error": "unauthorised attempt",
                    "status": status.HTTP_401_UNAUTHORIZED
                }
            )
        )

def gunicorn_restart(request):
    if request.user.is_superuser:
        try:
            os.system("sudo systemctl restart gunicorn")
            status_code = status.HTTP_200_OK
            msg = "Service Gunicorn is restarted"
        except:
            status_code = status.HTTP_404_NOT_FOUND
            msg = "Service Gunicorn is not restarted"

        context = {
            "message": msg,
            "status": status_code
        }
        print(context)

        return render(request, 'admin/services.html', context)

    else:
        return HttpResponse(
            content_type="application/json",
            content=json.dumps(
                {
                    "error": "unauthorised attempt",
                    "status": status.HTTP_401_UNAUTHORIZED
                }
            )
        )

def nginx_restart(request):
    if request.user.is_superuser:
        try:
            os.system("sudo systemctl restart nginx")
            status_code = status.HTTP_200_OK
            msg = "Service Nginx is restarted"
        except:
            status_code = status.HTTP_404_NOT_FOUND
            msg = "Service Nginx is not restarted"

        context = {
            "message": msg,
            "status": status_code
        }
        print(context)

        return render(request, 'admin/services.html', context)
    else:
        return HttpResponse(
            content_type="application/json",
            content=json.dumps(
                {
                    "error": "unauthorised attempt",
                    "status": status.HTTP_401_UNAUTHORIZED
                }
            )
        )




class GunicornRestart(APIView):

    """
    Api to restart gunicorn
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self,request):
        os.system("sudo systemctl restart gunicorn")


        return Response(data={"Message":"Gunicorn services has been restarted"},status=status.HTTP_200_OK)



