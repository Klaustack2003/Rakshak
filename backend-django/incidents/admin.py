from django.contrib import admin
from .models import Incident

@admin.register(Incident)
class IncidentAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'status', 'g_force', 'timestamp') # Columns
    list_filter = ('status', 'timestamp') # Sidebar Filters
    search_fields = ('user_email',) # Search Bar