"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""

from django.template import Library

register = Library()

@register.filter_function
def order_by(queryset, args):
    args = [x.strip() for x in args.split(',')]
    return queryset.order_by(*args)