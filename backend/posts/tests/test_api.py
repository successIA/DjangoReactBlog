# pylint: disable=unused-argument
from rest_framework.reverse import reverse

from posts.models import Post, Comment, CommentLike


def test_post_list(api_client, django_user_model):
    user = django_user_model.objects.create(
        username="test_username", password="test_password"
    )
    Post.objects.create(user=user, title="Post Title", body="Post Body")

    response = api_client.get(reverse("post-list"))
    assert response.status_code == 200
    assert len(response.data["results"]) == 1
    assert response.data["results"][0]["title"] == "Post Title"
    assert response.data["results"][0]["body"] == "Post Body"


def test_post_retrieve(api_client, test_user):
    post = Post.objects.create(user=test_user, title="Post Title", body="Post Body")

    response = api_client.get(reverse("post-detail", kwargs={"slug": post.slug}))
    assert response.status_code == 200
    assert response.data["title"] == "Post Title"
    assert response.data["body"] == "Post Body"


def test_post_create_404(api_client, test_auth_user):
    response = api_client.post("api/posts/", data={"title": "Hey!", "body": "Lgc"})
    assert response.status_code == 404
    assert Post.objects.count() == 0


def test_post_update_404(api_client, test_auth_user, post_factory):
    post = Post.objects.create(
        user=test_auth_user, title="Post Title", body="Post Body"
    )

    response1 = api_client.patch(
        f"api/posts/{post.slug}/", data={"title": "Hey!", "body": "Lgc"}
    )
    assert response1.status_code == 404

    response2 = api_client.put(
        f"api/posts/{post.slug}/", data={"title": "Hey!", "body": "Lgc"}
    )
    assert response2.status_code == 404

    post_qs = Post.objects.all()
    assert post_qs.count() == 1
    assert post_qs.first().title == "Post Title"
    assert post_qs.first().body == "Post Body"
    assert post_qs.first().updated is None


def test_post_delete_404(api_client, test_auth_user, post_factory):
    post = Post.objects.create(
        user=test_auth_user, title="Post Title", body="Post Body"
    )

    response = api_client.delete(f"api/posts/{post.slug}/")
    assert response.status_code == 404

    assert Post.objects.count() == 1


def test_post_search(api_client, post_factory):
    post_factory(title="TDD with Python and Django")
    post_factory(title="Learn JavaScript using TDD")
    post_factory(title="Learn Java Programming")

    base_url = reverse("post-list")
    response = api_client.get(f"{base_url}?search=tdd")
    assert response.status_code == 200

    assert len(response.data["results"]) == 2
    assert response.data["results"][0]["title"] == "Learn JavaScript using TDD"
    assert response.data["results"][1]["title"] == "TDD with Python and Django"


def test_comment_create(api_client, test_auth_user, test_post):
    response = api_client.post(
        reverse("comment-list", kwargs={"slug": test_post.slug}),
        data={"body": "First Comment"},
    )

    assert response.status_code == 201
    assert response.data["body"] == "First Comment"

    comment_qs = Comment.objects.all()
    assert comment_qs.count() == 1
    assert comment_qs.first().body == "First Comment"
    assert comment_qs.first().updated is None
    assert comment_qs.first().user == test_auth_user
    assert comment_qs.first().post == test_post


def test_comment_create_invalid_payload(api_client, test_auth_user, test_post):
    send = lambda input: api_client.post(
        reverse("comment-list", kwargs={"slug": test_post.slug}), data=input,
    )
    response = send({"body": ""})
    assert response.status_code == 400
    assert Comment.objects.count() == 0

    response = send({})
    assert response.status_code == 400
    assert Comment.objects.count() == 0


def test_comment_create_for_anonymous_user(api_client, test_post):
    response = api_client.post(
        reverse("comment-list", kwargs={"slug": test_post.slug}),
        data={"body": "First Comment"},
    )
    assert response.status_code == 403
    assert response.data["detail"] == "Authentication credentials were not provided."
    assert Comment.objects.count() == 0


def test_comment_retrieve(api_client, test_user, test_post):
    comment = Comment.objects.create(
        user=test_user, post=test_post, body="First Comment"
    )
    response = api_client.get(reverse("comment-detail", kwargs={"pk": comment.pk}))
    assert response.status_code == 200
    assert response.data["body"] == "First Comment"


def test_comment_list(api_client, test_user, post_factory):
    post1 = post_factory()
    comment1 = Comment.objects.create(user=test_user, post=post1, body="First Comment")

    post2 = post_factory()
    comment2 = Comment.objects.create(user=test_user, post=post2, body="Second Comment")

    response1 = api_client.get(reverse("comment-list", kwargs={"slug": post1.slug}))
    assert response1.status_code == 200
    assert len(response1.data["results"]) == 1
    assert response1.data["results"][0]["body"] == "First Comment"

    response2 = api_client.get(reverse("comment-list", kwargs={"slug": post2.slug}))
    assert response2.status_code == 200
    assert len(response2.data["results"]) == 1
    assert response2.data["results"][0]["body"] == "Second Comment"

    assert list(post1.comment_set.all()) == [comment1]
    assert list(post2.comment_set.all()) == [comment2]

    response3 = api_client.get("api/comments/")
    assert response3.status_code == 404


