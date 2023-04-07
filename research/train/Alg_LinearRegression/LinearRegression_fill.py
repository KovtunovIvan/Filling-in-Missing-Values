from sklearn.linear_model import LinearRegression
import pandas as pd
import random

random.seed(42)

def linreg_imputer(df):
    col = df.loc[:, df.isna().sum() > 0].columns[0]

    # обучающей выборкой будут строки без пропусков
    train = df.dropna().copy()
    # тестовой (или вернее выборкой для заполнения пропусков)
    # будут те строки, в которых пропуски есть
    test = df[df[col].isna()].copy()

    # выясним индекс столбца с пропусками
    col_index = df.columns.get_loc(col)

    # разделим на features и target
    y_train = train[col]
    X_train = train.drop(col, axis=1)

    # из "тестовой" выборки удалим столбец с пропусками
    test = test.drop(col, axis=1)

    # обучим модель линейной регрессии
    model = LinearRegression()
    model.fit(X_train, y_train)

    # сделаем прогноз пропусков
    y_pred = model.predict(test)
    # вставим пропуски (value) на изначальное место (loc) столбца с пропусками (column)
    test.insert(loc=col_index, column=col, value=y_pred)

    # соединим датасеты и обновим индекс
    df = pd.concat([train, test])
    df.sort_index(inplace=True)

    return df


