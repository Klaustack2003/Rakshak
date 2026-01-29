from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Incident
import json

@csrf_exempt
def report_incident(request):
    if request.method == 'POST':
        try:
            # 1. Parse the JSON data from the App
            data = json.loads(request.body)
            
            # 2. Create the Database Record
            # Note: We use .get('userEmail') because that is what the Frontend sends
            incident = Incident.objects.create(
                user_email=data.get('userEmail'),
                latitude=data.get('latitude'),
                longitude=data.get('longitude'),
                g_force=data.get('gForce'),
                speed=data.get('speed')
            )
            
            # 3. Send Success Response
            return JsonResponse({'status': 'success', 'id': incident.id}, status=201)
            
        except Exception as e:
            # If something goes wrong, tell us what
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    
    return JsonResponse({'status': 'error', 'message': 'Only POST requests allowed'}, status=405)