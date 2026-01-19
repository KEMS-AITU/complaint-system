# views.py
from rest_framework import generics, permissions
from .models import *
from .serializers import *
from .permissions import IsAdmin

# -----------------
# CLIENT VIEWS
# -----------------

class ComplaintListCreateView(generics.ListCreateAPIView):
    """
    GET → список своих жалоб клиента
    POST → создание новой жалобы
    """
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        
        return Complaint.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ComplaintDetailView(generics.RetrieveAPIView):
    """
    GET → детали конкретной жалобы клиента
    """
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        
        return Complaint.objects.filter(user=self.request.user)


class FeedbackCreateView(generics.CreateAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# -----------------
# ADMIN VIEWS
# -----------------

class ComplaintListAdminView(generics.ListAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


class ComplaintStatusUpdateView(generics.UpdateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


class AdminResponseCreateView(generics.CreateAPIView):
    serializer_class = AdminResponseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def perform_create(self, serializer):
        serializer.save(admin=self.request.user)
