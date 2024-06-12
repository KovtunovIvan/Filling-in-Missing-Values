import random
import numpy as np
random.seed(42)
np.random.seed(42)

def interpolate_fill(df):

    df_interpolate_fill = df.copy()

    df_interpolate_fill = df.interpolate(limit_direction = 'both')

    return df_interpolate_fill