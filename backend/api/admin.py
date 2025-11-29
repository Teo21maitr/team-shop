"""Admin configuration for API models."""
from django.contrib import admin
from .models import ShoppingList, Item, UserSession


@admin.register(ShoppingList)
class ShoppingListAdmin(admin.ModelAdmin):
    """Admin for ShoppingList."""

    list_display = ["list_id", "created_at"]
    search_fields = ["list_id"]
    readonly_fields = ["list_id", "created_at"]


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    """Admin for Item."""

    list_display = ["name", "status", "claimed_by", "shopping_list", "created_at"]
    list_filter = ["status", "shopping_list"]
    search_fields = ["name", "claimed_by"]


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    """Admin for UserSession."""

    list_display = ["session_key", "pseudo", "created_at"]
    search_fields = ["session_key", "pseudo"]
    readonly_fields = ["created_at"]
