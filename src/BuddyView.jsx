import React, { useState, useRef, useEffect } from 'react';
import { chatWithAi } from './AiService';

export default function BuddyView({ SD, ENTRIES, buddy, setBuddy, uName, observerMode }) {
  const [nudgeReply, setNudgeReply] = useState('');
  const [nudgeType, setNudgeType] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef(null);

  const userStreak = Math.max(...SD.map(s => s.stk), 0);
  const userPoints = ENTRIES.reduce((acc, curr) => acc + curr.pts, 0);
  const userLevel = Math.max(...SD.map(s => s.lv), 1);

  // Generate real serverless invite URL
  const getInviteUrl = () => {
    const origin = window.location.origin + window.location.pathname;
    return `${origin}?invite=true&bName=${encodeURIComponent(uName)}&bStreak=${userStreak}&bPoints=${userPoints}&bLevel=${userLevel}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getInviteUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Connect a mock buddy to instantly test the comparison UI
  const connectMockBuddy = () => {
    setBuddy({
      name: 'Ryan',
      streak: 15,
      points: 190,
      level: 6
    });
  };

  useEffect(() => {
    if (buddy && chatLog.length === 0) {
      setChatLog([
        { type: 'bot', text: `Hey ${uName}! I am connected as your Skill Buddy. Let's push each other to study and build everyday. What are you practicing today?` }
      ]);
    }
  }, [buddy]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const handleNudge = (type) => {
    if (observerMode) return;
    setNudgeType(type);
    let reply = '';
    
    if (type === 'coffee') {
      reply = `☕ 'Thanks for the coffee! I was just getting tired reviewing layout specs. Feeling highly energized now!' — ${buddy.name}`;
    } else if (type === 'poke') {
      reply = `⚡ 'Ouch! Poked! Fine, closing distraction tabs now. Going straight to code some milestones!' — ${buddy.name}`;
    } else {
      reply = `🤝 'Challenge accepted! Let's log at least 2 entries before midnight. Winner gets ultimate bragging rights!' — ${buddy.name}`;
    }

    setNudgeReply(reply);
    
    const logText = type === 'coffee' ? 'Sent coffee ☕' : type === 'poke' ? 'Nudged buddy ⚡' : 'Proposed 1v1 challenge 🤝';
    setChatLog(prev => [
      ...prev,
      { type: 'user', text: `[Action] ${logText}` },
      { type: 'bot', text: reply }
    ]);

    setTimeout(() => {
      setNudgeReply('');
      setNudgeType('');
    }, 4500);
  };

  const handleSendChat = async () => {
    if (observerMode || !chatInput.trim()) return;
    const msgText = chatInput;
    setChatInput('');

    setChatLog(prev => [
      ...prev,
      { type: 'user', text: msgText },
      { type: 'typing', text: '...' }
    ]);
    setIsTyping(true);

    try {
      const buddyChatHistory = chatLog.filter(c => c.type !== 'typing');
      const messages = [
        { 
          role: 'system', 
          content: `You are ${buddy.name}, a passionate learning companion and accountability partner for the user (${uName}). Respond to the user in a highly encouraging, friendly, and motivational peer tone. Emphasize consistency, streaks, and building things. Keep response to 1-2 sentences.`
        },
        ...buddyChatHistory.map(m => ({
          role: m.type === 'bot' ? 'assistant' : 'user',
          content: m.text
        })),
        { role: 'user', content: msgText }
      ];

      const replyText = await chatWithAi(messages);

      setChatLog(prev => {
        const cleanHistory = prev.filter(c => c.type !== 'typing');
        return [
          ...cleanHistory,
          { type: 'bot', text: replyText }
        ];
      });
    } catch (e) {
      setChatLog(prev => {
        const cleanHistory = prev.filter(c => c.type !== 'typing');
        return [
          ...cleanHistory,
          { type: 'bot', text: `A bit busy practicing right now, but let's keep showing up!` }
        ];
      });
    } finally {
      setIsTyping(false);
    }
  };

  // Render invite screen if no buddy is active
  if (!buddy) {
    return (
      <div className="view active">
        <div className="vtit">Skill Buddy Cockpit</div>
        <div className="vsub">Accountability is the best cheat-code to consistency. Generate a link to invite a friend!</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', marginTop: '12px' }}>
          
          <div className="card hover-3d" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '2.5rem' }}>🔗</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'var(--ink)' }}>Generate Your Accountability Invite Link</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--ink2)', lineHeight: 1.6 }}>
              Copy your personalized invite link and send it to your friend. When they open the link, they can choose to either:
            </p>
            
            <ul style={{ fontSize: '0.82rem', color: 'var(--ink3)', lineHeight: 1.7, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Observe without participating:</strong> Browse your dashboard, skills, and milestones in a gorgeous read-only mode to watch your back.</li>
              <li><strong>Join as active Buddy:</strong> Share their stats and streaks to compete and learn side-by-side with you!</li>
            </ul>

            <div className="share-box">
              <div className="share-url">{getInviteUrl()}</div>
              <button className="share-copy" onClick={copyToClipboard}>
                {copied ? 'Copied! ✓' : 'Copy Invite Link'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🤖</div>
              <h4 style={{ color: 'var(--ink)' }}>No Buddy nearby?</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--ink2)', margin: '10px 0 16px 0', lineHeight: 1.5 }}>
                Simulate a live connection with one of our AI learning companions to immediately test the side-by-side comparative dashboard.
              </p>
              <button className="sbmt" onClick={connectMockBuddy} style={{ padding: '8px 18px', fontSize: '0.8rem' }}>
                Connect with AI Buddy
              </button>
            </div>
            
            <div className="card" style={{ padding: '20px' }}>
              <div className="ctit">Why Skill Buddies?</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--ink3)', lineHeight: 1.5, marginTop: '6px' }}>
                Study groups fail because they lack structured metrics. Provd Skill Buddy forces consistency by plotting your streaks against a peer. The moment one slacks, the other knows!
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Render comparative dashboard if buddy is active
  return (
    <div className="view active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div>
          <div className="vtit">Skill Buddy Dashboard</div>
          <div className="vsub">Connected accountability partner: <strong>{buddy.name}</strong></div>
        </div>
        <button 
          className="nbtn-ghost" 
          style={{ padding: '6px 12px', fontSize: '0.74rem', border: '1px solid rgba(224, 74, 32, 0.2)', color: '#E04A20' }}
          onClick={() => setBuddy(null)}
        >
          Disconnect Buddy
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Comparisons Card */}
          <div className="card" style={{ padding: '22px' }}>
            <div className="ctit">Active Statistics vs {buddy.name}</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '18px' }}>
              
              {/* Streak Comparison */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--ink)' }}>Your Streak: <strong>{userStreak} days</strong></span>
                  <span style={{ color: 'var(--amber)' }}>{buddy.name}'s Streak: <strong>{buddy.streak} days</strong></span>
                </div>
                <div className="sk-bar-bg" style={{ height: '8px', background: 'rgba(237,234,228,.04)' }}>
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <div style={{ 
                      width: `${(userStreak / (userStreak + buddy.streak || 1)) * 100}%`, 
                      background: 'var(--lime)', 
                      borderRadius: '4px 0 0 4px',
                      transition: 'all 0.3s'
                    }} />
                    <div style={{ 
                      width: `${(buddy.streak / (userStreak + buddy.streak || 1)) * 100}%`, 
                      background: 'var(--amber)', 
                      borderRadius: '0 4px 4px 0',
                      transition: 'all 0.3s'
                    }} />
                  </div>
                </div>
              </div>

              {/* Points Comparison */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--ink)' }}>Your Total Points: <strong>{userPoints} pts</strong></span>
                  <span style={{ color: '#2898D8' }}>{buddy.name}'s Points: <strong>{buddy.points} pts</strong></span>
                </div>
                <div className="sk-bar-bg" style={{ height: '8px', background: 'rgba(237,234,228,.04)' }}>
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <div style={{ 
                      width: `${(userPoints / (userPoints + buddy.points || 1)) * 100}%`, 
                      background: 'var(--lime)', 
                      borderRadius: '4px 0 0 4px',
                      transition: 'all 0.3s'
                    }} />
                    <div style={{ 
                      width: `${(buddy.points / (userPoints + buddy.points || 1)) * 100}%`, 
                      background: '#2898D8', 
                      borderRadius: '0 4px 4px 0',
                      transition: 'all 0.3s'
                    }} />
                  </div>
                </div>
              </div>

              {/* Level side-by-side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '6px', textAlign: 'center' }}>
                <div style={{ border: '0.5px solid var(--bd)', borderRadius: 'var(--r)', padding: '10px', background: 'rgba(237,234,228,.01)' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--ink3)' }}>Your Level</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--lime)', marginTop: '4px' }}>Lv {userLevel}</div>
                </div>
                <div style={{ border: '0.5px solid var(--bd)', borderRadius: 'var(--r)', padding: '10px', background: 'rgba(237,234,228,.01)' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--ink3)' }}>{buddy.name}'s Level</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--ink)', marginTop: '4px' }}>Lv {buddy.level}</div>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Actions / Nudges Card */}
          <div className="card">
            <div className="ctit">Send Nudges to {buddy.name}</div>
            <div className="vsub" style={{ margin: '4px 0 16px 0', fontSize: '0.78rem' }}>Trigger instant dialogue bubble interactions.</div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="gbtn hover-3d" 
                onClick={() => handleNudge('coffee')}
                disabled={observerMode}
                style={{ flex: 1, padding: '12px', fontSize: '0.82rem' }}
              >
                ☕ Send Coffee
              </button>
              <button 
                className="gbtn hover-3d" 
                onClick={() => handleNudge('poke')}
                disabled={observerMode}
                style={{ flex: 1, padding: '12px', fontSize: '0.82rem' }}
              >
                ⚡ Poke Buddy
              </button>
              <button 
                className="gbtn hover-3d" 
                onClick={() => handleNudge('challenge')}
                disabled={observerMode}
                style={{ flex: 1, padding: '12px', fontSize: '0.82rem' }}
              >
                🤝 Challenge 1v1
              </button>
            </div>

            {nudgeReply && (
              <div style={{ 
                marginTop: '16px', 
                background: 'rgba(184, 232, 48, 0.08)', 
                border: '0.5px solid rgba(184, 232, 48, 0.25)', 
                padding: '12px 16px', 
                borderRadius: 'var(--r)', 
                fontStyle: 'italic', 
                color: 'var(--lime)',
                fontSize: '0.82rem',
                lineHeight: '1.5',
                animation: 'vfade 0.2s ease'
              }}>
                <strong>{buddy.name} says:</strong> {nudgeReply}
              </div>
            )}
          </div>

          {/* Joint Weekly Milestones */}
          <div className="card">
            <div className="ctit">Joint Weekly Accountability Milestones</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(237,234,228,.02)', padding: '10px 14px', borderRadius: '6px', border: '0.5px solid var(--bd)' }}>
                <div style={{ color: 'var(--lime)', fontWeight: 'bold' }}>✓</div>
                <div style={{ flex: 1, fontSize: '0.8rem' }}>Both logging active practice streaks for 3 days consecutively</div>
                <div style={{ fontSize: '0.7rem', background: 'rgba(184,232,48,.1)', color: 'var(--lime)', padding: '2px 6px', borderRadius: '10px' }}>Completed</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(237,234,228,.02)', padding: '10px 14px', borderRadius: '6px', border: '0.5px solid var(--bd)' }}>
                <div style={{ color: 'var(--ink3)' }}>○</div>
                <div style={{ flex: 1, fontSize: '0.8rem' }}>Accumulate 50 logged evidence points combined this week</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--ink3)' }}>{userPoints + buddy.points} / 250 pts</div>
              </div>
            </div>
          </div>

        </div>

        {/* Live Chat window */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ borderBottom: '0.5px solid var(--bd)', paddingBottom: '12px' }}>
            <div className="ctit">Active Channel: Chat with {buddy.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink3)', marginTop: '4px' }}>
              Strengthening streaks through deep daily logs.
            </div>
          </div>

          {/* Messages Loop */}
          <div style={{ 
            flex: 1, 
            height: '430px', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            padding: '12px 6px',
            marginTop: '10px' 
          }}>
            {chatLog.map((c, i) => (
              <div 
                key={i} 
                className={c.type === 'bot' ? 'chat-msg-bot' : c.type === 'user' ? 'chat-msg-user' : 'chat-typing'}
                style={{
                  lineHeight: '1.45',
                  padding: '10px 14px',
                  borderRadius: c.type === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  border: c.type === 'user' ? '0.5px solid rgba(184,232,48,.18)' : '0.5px solid var(--bd)',
                  background: c.type === 'user' ? 'rgba(184,232,48,.04)' : 'rgba(237,234,228,.02)',
                  fontSize: '0.82rem',
                  maxWidth: '85%'
                }}
              >
                {c.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Action Input Area */}
          <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '0.5px solid var(--bd)' }}>
            <input 
              type="text" 
              className="fi" 
              placeholder={observerMode ? 'Chat disabled in Observer Mode' : `Message ${buddy.name}...`}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendChat()}
              disabled={isTyping || observerMode}
            />
            <button 
              className="sbmt" 
              style={{ padding: '8px 18px', fontSize: '0.8rem' }}
              onClick={handleSendChat}
              disabled={isTyping || observerMode}
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
