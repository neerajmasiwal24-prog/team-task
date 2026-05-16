from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views.auth import register, register_admin, user_login, admin_login, logout
from .views.admin import create_project, manage_project, add_team_member, remove_team_member, create_task, manage_task_admin, admin_dashboard_summary, admin_team_summary
from .views.member import list_my_projects, list_project_tasks, update_task_status, dashboard_summary, get_task_detail

urlpatterns = [
    # Auth endpoints
    path('auth/register/', register, name='register'),
    path('auth/register/admin/', register_admin, name='register_admin'),
    path('auth/login/', user_login, name='user_login'),
    path('auth/login/admin/', admin_login, name='admin_login'),
    path('auth/logout/', logout, name='logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Admin endpoints
    path('admin/projects/', create_project, name='create_project'),
    path('admin/projects/<int:project_id>/', manage_project, name='manage_project'),
    path('admin/projects/<int:project_id>/members/', add_team_member, name='add_team_member'),
    path('admin/projects/<int:project_id>/members/<int:user_id>/', remove_team_member, name='remove_team_member'),
    path('admin/projects/<int:project_id>/tasks/', create_task, name='create_task'),
    path('admin/projects/<int:project_id>/tasks/<int:task_id>/', manage_task_admin, name='manage_task_admin'),
    path('admin/dashboard/', admin_dashboard_summary, name='admin_dashboard_summary'),
    path('admin/team/', admin_team_summary, name='admin_team_summary'),

    # Member endpoints
    path('member/projects/', list_my_projects, name='list_my_projects'),
    path('member/projects/<int:project_id>/tasks/', list_project_tasks, name='list_project_tasks'),
    path('member/tasks/<int:task_id>/', get_task_detail, name='get_task_detail'),
    path('member/tasks/<int:task_id>/status/', update_task_status, name='update_task_status'),
    
    # Dashboard
    path('dashboard/', dashboard_summary, name='dashboard_summary'),
]
