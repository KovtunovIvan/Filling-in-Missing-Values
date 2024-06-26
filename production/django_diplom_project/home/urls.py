# from django.contrib import admin
from . import views
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import path, re_path
from rest_framework import permissions

from .views import (
    LoginAPIView,
    RegistrationAPIView,
    UserLogoutAPIView,
    UserAPIView,
    IdGetUser,
)
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

schema_view = get_schema_view(
    openapi.Info(
        title="API MedMindes",
        default_version="v1",
        description="APIs used in the MedMindes web application",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@local.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

app_name = "home"

urlpatterns = [
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("register/", RegistrationAPIView.as_view(), name="create-user"),
    path("login/", LoginAPIView.as_view(), name="login-user"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("logout/", UserLogoutAPIView.as_view(), name="logout-user"),
    path("user/", UserAPIView.as_view(), name="user-info"),
    path("idUserCheck/", IdGetUser.as_view(), name="get-user-by-token"),
    path("AllProjects/", views.list_projects, name="list-projects"),
    path("get-project/<int:project_id>/", views.get_project, name="get-project"),
    path(
        "process-data/<int:project_id>/<int:method_fill_id>/<str:method_scaling_id>/",
        views.process_data,
        name="process-data",
    ),
    path("upload-file/", views.upload_file, name="upload-file"),
    path(
        "correlation-matrix/<int:project_id>/<str:file_type>/",
        views.correlation_matrix_view,
        name="correlation-matrix",
    ),
    path(
        "normal-distribution/<int:project_id>/<str:feature_name>/<str:file_type>/",
        views.normal_distribution_view,
        name="normal_distribution",
    ),
    path(
        "box-plot/<int:project_id>/<str:feature_name>/<str:file_type>/",
        views.box_plot_view,
        name="box_plot_view",
    ),
    path("upload-avatar/", views.upload_avatar, name="upload_avatar"),
    path("delete-avatar/", views.delete_avatar, name="delete_avatar"),
    path(
        "change-password/",
        views.change_password,
        name="change_password",
    ),
    path(
        "update-profile/",
        views.update_profile,
        name="update_profile",
    ),
    path(
        "delete-profile/",
        views.delete_user_profile,
        name="delete-user-profile",
    ),
    path("reset_password/", views.reset_password, name="reset_password"),
    path("contact/", views.contact_view, name="contact"),
    path(
        "download/<int:project_id>/",
        views.download_processed_file,
        name="download_processed_file",
    ),
    path(
        "check-task-status/<int:project_id>/",
        views.check_task_status,
        name="check_task_status",
    ),
    path(
        "delete-project/<int:project_id>/", views.delete_project, name="delete_project"
    ),
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
]

urlpatterns += static(
    settings.ORIGINAL_CSV_FILES_DIR, document_root=settings.ORIGINAL_CSV_FILES_DIR
)
urlpatterns += static(
    settings.PROCESSED_CSV_FILES_DIR, document_root=settings.PROCESSED_CSV_FILES_DIR
)
urlpatterns += static(settings.AVATARS_DIR, document_root=settings.AVATARS_DIR)
