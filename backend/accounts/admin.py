from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from accounts.models import User


class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "first_name", "last_name", "is_staff")
    list_filter = ("is_staff", "is_superuser", "is_active", "groups")


admin.site.register(User, CustomUserAdmin)
