import random

random.seed(42)

def median_fill(df):
    col_missing = df.loc[:, df.isna().sum() > 0]

    df_median_fill = df.copy()

    for i in col_missing:
        df_median_fill[i] = df[i].fillna(df[i].median())

    return df_median_fill


