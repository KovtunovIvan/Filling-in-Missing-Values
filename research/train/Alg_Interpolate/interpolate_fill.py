def interpolate_fill(df):

    df_interpolate_fill = df.copy()

    df_interpolate_fill = df.interpolate()

    return df_interpolate_fill


