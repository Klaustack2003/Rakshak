import requests
import time

print(" Car is driving...")
time.sleep(2)
print(" BANG! Crash detected!")

# Prepare the data
data = {
    "user_id": 101,
    "location": "Durgapur Expressway",
    "message": "Heavy impact detected."
}

try:
    # Send it to the server
    response = requests.post("http://127.0.0.1:8000/crash_alert", json=data)
    print(" Server responded:", response.json())
except:
    print(" Server is offline!")