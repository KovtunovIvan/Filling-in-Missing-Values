from wsgiref.types import FileWrapper
from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import GenericAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
import json
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from rest_framework.decorators import api_view, permission_classes
from .forms import ProjectForm
from .models import Project, Visualization
from .serializers import ProjectSerializer
from django.http import HttpResponse, HttpResponseBadRequest
from .models import Project
from fill_methods.CatBoostRegressor_fill import CatBoostRegressor_imputer
from fill_methods.DecisionTreeRegressor_fill import DecisionTree_imputer
from fill_methods.interpolate_fill import interpolate_fill
from fill_methods.KNNImputer_fill import KNN_fill
from fill_methods.LinearRegression_fill import linreg_imputer
from fill_methods.max_fill import max_fill
from fill_methods.mean_fill import mean_fill
from fill_methods.median_fill import median_fill
from fill_methods.min_fill import min_fill
from fill_methods.RandomForestRegressor_fill import RandomForest_imputer
from fill_methods.SVR_fill import SVM_imputer
from fill_methods.XGBRegressor_fill import XGBRegressor_imputer
from scaling_methods.scaler_standart import scaling_standart
from scaling_methods.scaler_normalize import normalization_scale
import pandas as pd
import random
from io import StringIO
import numpy as np
from io import BytesIO
from .encoder import data_encoding
from django.db.models import Count
import re
import os
from django.http import HttpResponse, Http404, FileResponse
from django.shortcuts import get_object_or_404
from django.urls import reverse
from rest_framework_simplejwt.tokens import AccessToken
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import io
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Token
from .models import User
from django.views.decorators.csrf import csrf_exempt
from .serializers import LoginSerializer, RegistrationSerializer, UserSerializer
from django.http import StreamingHttpResponse
import time
from .tasks import process_large_data
from celery.result import AsyncResult


class RegistrationAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh": str(token), "access": str(token.access_token)}
        # headers = {"Authorization": f'Bearer {str(token.access_token)}'}
        return Response(data, status=status.HTTP_201_CREATED)


class LoginAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        serializer = UserSerializer(user)
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh": str(token), "access": str(token.access_token)}

        return Response(data, status=status.HTTP_200_OK)


