"""
Django signals for broadcasting real-time updates.
Signals trigger WebSocket events when items are created, updated, or deleted.
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Item
from .serializers import ItemSerializer


@receiver(post_save, sender=Item)
def item_saved(sender, instance, created, **kwargs):
    """
    Broadcast item_added or item_updated event when an item is saved.
    """
    channel_layer = get_channel_layer()
    room_group_name = f"list_{instance.shopping_list.list_id}"
    
    # Serialize the item data
    item_data = ItemSerializer(instance).data
    
    # Determine event type
    event_type = "item_added" if created else "item_updated"
    
    # Broadcast to WebSocket group
    async_to_sync(channel_layer.group_send)(
        room_group_name,
        {
            "type": event_type,
            "event": event_type.upper(),
            "item": item_data,
        },
    )


@receiver(post_delete, sender=Item)
def item_deleted(sender, instance, **kwargs):
    """
    Broadcast item_deleted event when an item is deleted.
    """
    channel_layer = get_channel_layer()
    room_group_name = f"list_{instance.shopping_list.list_id}"
    
    # Broadcast to WebSocket group
    async_to_sync(channel_layer.group_send)(
        room_group_name,
        {
            "type": "item_deleted",
            "event": "ITEM_DELETED",
            "item_id": instance.id,
        },
    )
