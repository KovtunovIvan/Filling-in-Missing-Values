from sklearn.impute import KNNImputer
import pandas as pd
import random

random.seed(42)

def KNNImputer_fill(df):

    df_KNNImputer_fill = df.copy()

    knn_imputer = KNNImputer()

    df_KNNImputer_fill = pd.DataFrame(knn_imputer.fit_transform(df_KNNImputer_fill), columns=df_KNNImputer_fill.columns)
    df_KNNImputer_fill.isna().sum()

    return df_KNNImputer_fill


