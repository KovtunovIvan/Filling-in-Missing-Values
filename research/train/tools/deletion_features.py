import numpy as np

def make_missing_value(data, missing_ratio):
    # искусственно создаем пропуски в данных, которые впоследствии будем заполнять
    # выбираем случайный признак
    
    df = data.copy()

    random_feature = np.random.choice(df.columns)

    # определяем количество пропусков
    num_missing = int(len(df) * missing_ratio)

    # генерируем случайные индексы для замены на пропуски
    np.random.seed(42)
    missing_index = np.random.choice(len(df), size=num_missing, replace=False)

    # заменяем значения на пропуски в случайных строках признака
    df.iloc[missing_index, df.columns.get_loc(random_feature)] = np.nan

    return df


