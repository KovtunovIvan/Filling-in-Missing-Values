from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from .models import Project


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'middle_name', 'phone_number']


class RegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", 'email', 'password']
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
    class Meta:
        model = Project
        fields = ['id', 'title','user']
