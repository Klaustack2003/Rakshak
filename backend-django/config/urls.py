from django.contrib import admin
from django.urls import path
# FIXED: Import 'report_incident' (matching views.py), not 'report_crash'
from incidents.views import report_incident 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/report/', report_incident),  # This connects the React App to Django
]