from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Incident

@api_view(['POST'])
def report_crash(request):
    data = request.data
    
    # Create the record in Postgres
    incident = Incident.objects.create(
        user_email=data.get('userEmail'),
        latitude=data.get('latitude'),
        longitude=data.get('longitude'),
        g_force=data.get('gForce'),
        speed=data.get('speed')
    )
    
    return Response({"status": "Success", "id": incident.id})