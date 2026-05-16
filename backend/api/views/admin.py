from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.models.project import Project
from api.models.task import Task
from api.models.membership import Membership
from api.models.user import User
from api.serializers import ProjectSerializer, TaskSerializer, MembershipSerializer
from api.permissions import IsProjectAdmin

# --- PROJECT MANAGEMENT ---

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    """Any authenticated user can create a project. They automatically become the Project Admin."""
    serializer = ProjectSerializer(data=request.data)
    if serializer.is_valid():
        project = serializer.save(created_by=request.user)
        # Assign creator as Admin
        Membership.objects.create(user=request.user, project=project, role='Admin')
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated, IsProjectAdmin])
def manage_project(request, project_id):
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

    # Permission class IsProjectAdmin will verify access using the project object
    self_check = IsProjectAdmin()
    if not self_check.has_object_permission(request, None, project):
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        project.delete()
        return Response({'message': 'Project deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


# --- TEAM MANAGEMENT ---

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsProjectAdmin])
def add_team_member(request, project_id):
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

    self_check = IsProjectAdmin()
    if not self_check.has_object_permission(request, None, project):
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

    email = request.data.get('email')
    role = request.data.get('role', 'Member')

    if not email:
        return Response({'error': 'User email is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'User with this email not found'}, status=status.HTTP_404_NOT_FOUND)

    if Membership.objects.filter(user=user, project=project).exists():
        return Response({'error': 'User is already a member of this project'}, status=status.HTTP_400_BAD_REQUEST)

    membership = Membership.objects.create(user=user, project=project, role=role)
    return Response(MembershipSerializer(membership).data, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsProjectAdmin])
def remove_team_member(request, project_id, user_id):
    try:
        project = Project.objects.get(id=project_id)
        membership = Membership.objects.get(project=project, user_id=user_id)
    except (Project.DoesNotExist, Membership.DoesNotExist):
        return Response({'error': 'Project or Membership not found'}, status=status.HTTP_404_NOT_FOUND)

    self_check = IsProjectAdmin()
    if not self_check.has_object_permission(request, None, project):
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
    if membership.user == request.user:
        return Response({'error': 'You cannot remove yourself'}, status=status.HTTP_400_BAD_REQUEST)

    membership.delete()
    return Response({'message': 'Member removed successfully'}, status=status.HTTP_204_NO_CONTENT)


# --- TASK MANAGEMENT (ADMIN) ---

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsProjectAdmin])
def create_task(request, project_id):
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

    self_check = IsProjectAdmin()
    if not self_check.has_object_permission(request, None, project):
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        assigned_to_email = request.data.get('assigned_to_email')
        assigned_user = None
        if assigned_to_email:
            try:
                assigned_user = User.objects.get(email=assigned_to_email)
                # Verify user is in project
                if not Membership.objects.filter(user=assigned_user, project=project).exists():
                    return Response({'error': 'Assigned user is not a member of this project'}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({'error': 'Assigned user not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer.save(project=project, assigned_to=assigned_user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated, IsProjectAdmin])
def manage_task_admin(request, project_id, task_id):
    try:
        project = Project.objects.get(id=project_id)
        task = Task.objects.get(id=task_id, project=project)
    except (Project.DoesNotExist, Task.DoesNotExist):
        return Response({'error': 'Project or Task not found'}, status=status.HTTP_404_NOT_FOUND)

    self_check = IsProjectAdmin()
    if not self_check.has_object_permission(request, None, project):
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        # Re-assignment handling
        assigned_to_email = request.data.get('assigned_to_email')
        assigned_user = task.assigned_to
        if assigned_to_email:
            try:
                assigned_user = User.objects.get(email=assigned_to_email)
                if not Membership.objects.filter(user=assigned_user, project=project).exists():
                    return Response({'error': 'Assigned user is not a member of this project'}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({'error': 'Assigned user not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(assigned_to=assigned_user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        task.delete()
        return Response({'message': 'Task deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


# --- DASHBOARD VIEWS ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard_summary(request):
    """Get dashboard stats and active tasks for the logged-in admin"""
    if request.user.is_staff or request.user.is_superuser:
        projects = list(Project.objects.all())
    else:
        memberships = Membership.objects.filter(user=request.user, role='Admin').select_related('project')
        projects = [m.project for m in memberships]
    
    # 2. Get all tasks for these projects
    tasks_qs = Task.objects.filter(project__in=projects).order_by('due_date')
    
    # 3. Serialize data
    projects_data = ProjectSerializer(projects, many=True).data
    tasks_data = TaskSerializer(tasks_qs, many=True).data
    
    return Response({
        'managed_projects': projects_data,
        'all_tasks': tasks_data,
        'summary': {
            'projects_count': len(projects),
            'tasks_count': tasks_qs.count()
        }
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_team_summary(request):
    """Get all managed projects and their team members for the logged-in admin"""
    if request.user.is_staff or request.user.is_superuser:
        projects = list(Project.objects.all())
    else:
        memberships_admin = Membership.objects.filter(user=request.user, role='Admin').select_related('project')
        projects = [m.project for m in memberships_admin]
    
    all_memberships = Membership.objects.filter(project__in=projects).select_related('user', 'project').order_by('project__name', 'user__email')
    
    projects_data = ProjectSerializer(projects, many=True).data
    memberships_data = MembershipSerializer(all_memberships, many=True).data
    
    # Calculate unique users across all managed projects
    unique_user_ids = set([m.user_id for m in all_memberships])
    
    return Response({
        'managed_projects': projects_data,
        'memberships': memberships_data,
        'capacity': {
            'used': len(unique_user_ids),
            'total': 20
        }
    })
