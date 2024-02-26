# from django.contrib import admin
from django.urls import path
from .views import (
    LoginAPIView,
    RegistrationAPIView,
    UserLogoutAPIView,
    UserAPIView,
    IdGetUser,
)
from rest_framework_simplejwt.views import TokenRefreshView

app_name = "home"

urlpatterns = [
    path("register/", RegistrationAPIView.as_view(), name="create-user"),
    path("login/", LoginAPIView.as_view(), name="login-user"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("logout/", UserLogoutAPIView.as_view(), name="logout-user"),
    path("user/", UserAPIView.as_view(), name="user-info"),
    path("idUserCheck/", IdGetUser.as_view(), name="get-user-by-token"),
]
