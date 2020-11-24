"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from rest_framework.routers import DefaultRouter

from posts.api import PostViewSet, CommentViewSet
from accounts.api import current_user

router = DefaultRouter()
router.register(r"posts", PostViewSet, basename="post")


comment_list = CommentViewSet.as_view({"get": "list", "post": "create"})

comment_detail = CommentViewSet.as_view(
    {"get": "retrieve", "patch": "partial_update", "delete": "destroy"}
)

comment_toggle_like = CommentViewSet.as_view({"post": "toggle_like"})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/dj-rest-auth/", include("dj_rest_auth.urls")),
    path("api/current-user/", current_user, name="current-user"),
    path("api/", include(router.urls)),
    path("api/posts/<str:slug>/comments/", comment_list, name="comment-list"),
    path("api/comments/<int:pk>/", comment_detail, name="comment-detail",),
    path(
        "api/comments/<int:pk>/toggle-like/",
        comment_toggle_like,
        name="comment-toggle-like",
    ),
]
