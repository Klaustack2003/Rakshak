from django.contrib import admin
from django.urls import path
from incidents.views import report_crash

urlpatterns = [
    path('admin/', admin.site.urls),          # The Dashboard
    path('api/report/', report_crash),        # The React Endpoint
]