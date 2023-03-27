from sklearn.impute import KNNImputer
import pandas as pd

def KNNImputer_fill(df):

    df_KNNImputer_fill = df.copy()

    # используем те же параметры, что и раньше: пять "соседей" с одинаковыми весами
    knn_imputer = KNNImputer(n_neighbors=5, weights='uniform')

    df_KNNImputer_fill = pd.DataFrame(knn_imputer.fit_transform(df_KNNImputer_fill), columns=df_KNNImputer_fill.columns)
    df_KNNImputer_fill.isna().sum()

    return df_KNNImputer_fill


