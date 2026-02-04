from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import *

User = get_user_model()


class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at']


class AdminResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminResponse
        fields = '__all__'


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at']


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'password',
            'email',
            'first_name',
            'last_name',
            'role'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'is_superuser',
            'is_staff',
            'avatar',
            'avatar_url',
            'date_joined',
            'last_login',
        ]
        read_only_fields = [
            'id',
            'role',
            'is_superuser',
            'is_staff',
            'date_joined',
            'last_login',
            'avatar_url',
        ]

    def get_avatar_url(self, obj):
        if not obj.avatar:
            return ''
        try:
            url = obj.avatar.url
        except ValueError:
            return ''
        request = self.context.get('request')
        if request is not None:
            return request.build_absolute_uri(url)
        return url


class ComplaintHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintHistory
        fields = '__all__'
