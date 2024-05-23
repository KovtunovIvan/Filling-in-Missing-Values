from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from .models import Project
from celery.result import AsyncResult


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "middle_name",
            "phone_number",
            "avatar",
        ]

    def get_avatar(self, obj):
        if obj.avatar:
            return obj.avatar.url
        else:
            return None


class RegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):

        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


class ProjectSerializer(serializers.ModelSerializer):
    # Добавляем дополнительное поле для статуса проекта
    status = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "user",
            "status",
            "task_id",
        ]

    def get_status(self, obj):
        task_id = obj.task_id

        if not task_id:
            return "No task associated with this project."

        result = AsyncResult(task_id)

        if result.ready():
            if result.successful():
                return "SUCCESS"
            else:
                return "FAILURE"
        else:
            return "PENDING"
