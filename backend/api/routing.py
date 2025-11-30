"""
WebSocket URL routing for the API app.
Maps WebSocket connections to appropriate consumers.
"""
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/lists/(?P<list_id>\w+)/$", consumers.ListConsumer.as_asgi()),
]
