import os
from celery import shared_task

from django_diplom_project import settings
from .models import Project
import pandas as pd
from io import BytesIO, StringIO
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
from .encoder import data_encoding
from django.http import FileResponse, HttpResponse


@shared_task
def process_large_data(project_id, method_fill_id, method_scaling_id):
    project = Project.objects.get(pk=project_id)
    title = project.title

    original_csv_file = project.original_csv_file

    df = pd.read_csv(original_csv_file)

    df_encoding = data_encoding(df)

    all_methods = [
        mean_fill,
        median_fill,
        min_fill,
        max_fill,
        interpolate_fill,
        linreg_imputer,
        KNN_fill,
        DecisionTree_imputer,
        RandomForest_imputer,
        SVM_imputer,
        XGBRegressor_imputer,
        CatBoostRegressor_imputer,
    ]

    scaling_methods_names = {
        "standart": "standart_scaling",
        "normalize": "normalization_scaling",
    }

    filled_df = all_methods[int(method_fill_id)](df_encoding)

    if method_scaling_id == "standart":
        scale_df = scaling_standart(filled_df)
    elif method_scaling_id == "normalize":
        scale_df = normalization_scale(filled_df)
    else:
        raise ValueError("Invalid scaling method id")

    result_df = scale_df.to_csv(index=False)

    buffer = BytesIO()

    buffer.write(result_df.encode())

    project.processed_csv_file.save(
        f"{title}_{all_methods[method_fill_id]}.csv", buffer
    )

    processed_file_path = project.processed_csv_file.path
    with open(processed_file_path, "w") as file:
        file.write(result_df)

    project.task_id = process_large_data.request.id
    project.save()

    return processed_file_path
