import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Activity, AlertCircle, Globe } from 'lucide-react';

function App() {
  // Mock initial state matching our ML model output vectors
  const [matchData, setMatchData] = useState({
    match_id: 99281,
    home_team: "Arsenal",
    away_team: "Chelsea",
    current_minute: 75,
    goal_differential: 0,
    xg_differential: 1.85,
    red_cards_diff: -1,
    probabilities: { home: 0.65, draw: 0.20, away: 0.15 },
    live_recap: "Arsenal is heavily dominating possession following Chelsea's recent red card. Expect an intense final 15 minutes as the home side hunts for a breakthrough."
  });

  const [language, setLanguage] = useState('English');

  // Simulated WebSockets Connection
  useEffect(() => {
    // In production, you would connect to your real backend server:
    // const ws = new WebSocket('ws://localhost:8080/api/v1/live-stream');
    
    const interval = setInterval(() => {
      setMatchData(prev => {
        const nextMin = prev.current_minute < 90 ? prev.current_minute + 1 : 90;
        // Simulating slight adjustments as the game ticks forward
        return {
          ...prev,
          current_minute: nextMin,
          probabilities: {
            home: Math.min(0.95, prev.probabilities.home + 0.01),
            draw: Math.max(0.05, prev.probabilities.draw - 0.005),
            away: Math.max(0.01, prev.probabilities.away - 0.005)
          }
        };
      });
    }, 4000); // Fast-forward ticks for visual previewing

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', padding: '2rem' }}>
      
      {/* Header & Localization Bar */}
      <header style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity style={{ color: '#38bdf8' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>AI Telemetry Sports Gateway</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1e293b', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
          <Globe size={16} style={{ color: '#94a3b8' }} />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{ background: 'none', color: '#f8fafc', border: 'none', outline: 'none', cursor: 'pointer' }}
          >
            <option value="English" style={{background: '#1e293b'}}>English</option>
            <option value="Spanish" style={{background: '#1e293b'}}>Español</option>
            <option value="French" style={{background: '#1e293b'}}>Français</option>
          </select>
        </div>
      </header>

      {/* Main Scoreboard Layout */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Match Header */}
        <div style={{ background: '#1e293b', borderRadius: '1rem', padding: '2rem', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)' }}>
          <div style={{ color: '#38bdf8', fontWeight: 'semibold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem' }}>
            <Clock size={18} /> Minute {matchData.current_minute}'
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
            <div>{matchData.home_team}</div>
            <div style={{ background: '#0f172a', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', letterSpacing: '2px' }}>
              {matchData.goal_differential >= 0 ? matchData.goal_differential : 0} - {matchData.goal_differential < 0 ? Math.abs(matchData.goal_differential) : 0}
            </div>
            <div>{matchData.away_team}</div>
          </div>
          {matchData.red_cards_diff !== 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: '#ef4444', marginTop: '1rem', fontSize: '0.875rem' }}>
              <AlertCircle size={16} /> Context Alert: Away Team Red Card Active (-1)
            </div>
          )}
        </div>

        {/* Analytics Engine Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* ML Win Probability Output Panel */}
          <div style={{ background: '#1e293b', borderRadius: '1rem', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={18} style={{ color: '#eab308' }} /> Live Predictive Machine Learning Odds
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Home bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  <span>{matchData.home_team} Win</span>
                  <span style={{ fontWeight: 'bold', color: '#22c55e' }}>{(matchData.probabilities.home * 100).toFixed(1)}%</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#0f172a', borderRadius: '0.5rem', height: '12px' }}>
                  <div style={{ backgroundColor: '#22c55e', height: '12px', borderRadius: '0.5rem', width: `${matchData.probabilities.home * 100}%`, transition: 'width 0.5s ease-in-out' }}></div>
                </div>
              </div>

              {/* Draw bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  <span>Draw Matrix</span>
                  <span style={{ fontWeight: 'bold', color: '#94a3b8' }}>{(matchData.probabilities.draw * 100).toFixed(1)}%</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#0f172a', borderRadius: '0.5rem', height: '12px' }}>
                  <div style={{ backgroundColor: '#94a3b8', height: '12px', borderRadius: '0.5rem', width: `${matchData.probabilities.draw * 100}%`, transition: 'width 0.5s ease-in-out' }}></div>
                </div>
              </div>

              {/* Away bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  <span>{matchData.away_team} Win</span>
                  <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{(matchData.probabilities.away * 100).toFixed(1)}%</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#0f172a', borderRadius: '0.5rem', height: '12px' }}>
                  <div style={{ backgroundColor: '#ef4444', height: '12px', borderRadius: '0.5rem', width: `${matchData.probabilities.away * 100}%`, transition: 'width 0.5s ease-in-out' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Generative AI Real-Time Insights Panel */}
          <div style={{ background: '#1e293b', borderRadius: '1rem', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} style={{ color: '#a855f7' }} /> Azure OpenAI Live Tactical Narrative
            </h3>
            <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid #a855f7', minHeight: '100px', lineHeight: '1.5' }}>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
                {language === 'Spanish' ? "Arsenal domina la posesión debido a la tarjeta roja de Chelsea..." : 
                 language === 'French' ? "Arsenal domine la possession suite au carton rouge de Chelsea..." : 
                 matchData.live_recap}
              </p>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#64748b', textAlign: 'right' }}>
              Telemetry Delta Flow Metrics: xG Diff: {matchData.xg_differential.toFixed(2)}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
