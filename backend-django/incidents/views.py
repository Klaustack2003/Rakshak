from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Incident
import json

@csrf_exempt
def report_incident(request):  # <--- NAME MUST MATCH urls.py
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Save data to the database
            incident = Incident.objects.create(
                user_email=data.get('userEmail'),
                latitude=data.get('latitude'),
                longitude=data.get('longitude'),
                g_force=data.get('gForce'),
                speed=data.get('speed')
            )
            
            return JsonResponse({'status': 'success', 'id': incident.id}, status=201)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    
    return JsonResponse({'status': 'error', 'message': 'Only POST allowed'}, status=405)