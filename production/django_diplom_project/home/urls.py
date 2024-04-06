# from django.contrib import admin
from . import views
from django.urls import path
from .views import (
    LoginAPIView,
    RegistrationAPIView,
    UserLogoutAPIView,
    UserAPIView,
    IdGetUser,
)
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

app_name = "home"

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("register/", RegistrationAPIView.as_view(), name="create-user"),
    path("login/", LoginAPIView.as_view(), name="login-user"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("logout/", UserLogoutAPIView.as_view(), name="logout-user"),
    path("user/", UserAPIView.as_view(), name="user-info"),
    path("idUserCheck/", IdGetUser.as_view(), name="get-user-by-token"),
    path('AllProjects/', views.list_projects, name='list-projects'),
    path('Project/', views.create_project, name='create-project'),
    path('process-data/<int:project_id>/<int:method_fill_id>/<str:method_scaling_id>/', views.process_data, name='process-data'),
]
