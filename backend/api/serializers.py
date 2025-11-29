from rest_framework import serializers
from .models import ShoppingList, Item, UserSession


class ItemSerializer(serializers.ModelSerializer):
    """Serializer for Item model."""

    class Meta:
        model = Item
        fields = ["id", "name", "status", "claimed_by", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class ShoppingListSerializer(serializers.ModelSerializer):
    """Serializer for ShoppingList model with nested items."""

    items = ItemSerializer(many=True, read_only=True)

    class Meta:
        model = ShoppingList
        fields = ["id", "list_id", "created_at", "items"]
        read_only_fields = ["id", "list_id", "created_at"]


class UserSessionSerializer(serializers.ModelSerializer):
    """Serializer for UserSession model."""

    class Meta:
        model = UserSession
        fields = ["id", "session_key", "pseudo", "created_at"]
        read_only_fields = ["id", "created_at"]
