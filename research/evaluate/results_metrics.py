import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import random

random.seed(42)

def generate_results_metrics(data, all_methods):
    mean_absolute = []
    mean_squared = []
    r2 = []
    for i in range(len(all_methods)):
        mean_absolute.append(mean_absolute_error(all_methods[i], data))
        mean_squared.append(mean_squared_error(all_methods[i], data))
        r2.append(r2_score(all_methods[i], data))

    result_all_metrics = {'Mean_absolute_error': mean_absolute,
                          'Mean_squared_error': mean_squared,
                          'r2_score': r2}

    df_result = pd.DataFrame(result_all_metrics,
                             index=['Mean', 'Median', 'Min', 'Max', 'Interpolate', 'LinearReg', 'KNNImputer', 'DecisionTree', 'RandomForest', 'SVM', 'XGBRegressor', 'CatBoostRegressor'])
    return df_result
