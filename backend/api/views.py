from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer,NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):#to get the notes of the current user
        user = self.request.user#to get the current user
        return Note.objects.filter(author=user)#to get(return) the notes of the current user 

    def perform_create(self, serializer):#to create a new note .here serializer refers to the NoteSerializer
        if serializer.is_valid():#if the serializer is valid eg : if the data has correct fields = ["id", "title", "content", "created_at", "author"]
            serializer.save(author=self.request.user)#save if the data is valid and if its the current user
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):#to delete a note
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
