from django.urls import path

from core.views import TilesByCategory, UpdateOrder, CopyTile, MoveTile, CategoryList
from ui_controllers import views
from ui_controllers.views import UITiles, UITile, AllTileCategoriesAPI, AllInactiveTiles, AllActiveTiles, SetTileOrder, \
    AllAssets, CreateAsset, CreateTile, UpdateTile, FetchTiles, TilesWithNoCategory, UnusedTiles, DeleteTile

urlpatterns = [
    # path('', include(router.urls)),
    path('', UITiles.as_view()),

    path('tiles/', FetchTiles.as_view()),
    path('no-category-tiles/', TilesWithNoCategory.as_view()),
    path('homepage_default_tiles/', UITiles.as_view()),
    path('all-tiles-list/', TilesByCategory.as_view(), name="all_tiles_list"),
    path('update-order/', UpdateOrder.as_view(), name="update_order"),
    path('copy-tile/', CopyTile.as_view(), name="copy-tile"),
    path('move-tile/', MoveTile.as_view(), name="move-tile"),
    path('category-list/', CategoryList.as_view(), name="category-list"),
    path('all-tiles-categories/', AllTileCategoriesAPI.as_view(), name="all-tiles-categories"),
    path('all-inactive-tiles/', AllInactiveTiles.as_view(), name="all-inactive-tiles"),
    path('all-active-tiles/', AllActiveTiles.as_view(), name="all-active-tiles"),
    path('set-tile-order/', SetTileOrder.as_view(), name="set-tile-order"),
    # path('assets/all/', AllAssets.as_view(), name="all-assets"),
    path('assets/create/', CreateAsset.as_view(), name="create-asset"),
    path('create-tile/', CreateTile.as_view(), name="create-tile"),
    path('update-tile/<str:tile_id>/', UpdateTile.as_view(), name="update-tile"),
    path('delete-tile/<str:tile_id>/', DeleteTile.as_view(), name="delete-tile"),
    path('unused-tiles/', UnusedTiles.as_view(), name="unused-tiles"),

    path('<str:category_name>/', UITile.as_view()),

]
