def interpolate_fill(df):


    df_interpolate_fill = df.copy()

    df_interpolate_fill = df.interpolate(limit_direction = 'both')

    return df_interpolate_fill


