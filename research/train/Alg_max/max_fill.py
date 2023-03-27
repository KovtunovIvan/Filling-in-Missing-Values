def max_fill(df):
    col_missing = df.loc[:, df.isna().sum() > 0]

    df_max_fill = df.copy()

    for i in col_missing:
        df_max_fill[i] = df[i].fillna(df[i].max())

    return df_max_fill


