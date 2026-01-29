from django.urls import path
from .views import report_incident  # Make sure your view is named 'report_incident'

urlpatterns = [
    path('report/', report_incident, name='report_incident'),
]