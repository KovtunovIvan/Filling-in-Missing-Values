import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import matplotlib.pyplot as plt

def visualization_results_metrics(df_result):
    dict_graf = df_result.to_dict()
    plt.figure(figsize=(10, 6))

    for metric, methods in dict_graf.items():
        x = range(len(methods))
        y = list(methods.values())
        plt.plot(x, y, label=metric)

    plt.xticks(x, list(methods.keys()), rotation=90)
    plt.legend()
    plt.show()
