import pandas as pd
import random

random.seed(42)

def mean_fill(df):
    col_missing = df.loc[:, df.isna().sum() > 0]

    df_mean_fill = df.copy()

    for i in col_missing:
        df_mean_fill[i] = df[i].fillna(df[i].mean())

    return df_mean_fill


