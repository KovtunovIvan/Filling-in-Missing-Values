from sklearn.preprocessing import LabelEncoder
import pandas as pd
import numpy as np
import random

np.random.seed(42)
random.seed(42)

def data_encoding(df):
    cat_data = df.select_dtypes(include=['object', 'category'])

    for col in cat_data.columns:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])

    return df