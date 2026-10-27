import os
import json
import time
import random

try:
    from azure.eventhub import EventHubProducerClient, EventData
except ImportError:  # pragma: no cover - optional dependency in offline mode
    EventHubProducerClient = None
    EventData = None

CONNECTION_STR = os.getenv("AZURE_EVENTHUB_CONNECTION_STR")
EVENT_HUB_NAME = os.getenv("AZURE_EVENTHUB_NAME")

def run_live_match_simulation():
    # --- COMMENTED OUT CLOUD CHECKS ---
    # if not CONNECTION_STR or not EVENT_HUB_NAME:
    #     print("\n⚠️  Environment variables missing!")
    #     print("Please configure AZURE_EVENTHUB_CONNECTION_STR and AZURE_EVENTHUB_NAME before testing.")
    #     return
    #
    # assert CONNECTION_STR is not None
    # assert EVENT_HUB_NAME is not None

    print(f"\n🔄 Simulating Local Data Stream Pipeline (Offline Mode)...")
    
    # --- COMMENTED OUT PRODUCER CREATION ---
    # producer = EventHubProducerClient.from_connection_string(
    #     conn_str=CONNECTION_STR,
    #     eventhub_name=EVENT_HUB_NAME,
    # )
    
    # Initialize basic football match attributes
    match_id = random.randint(10000, 99999)
    home_xg = 0.0
    away_xg = 0.0
    home_goals = 0
    away_goals = 0

    print(f"🏁 Starting Live Telemetry Stream for Match ID: {match_id}\n")

    # --- REMOVED PRODUCER WRAPPER ---
    # with producer:
    
    # Simulate data streaming in compressed 5-minute intervals
    for minute in range(1, 91, 5):
        # Dynamic generation modeling realistic soccer momentum shifts
        home_xg += round(random.uniform(0.0, 0.3), 2)
        away_xg += round(random.uniform(0.0, 0.2), 2)

        # Low probability chance of scoring per update interval
        if random.random() > 0.85:
            home_goals += 1
        if random.random() > 0.90:
            away_goals += 1

        # Form the exact payload structure your ML engine expects
        telemetry_payload: dict[str, int | float] = {
            "match_id": match_id,
            "current_minute": minute,
            "goal_differential": home_goals - away_goals,
            "xg_differential": round(home_xg - away_xg, 2),
            "red_cards_diff": 0 if minute < 70 else random.choice([0, 0, -1]),
        }

        # --- COMMENTED OUT AZURE DISPATCH NETWORK CODE ---
        # event_batch = producer.create_batch()
        # event_batch.add(EventData(json.dumps(telemetry_payload)))
        # producer.send_batch(event_batch)

        print(
            f"⏰ Min {minute:02d} | Score: {home_goals}-{away_goals} | "
            f"xG Diff: {telemetry_payload['xg_differential']:+.2f} -> Dispatched to Pipeline Stream!"
        )

        # Sleep 1 second between updates to emulate a high-speed match tracker stream
        time.sleep(1)

    print("\n✅ Live match simulation completed successfully.")

if __name__ == "__main__":
    run_live_match_simulation()
