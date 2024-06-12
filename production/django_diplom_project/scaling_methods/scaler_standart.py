from sklearn.preprocessing import StandardScaler
import pandas as pd
import numpy as np
import random

np.random.seed(42)
random.seed(42)

def scaling_standart(data):

    df_std = StandardScaler().fit_transform(data)
    data = pd.DataFrame(df_std, index=data.index, columns=data.columns)

    return data