from sklearn.preprocessing import StandardScaler
import pandas as pd
import numpy as np

def data_scaling(data):

    df_std = StandardScaler().fit_transform(data)
    data = pd.DataFrame(df_std, index=data.index, columns=data.columns)

    return data


