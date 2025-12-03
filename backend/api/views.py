"""
API views for TeamShop.
Following SOLID principles - views are thin and delegate to services.
"""
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Item
from .serializers import ShoppingListSerializer, ItemSerializer
from .services import ShoppingListService, ItemService


@api_view(["POST"])
def create_list(request):
    """
    POST /api/lists/
    Créer une nouvelle liste de courses.
    """
    shopping_list = ShoppingListService.create_list()
    serializer = ShoppingListSerializer(shopping_list)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def get_list(request, list_id):
    """
    GET /api/lists/{list_id}/
    Récupérer les détails d'une liste de courses.
    """
    shopping_list = ShoppingListService.get_list_by_id(list_id)
    serializer = ShoppingListSerializer(shopping_list)
    return Response(serializer.data)


@api_view(["POST"])
def add_item(request, list_id):
    """
    POST /api/lists/{list_id}/items/
    Ajouter un article à une liste de courses.
    Body: { "name": "Article name" }
    """
    shopping_list = ShoppingListService.get_list_by_id(list_id)
    name = request.data.get("name")

    if not name:
        return Response(
            {"error": "Le nom de l'article est requis"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    item = ItemService.create_item(shopping_list, name)
    serializer = ItemSerializer(item)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH"])
def update_item(request, item_id):
    """
    PATCH /api/items/{item_id}/
    Mettre à jour un article.
    Body: { "name": "...", "status": "...", "claimed_by": "..." }
    """
    try:
        item = Item.objects.get(id=item_id)
    except Item.DoesNotExist:
        return Response(
            {"error": "Article introuvable"}, status=status.HTTP_404_NOT_FOUND
        )

    # Check if item is locked by another user
    current_pseudo = request.data.get("current_pseudo")
    if (
        item.status == "claimed"
        and item.claimed_by
        and item.claimed_by != current_pseudo
    ):
        return Response(
            {"error": "Cet article est verrouillé par un autre utilisateur"},
            status=status.HTTP_403_FORBIDDEN,
        )

    # Update allowed fields
    allowed_fields = ["name", "status", "claimed_by"]
    update_data = {
        key: value for key, value in request.data.items() if key in allowed_fields
    }

    item = ItemService.update_item(item, **update_data)
    serializer = ItemSerializer(item)
    return Response(serializer.data)


@api_view(["DELETE"])
def delete_item(request, item_id):
    """
    DELETE /api/items/{item_id}/
    Supprimer un article.
    """
    try:
        item = Item.objects.get(id=item_id)
    except Item.DoesNotExist:
        return Response(
            {"error": "Article introuvable"}, status=status.HTTP_404_NOT_FOUND
        )

    # Check if item is locked by another user
    current_pseudo = request.data.get("current_pseudo")
    if (
        item.status == "claimed"
        and item.claimed_by
        and item.claimed_by != current_pseudo
    ):
        return Response(
            {"error": "Cet article est verrouillé par un autre utilisateur"},
            status=status.HTTP_403_FORBIDDEN,
        )

    ItemService.delete_item(item)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
def reset_list(request, list_id):
    """
    POST /api/lists/{list_id}/reset/
    Réinitialiser la liste après les courses.
    """
    shopping_list = ShoppingListService.get_list_by_id(list_id)
    ShoppingListService.reset_list(shopping_list)
    serializer = ShoppingListSerializer(shopping_list)
    return Response(serializer.data)


@api_view(["POST"])
def rename_pseudo(request, list_id):
    """
    POST /api/lists/{list_id}/rename-pseudo/
    Renommer le pseudo d'un utilisateur.
    Body: { "old_pseudo": "...", "new_pseudo": "..." }
    """
    shopping_list = ShoppingListService.get_list_by_id(list_id)
    old_pseudo = request.data.get("old_pseudo")
    new_pseudo = request.data.get("new_pseudo")

    if not old_pseudo or not new_pseudo:
        return Response(
            {"error": "Les pseudos ancien et nouveau sont requis"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if old_pseudo == new_pseudo:
        return Response(
            {"error": "Le nouveau pseudo doit être différent de l'ancien"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        updated_count = ShoppingListService.rename_pseudo(
            shopping_list, old_pseudo, new_pseudo
        )
        return Response(
            {
                "message": "Pseudo renommé avec succès",
                "old_pseudo": old_pseudo,
                "new_pseudo": new_pseudo,
                "updated_items": updated_count,
            }
        )
    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
