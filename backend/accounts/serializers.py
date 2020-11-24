from django.contrib.auth import get_user_model

from rest_framework import serializers
from dj_rest_auth.serializers import TokenSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username"]


class UserTokenSerializer(TokenSerializer):
    user = UserSerializer()

    class Meta(TokenSerializer.Meta):
        fields = TokenSerializer.Meta.fields + ("user",)
