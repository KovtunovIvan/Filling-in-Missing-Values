# Generated by Django 4.2.2 on 2024-04-16 19:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0007_remove_project_description'),
    ]

    operations = [
        migrations.CreateModel(
            name='Visualization',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('project_id', models.IntegerField()),
                ('visualization_type', models.CharField(choices=[('Correlation Matrix', 'Correlation Matrix'), ('Normal Distribution', 'Normal Distribution'), ('Box Plot', 'Box Plot')], max_length=50)),
                ('image_path', models.CharField(max_length=255)),
            ],
        ),
    ]
