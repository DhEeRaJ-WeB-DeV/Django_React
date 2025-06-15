from django.db import models
from django.contrib.auth.models import User


class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    # The author of the note, represented as a foreign key relationship to the built-in User model
    # - on_delete=models.CASCADE: When the associated user is deleted, all their notes will also be deleted
    # - related_name="notes": Allows accessing all notes of a user using `user.notes`
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title

