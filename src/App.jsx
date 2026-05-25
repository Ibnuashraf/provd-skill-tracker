import React, { useState } from 'react';
import Landing from './Landing';
import Dashboard from './Dashboard';
import { LogView, SkillsView, MilestonesView, AchievementsView, AiAssistantView } from './OtherViews';
import BuddyView from './BuddyView';
import Background from './Background';
import { INITIAL_SD, INITIAL_ENTRIES, INITIAL_MS, INITIAL_ACHS } from './Data';
import Logo from './Logo';

function Sidebar({ uName, activeView, setView, setUName, sidebarOpen }) {
  const items = [
    { id: 'dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>, label: 'Dashboard' },
    { id: 'log', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>, label: 'Log Evidence' },
    { id: 'skills', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>, label: 'My Skills' },
    { id: 'milestones', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>, label: 'Milestones' },
    { id: 'achievements', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>, label: 'Achievements' },
    { id: 'ai', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg>, label: 'AI Assistant' },
    { id: 'buddy', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, label: 'Skill Buddy' },
  ];

  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div style={{padding: sidebarOpen ? '0 20px' : '0', marginBottom: '28px', display:'flex', justifyContent: sidebarOpen ? 'flex-start' : 'center', transition:'all 0.3s ease'}}>
        <Logo size={sidebarOpen ? 'large' : 'small'} showText={sidebarOpen} />
      </div>
      <div className="sb-nav">
        {items.map(it => (
          <button key={it.id} className={`sb-it ${activeView === it.id ? 'on' : ''}`} onClick={() => setView(it.id)}>
            <div className="sb-ic">{it.icon}</div>
            {sidebarOpen && it.label}
          </button>
        ))}
      </div>
      <div className="sb-bot">
        <div className="sb-user">
          <div className="sb-av">{uName ? uName[0].toUpperCase() : 'U'}</div>
          {sidebarOpen && (
            <div>
              <div className="sb-nm">{uName}</div>
              <div className="sb-rl">Free tier</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [uName, setUName] = useState('');
  const [history, setHistory] = useState(['dashboard']);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Skill Buddy States
  const [observerMode, setObserverMode] = useState(false);
  const [buddy, setBuddy] = useState(null);
  const [inviteData, setInviteData] = useState(null);
  const [joinNameInput, setJoinNameInput] = useState('');

  // Parse invite URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get('invite');
    const bName = params.get('bName');
    
    if (invite === 'true' && bName) {
      const bStreak = parseInt(params.get('bStreak') || '0', 10);
      const bPoints = parseInt(params.get('bPoints') || '0', 10);
      const bLevel = parseInt(params.get('bLevel') || '1', 10);
      
      setInviteData({
        name: bName,
        streak: bStreak,
        points: bPoints,
        level: bLevel
      });
    }
  }, []);

  const view = history[history.length - 1];

  const setView = (newView) => {
    if (newView !== view) {
      setHistory(prev => [...prev, newView]);
    }
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    } else {
      setUName('');
      setHistory(['dashboard']);
    }
  };

  const [SD, setSD] = useState(INITIAL_SD);
  const [ENTRIES, setENTRIES] = useState(INITIAL_ENTRIES);
  const [MS, setMS] = useState(INITIAL_MS);
  const [ACHS, setACHS] = useState(INITIAL_ACHS);

  const maxStk = Math.max(...SD.map(s => s.stk), 0);

  // Handle Observer Mode
  const startObserving = () => {
    if (!inviteData) return;
    setObserverMode(true);
    setUName(inviteData.name);
    setHistory(['dashboard']);
    setInviteData(null); // Close modal
  };

  // Handle Active Participation Joining
  const startParticipating = () => {
    if (!joinNameInput.trim() || !inviteData) return;
    setObserverMode(false);
    setUName(joinNameInput.trim());
    setBuddy({
      name: inviteData.name,
      streak: inviteData.streak,
      points: inviteData.points,
      level: inviteData.level
    });
    setHistory(['dashboard']);
    setInviteData(null); // Close modal
  };

  // Welcome / Invite Modal Overlay
  if (inviteData) {
    return (
      <>
        <Background />
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5, 5, 5, 0.9)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'sans-serif'
        }}>
          <div className="card hover-3d" style={{ maxWidth: '460px', padding: '30px', textAlign: 'center', border: '1px solid var(--bdl)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '14px' }}>🤝</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'var(--ink)' }}>Skill Buddy Invitation</h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--ink2)', lineHeight: 1.6, margin: '14px 0 20px 0' }}>
              <strong>{inviteData.name}</strong> (Streak: <strong>🔥 {inviteData.streak} days</strong>) has invited you to join them as a Skill Buddy on Provd!
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Option A: Observe */}
              <button 
                className="gbtn hover-3d" 
                onClick={startObserving}
                style={{ padding: '14px', width: '100%', fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '3px' }}
              >
                <span style={{ fontWeight: '700', color: 'var(--lime)' }}>👀 Observe Progress</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--ink3)' }}>View {inviteData.name}'s dashboard without sharing your own stats</span>
              </button>

              <div className="mdiv" style={{ margin: '6px 0' }}>OR</div>

              {/* Option B: Join */}
              <div style={{ background: 'rgba(237,234,228,.02)', padding: '16px', borderRadius: 'var(--r)', border: '0.5px solid var(--bd)' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--ink)', marginBottom: '8px', textAlign: 'left' }}>
                  🤝 Join as Active Buddy
                </div>
                <input 
                  type="text" 
                  className="fi" 
                  placeholder="Enter your name..." 
                  value={joinNameInput} 
                  onChange={e => setJoinNameInput(e.target.value)}
                  style={{ marginBottom: '12px' }}
                />
                <button 
                  className="sbmt" 
                  disabled={!joinNameInput.trim()}
                  onClick={startParticipating}
                  style={{ width: '100%', padding: '10px' }}
                >
                  Connect & Start Tracker →
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!uName) {
    return (
      <>
        <Background />
        <Landing setUName={(name) => { setUName(name); setHistory(['dashboard']); }} setView={setView} />
      </>
    );
  }

  return (
    <>
      <Background />
      <div id="page-app" className="page active">
        <Sidebar uName={uName} activeView={view} setView={setView} setUName={setUName} sidebarOpen={sidebarOpen} />
        <div className={`app-main ${sidebarOpen ? 'sb-open' : 'sb-closed'}`}>
          
          <div className="app-header">
            <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
              <button className="app-header-back" onClick={() => setSidebarOpen(!sidebarOpen)} style={{padding:'8px 12px'}}>
                ☰
              </button>
              {history.length > 1 && (
                <button className="app-header-back" onClick={goBack}>
                  ← Back
                </button>
              )}
            </div>
            <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
              <div style={{fontSize:'.84rem', color:'var(--ink2)'}}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
              <button className="nbtn-ghost" style={{padding:'6px 12px', fontSize:'.8rem', border:'1px solid var(--bd)'}} onClick={() => { setUName(''); setHistory(['dashboard']); }}>
                Sign out
              </button>
            </div>
          </div>

          {observerMode && (
            <div style={{
              background: 'rgba(184,232,48,.08)',
              border: '0.5px solid rgba(184,232,48,.25)',
              borderRadius: 'var(--r)',
              padding: '12px 18px',
              marginBottom: '20px',
              fontSize: '0.84rem',
              color: 'var(--lime)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              animation: 'vfade 0.25s ease'
            }}>
              <span>👀 <strong>Observer Mode:</strong> You are viewing <strong>{uName}</strong>'s progress dashboard in read-only.</span>
              <button 
                className="sbmt" 
                onClick={() => {
                  setObserverMode(false);
                  setInviteData({
                    name: uName,
                    streak: maxStk,
                    points: ENTRIES.reduce((a, b) => a + b.pts, 0),
                    level: Math.max(...SD.map(s => s.lv), 1)
                  });
                }} 
                style={{ padding: '6px 12px', fontSize: '0.76rem' }}
              >
                Join as Buddy
              </button>
            </div>
          )}

          {view === 'dashboard' && <Dashboard SD={SD} ENTRIES={ENTRIES} maxStk={maxStk} setView={setView} />}
          {view === 'log' && <LogView SD={SD} ENTRIES={ENTRIES} setENTRIES={setENTRIES} observerMode={observerMode} />}
          {view === 'skills' && <SkillsView SD={SD} setSD={setSD} MS={MS} setMS={setMS} setView={setView} observerMode={observerMode} />}
          {view === 'milestones' && <MilestonesView SD={SD} MS={MS} setMS={setMS} observerMode={observerMode} />}
          {view === 'achievements' && <AchievementsView ACHS={ACHS} />}
          {view === 'ai' && <AiAssistantView SD={SD} observerMode={observerMode} />}
          {view === 'buddy' && <BuddyView SD={SD} ENTRIES={ENTRIES} buddy={buddy} setBuddy={setBuddy} uName={uName} observerMode={observerMode} />}
        </div>
      </div>
    </>
  );
}
