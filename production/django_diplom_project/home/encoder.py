# воспользуемся OneHotEncoder
from sklearn.preprocessing import OneHotEncoder
import pandas as pd
import numpy as np
import random

np.random.seed(42)
random.seed(42)

def data_encoding(df):

    # Выделяем категориальные столбцы в отдельный DataFrame
    cat_data = df.select_dtypes(include=['object', 'category'])

    # Создаем экземпляр объекта OneHotEncoder
    ohe = OneHotEncoder()

    # Применяем OneHotEncoding к DataFrame
    encoded_data = ohe.fit_transform(cat_data)

    # Преобразуем результаты в DataFrame
    encoded_df = pd.DataFrame(encoded_data.toarray(), columns=ohe.get_feature_names_out(cat_data.columns))

    # Заменяем столбцы с категориальными данными на столбцы, полученные после применения OneHotEncoding
    data = pd.concat([df.select_dtypes(include=['float', 'int']), encoded_df], axis=1)

    return data