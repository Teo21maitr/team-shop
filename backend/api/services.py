"""
Service layer for business logic.
Following SOLID principles - Single Responsibility.
"""
from django.shortcuts import get_object_or_404
from .models import ShoppingList, Item


class ShoppingListService:
    """Service for managing shopping lists."""

    @staticmethod
    def create_list():
        """Create a new shopping list."""
        shopping_list = ShoppingList.objects.create()
        return shopping_list

    @staticmethod
    def get_list_by_id(list_id):
        """
        Retrieve a shopping list by its unique list_id.
        Raises Http404 if not found.
        """
        return get_object_or_404(ShoppingList, list_id=list_id)

    @staticmethod
    def reset_list(shopping_list):
        """
        Reset a shopping list after shopping:
        - Delete all 'bought' items
        - Reset 'claimed' items to 'pending'
        - Broadcast LIST_RESET event
        """
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync
        from .serializers import ShoppingListSerializer
        import time

        # Perform bulk updates
        shopping_list.items.filter(status="bought").delete()
        shopping_list.items.filter(status="claimed").update(
            status="pending", claimed_by=None
        )

        print(f"Resetting list {shopping_list.list_id}")
        for item in shopping_list.items.all():
            print(f"Item {item.name} is now {item.status}")

        # Broadcast reset event with fresh list data
        channel_layer = get_channel_layer()
        
        # Re-fetch the list to ensure we have the latest items state
        # This prevents sending stale data if the relation was cached
        updated_list = ShoppingList.objects.get(pk=shopping_list.pk)
        serializer = ShoppingListSerializer(updated_list)
        
        print(f"Broadcasting LIST_RESET for {shopping_list.list_id}")

        for item in shopping_list.items.all():
            print(f"Item {item.name} is now {item.status}")
        
        # Small delay to ensure HTTP response completes before WebSocket event
        # This prevents race conditions where frontend state changes interrupt WebSocket
        time.sleep(0.1)
        
        async_to_sync(channel_layer.group_send)(
            f"list_{shopping_list.list_id}",
            {
                "type": "list_reset",
                "event": "LIST_RESET",
                "list": serializer.data,
            },
        )

    @staticmethod
    def rename_pseudo(shopping_list, old_pseudo, new_pseudo):
        """
        Rename a user's pseudo and update all their claimed items.
        Validates uniqueness within active list session.
        Broadcasts PSEUDO_RENAMED event to all connected users.
        """
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync

        # Validate that new_pseudo is not already in use by another user
        # Check if any items are claimed by the new pseudo (excluding the current user's items)
        existing_items = shopping_list.items.filter(
            claimed_by=new_pseudo, status='claimed'
        ).exclude(claimed_by=old_pseudo)

        if existing_items.exists():
            raise ValueError(f"Le pseudo '{new_pseudo}' est déjà utilisé")

        # Update all items claimed by old_pseudo to new_pseudo
        updated_count = shopping_list.items.filter(
            claimed_by=old_pseudo, status='claimed'
        ).update(claimed_by=new_pseudo)

        print(f"Renamed pseudo from '{old_pseudo}' to '{new_pseudo}' for {updated_count} items")

        # Broadcast rename event
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"list_{shopping_list.list_id}",
            {
                "type": "pseudo_renamed",
                "event": "PSEUDO_RENAMED",
                "old_pseudo": old_pseudo,
                "new_pseudo": new_pseudo,
            },
        )

        return updated_count


class ItemService:
    """Service for managing items."""

    @staticmethod
    def create_item(shopping_list, name):
        """Create a new item in a shopping list."""
        item = Item.objects.create(shopping_list=shopping_list, name=name)
        return item

    @staticmethod
    def update_item(item, **kwargs):
        """
        Update an item with provided fields.
        Validates ownership for status changes.
        """
        for key, value in kwargs.items():
            setattr(item, key, value)
        item.save()
        return item

    @staticmethod
    def delete_item(item):
        """Delete an item."""
        item.delete()

    @staticmethod
    def claim_item(item, pseudo):
        """Claim an item (set status to claimed and assign pseudo)."""
        if item.status != "pending":
            raise ValueError("Item is not available for claiming")
        item.status = "claimed"
        item.claimed_by = pseudo
        item.save()
        return item

    @staticmethod
    def validate_item(item, pseudo):
        """
        Validate an item (set status to bought).
        Only the user who claimed it can validate.
        """
        if item.status != "claimed":
            raise ValueError("Item must be claimed before validation")
        if item.claimed_by != pseudo:
            raise ValueError("Only the user who claimed the item can validate it")
        item.status = "bought"
        item.save()
        return item
