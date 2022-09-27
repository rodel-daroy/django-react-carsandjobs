from django import forms

from site_content.models import Article


class ArticleForm(forms.ModelForm):
    """
    Model form for article
    """
    class Meta:
        model = Article
        exclude = ('publish_date', )