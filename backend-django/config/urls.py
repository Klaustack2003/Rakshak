from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # This line connects your API URLs. If it's missing, you get 404s.
    path('api/', include('api.urls')), 
]