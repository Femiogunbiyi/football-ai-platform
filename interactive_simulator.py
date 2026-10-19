import sys
import pandas as pd
import joblib

def load_local_engine():
    try:
        # Load the frozen model file from disk
        model = joblib.load('football_momentum_model.pkl')
        return model
    except FileNotFoundError:
        print("❌ Error: 'football_momentum_model.pkl' not found.")
        print("Please ensure you ran 'train_model.py' first to generate your AI model.")
        sys.exit(1)

def run_simulator():
    model = load_local_engine()
    
    print("====================================================")
    print(" ⚽ LIVE FOOTBALL MOMENTUM PREDICTOR SIMULATOR ⚽ ")
    print("====================================================")
    print("Enter custom match parameters to test your model locally.")
    print("Type 'exit' at any prompt to quit.\n")
    
    while True:
        try:
            # 1. Capture user inputs for the match scenario
            minute_input = input("⏱️ Current Match Minute (1-90): ").strip()
            if minute_input.lower() == 'exit': break
            minute = int(minute_input)
            
            goal_input = input("🥅 Goal Differential (Home Goals minus Away Goals, e.g. -1, 0, 2): ").strip()
            if goal_input.lower() == 'exit': break
            goal_diff = int(goal_input)
            
            xg_input = input("📊 Expected Goals (xG) Differential (Home xG minus Away xG, e.g. +1.45, -0.80): ").strip()
            if xg_input.lower() == 'exit': break
            xg_diff = float(xg_input)
            
            red_input = input("🟥 Red Card Differential (Home Reds minus Away Reds, e.g. -1 if Home has more reds): ").strip()
            if red_input.lower() == 'exit': break
            red_diff = int(red_input)
            
            # 2. Package scenario data into a DataFrame matching our training dimensions
            match_vector = pd.DataFrame([{
                'current_minute': minute, 
                'goal_differential': goal_diff, 
                'xg_differential': xg_diff,
                'red_cards_diff': red_diff
            }])
            
            # 3. Calculate live probabilities using our local model
            probabilities = model.predict_proba(match_vector)[0]
            
            # 4. Display the predictive analytics output
            print("\n----------------------------------------------------")
            print(f"🔮 LIVE OUTCOME PROBABILITIES (Minute {minute})")
            print("----------------------------------------------------")
            print(f"🏠 Home Win Probability: {probabilities[0]:.2%}")
            print(f"🤝 Draw Probability:     {probabilities[1]:.2%}")
            print(f"🏃 Away Win Probability: {probabilities[2]:.2%}")
            print("====================================================\n")
            
        except ValueError:
            print("\n❌ Invalid input format. Please enter numerical values.\n")
        except KeyboardInterrupt:
            break
            
    print("\n👋 Simulator closed. Thank you for testing!")

if __name__ == "__main__":
    run_simulator()
