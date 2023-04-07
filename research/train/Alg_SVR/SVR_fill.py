from sklearn.svm import SVR
import pandas as pd
import random

random.seed(42)

def SVM_imputer(df):
    col = df.loc[:, df.isna().sum() > 0].columns[0]

    train = df.dropna().copy()
    test = df[df[col].isna()].copy()

    col_index = df.columns.get_loc(col)

    y_train = train[col]
    X_train = train.drop(col, axis=1)

    test = test.drop(col, axis=1)

    model = SVR()
    model.fit(X_train, y_train)

    y_pred = model.predict(test)
    test.insert(loc=col_index, column=col, value=y_pred)

    df = pd.concat([train, test])
    df.sort_index(inplace=True)

    return df


