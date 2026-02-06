from rest_framework import generics, permissions
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from .models import (
    User,
    Complaint,
    Feedback,
    AdminResponse,
    ComplaintHistory
)
from .serializers import (
    ComplaintSerializer,
    FeedbackSerializer,
    AdminResponseSerializer,
    ComplaintHistorySerializer,
    UserRegisterSerializer,
    UserProfileSerializer,
)
from .permissions import IsAdmin

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserRegisterSerializer
class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        return self.request.user

    def get_serializer_context(self):
        return {'request': self.request}


class ComplaintListCreateView(generics.ListCreateAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Complaint.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        complaint = serializer.save(user=self.request.user)

        ComplaintHistory.objects.create(
            complaint=complaint,
            user=self.request.user,
            action='CREATED',
            new_status=complaint.status
        )


class ComplaintDetailView(generics.RetrieveAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Complaint.objects.filter(user=self.request.user)


class FeedbackCreateView(generics.CreateAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        feedback = serializer.save(user=self.request.user)

        ComplaintHistory.objects.create(
            complaint=feedback.complaint,
            user=self.request.user,
            action='FEEDBACK',
            comment=feedback.comment
        )


class ComplaintHistoryView(generics.ListAPIView):
    serializer_class = ComplaintHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ComplaintHistory.objects.filter(
            complaint_id=self.kwargs['pk'],
            complaint__user=self.request.user
        ).order_by('created_at')


class ComplaintListAdminView(generics.ListAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


class ComplaintStatusUpdateView(generics.UpdateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def perform_update(self, serializer):
        old_status = self.get_object().status
        complaint = serializer.save()

        if old_status != complaint.status:
            ComplaintHistory.objects.create(
                complaint=complaint,
                user=self.request.user,
                action='STATUS_CHANGED',
                old_status=old_status,
                new_status=complaint.status
            )


class AdminResponseCreateView(generics.CreateAPIView):
    serializer_class = AdminResponseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def perform_create(self, serializer):
        admin_response = serializer.save(admin=self.request.user)

        ComplaintHistory.objects.create(
            complaint=admin_response.complaint,
            user=self.request.user,
            action='ADMIN_RESPONSE',
            comment=admin_response.response_text
        )
@api_view(['POST'])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created"}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)