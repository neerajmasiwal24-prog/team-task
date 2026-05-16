from rest_framework import permissions
from api.models.membership import Membership

class IsGlobalAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser))

class IsProjectAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Assumes obj is a Project or has a project attribute
        project = obj if hasattr(obj, 'memberships') else getattr(obj, 'project', None)
        if not project:
            return False
        
        # Superusers can do anything
        if request.user.is_staff or request.user.is_superuser:
            return True
            
        return Membership.objects.filter(user=request.user, project=project, role='Admin').exists()

class IsProjectMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        project = obj if hasattr(obj, 'memberships') else getattr(obj, 'project', None)
        if not project:
            return False
            
        if request.user.is_staff or request.user.is_superuser:
            return True
            
        return Membership.objects.filter(user=request.user, project=project).exists()
