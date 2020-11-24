from django.contrib import admin

from posts.models import Post, Comment, CommentLike

admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(CommentLike)
