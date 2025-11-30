import os
import django
import sys

# Add the project directory to the python path
sys.path.append('/Users/teomaitrot/Documents/projet-perso/team-shop/teo21maitr-team-shop/backend')

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "teamshop.settings")
django.setup()

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from api.models import ShoppingList
from api.serializers import ShoppingListSerializer

list_id = "UYH55J"
try:
    shopping_list = ShoppingList.objects.get(list_id=list_id)
    # Re-fetch to match service logic (though here we just got it)
    serializer = ShoppingListSerializer(shopping_list)

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"list_{list_id}",
        {
            "type": "list_reset",
            "event": "LIST_RESET",
            "list": serializer.data,
        },
    )
    print(f"Reset event sent for list {list_id}")
except Exception as e:
    print(f"Error: {e}")
