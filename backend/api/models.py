import string
import random
from django.db import models


def generate_list_code():
    """Generate a unique 6-character alphanumeric code for a shopping list."""
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=6))


class ShoppingList(models.Model):
    """Represents a collaborative shopping list."""

    list_id = models.CharField(
        max_length=6, unique=True, default=generate_list_code, editable=False
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"List {self.list_id}"


class Item(models.Model):
    """Represents an item in a shopping list."""

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("claimed", "Claimed"),
        ("bought", "Bought"),
    ]

    shopping_list = models.ForeignKey(
        ShoppingList, on_delete=models.CASCADE, related_name="items"
    )
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    claimed_by = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.name} ({self.status})"


class UserSession(models.Model):
    """Tracks anonymous users via session identifiers."""

    session_key = models.CharField(max_length=40, unique=True)
    pseudo = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session {self.session_key} - {self.pseudo or 'Anonymous'}"
