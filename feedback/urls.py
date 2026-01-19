from django.urls import path
from .views import *

urlpatterns = [
    # client
    path('complaints/', ComplaintListCreateView.as_view()),  # GET + POST
    path('complaints/<int:pk>/', ComplaintDetailView.as_view()),
    path('feedback/', FeedbackCreateView.as_view()),

    # admin
    path('admin/complaints/', ComplaintListAdminView.as_view()),
    path('admin/complaints/<int:pk>/status/', ComplaintStatusUpdateView.as_view()),
    path('admin/response/', AdminResponseCreateView.as_view()),
]
