import pandas as pd
from statsbombpy import sb
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
import joblib

print("Fetching competitions...")
competitions = sb.competitions()

# Using World Cup 2022 Data (Comp ID: 43, Season ID: 106)
comp_id = 43
season_id = 106

print("Fetching matches...")
matches = sb.matches(competition_id=comp_id, season_id=season_id)

print("Processing matches with xG and Card tracking...")
all_snapshots = []

# Process the top 30 matches for a broader data baseline
for match_id in matches['match_id'].head(30):
    try:
        events = sb.events(match_id=match_id)
        events = events.sort_values(by=['minute', 'second']).dropna(subset=['minute'])
        
        match_info = matches[matches['match_id'] == match_id].iloc[0]
        home_team = match_info['home_team']
        away_team = match_info['away_team']
        
        # Determine the ultimate training label
        if match_info['home_score'] > match_info['away_score']:
            final_outcome = 0  # Home Win
        elif match_info['home_score'] < match_info['away_score']:
            final_outcome = 2  # Away Win
        else:
            final_outcome = 1  # Draw
            
        # Sample snapshots at 5-minute intervals
        for minute in range(5, 90, 5):
            past_events = events[events['minute'] <= minute]
            
            # 1. Track Running Goals
            shots = past_events[past_events['type'] == 'Shot']
            home_goals = len(shots[(shots['team'] == home_team) & (shots['shot_outcome'] == 'Goal')])
            away_goals = len(shots[(shots['team'] == away_team) & (shots['shot_outcome'] == 'Goal')])
            goal_differential = home_goals - away_goals
            
            # 2. Track Expected Goals (xG) Accumulation
            home_xg = shots[shots['team'] == home_team]['shot_statsbomb_xg'].fillna(0).sum()
            away_xg = shots[shots['team'] == away_team]['shot_statsbomb_xg'].fillna(0).sum()
            xg_differential = home_xg - away_xg
            
            # 3. Track Red Cards
            cards_events = past_events[past_events['foul_committed_card'].notna()]
            home_reds = len(cards_events[(cards_events['team'] == home_team) & 
                                         (cards_events['foul_committed_card'].isin(['Red Card', 'Second Yellow']))])
            away_reds = len(cards_events[(cards_events['team'] == away_team) & 
                                         (cards_events['foul_committed_card'].isin(['Red Card', 'Second Yellow']))])
            red_cards_diff = home_reds - away_reds
            
            all_snapshots.append({
                'current_minute': minute,
                'goal_differential': goal_differential,
                'xg_differential': xg_differential,
                'red_cards_diff': red_cards_diff,
                'final_outcome': final_outcome
            })
            
    except Exception as e:
        continue

# Build the Matrix (X) and Vector (y)
df = pd.DataFrame(all_snapshots)
X = df[['current_minute', 'goal_differential', 'xg_differential', 'red_cards_diff']]
y = df['final_outcome']

# Split Data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the Advanced Model
print("\nTraining Advanced XGBoost Classifier...")
model = XGBClassifier(eval_metric='mlogloss', random_state=42)
model.fit(X_train, y_train)
print("Advanced model training complete!")

# Save the trained model to disk so you can load it in the cloud later
joblib.dump(model, 'football_momentum_model.pkl')
print("Model saved successfully as 'football_momentum_model.pkl'!")

# Smart Predictor Function to verify it works
def predict_live_probability_v2(minute, goal_diff, xg_diff, red_diff):
    sample = pd.DataFrame([{
        'current_minute': minute, 
        'goal_differential': goal_diff, 
        'xg_differential': xg_diff,
        'red_cards_diff': red_diff
    }])
    
    probabilities = model.predict_proba(sample)[0]
    
    print(f"\n--- Smart Prediction at Minute {minute} ---")
    print(f"Goals Diff: {goal_diff} | xG Diff: {xg_diff:+.2f} | Red Cards Diff: {red_diff}")
    print(f"⚽ Home Win: {probabilities[0]:.2%}")
    print(f"🤝 Draw:     {probabilities[1]:.2%}")
    print(f"🏃 Away Win: {probabilities[2]:.2%}")

# Test Scenario: Minute 80, Score 0-0, Home team has +1.85 xG, Away team has a red card (-1 difference)
predict_live_probability_v2(minute=80, goal_diff=0, xg_diff=1.85, red_diff=-1)
