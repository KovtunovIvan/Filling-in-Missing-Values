import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import numpy as np
import plotly.graph_objs as go
import seaborn as sns

def visualization_results_metrics(df1_result, df15_result, df20_result):
    dict_graf = df1_result.to_dict()
    plt.figure(figsize=(10, 6))

    for metric, methods in dict_graf.items():
        x = range(len(methods))
        y = list(methods.values())
        plt.plot(x, y, label=metric)

    plt.xticks(x, list(methods.keys()), rotation=90)
    plt.legend()
    plt.grid()
    plt.show()

    #####################################################################
    dict_graf = df15_result.to_dict()
    plt.figure(figsize=(10, 6))

    for metric, methods in dict_graf.items():
        x = range(len(methods))
        y = list(methods.values())
        plt.plot(x, y, label=metric)

    plt.xticks(x, list(methods.keys()), rotation=90)
    plt.legend()
    plt.grid()
    plt.show()
    #####################################################################
    dict_graf = df20_result.to_dict()
    plt.figure(figsize=(10, 6))

    for metric, methods in dict_graf.items():
        x = range(len(methods))
        y = list(methods.values())
        plt.plot(x, y, label=metric)

    plt.xticks(x, list(methods.keys()), rotation=90)
    plt.legend()
    plt.grid()
    plt.show()
    #####################################################################

    # Создаем трехмерный график
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    # Создаем массивы значений для каждой метрики и каждого метода заполнения пропусков
    mse_5 = np.array(df1_result['Mean_squared_error'])
    mae_5 = np.array(df1_result['Mean_absolute_error'])
    r2_5 = np.array(df1_result['r2_score'])

    mse_20 = np.array(df15_result['Mean_squared_error'])
    mae_20 = np.array(df15_result['Mean_absolute_error'])
    r2_20 = np.array(df15_result['r2_score'])

    mse_35 = np.array(df20_result['Mean_squared_error'])
    mae_35 = np.array(df20_result['Mean_absolute_error'])
    r2_35 = np.array(df20_result['r2_score'])

    # Создаем точки на графике для каждого метода заполнения пропусков
    ax.scatter(mse_5, mae_5, r2_5, c='r', marker='o', label='5% пропусков')
    ax.scatter(mse_20, mae_20, r2_20, c='b', marker='^', label='20% пропусков')
    ax.scatter(mse_35, mae_35, r2_35, c='g', marker='s', label='35% пропусков')

    # Добавляем подписи к осям и заголовок графика
    ax.set_xlabel('MSE')
    ax.set_ylabel('MAE')
    ax.set_zlabel('R2')
    ax.set_title('Метрики для разных методов заполнения пропусков')

    # Добавляем легенду
    ax.legend()

    # Показываем график
    #plt.grid()
    plt.show()
    #####################################################################

    # Создаем датафрейм с метриками для каждого метода заполнения пропусков
    data = pd.concat(
        [df1_result['Mean_absolute_error'], df15_result['Mean_absolute_error'], df20_result['Mean_absolute_error']],
        axis=1)
    data.reset_index(inplace=True)
    data.columns = ['Method', 'MAE_5', 'MAE_20', 'MAE_35']

    # Создаем трехмерную столбчатую диаграмму
    fig = go.Figure(data=[go.Bar(x=data['Method'], y=data['MAE_5'], name='5% пропусков'),
                          go.Bar(x=data['Method'], y=data['MAE_20'], name='20% пропусков'),
                          go.Bar(x=data['Method'], y=data['MAE_35'], name='35% пропусков')])

    # Настраиваем внешний вид графика
    fig.update_layout(title='Значение метрики MAE для разных методов заполнения пропусков',
                      xaxis_title='Метод заполнения пропусков',
                      yaxis_title='MAE',
                      scene=dict(xaxis=dict(title='%', range=[-0.5, 11.5]),
                                 yaxis=dict(title='MAE', range=[0, 1.5]),
                                 zaxis=dict(title='%', range=[-0.5, 2.5])),
                      width=800,
                      height=600,
                      margin=dict(l=50, r=50, b=50, t=50),
                      showlegend=True)

    # Показываем график
    fig.show()

    #####################################################################

    # создаем датафрейм на основе словаря
    """df = data

    # устанавливаем 'Method' в качестве индекса
    df.set_index('Method', inplace=True)

    # создаем тепловую карту
    sns.heatmap(df, annot=True, cmap='coolwarm')

    # устанавливаем заголовок графика
    plt.title('MAE для различных методов и процентов пропусков')

    # показываем график
    plt.show()"""

    #####################################################################
    # создаем датафрейм на основе словаря
    df = data.reset_index()

    # создаем объекты для осей x, y и z
    x = list(data.reset_index()['Method'])
    y = ['5%', '20%', '35%']
    z = [df['MAE_5'].tolist(),
         df['MAE_20'].tolist(),
         df['MAE_35'].tolist()]

    # создаем 3D график
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    # устанавливаем метки для осей x, y и z
    ax.set_xticklabels(x)
    ax.set_yticklabels(y)
    ax.set_xlabel('Method')
    ax.set_ylabel('Missing Values')
    ax.set_zlabel('MAE')

    # создаем трехмерную плоскость
    xpos, ypos = np.meshgrid(range(len(x)), range(len(y)))
    xpos = xpos.flatten()
    ypos = ypos.flatten()
    zpos = np.zeros_like(xpos)

    # определяем размеры каждого столбца на трехмерной плоскости
    dx = 0.5 * np.ones_like(zpos)
    dy = 0.5 * np.ones_like(zpos)
    dz = np.array(z).flatten()

    # создаем бары на трехмерной плоскости
    ax.bar3d(xpos, ypos, zpos, dx, dy, dz, color='b', alpha=0.8)

    # устанавливаем заголовок графика
    plt.title('MAE для различных методов и процентов пропусков')

    # показываем график
    #plt.grid()
    plt.show()
    #####################################################################

    # создаем датафрейм из словаря
    """df = data.reset_index()

    # создаем фигуру
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    # создаем оси x, y, z
    x = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    y = np.array([5, 20, 35])
    X, Y = np.meshgrid(x, y)
    Z = np.array(df[['MAE_5', 'MAE_20', 'MAE_35']]).T

    # создаем поверхность
    ax.plot_surface(X, Y, Z, cmap='viridis', alpha=0.7)

    # настраиваем метки на осях
    ax.set_xlabel('Method')
    ax.set_ylabel('Percent Missing Values')
    ax.set_zlabel('MAE')

    # настраиваем метки на осях x и y
    ax.set_xticks(x)
    ax.set_xticklabels(df['Method'])
    plt.xticks(rotation=45)
    ax.set_yticks(y)

    # показываем график
    plt.show()"""
    #####################################################################
    plt.plot(df1_result['r2_score'], )
    plt.plot(df15_result['r2_score'])
    plt.plot(df20_result['r2_score'])
    plt.legend(['0.05', '0.20', '0.35'], bbox_to_anchor=(1, 1))
    plt.xticks(rotation=60)
    plt.grid()
    plt.show()
    #####################################################################
    """fig, ax = plt.subplots()
    x = df1_result['Mean_absolute_error'].index
    ax.bar(x, df20_result['Mean_absolute_error'], label='35%')
    ax.bar(x, df15_result['Mean_absolute_error'], label='20%')
    ax.bar(x, df1_result['Mean_absolute_error'], label='5%')
    ax.legend(fontsize=15)
    ax.set_title('Mean Absolute Error', fontsize=15)

    fig.set_figwidth(20)
    fig.set_figheight(6)

    plt.show()"""
    #####################################################################
    missing_frac_range = [0.05, 0.20, 0.35]
    leg = df1_result['r2_score'].index  
    res5 = df1_result['r2_score']
    res20 = df15_result['r2_score']
    res35 = df20_result['r2_score']

    plt.plot(missing_frac_range, [res5, res20, res35])
    plt.legend(leg, bbox_to_anchor=(1, 1))
    plt.grid()
    plt.show()