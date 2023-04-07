import numpy as np
import pandas as pd
import random

np.random.seed(42)
random.seed(42)

def data_balancing(df, column):
    from imblearn.over_sampling import SMOTE

    X = df.drop(column, axis=1)
    y = df[column]

    smote = SMOTE()
    X_resampled, y_resampled = smote.fit_resample(X, y)

    df = pd.concat([X_resampled, y_resampled], axis=1)

    return df