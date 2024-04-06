import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _
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

    def __str__(self):
        return f"hello"

class Project(models.Model):
    title = models.CharField(max_length=100)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    original_csv_file = models.FileField(upload_to='original_csv_files/', default='', null=True, blank=True) 
    processed_csv_file = models.FileField(upload_to='processed_csv_files/', default='', null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.title:  # Проверяем, есть ли уже заголовок проекта
            # Получаем имя загруженного файла
            filename = os.path.basename(self.original_csv_file.name)
            base_name, ext = os.path.splitext(filename)
            title = base_name

            # Проверяем, есть ли уже проект с таким же названием файла
            existing_projects = Project.objects.filter(title=title)
            if existing_projects.exists():
                # Если есть, добавляем порядковый номер
                title = f"{base_name}_{existing_projects.count() + 1}"

            self.title = title

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title