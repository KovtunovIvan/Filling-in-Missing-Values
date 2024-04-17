import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf.urls.static import static
import os

class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifier
    for authentication instead of usernames.
    """

    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError(_("Users must have an email address"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))
        return self.create_user(email, password, **extra_fields)

    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None


class User(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)

    def __str__(self):
        return f"hello"

class Project(models.Model):
    title = models.CharField(max_length=100)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    original_csv_file = models.FileField(upload_to=settings.ORIGINAL_CSV_FILES_DIR, default='', null=True, blank=True) 
    processed_csv_file = models.FileField(upload_to=settings.PROCESSED_CSV_FILES_DIR, default='', null=True, blank=True)

    def __str__(self):
        return self.title

class Visualization(models.Model):
    PROJECT_TYPES = [
        ('Correlation Matrix', 'Correlation Matrix'),
        ('Normal Distribution', 'Normal Distribution'),
        ('Box Plot', 'Box Plot')
    ]

    project_id = models.IntegerField()
    visualization_type = models.CharField(max_length=50, choices=PROJECT_TYPES)
    image_path = models.CharField(max_length=255)
    feature_name = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Visualization for Project {self.project_id} ({self.visualization_type})"