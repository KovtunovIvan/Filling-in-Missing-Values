from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import GenericAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
import json
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from rest_framework.decorators import api_view, permission_classes
from .forms import ProjectForm
from .models import Project, Visualization
from .serializers import ProjectSerializer
from django.http import HttpResponse
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

from .serializers import (
    LoginSerializer, RegistrationSerializer, UserSerializer
)

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

    def post(self,request):
        reqdata = request.data['data']
        userID = reqdata['id']
        print(userID)
        if userID:
            user = User.objects.get_user(userID)
            serializer = UserSerializer(user)
            data = serializer.data
            print(data)
        else: 
            data = {
                "user": 'no user found' 
            }
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
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def list_projects(request):
    projects = Project.objects.all()
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def get_project(request, project_id):
    try:
        project = Project.objects.get(pk=project_id)
        serializer = ProjectSerializer(project)
        data = serializer.data
        # Добавляем ссылки на загруженный и обработанный файлы
        data["original_csv_file_url"] = project.original_csv_file.url if project.original_csv_file else None
        data["processed_csv_file_url"] = project.processed_csv_file.url if project.processed_csv_file else None
        # Получаем только имена файлов без путей к директориям
        data["original_csv_file_name"] = os.path.basename(project.original_csv_file.name) if project.original_csv_file else None
        data["processed_csv_file_name"] = os.path.basename(project.processed_csv_file.name) if project.processed_csv_file else None
        return Response(data, status=status.HTTP_200_OK)
    except Project.DoesNotExist:
        return Response({"detail": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

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

@api_view(['POST'])
@permission_classes([IsAuthenticated])  
def upload_file(request):
    if request.method == 'POST':
        if 'file' not in request.FILES:
            return Response({'success': False, 'message': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_file = request.FILES['file']
        
        # Получаем базовое имя файла (без расширения)
        base_name, ext = os.path.splitext(uploaded_file.name)
        
        # Если имя файла уже содержит скобки и номер внутри, увеличиваем номер
        if re.match(r"^(.*)\s\((\d+)\)$", base_name):
            match = re.match(r"^(.*)\s\((\d+)\)$", base_name)
            base_name = match.group(1)
            existing_projects_count = int(match.group(2))
        else:
            existing_projects_count = Project.objects.filter(title__startswith=base_name).count()

        # Создаем уникальное имя проекта с номером
        title = f"{base_name} ({existing_projects_count + 1})"

        # Создаем проект и сохраняем файл
        project = Project.objects.create(title=title, user=request.user)
        project.original_csv_file = uploaded_file
        project.original_csv_file.name = f'{title}.csv'
        project.save()
        print(title)

        return Response({'success': True, 'message': 'Project created successfully!'}, status=status.HTTP_201_CREATED)



@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def process_data(request, project_id, method_fill_id, method_scaling_id):
    # Получаем объект проекта по его идентификатору
    project = Project.objects.get(pk=project_id)

    title = project.title

    # Получаем файл CSV из объекта проекта
    original_csv_file = project.original_csv_file

    # Считываем файл CSV в DataFrame с помощью pandas
    df = pd.read_csv(original_csv_file)

    df_encoding = data_encoding(df)

    all_methods_names = ['mean_fill', 'median_fill', 'min_fill', 'max_fill', 'interpolate_fill', 
              'linreg_imputer', 'KNN_fill', 'DecisionTree_imputer',
              'RandomForest_imputer', 'SVM_imputer', 'XGBRegressor_imputer', 'CatBoostRegressor_imputer']
    
    all_methods = [mean_fill(df_encoding), median_fill(df_encoding), min_fill(df_encoding), max_fill(df_encoding), interpolate_fill(df_encoding), 
              linreg_imputer(df_encoding), KNN_fill(df_encoding), DecisionTree_imputer(df_encoding),
              RandomForest_imputer(df_encoding), SVM_imputer(df_encoding), XGBRegressor_imputer(df_encoding), CatBoostRegressor_imputer(df_encoding)]

    filled_df = all_methods[method_fill_id]

    if method_scaling_id == 'standart':
        scale_df = scaling_standart(filled_df)
    elif method_scaling_id == 'normalize':
        scale_df = normalization_scale(filled_df)

    # Создаем новый файл CSV с заполненными значениями
    result_df = scale_df.to_csv(index=False)

    # Создаем временный объект BytesIO для сохранения данных в памяти
    buffer = BytesIO()

    # Записываем данные CSV в объект BytesIO
    buffer.write(result_df.encode())

    # Сохраняем обработанный файл в объекте проекта
    project.processed_csv_file.save(f'{title}_{all_methods_names[method_fill_id]}.csv', buffer)

    # Возвращаем созданный файл в ответе
    response = HttpResponse(result_df, content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename=f"{title}_{all_methods_names[method_fill_id]}.csv"'
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def correlation_matrix_view(request, project_id):
    try:
        project = Project.objects.get(pk=project_id)
        user_id = request.user.id
        
        # Проверяем, существует ли уже визуализация "Correlation Matrix" для этого проекта
        visualization = Visualization.objects.filter(
            project_id=project_id,
            visualization_type='Correlation Matrix'
        ).first()

        if visualization:
            # Если визуализация уже существует, возвращаем изображение из базы данных
            with open(visualization.image_path, 'rb') as f:
                image_data = f.read()
            return HttpResponse(image_data, content_type='image/png')
        
        # Если визуализации не существует, продолжаем создавать корреляционную матрицу
        file_path = project.processed_csv_file.path
        df = pd.read_csv(file_path)
        
        corr_matrix = df.corr()

        plt.figure(figsize=(10, 8))
        sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt=".2f", linewidths=.5)
        plt.title('Correlation Matrix')
        
        # Создаем папку для хранения графиков проекта, если она еще не существует
        plot_dir = os.path.join('project_plots', 'correlation_matrices', str(user_id), str(project_id))
        os.makedirs(plot_dir, exist_ok=True)

        image_name = f"{os.path.splitext(os.path.basename(file_path))[0]}.png"
        image_path = os.path.join(plot_dir, image_name)

        plt.savefig(image_path)

        # Сохраняем информацию о визуализации в базе данных
        Visualization.objects.create(
            project_id=project_id,
            visualization_type='Correlation Matrix',
            image_path=image_path
        )

        plt.clf()

        with open(image_path, 'rb') as f:
            image_data = f.read()
        return HttpResponse(image_data, content_type='image/png')

    except Project.DoesNotExist:

        return HttpResponse("Project not found", status=404)