import pandas as pd
import numpy as np
import random
from sklearn.preprocessing import MinMaxScaler

def normalization_scale(data):
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data)
    scaled_df = pd.DataFrame(scaled_data, columns=data.columns)
    return scaled_df
