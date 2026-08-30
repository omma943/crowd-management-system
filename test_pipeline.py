import sys
import time
import requests

BASE_URL = "http://127.0.0.1:8000"

def test_api():
    print("Testing Backend Connection to:", BASE_URL)
    
    # 1. Health check
    res = requests.get(f"{BASE_URL}/health")
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    print("[PASS] 1. Health Check:", res.json())

    # 2. Get initial crowd
    res = requests.get(f"{BASE_URL}/crowd/current")
    assert res.status_code == 200
    initial_crowd = res.json()["current_crowd"]
    print(f"[PASS] 2. Current Crowd before new events: {initial_crowd}")

    # 3. Post Entry Event (+10)
    entry_payload = {
        "camera_id": "ENTRY_01",
        "gate_id": "GATE_1",
        "direction": "entry",
        "count": 10
    }
    res = requests.post(f"{BASE_URL}/events", json=entry_payload)
    assert res.status_code == 200, f"Post entry failed: {res.text}"
    created_entry = res.json()
    print("[PASS] 3. Posted Entry Event (+10):", created_entry["id"], created_entry["camera_id"], created_entry["direction"])

    # 4. Confirm current crowd increased by 10
    res = requests.get(f"{BASE_URL}/crowd/current")
    new_crowd = res.json()["current_crowd"]
    assert new_crowd == initial_crowd + 10, f"Expected {initial_crowd + 10}, got {new_crowd}"
    print(f"[PASS] 4. Verified Current Crowd increased: {initial_crowd} -> {new_crowd}")

    # 5. Post Exit Event (-3)
    exit_payload = {
        "camera_id": "EXIT_01",
        "gate_id": "GATE_1",
        "direction": "exit",
        "count": 3
    }
    res = requests.post(f"{BASE_URL}/events", json=exit_payload)
    assert res.status_code == 200
    created_exit = res.json()
    print("[PASS] 5. Posted Exit Event (-3):", created_exit["id"], created_exit["camera_id"], created_exit["direction"])

    # 6. Confirm current crowd decreased by 3
    res = requests.get(f"{BASE_URL}/crowd/current")
    after_exit_crowd = res.json()["current_crowd"]
    assert after_exit_crowd == new_crowd - 3, f"Expected {new_crowd - 3}, got {after_exit_crowd}"
    print(f"[PASS] 6. Verified Current Crowd decreased: {new_crowd} -> {after_exit_crowd}")

    # 7. Check /crowd/stats
    res = requests.get(f"{BASE_URL}/crowd/stats")
    assert res.status_code == 200
    stats = res.json()
    print("[PASS] 7. Verified Today's Stats:", stats)

    # 8. Check /crowd/gates
    res = requests.get(f"{BASE_URL}/crowd/gates")
    assert res.status_code == 200
    gates = res.json()
    print("[PASS] 8. Verified Multi-Gate Analytics:", gates)

    # 9. Check /crowd/cameras
    res = requests.get(f"{BASE_URL}/crowd/cameras")
    assert res.status_code == 200
    cameras = res.json()
    print("[PASS] 9. Verified Camera Statuses:", cameras)

    # 10. Check /crowd/history
    res = requests.get(f"{BASE_URL}/crowd/history?period=today")
    assert res.status_code == 200
    history = res.json()
    print(f"[PASS] 10. Verified Hourly History: {len(history)} data intervals")

    # 11. Check /events list
    res = requests.get(f"{BASE_URL}/events?limit=5")
    assert res.status_code == 200
    ev_list = res.json()
    assert ev_list["total"] >= 2
    print(f"[PASS] 11. Verified Event Log: Total {ev_list['total']} events recorded")

    # 12. Check /crowd/alerts
    res = requests.get(f"{BASE_URL}/crowd/alerts?capacity=200")
    assert res.status_code == 200
    alerts = res.json()
    print(f"[PASS] 12. Verified Alert Generation: {len(alerts)} alerts generated")

    print("\n==============================================")
    print("ALL API ENDPOINTS & LOGIC VERIFIED SUCCESSFULLY!")
    print("==============================================")

if __name__ == "__main__":
    test_api()
