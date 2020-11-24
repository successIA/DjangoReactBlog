from django.db import models
from django.conf import settings
from django.utils import timezone

from posts.utils import generate_unique_slug


class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=255, blank=True)
    body = models.TextField()
    published = models.BooleanField(default=True)
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.slug = generate_unique_slug(self)
        if self.pk:
            self.updated = timezone.now()
        super(Post, self).save(*args, **kwargs)


class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    body = models.TextField()
    liked = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through="CommentLike",
        related_name="liked_comments",
        blank=True,
    )
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.body[:255]


class CommentLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    created = models.DateTimeField(default=timezone.now)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "comment"], name="unique_comment_like"
            )
        ]
