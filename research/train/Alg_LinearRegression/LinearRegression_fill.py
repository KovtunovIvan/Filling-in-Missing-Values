from sklearn.linear_model import LinearRegression
import pandas as pd
import random
import numpy as np
random.seed(42)
np.random.seed(42)

def linreg_imputer(df):
    if len(df.columns[df.isna().any()].tolist()) == 1:
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
    else:
        missing_columns = df.columns[df.isna().any()].tolist()
        # заполнить пропуски случайными значениями и сохранить в df_imp в "имя_признака + '_imp'"
        df_imp = df.copy()
        df_result = df.copy()

        for feature in missing_columns:
            df_imp[feature + '_imp'] = df_imp[feature]
            number_missing = df_imp[feature].isnull().sum()
            observed_values = df_imp.loc[df_imp[feature].notnull(), feature]
            df_imp.loc[df_imp[feature].isnull(), feature + '_imp'] = np.random.choice(observed_values, number_missing,
                                                                                      replace=True)

        for feature in missing_columns:
            # Параметры: признаки - неполные признаки - признак для предсказания + '_imp'
            parameters = list(set(df_imp.columns) - set(missing_columns) - {feature + '_imp'})

            # X - Параметры, Y - признак для предсказания + '_imp'
            model = LinearRegression()
            model.fit(X=df_imp[parameters], y=df_imp[feature + '_imp'])

            df_result.loc[df_imp[feature].isnull(), feature] = model.predict(df_imp[parameters])[
                df_imp[feature].isnull()]

        return df_result


