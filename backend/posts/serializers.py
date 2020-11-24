# pylint: disable=abstract-method
from rest_framework import serializers

from .models import Post, Comment


class PostSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    read_time = serializers.SerializerMethodField()

    def get_user(self, obj):
        return obj.user.username

    def get_read_time(self, obj):
        return "10mins"

    class Meta:
        model = Post
        fields = [
            "id",
            "user",
            "title",
            "slug",
            "body",
            "read_time",
            "created",
            "updated",
        ]
        write_only_fields = ["title", "body"]


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    post = serializers.SerializerMethodField()

    likes = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    def get_likes(self, obj):
        return obj.liked.count()

    def get_is_liked(self, obj):
        user = self.context["request"].user
        print("USER:", user)
        if user.is_authenticated:
            return bool(user in obj.liked.all())
        return False

    def get_post(self, obj):
        return obj.post.slug

    def get_user(self, obj):
        return obj.user.username

    class Meta:
        model = Comment
        fields = [
            "id",
            "user",
            "post",
            "body",
            "is_liked",
            "likes",
            "created",
            "updated",
        ]
        read_only_fields = ["user", "post", "created", "updated"]


class CommentToggleLikeSerializer(serializers.Serializer):
    like = serializers.BooleanField()


class CommentLikeSerializer(serializers.ModelSerializer):
    comment = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    def get_comment(self, obj):
        return obj.pk

    def get_likes(self, obj):
        return obj.liked.count()

    def get_is_liked(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            return bool(user in obj.liked.all())
        return False

    class Meta:
        model = Comment
        fields = ["comment", "likes", "is_liked"]
        read_only_fields = fields