class IdGetUser(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def post(self, request):
        reqdata = request.data["data"]
        userID = reqdata["id"]
        print(userID)
        if userID:
            user = User.objects.get_user(userID)
            serializer = UserSerializer(user)
            data = serializer.data
            print(data)
        else:
            data = {"user": "no user found"}
        return Response(data, status=status.HTTP_200_OK)


class UserLogoutAPIView(GenericAPIView):

    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data["refresh"]
            print(refresh_token)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserAPIView(RetrieveUpdateAPIView):
    """
    Get, Update user information
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_projects(request):
    user = request.user  # Получаем текущего авторизованного пользователя
    projects = Project.objects.filter(user=user)  # Фильтруем проекты по пользователю
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_project(request, project_id):
    try:
        project = Project.objects.get(pk=project_id)
        serializer = ProjectSerializer(project)
        data = serializer.data
        # Добавляем ссылки на загруженный и обработанный файлы
        data["original_csv_file_url"] = (
            project.original_csv_file.url if project.original_csv_file else None
        )
        data["processed_csv_file_url"] = (
            project.processed_csv_file.url if project.processed_csv_file else None
        )
        # Получаем только имена файлов без путей к директориям
        data["original_csv_file_name"] = (
            os.path.basename(project.original_csv_file.name)
            if project.original_csv_file
            else None
        )
        data["processed_csv_file_name"] = (
            os.path.basename(project.processed_csv_file.name)
            if project.processed_csv_file
            else None
        )
        # Проверяем наличие файла на сервере и путь к файлу в базе данных
        processed_data_path = None
        if project.processed_csv_file and project.processed_csv_file.name:
            processed_data_path = project.processed_csv_file.path
        if processed_data_path and os.path.exists(processed_data_path):
            # Если файл существует на сервере, читаем его и получаем список признаков
            try:
                df = pd.read_csv(processed_data_path)
                features = list(df.columns)
            except FileNotFoundError:
                features = None
        else:
            features = None
        data["features"] = features
        return Response(data, status=status.HTTP_200_OK)
    except Project.DoesNotExist:
        return Response(
            {"detail": "Project not found"}, status=status.HTTP_404_NOT_FOUND
        )


"""@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def get_project(request, project_id):
    try:
        project = Project.objects.get(pk=project_id)
        if not project:
            return Response({"detail": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        
        original_csv_file_url = f'http://127.0.0.1:8000/original-csv-file/{project_id}/'
        processed_csv_file_url = f'http://127.0.0.1:8000/processed-csv-file/{project_id}/'
        
        data = {
            "id": project.id,
            "title": project.title,
            "user": project.user.id,
            "original_csv_file_url": original_csv_file_url if project.original_csv_file else None,
            "processed_csv_file_url": processed_csv_file_url if project.processed_csv_file else None,
            "original_csv_file_name": os.path.basename(project.original_csv_file.name) if project.original_csv_file else None,
            "processed_csv_file_name": os.path.basename(project.processed_csv_file.name) if project.processed_csv_file else None
        }
        
        return Response(data, status=status.HTTP_200_OK)
    except Project.DoesNotExist:
        return Response({"detail": "Project not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def download_original_csv_file(request, project_id):
    try:
        project = Project.objects.get(pk=project_id)
        if project.original_csv_file:
            response = HttpResponse(project.original_csv_file, content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="{project.original_csv_file.name}"'
            return response
        else:
            return HttpResponse("Original CSV file not found", status=404)
    except Project.DoesNotExist:
        return HttpResponse("Project not found", status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def download_processed_csv_file(request, project_id):
    try:
        project = Project.objects.get(pk=project_id)
        if project.processed_csv_file:
            response = HttpResponse(project.processed_csv_file, content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="{project.processed_csv_file.name}"'
            return response
        else:
            return HttpResponse("Processed CSV file not found", status=404)
    except Project.DoesNotExist:
        return HttpResponse("Project not found", status=404)"""


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_file(request):
    if request.method == "POST":
        if "file" not in request.FILES:
            return Response(
                {"success": False, "message": "No file uploaded"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        uploaded_file = request.FILES["file"]

        # Получаем базовое имя файла (без расширения)
        base_name, ext = os.path.splitext(uploaded_file.name)

        # Если имя файла уже содержит скобки и номер внутри, увеличиваем номер
        if re.match(r"^(.*)\s\((\d+)\)$", base_name):
            match = re.match(r"^(.*)\s\((\d+)\)$", base_name)
            base_name = match.group(1)
            existing_projects_count = int(match.group(2))
        else:
            existing_projects_count = Project.objects.filter(
                title__startswith=base_name
            ).count()

        # Создаем уникальное имя проекта с номером
        title = f"{base_name} ({existing_projects_count + 1})"

        # Создаем проект и сохраняем файл
        project = Project.objects.create(title=title, user=request.user)
        project.original_csv_file = uploaded_file
        project.original_csv_file.name = f"{title}.csv"
        project.save()
        print(title)

        return Response(
            {"success": True, "message": "Project created successfully!"},
            status=status.HTTP_201_CREATED,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def process_data(request, project_id, method_fill_id, method_scaling_id):
    task = process_large_data.delay(project_id, method_fill_id, method_scaling_id)
    task_id = task.id

    return Response({"task_id": task_id}, status=202)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def download_processed_file(request, project_id):
    project = get_object_or_404(Project, pk=project_id)
    processed_file = project.processed_csv_file

    # Открываем файл и возвращаем его как HttpResponse
    with open(processed_file.path, "rb") as file:
        file_content = file.read()

    response = HttpResponse(
        file_content,
        content_type="text/csv",  # Укажите соответствующий MIME-тип для вашего файла
    )
    response["Content-Disposition"] = (
        f'attachment; filename="{project.processed_csv_file.name}"'
    )

    return response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_task_status(request, task_id):
    result = AsyncResult(task_id)

    if result.ready():
        if result.successful():
            return JsonResponse({"status": "SUCCESS", "file_url": result.get()})
        else:
            return JsonResponse({"status": "FAILURE", "message": str(result.result)})
    else:
        return JsonResponse({"status": "PENDING"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def correlation_matrix_view(request, project_id):
    try:
        project = Project.objects.get(pk=project_id)
        user_id = request.user.id

        visualization = Visualization.objects.filter(
            project_id=project_id, visualization_type="Correlation Matrix"
        ).first()

        if visualization:
            with open(visualization.image_path, "rb") as f:
                image_data = f.read()
            return HttpResponse(image_data, content_type="image/png")

        file_path = project.processed_csv_file.path
        df = pd.read_csv(file_path)

        corr_matrix = df.corr()

        plt.figure(figsize=(10, 8))
        sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", fmt=".2f", linewidths=0.5)
        plt.title("Correlation Matrix")

        plot_dir = os.path.join(
            "project_plots", "correlation_matrices", str(user_id), str(project_id)
        )
        os.makedirs(plot_dir, exist_ok=True)

        image_name = f"{os.path.splitext(os.path.basename(file_path))[0]}.png"
        image_path = os.path.join(plot_dir, image_name)

        plt.savefig(image_path)

        # Сохраняем информацию о визуализации в базе данных
        Visualization.objects.create(
            project_id=project_id,
            visualization_type="Correlation Matrix",
            image_path=image_path,
        )

        plt.clf()

        with open(image_path, "rb") as f:
            image_data = f.read()
        return HttpResponse(image_data, content_type="image/png")

    except Project.DoesNotExist:

        return HttpResponse("Project not found", status=404)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def normal_distribution_view(request, project_id, feature_name):
    try:
        project = Project.objects.get(pk=project_id)
        user_id = request.user.id

        visualization = Visualization.objects.filter(
            project_id=project_id,
            feature_name=feature_name,
            visualization_type="Normal Distribution",
        ).first()

        if visualization:
            with open(visualization.image_path, "rb") as f:
                image_data = f.read()
            return HttpResponse(image_data, content_type="image/png")

        file_path = project.processed_csv_file.path
        df = pd.read_csv(file_path)

        feature_data = df[feature_name]

        plt.figure(figsize=(10, 8))
        sns.histplot(feature_data, kde=True, color="blue", bins=20)
        plt.title(f"Normal Distribution of {feature_name}")
        plt.xlabel(feature_name)
        plt.ylabel("Frequency")

        plot_dir = os.path.join(
            "project_plots", "normal_distributions", str(user_id), str(project_id)
        )
        os.makedirs(plot_dir, exist_ok=True)

        image_name = f"{feature_name}_normal_distribution.png"
        image_path = os.path.join(plot_dir, image_name)

        plt.savefig(image_path)

        # Сохраняем информацию о визуализации в базе данных
        Visualization.objects.create(
            project_id=project_id,
            feature_name=feature_name,
            visualization_type="Normal Distribution",
            image_path=image_path,
        )

        plt.clf()

        with open(image_path, "rb") as f:
            image_data = f.read()
        return HttpResponse(image_data, content_type="image/png")

    except Project.DoesNotExist:

        return HttpResponse("Project not found", status=404)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def box_plot_view(request, project_id, feature_name):
    try:
        project = Project.objects.get(pk=project_id)
        user_id = request.user.id

        visualization = Visualization.objects.filter(
            project_id=project_id,
            visualization_type="Box Plot",
            feature_name=feature_name,
        ).first()

        if visualization:
            with open(visualization.image_path, "rb") as f:
                image_data = f.read()
            return HttpResponse(image_data, content_type="image/png")

        file_path = project.processed_csv_file.path
        df = pd.read_csv(file_path)

        plt.figure(figsize=(10, 8))
        sns.boxplot(x=feature_name, data=df)
        plt.title(f"Box Plot for {feature_name}")

        plot_dir = os.path.join(
            "project_plots", "box_plots", str(user_id), str(project_id)
        )
        os.makedirs(plot_dir, exist_ok=True)

        image_name = f"{os.path.splitext(os.path.basename(file_path))[0]}_{feature_name}_box_plot.png"
        image_path = os.path.join(plot_dir, image_name)

        plt.savefig(image_path)

        Visualization.objects.create(
            project_id=project_id,
            visualization_type="Box Plot",
            feature_name=feature_name,
            image_path=image_path,
        )

        plt.clf()

        with open(image_path, "rb") as f:
            image_data = f.read()
        return HttpResponse(image_data, content_type="image/png")

    except Project.DoesNotExist:
        return HttpResponse("Project not found", status=404)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_avatar(request):
    if request.method == "POST" and request.FILES.get("avatar"):
        user = request.user
        user.avatar = request.FILES["avatar"]
        user.save()
        return Response({"message": "Avatar uploaded successfully"})
    else:
        return Response({"error": "No avatar file provided"}, status=400)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_avatar(request):
    user = request.user
    if user.avatar:
        user.avatar.delete()
        user.save()
        return Response({"message": "Avatar deleted successfully"})
    else:
        return Response({"error": "No avatar to delete"}, status=400)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def change_password(request, old_password, new_password):
    # Аутентифицируем пользователя
    user = request.user
    if not user.check_password(old_password):
        return Response({"error": "Invalid old password."}, status=400)

    # Устанавливаем новый пароль и сохраняем пользователя
    user.set_password(new_password)
    user.save()

    return Response({"message": "Password has been changed successfully."}, status=200)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request, first_name, last_name, middle_name, phone_number):
    user = request.user
    user.first_name = first_name
    user.last_name = last_name
    user.middle_name = middle_name
    user.phone_number = phone_number
    user.save()
    return Response({"message": "Profile updated successfully"}, status=200)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_user_profile(request, password):
    user = request.user
    if not user.check_password(password):
        return Response(
            {"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST
        )
    user.delete()
    return Response(
        {"message": "User profile and related data deleted successfully"},
        status=status.HTTP_200_OK,
    )


@csrf_exempt
def reset_password(request):
    if request.method == "POST":
        email = request.POST.get("email")
        try:
            user = User.objects.get(email=email)
            # Создание временного пароля
            temp_password = User.objects.make_random_password()
            user.set_password(temp_password)
            user.save()
            # Отправка временного пароля по электронной почте
            send_mail(
                "MedMindes. Сброс пароля",
                f"Мы получили запрос на сброс пароля для вашей учётной записи.\nЕсли вы делали такой запрос, воспользуйтесь паролем ниже. Если нет, то сообщите нам об этом в ответоном письме.\nВаш временный пароль: {temp_password}",
                "medmindes@mail.ru",
                [email],
                fail_silently=False,
            )
            return JsonResponse(
                {"message": "Временный пароль отправлен на вашу электронную почту."}
            )
        except User.DoesNotExist:
            return JsonResponse(
                {
                    "error": "Пользователь с таким адресом электронной почты не существует."
                }
            )


@csrf_exempt
def contact_view(request):
    if request.method == "POST":
        try:
            email = request.POST.get("email")
            last_name = request.POST.get("last_name")
            first_name = request.POST.get("first_name")
            middle_name = request.POST.get("middle_name")
            phone = request.POST.get("phone")
            company = request.POST.get("company")
            position = request.POST.get("position")
            message = request.POST.get("message")
            form_type = request.POST.get("form_type")

            if form_type == "feedback":
                subject = "Новое сообщение обратной связи"
            elif form_type == "presentation_order":
                subject = "Новый заказ презентации"
            else:
                subject = "Новое сообщение"
            message_body = f"""
            Фамилия: {middle_name}
            Имя: {first_name}
            Отчество: {last_name}
            Телефон: {phone}
            Почта: {email}
            Компания: {company}
            Должность: {position}
            Сообщение: {message}
            """
            from_email = "medmindes@mail.ru"
            recipient_list = ["medmindes@mail.ru"]

            send_mail(
                subject, message_body, from_email, recipient_list, fail_silently=False
            )
            return JsonResponse(
                {"status": "success", "message": "Сообщение отправлено!"}
            )
        except Exception as e:
            return JsonResponse(
                {"status": "error", "message": f"Ошибка при отправке: {e}"}
            )
    else:
        return JsonResponse({"status": "error", "message": "Используйте метод POST"})
