import random
import numpy as np
random.seed(42)
np.random.seed(42)

def min_fill(df):
    col_missing = df.loc[:, df.isna().sum() > 0]

    df_min_fill = df.copy()

    for i in col_missing:
        df_min_fill[i] = df[i].fillna(df[i].min())

    return df_min_fill


