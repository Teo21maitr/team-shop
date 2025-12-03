"""
WebSocket consumers for real-time list synchronization.
Following SOLID principles - focused consumer handling list events.
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer


class ListConsumer(AsyncWebsocketConsumer):
    """
    Consumer for handling real-time updates to shopping lists.
    Each connection joins a group specific to the list_id.
    """

    async def connect(self):
        """Accept WebSocket connection and join list group."""
        self.list_id = self.scope["url_route"]["kwargs"]["list_id"]
        self.room_group_name = f"list_{self.list_id}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        """Leave list group on disconnect."""
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """
        Receive message from WebSocket.
        Currently not used, but available for future features.
        """
        pass

    # Event handlers for broadcasting
    async def item_added(self, event):
        """Send item_added event to WebSocket."""
        await self.send(text_data=json.dumps(event))

    async def item_updated(self, event):
        """Send item_updated event to WebSocket."""
        await self.send(text_data=json.dumps(event))

    async def item_deleted(self, event):
        """Send item_deleted event to WebSocket."""
        await self.send(text_data=json.dumps(event))

    async def list_reset(self, event):
        """Send list_reset event to WebSocket."""
        await self.send(text_data=json.dumps(event))

    async def pseudo_renamed(self, event):
        """Send pseudo_renamed event to WebSocket."""
        await self.send(text_data=json.dumps(event))
