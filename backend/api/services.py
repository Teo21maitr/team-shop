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
        """
        shopping_list.items.filter(status="bought").delete()
        shopping_list.items.filter(status="claimed").update(
            status="pending", claimed_by=None
        )


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
