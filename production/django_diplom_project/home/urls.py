# from django.contrib import admin
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.urls import reverse

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
    path('get-project/<int:project_id>/', views.get_project, name='get-project'),
    path('process-data/<int:project_id>/<int:method_fill_id>/<str:method_scaling_id>/', views.process_data, name='process-data'),
    path('upload-file/', views.upload_file, name='upload-file'),
    #path('original-csv-file/<int:project_id>/', views.download_original_csv_file, name='original-csv-file-download'),
    #path('processed-csv-file/<int:project_id>/', views.download_processed_csv_file, name='processed-csv-file-download'),
    path('correlation-matrix/<int:project_id>/', views.correlation_matrix_view, name='correlation-matrix'),
    path('normal-distribution/<int:project_id>/<str:feature_name>/', views.normal_distribution_view, name='normal_distribution'),
    path('box-plot/<int:project_id>/<str:feature_name>/', views.box_plot_view, name='box_plot_view'),
    path('upload-avatar/', views.upload_avatar, name='upload_avatar'),
    path('delete-avatar/', views.delete_avatar, name='delete_avatar'),
    path('change-password/<str:old_password>/<str:new_password>/', views.change_password, name='change_password'),
    path('update-profile/<str:first_name>/<str:last_name>/<str:middle_name>/<str:phone_number>/', views.update_profile, name='update_profile'),
]

urlpatterns += static(settings.ORIGINAL_CSV_FILES_DIR, document_root=settings.ORIGINAL_CSV_FILES_DIR)
urlpatterns += static(settings.PROCESSED_CSV_FILES_DIR, document_root=settings.PROCESSED_CSV_FILES_DIR)
