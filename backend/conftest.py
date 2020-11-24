import pytest
from pytest_factoryboy import register
from rest_framework.test import APIClient

from posts.models import Post, Comment
from posts.tests.factories import (
    UserFactory,
    CommentFactory,
    PostFactory,
    CommentLikeFactory,
)

register(UserFactory)
register(PostFactory)
register(CommentFactory)
register(CommentLikeFactory)


@pytest.fixture(autouse=True)
def enable_db_access(db):
    pass


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def test_user(django_user_model):
    return django_user_model.objects.create(
        username="test_username", password="test_password"
    )


@pytest.fixture
def test_auth_user(api_client, test_user):
    api_client.force_authenticate(test_user)
    return test_user


@pytest.fixture
def test_post(test_user):
    return Post.objects.create(user=test_user, title="Post Title", body="Post Body")


@pytest.fixture
def test_comment(test_user, test_post):
    return Comment.objects.create(user=test_user, post=test_post, body="First Comment")
