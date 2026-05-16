from rest_framework import serializers
from api.models.user import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        email = validated_data.get('email', '')
        username = email.split('@')[0]
        user = User.objects.create_user(username=username, **validated_data)
        return user
