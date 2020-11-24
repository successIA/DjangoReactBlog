from django.contrib.auth import get_user_model

import factory
from faker import Factory as FakerFactory

from posts.models import Comment, Post, CommentLike

User = get_user_model()
faker = FakerFactory.create()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.LazyAttribute(lambda _: faker.name())
    password = factory.PostGenerationMethodCall("set_password", faker.password())


class PostFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Post

    user = factory.SubFactory(UserFactory)
    title = factory.LazyAttribute(lambda _: faker.sentence())
    body = factory.LazyAttribute(lambda _: faker.sentence())


class CommentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Comment

    user = factory.SubFactory(UserFactory)
    body = factory.LazyAttribute(lambda _: faker.sentence())
    post = factory.SubFactory(PostFactory)


class CommentLikeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CommentLike

    user = factory.SubFactory(UserFactory)
    comment = factory.SubFactory(CommentFactory)
