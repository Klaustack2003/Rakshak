from django.db import models

class Incident(models.Model):
    user_email = models.EmailField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    g_force = models.FloatField(default=0.0)
    speed = models.FloatField(default=0.0)
    status = models.CharField(max_length=50, default="CRASH DETECTED")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_email} - {self.status}"