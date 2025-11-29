"""URL configuration for the API app."""
from django.urls import path
from . import views

urlpatterns = [
    path("lists/", views.create_list, name="create_list"),
    path("lists/<str:list_id>/", views.get_list, name="get_list"),
    path("lists/<str:list_id>/items/", views.add_item, name="add_item"),
    path("lists/<str:list_id>/reset/", views.reset_list, name="reset_list"),
    path("items/<int:item_id>/", views.update_item, name="update_item"),
    path("items/<int:item_id>/delete/", views.delete_item, name="delete_item"),
]
