from django import forms

from site_content.models import Article
from ui_controllers.models import ControllerTile


class TileForm(forms.ModelForm):
    """
    Tiles form for ui_controllers
    """
    tile_CTA_article = forms.ModelChoiceField(queryset=Article.objects.published(), required=False)

    class Meta:
        model = ControllerTile
        fields = '__all__'
