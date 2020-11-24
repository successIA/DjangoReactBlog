from ..models import Post


def test_post_create_slug(test_user):
    post = Post.objects.create(user=test_user, title="Post Title", body="Post Body")
    assert post.slug == "post-title"


def test_post_update_slug(test_user):
    post = Post.objects.create(user=test_user, title="Post Title", body="Post Body")
    assert post.slug == "post-title"

    post.title = "Update Post Title"
    post.save()
    assert post.slug == "update-post-title"


def test_post_update_updated_field(test_user):
    post = Post.objects.create(user=test_user, title="Post Title", body="Post Body")
    assert post.slug == "post-title"
    assert post.updated is None

    post.title = "Update Post Title"
    post.save()
    assert post.updated is not None
