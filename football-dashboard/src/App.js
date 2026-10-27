import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Activity, AlertCircle, Globe } from 'lucide-react';

function App() {
  // Initialize state representing our predictive data metrics
  const [matchData, setMatchData] = useState({
    match_id: 99281,
    home_team: "Arsenal",
    away_team: "Chelsea",
    current_minute: 5,
    goal_differential: 0,
    xg_differential: 0.15,
    red_cards_diff: -1,
    probabilities: { home: 0.45, draw: 0.30, away: 0.25 },
    live_recap: "Match kickoff. Both sides are currently feeling out structural low blocks in a tight tactical opening sequence."
  });

  const [language, setLanguage] = useState('English');

  // Simulated real-time pipeline connection that drives the data loops dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      setMatchData(prev => {
        // Increment the timeline loop by 5 minutes per tick up to full-time
        const nextMin = prev.current_minute < 90 ? prev.current_minute + 5 : 90;
        
        // Randomly simulate a score event occurrence (12% chance per snapshot interval)
        const scoreChange = Math.random() > 0.88;
        const homeScores = scoreChange && Math.random() > 0.5;
        const awayScores = scoreChange && !homeScores;
        
        // Track running score aggregates
        const currentHomeGoals = prev.goal_differential >= 0 ? prev.goal_differential : 0;
        const currentAwayGoals = prev.goal_differential < 0 ? Math.abs(prev.goal_differential) : 0;
        
        const newHomeGoals = homeScores ? currentHomeGoals + 1 : currentHomeGoals;
        const newAwayGoals = awayScores ? currentAwayGoals + 1 : currentAwayGoals;
        const newGoalDiff = newHomeGoals - newAwayGoals;
        
        // Shift the Machine Learning probability states based on score events and time decays
        let newHomeProb = prev.probabilities.home;
        if (homeScores) newHomeProb = Math.min(0.92, newHomeProb + 0.18);
        if (awayScores) newHomeProb = Math.max(0.08, newHomeProb - 0.18);
        
        // Dynamic variance adjustments for Expected Goals (xG) metrics
        const newXGDiff = parseFloat((prev.xg_differential + (Math.random() * 0.4 - 0.15)).toFixed(2));
        
        // Balance out remaining odds allocation arrays
        const newDrawProb = Math.max(0.05, 0.35 - (nextMin * 0.003));
        const newAwayProb = Math.max(0.01, 1 - newHomeProb - newDrawProb);

        // Map fresh structural storytelling segments to reflect the new state vectors
        let contextualRecap = "A tense tactical low-block battle continues as both managers look to optimize baseline squad space substitutions.";
        if (newGoalDiff > 0) {
          contextualRecap = "Arsenal is dictating tempo with aggressive overlapping runs, successfully exposing defensive structural flaws.";
        } else if (newGoalDiff < 0) {
          contextualRecap = "Chelsea breaks through via a lightning counter-attack, exploiting transitional spaces with direct forward movement.";
        } else if (Math.abs(newXGDiff) > 1.5) {
          contextualRecap = "Severe momentum shifts detected. Attacking volume is testing structural lines despite the locked scoreline.";
        }

        return {
          ...prev,
          current_minute: nextMin,
          goal_differential: newGoalDiff,
          xg_differential: newXGDiff,
          probabilities: {
            home: parseFloat(newHomeProb.toFixed(3)),
            draw: parseFloat(newDrawProb.toFixed(3)),
            away: parseFloat(newAwayProb.toFixed(3))
          },
          live_recap: contextualRecap
        };
      });
    }, 3000); // Drives the visualization panel changes every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Compute physical display labels based on current goal differential states
  const homeDisplayGoals = matchData.goal_differential >= 0 ? matchData.goal_differential : 0;
  const awayDisplayGoals = matchData.goal_differential < 0 ? Math.abs(matchData.goal_differential) : 0;

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', padding: '2rem' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #334155',
          paddingBottom: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity style={{ color: '#38bdf8' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>AI Telemetry Sports Gateway</h1>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#1e293b',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem'
          }}
        >
          <Globe size={16} style={{ color: '#94a3b8' }} />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ background: 'none', color: '#f8fafc', border: 'none', outline: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            <option value="English" style={{ background: '#1e293b' }}>English</option>
            <option value="Spanish" style={{ background: '#1e293b' }}>Español</option>
            <option value="French" style={{ background: '#1e293b' }}>Français</option>
          </select>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div
          style={{
            background: '#1e293b',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)'
          }}
        >
          <div
            style={{
              color: '#38bdf8',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.25rem',
              marginBottom: '1rem'
            }}
          >
            <Clock size={18} /> Minute {matchData.current_minute}'
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
            <div style={{ width: '30%', textAlign: 'right' }}>{matchData.home_team}</div>
            <div style={{ background: '#0f172a', padding: '0.5rem 2rem', borderRadius: '0.5rem', letterSpacing: '4px', fontSize: '2.5rem' }}>
              {homeDisplayGoals} - {awayDisplayGoals}
            </div>
            <div style={{ width: '30%', textAlign: 'left' }}>{matchData.away_team}</div>
          </div>
          {matchData.red_cards_diff !== 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#ef4444',
                marginTop: '1.25rem',
                fontSize: '0.875rem'
              }}
            >
              <AlertCircle size={16} /> Context Alert: Away Team Red Card Constraint Active
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          <div style={{ background: '#1e293b', borderRadius: '1rem', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={18} style={{ color: '#eab308' }} /> Live Predictive Machine Learning Odds
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  <span>{matchData.home_team} Win Probability</span>
                  <span style={{ fontWeight: 'bold', color: '#22c55e' }}>{(matchData.probabilities.home * 100).toFixed(1)}%</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#0f172a', borderRadius: '0.5rem', height: '12px' }}>
                  <div
                    style={{
                      backgroundColor: '#22c55e',
                      height: '12px',
                      borderRadius: '0.5rem',
                      width: `${matchData.probabilities.home * 100}%`,
                      transition: 'width 0.4s ease-in-out'
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  <span>Draw Matrix State</span>
                  <span style={{ fontWeight: 'bold', color: '#94a3b8' }}>{(matchData.probabilities.draw * 100).toFixed(1)}%</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#0f172a', borderRadius: '0.5rem', height: '12px' }}>
                  <div
                    style={{
                      backgroundColor: '#94a3b8',
                      height: '12px',
                      borderRadius: '0.5rem',
                      width: `${matchData.probabilities.draw * 100}%`,
                      transition: 'width 0.4s ease-in-out'
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  <span>{matchData.away_team} Win Probability</span>
                  <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{(matchData.probabilities.away * 100).toFixed(1)}%</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#0f172a', borderRadius: '0.5rem', height: '12px' }}>
                  <div
                    style={{
                      backgroundColor: '#ef4444',
                      height: '12px',
                      borderRadius: '0.5rem',
                      width: `${matchData.probabilities.away * 100}%`,
                      transition: 'width 0.4s ease-in-out'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: '#1e293b', borderRadius: '1rem', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#f8fafc' }}>
              Live Tactical Intelligence Snapshot
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>Expected Goal Differential</span>
                <strong style={{ color: '#38bdf8' }}>{matchData.xg_differential.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>Red Card Impact</span>
                <strong style={{ color: '#fca5a5' }}>{matchData.red_cards_diff}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>Narrative Context</span>
                <strong style={{ color: '#eab308' }}>{matchData.live_recap}</strong>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