def test_comment_sort_by_relevance(
    api_client, post_factory, comment_factory, comment_like_factory
):
    post = post_factory()
    comment1 = comment_factory(post=post, body="Comment with 0 likes.")

    comment2 = comment_factory(post=post, body="Comment with 1 likes.")
    comment_like_factory(comment=comment2)

    comment3 = comment_factory(post=post, body="Comment with 2 likes(0).")
    comment_like_factory(comment=comment3)
    comment_like_factory(comment=comment3)

    comment4 = comment_factory(post=post, body="Comment with 2 likes(1).")
    comment_like_factory(comment=comment4)
    comment_like_factory(comment=comment4)

    assert comment1.liked.count() == 0
    assert comment2.liked.count() == 1
    assert comment3.liked.count() == 2
    assert comment4.liked.count() == 2

    assert Comment.objects.count() == 4

    response = api_client.get(reverse("comment-list", kwargs={"slug": post.slug}))
    assert len(response.data["results"]) == 4
    assert response.data["results"][0]["body"] == "Comment with 2 likes(0)."
    assert response.data["results"][1]["body"] == "Comment with 2 likes(1)."
    assert response.data["results"][2]["body"] == "Comment with 1 likes."
    assert response.data["results"][3]["body"] == "Comment with 0 likes."


def test_comment_sort_by_newest(
    api_client, post_factory, comment_factory, comment_like_factory
):
    post = post_factory()
    comment1 = comment_factory(post=post, body="Comment with 0 likes.")

    comment2 = comment_factory(post=post, body="Comment with 1 likes.")
    comment_like_factory(comment=comment2)

    comment3 = comment_factory(post=post, body="Comment with 2 likes.")
    comment_like_factory(comment=comment3)
    comment_like_factory(comment=comment3)

    assert comment1.liked.count() == 0
    assert comment2.liked.count() == 1
    assert comment3.liked.count() == 2

    base_url = reverse("comment-list", kwargs={"slug": post.slug})
    response = api_client.get(f"{base_url}?newest=1")

    assert len(response.data["results"]) == 3
    assert response.data["results"][0]["body"] == "Comment with 0 likes."
    assert response.data["results"][1]["body"] == "Comment with 1 likes."
    assert response.data["results"][2]["body"] == "Comment with 2 likes."


def test_comment_update(api_client, test_auth_user, test_post):
    comment = Comment.objects.create(
        user=test_auth_user, post=test_post, body="First Comment"
    )

    response = api_client.patch(
        reverse("comment-detail", kwargs={"pk": comment.pk}),
        data={"body": "Patch First Comment"},
    )
    assert response.status_code == 200
    assert response.data["body"] == "Patch First Comment"

    comment_qs = Comment.objects.all()
    assert comment_qs.count() == 1
    assert comment_qs.first().body == "Patch First Comment"
    assert comment_qs.first().updated is not None
    assert comment_qs.first().user == test_auth_user
    assert comment_qs.first().post == test_post


def test_comment_put_404(api_client, test_auth_user, test_post):
    comment = Comment.objects.create(
        user=test_auth_user, post=test_post, body="First Comment"
    )

    response = api_client.put(
        reverse("comment-detail", kwargs={"pk": comment.pk}),
        data={"body": "Put First Comment"},
    )
    assert response.status_code == 405
    assert response.json()["detail"] == 'Method "PUT" not allowed.'

    comment_qs = Comment.objects.all()
    assert comment_qs.count() == 1
    assert comment_qs.first().body == "First Comment"
    assert comment_qs.first().updated is None
    assert comment_qs.first().user == test_auth_user
    assert comment_qs.first().post == test_post


def test_comment_update_for_non_owner(
    api_client, django_user_model, test_user, test_post
):
    comment = Comment.objects.create(
        user=test_user, post=test_post, body="First Comment"
    )

    another_user = django_user_model.objects.create(
        username="another_test_username", password="test_password"
    )
    api_client.force_authenticate(user=another_user)

    response = api_client.patch(
        reverse("comment-detail", kwargs={"pk": comment.pk}),
        data={"body": "Patch First Comment"},
    )
    assert response.status_code == 403
    assert (
        response.data["detail"] == "You do not have permission to perform this action."
    )

    comment_qs = Comment.objects.all()
    assert comment_qs.count() == 1
    assert comment_qs.first().body == "First Comment"
    assert comment_qs.first().updated is None


def test_comment_update_for_anonymous_user(api_client, test_user, test_post):
    comment = Comment.objects.create(
        user=test_user, post=test_post, body="First Comment"
    )
    response = api_client.patch(
        reverse("comment-detail", kwargs={"pk": comment.pk}),
        data={"body": "Patch First Comment"},
    )
    assert response.status_code == 403

    assert response.data["detail"] == "Authentication credentials were not provided."

    comment_qs = Comment.objects.all()
    assert comment_qs.count() == 1
    assert comment_qs.first().body == "First Comment"
    assert comment_qs.first().updated is None


