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
from .models import Project
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
import pandas as pd
import random
from io import StringIO
import numpy as np
from io import BytesIO
from .encoder import data_encoding

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
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])  
def create_project(request):
    if request.method == 'POST':
        form = ProjectForm(request.POST, request.FILES)
        if form.is_valid():
            project = form.save(commit=False)
            project.user = request.user
            project.save()
            return Response({'success': True, 'message': 'Project created successfully!'}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'message': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def list_projects(request):
    projects = Project.objects.all()
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def fill_missing_values(request, project_id, method_id):
    # Получаем объект проекта по его идентификатору
    project = Project.objects.get(pk=project_id)

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

    filled_df = all_methods[method_id]

    # Создаем новый файл CSV с заполненными значениями
    filled_csv = filled_df.to_csv(index=False)

    # Создаем временный объект BytesIO для сохранения данных в памяти
    buffer = BytesIO()

    # Записываем данные CSV в объект BytesIO
    buffer.write(filled_csv.encode())

    # Сохраняем обработанный файл в объекте проекта
    project.processed_csv_file.save(f'processed_data_{all_methods_names[method_id]}.csv', buffer)

    # Возвращаем созданный файл в ответе
    response = HttpResponse(filled_csv, content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename=f"processed_data_{all_methods_names[method_id]}.csv"'
    return response