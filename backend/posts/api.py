from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Count

from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework import filters

from posts.models import Post, Comment
from posts.serializers import (
    PostSerializer,
    CommentSerializer,
    CommentToggleLikeSerializer,
    CommentLikeSerializer,
)
from posts.permissions import IsOwnerOrReadOnly
from posts.pagination import StandardResultsSetPagination


class PostViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = "slug"
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ["title"]

    def get_queryset(self):
        return super().get_queryset().order_by("-created")


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        if self.action == "list":
            qs = self._get_post().comment_set.all()
        else:
            qs = Comment.objects.all()

        if self.request.query_params.get("newest"):
            return qs.order_by("created")

        return qs.annotate(like_count=Count("liked")).order_by("-like_count", "created")

    def _get_post(self):
        return get_object_or_404(Post, slug=self.kwargs["slug"])

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, post=self._get_post())

    def perform_update(self, serializer):
        serializer.save(updated=timezone.now())

    @action(detail=True, methods=["post"])
    def toggle_like(self, request, pk=None):
        comment = self.get_object()

        serializer = CommentToggleLikeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.validated_data["like"] is True:
            comment.liked.add(request.user)
        else:
            comment.liked.remove(request.user)

        data = CommentLikeSerializer(
            instance=comment, context={"request": request}
        ).data

        return Response(data=data, status=status.HTTP_201_CREATED)
