from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Category, Complaint, AdminResponse, Feedback


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Role', {'fields': ('role',)}),
    )
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')
    search_fields = ('title',)


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('id', 'status', 'user', 'category', 'created_at')
    list_filter = ('status', 'category')
    search_fields = ('text',)
    readonly_fields = ('created_at',)


@admin.register(AdminResponse)
class AdminResponseAdmin(admin.ModelAdmin):
    list_display = ('id', 'complaint', 'admin', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('id', 'complaint', 'user', 'is_accepted', 'created_at')
    list_filter = ('is_accepted',)
    readonly_fields = ('created_at',)