def test_comment_delete(api_client, test_auth_user, test_post):
    comment = Comment.objects.create(
        user=test_auth_user, post=test_post, body="First Comment"
    )
    response = api_client.delete(reverse("comment-detail", kwargs={"pk": comment.pk}))
    assert response.status_code == 204
    assert response.data is None
    assert Comment.objects.count() == 0


def test_comment_delete_for_non_owner(
    api_client, test_user, django_user_model, test_post
):
    comment = Comment.objects.create(
        user=test_user, post=test_post, body="First Comment"
    )

    another_user = django_user_model.objects.create(
        username="another_test_username", password="test_password"
    )
    api_client.force_authenticate(another_user)

    response = api_client.delete(reverse("comment-detail", kwargs={"pk": comment.pk}))
    assert response.status_code == 403
    assert (
        response.data["detail"] == "You do not have permission to perform this action."
    )

    comment_qs = Comment.objects.all()
    assert comment_qs.count() == 1
    assert comment_qs.first().body == "First Comment"
    assert comment_qs.first().updated is None


def test_comment_delete_for_anonymous_user(api_client, test_user, test_post):
    comment = Comment.objects.create(
        user=test_user, post=test_post, body="First Comment"
    )

    response = api_client.delete(reverse("comment-detail", kwargs={"pk": comment.pk}))
    assert response.status_code == 403
    assert response.data["detail"] == "Authentication credentials were not provided."

    comment_qs = Comment.objects.all()
    assert comment_qs.count() == 1
    assert comment_qs.first().body == "First Comment"
    assert comment_qs.first().updated is None


def test_comment_like(api_client, test_comment, test_auth_user):
    assert test_auth_user not in test_comment.liked.all()

    def send():
        response = api_client.post(
            reverse("comment-toggle-like", kwargs={"pk": test_comment.pk}),
            data={"like": True},
        )
        assert response.status_code == 201
        assert response.data["comment"] == test_comment.pk
        assert response.data["likes"] == 1
        assert response.data["is_liked"] is True

        comment_like_qs = CommentLike.objects.all()
        assert comment_like_qs.count() == 1
        assert comment_like_qs.first().user == test_auth_user
        assert comment_like_qs.first().comment == test_comment
        assert test_auth_user in test_comment.liked.all()

    send()
    send()  # test for idempotency


def test_comment_like_invalid_payload(api_client, test_auth_user, test_comment):
    send = lambda input: api_client.post(
        reverse("comment-toggle-like", kwargs={"pk": test_comment.pk}), data=input,
    )

    response = send({"like": ""})
    assert response.status_code == 400
    assert CommentLike.objects.count() == 0

    response = send({"like": 34})
    assert response.status_code == 400
    assert CommentLike.objects.count() == 0


def test_comment_unlike(api_client, test_auth_user, test_comment):
    CommentLike.objects.create(user=test_auth_user, comment=test_comment)
    assert CommentLike.objects.count() == 1
    assert test_auth_user in test_comment.liked.all()

    def send():
        response = api_client.post(
            reverse("comment-toggle-like", kwargs={"pk": test_comment.pk}),
            data={"like": False},
        )

        assert response.status_code == 201

        response_json = response.json()
        assert response_json["comment"] == test_comment.pk
        assert response_json["likes"] == 0
        assert response_json["is_liked"] is False

        assert CommentLike.objects.count() == 0
        assert test_auth_user not in test_comment.liked.all()

    send()
    send()  # test for idempotency


def test_comment_unlike_invalid_payload(api_client, test_auth_user, test_comment):
    CommentLike.objects.create(user=test_auth_user, comment=test_comment)
    assert CommentLike.objects.count() == 1
    assert test_auth_user in test_comment.liked.all()

    send = lambda input: api_client.post(
        reverse("comment-toggle-like", kwargs={"pk": test_comment.pk}), data=input,
    )

    response = send({"like": ""})
    assert response.status_code == 400
    assert CommentLike.objects.count() == 1

    response = send({"like": 34})
    assert response.status_code == 400
    assert CommentLike.objects.count() == 1


def test_comment_like_for_anonymous_user(api_client, test_comment):
    assert CommentLike.objects.count() == 0

    response = api_client.post(
        reverse("comment-toggle-like", kwargs={"pk": test_comment.pk}),
        data={"like": True},
    )

    assert response.status_code == 403
    assert response.data["detail"] == "Authentication credentials were not provided."

    assert CommentLike.objects.count() == 0


def test_comment_unlike_for_anonymous_user(api_client, test_comment, test_user):
    CommentLike.objects.create(user=test_user, comment=test_comment)
    assert CommentLike.objects.count() == 1

    response = api_client.post(
        reverse("comment-toggle-like", kwargs={"pk": test_comment.pk}),
        data={"like": False},
    )

    assert response.status_code == 403
    assert response.data["detail"] == "Authentication credentials were not provided."

    assert CommentLike.objects.count() == 1
