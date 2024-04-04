from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django import forms
from .models import Project
from .models import User

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("email",)

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ("email",)

class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['description', 'original_csv_file']

        