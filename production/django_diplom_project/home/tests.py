from django.test import TestCase, Client
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from unittest.mock import patch, MagicMock, mock_open, Mock
from home.models import Project
from home.serializers import ProjectSerializer
import os
from django.core.files.base import ContentFile
import os
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core import mail


class RegistrationAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse("home:create-user")
        self.valid_payload = {
            "email": "test@example.com",
            "password": "testpassword",
        }
        self.invalid_payload = {
            "email": "test",
            "password": "",
        }

    def test_registration_with_valid_data(self):
        response = self.client.post(
            self.register_url, self.valid_payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_registration_with_invalid_data(self):
        response = self.client.post(
            self.register_url, self.invalid_payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


User = get_user_model()


class LoginAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse("home:login-user")
        self.user = User.objects.create_user(
            email="test@example.com", password="testpassword"
        )
        self.valid_credentials = {
            "email": "test@example.com",
            "password": "testpassword",
        }
        self.invalid_credentials = {
            "email": "test@example.com",
            "password": "wrongpassword",
        }

    def test_login_with_valid_credentials(self):
        response = self.client.post(
            self.login_url, self.valid_credentials, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_with_invalid_credentials(self):
        response = self.client.post(
            self.login_url, self.invalid_credentials, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UploadFileAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.upload_url = reverse("home:upload-file")
        self.user = User.objects.create_user(
            email="test@example.com", password="testpassword"
        )
        self.client.force_authenticate(user=self.user)
        self.valid_payload = {"file": MagicMock(name="file")}
        self.invalid_payload = {}

    def test_upload_file_with_valid_data(self):
        response = self.client.post(
            self.upload_url, self.valid_payload, format="multipart"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_upload_file_with_invalid_data(self):
        response = self.client.post(
            self.upload_url, self.invalid_payload, format="multipart"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ProcessDataAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@example.com", password="testpassword"
        )
        self.client.force_authenticate(user=self.user)
        self.project = Project.objects.create(title="Test Project", user=self.user)
        self.process_url = reverse(
            "home:process-data",
            kwargs={
                "project_id": self.project.id,
                "method_fill_id": 1,
                "method_scaling_id": "scaling_method",
            },
        )

    @patch("home.views.process_large_data.delay")
    def test_process_data(self, mock_process_large_data):
        mock_task = MagicMock()
        mock_task.id = "test_task_id"
        mock_process_large_data.return_value = mock_task

        response = self.client.get(self.process_url)

        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertIn("task_id", response.data)
        self.assertEqual(response.data["task_id"], "test_task_id")

        # Проверка, что task_id был обновлен в проекте
        self.project.refresh_from_db()
        self.assertEqual(self.project.task_id, "test_task_id")

    def test_process_data_without_authentication(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.process_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ListProjectsAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@example.com", password="testpassword"
        )
        self.client.force_authenticate(user=self.user)
        self.list_projects_url = reverse("home:list-projects")

        # Создаем несколько проектов для пользователя
        self.project1 = Project.objects.create(title="Project 1", user=self.user)
        self.project2 = Project.objects.create(title="Project 2", user=self.user)

        # Создаем проект для другого пользователя
        self.other_user = User.objects.create_user(
            email="other@example.com", password="testpassword"
        )
        self.project_other = Project.objects.create(
            title="Other User Project", user=self.other_user
        )

    def test_list_projects(self):
        response = self.client.get(self.list_projects_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        projects = Project.objects.filter(user=self.user).order_by("id")
        serializer = ProjectSerializer(projects, many=True)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(len(response.data), 2)

    def test_list_projects_without_authentication(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_projects_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class GetProjectAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@example.com", password="testpassword"
        )
        self.client.force_authenticate(user=self.user)

        self.project = Project.objects.create(
            title="Test Project",
            user=self.user,
            original_csv_file="test_original.csv",
            processed_csv_file="test_processed.csv",
        )

        self.get_project_url = reverse(
            "home:get-project", kwargs={"project_id": self.project.id}
        )

    @patch("home.views.os.path.exists", return_value=True)
    @patch("home.views.pd.read_csv")
    def test_get_project(self, mock_read_csv, mock_path_exists):
        mock_df = MagicMock()
        mock_df.columns = ["feature1", "feature2"]
        mock_read_csv.return_value = mock_df

        response = self.client.get(self.get_project_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        project = Project.objects.get(pk=self.project.id)
        serializer = ProjectSerializer(project)
        data = serializer.data
        data["original_csv_file_url"] = project.original_csv_file.url
        data["processed_csv_file_url"] = project.processed_csv_file.url
        data["original_csv_file_name"] = os.path.basename(
            project.original_csv_file.name
        )
        data["processed_csv_file_name"] = os.path.basename(
            project.processed_csv_file.name
        )
        data["features"] = list(mock_df.columns)
        data["features_original"] = list(mock_df.columns)

        self.assertEqual(response.data, data)

    def test_get_project_not_found(self):
        url = reverse("home:get-project", kwargs={"project_id": 999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["detail"], "Project not found")

    def test_get_project_without_authentication(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.get_project_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class DownloadProcessedFileAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@example.com", password="testpassword"
        )
        self.client.force_authenticate(user=self.user)

        self.project = Project.objects.create(
            title="Test Project",
            user=self.user,
        )
        self.project.processed_csv_file.save(
            "test_processed.csv", ContentFile("processed data")
        )

        self.download_url = reverse(
            "home:download_processed_file", kwargs={"project_id": self.project.id}
        )

    @patch("builtins.open", new_callable=mock_open, read_data="processed data")
    @patch("home.views.os.path.exists", return_value=True)
    def test_download_processed_file(self, mock_path_exists, mock_file):
        response = self.client.get(self.download_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response["Content-Disposition"], 'attachment; filename="test_processed.csv"'
        )
        self.assertEqual(response.content.decode(), "processed data")

    def test_download_processed_file_not_found(self):
        url = reverse("home:download_processed_file", kwargs={"project_id": 999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_download_processed_file_without_authentication(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.download_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CheckTaskStatusAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@example.com", password="testpassword"
        )
        self.client.force_authenticate(user=self.user)

        self.project = Project.objects.create(
            title="Test Project",
            user=self.user,
        )
        self.project_with_task = Project.objects.create(
            title="Test Project with Task", user=self.user, task_id="test_task_id"
        )

        self.url = reverse(
            "home:check_task_status", kwargs={"project_id": self.project.id}
        )
        self.url_with_task = reverse(
            "home:check_task_status", kwargs={"project_id": self.project_with_task.id}
        )

    def test_check_task_status_no_task(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.json()["status"], "No task associated with this project."
        )

    @patch("home.views.AsyncResult")
    def test_check_task_status_pending(self, mock_async_result):
        mock_result = Mock()
        mock_result.ready.return_value = False
        mock_async_result.return_value = mock_result

        response = self.client.get(self.url_with_task)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "PENDING")

    @patch("home.views.AsyncResult")
    def test_check_task_status_success(self, mock_async_result):
        mock_result = Mock()
        mock_result.ready.return_value = True
        mock_result.successful.return_value = True
        mock_result.get.return_value = "http://example.com/processed_file.csv"
        mock_async_result.return_value = mock_result

        response = self.client.get(self.url_with_task)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "SUCCESS")
        self.assertEqual(
            response.json()["file_url"], "http://example.com/processed_file.csv"
        )

    @patch("home.views.AsyncResult")
    def test_check_task_status_failure(self, mock_async_result):
        mock_result = Mock()
        mock_result.ready.return_value = True
        mock_result.successful.return_value = False
        mock_result.result = Exception("Test error")
        mock_async_result.return_value = mock_result

        response = self.client.get(self.url_with_task)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "FAILURE")
        self.assertEqual(response.json()["message"], "Test error")

    def test_check_task_status_not_found(self):
        url = reverse("home:check_task_status", kwargs={"project_id": 999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_check_task_status_without_authentication(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UploadAvatarAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.upload_url = reverse("home:upload_avatar")
        self.user = User.objects.create_user(
            email="test@example.com", password="testpassword"
        )
        self.client.force_authenticate(user=self.user)
        self.valid_payload = {"avatar": MagicMock(name="avatar")}
        self.invalid_payload = {}

    def test_upload_avatar_with_valid_data(self):
        response = self.client.post(
            self.upload_url, self.valid_payload, format="multipart"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_upload_avatar_with_invalid_data(self):
        response = self.client.post(
            self.upload_url, self.invalid_payload, format="multipart"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class DeleteAvatarTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.delete_url = reverse("home:delete_avatar")
        self.user = User.objects.create_user(
            email="test@example.com", password="testpassword"
        )
        self.client.force_authenticate(user=self.user)

    def test_delete_avatar_success(self):
        # Создаем фиктивный файл для аватара
        avatar_content = b"file_content"
        avatar = SimpleUploadedFile(
            "avatar.jpg", avatar_content, content_type="image/jpeg"
        )

        # Устанавливаем аватар пользователю
        self.user.avatar = avatar
        self.user.save()

        # Удаляем аватар
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Avatar deleted successfully")

    def test_delete_avatar_no_avatar(self):
        # Проверяем удаление, когда у пользователя нет аватара
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "No avatar to delete")


class ChangePasswordTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.change_password_url = reverse("home:change_password")
        self.user = User.objects.create_user(
            email="test@example.com", password="oldpassword"
        )
        self.client.force_authenticate(user=self.user)

    def test_change_password_success(self):
        # Изменяем пароль пользователя
        data = {"old_password": "oldpassword", "new_password": "newpassword"}
        response = self.client.put(self.change_password_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["message"], "Password has been changed successfully."
        )

        # Проверяем, что пароль изменился
        self.assertTrue(
            User.objects.get(email="test@example.com").check_password("newpassword")
        )

    def test_change_password_invalid_old_password(self):
        # Пытаемся изменить пароль с неверным старым паролем
        data = {"old_password": "wrongpassword", "new_password": "newpassword"}
        response = self.client.put(self.change_password_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Invalid old password.")

    def test_change_password_missing_parameters(self):
        # Пытаемся изменить пароль без указания старого и нового паролей
        response = self.client.put(self.change_password_url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["error"],
            "Old and new passwords must be provided in the request body.",
        )


class UpdateProfileTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.update_profile_url = reverse("home:update_profile")
        self.user = User.objects.create_user(
            email="test@example.com",
            password="testpassword",
            first_name="John",
            last_name="Doe",
            middle_name="Smith",
            phone_number="1234567890",
        )
        self.client.force_authenticate(user=self.user)

    def test_update_profile_success(self):
        # Обновляем профиль пользователя
        data = {
            "first_name": "Jane",
            "last_name": "Doe",
            "middle_name": "Johnson",
            "phone_number": "0987654321",
        }
        response = self.client.put(self.update_profile_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["message"].strip(), "Profile updated successfully"
        )

        # Проверяем, что профиль изменился
        user = User.objects.get(email="test@example.com")
        self.assertEqual(user.first_name, "Jane")
        self.assertEqual(user.last_name, "Doe")
        self.assertEqual(user.middle_name, "Johnson")
        self.assertEqual(user.phone_number, "0987654321")

    def test_update_profile_partial_fields(self):
        # Обновляем профиль пользователя с частичными данными
        data = {"first_name": "Jane", "phone_number": "0987654321"}
        response = self.client.put(self.update_profile_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["message"].strip(), "Profile updated successfully"
        )

        # Проверяем, что только указанные поля изменились
        user = User.objects.get(email="test@example.com")
        self.assertEqual(user.first_name, "Jane")
        self.assertEqual(user.last_name, "Doe")
        self.assertEqual(user.middle_name, "Smith")  # Не должно измениться
        self.assertEqual(user.phone_number, "0987654321")


class DeleteUserProfileTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.delete_profile_url = reverse("home:delete-user-profile")
        self.user = User.objects.create_user(
            email="test@example.com", password="testpassword"
        )
        self.client.force_authenticate(user=self.user)

    def test_delete_user_profile_success(self):
        # Удаление профиля пользователя с правильным паролем
        data = {"password": "testpassword"}
        response = self.client.delete(self.delete_profile_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["message"],
            "User profile and related data deleted successfully",
        )

        # Проверка, что пользователь удален из базы данных
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(email="test@example.com")

    def test_delete_user_profile_invalid_password(self):
        # Попытка удаления профиля пользователя с неправильным паролем
        data = {"password": "wrongpassword"}
        response = self.client.delete(self.delete_profile_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Invalid password")

        # Проверка, что пользователь остался в базе данных
        self.assertIsNotNone(User.objects.get(email="test@example.com"))


class ResetPasswordTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.reset_password_url = reverse("home:reset_password")
        self.user = User.objects.create_user(
            email="test@example.com", password="testpassword"
        )

    def test_reset_password_success(self):
        # Попытка сброса пароля для существующего пользователя
        response = self.client.post(
            self.reset_password_url, {"email": "test@example.com"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()["message"],
            "Временный пароль отправлен на вашу электронную почту.",
        )

        # Проверка отправки письма
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, "MedMindes. Сброс пароля")
        self.assertIn("Ваш временный пароль", mail.outbox[0].body)

    def test_reset_password_nonexistent_user(self):
        # Попытка сброса пароля для несуществующего пользователя
        response = self.client.post(
            self.reset_password_url, {"email": "nonexistent@example.com"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()["error"],
            "Пользователь с таким адресом электронной почты не существует.",
        )

        self.assertEqual(len(mail.outbox), 0)


class ContactViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.contact_url = reverse("home:contact")

    def test_contact_view_success(self):
        # Попытка отправить сообщение обратной связи
        response = self.client.post(
            self.contact_url,
            {
                "form_type": "feedback",
                "email": "test@example.com",
                "last_name": "Doe",
                "first_name": "John",
                "middle_name": "Smith",
                "phone": "+1234567890",
                "company": "Test Company",
                "position": "Tester",
                "message": "This is a test message.",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "success")
        self.assertEqual(response.json()["message"], "Сообщение отправлено!")

        # Проверка отправки электронной почты
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, "Новое сообщение обратной связи")
        self.assertIn("Фамилия: Smith", mail.outbox[0].body)
        self.assertIn("Имя: John", mail.outbox[0].body)
        self.assertIn("Отчество: Doe", mail.outbox[0].body)
        self.assertIn("Телефон: +1234567890", mail.outbox[0].body)
        self.assertIn("Почта: test@example.com", mail.outbox[0].body)
        self.assertIn("Компания: Test Company", mail.outbox[0].body)
        self.assertIn("Должность: Tester", mail.outbox[0].body)
        self.assertIn("Сообщение: This is a test message.", mail.outbox[0].body)

    def test_contact_view_error(self):
        # Попытка отправить сообщение с неправильным методом запроса
        response = self.client.get(self.contact_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "error")
        self.assertEqual(response.json()["message"], "Используйте метод POST")


class DeleteProjectTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpassword"
        )
        self.client.force_login(self.user)

        self.project = Project.objects.create(id=1, user=self.user)

    def test_delete_project_success(self):
        response = self.client.delete(
            reverse("home:delete_project", kwargs={"project_id": self.project.id})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_project_not_found(self):
        response = self.client.delete(
            reverse("home:delete_project", kwargs={"project_id": 999})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
