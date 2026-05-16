from rest_framework import serializers
from api.models.project import Project
from api.models.membership import Membership
from .user_serializers import UserSerializer

class MembershipSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    user_first_name = serializers.ReadOnlyField(source='user.first_name')
    user_last_name = serializers.ReadOnlyField(source='user.last_name')
    project_name = serializers.ReadOnlyField(source='project.name')

    class Meta:
        model = Membership
        fields = ('id', 'user', 'user_email', 'user_first_name', 'user_last_name', 'project', 'project_name', 'role', 'joined_at')
        read_only_fields = ('project',)

class ProjectSerializer(serializers.ModelSerializer):
    created_by_email = serializers.ReadOnlyField(source='created_by.email')
    memberships = MembershipSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ('id', 'name', 'description', 'created_by', 'created_by_email', 'created_at', 'memberships')
        read_only_fields = ('created_by',)
