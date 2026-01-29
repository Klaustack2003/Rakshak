from django.contrib import admin
from django.urls import path
from incidents.views import report_incident  # Import from your actual app 'incidents'

urlpatterns = [
    path('admin/', admin.site.urls),
    # Direct path to the view. No 'include' needed for simple setups.
    path('api/report/', report_incident, name='report_incident'),
]