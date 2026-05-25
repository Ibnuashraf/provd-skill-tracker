import React, { useState, useRef, useEffect } from 'react';
import { chatWithAi } from './AiService';

const BUDDIES = [
  {
    id: 'alex',
    name: 'Alex',
    role: 'Systems Engineer',
    avatar: '👨‍💻',
    skills: 'Rust, C++, WebAssembly',
    streak: 12,
    points: 184,
    level: 6,
    personality: 'Technical, analytical, precise, and supportive but nerdy.',
    goals: 'Optimize low-level performance of his custom interpreter.',
    systemPrompt: 'You are Alex, a precise Systems Engineer learning Rust & System Architecture. Your current streak is 12 days. Respond to the user in a technical, slightly nerdy, but highly encouraging and analytical tone. Focus on system efficiency, code patterns, and debugging. Keep your response concise (1-2 sentences).'
  },
  {
    id: 'zoe',
    name: 'Zoe',
    role: 'UI/UX Designer',
    avatar: '👩‍🎨',
    skills: 'Figma, SVG Animation, Design Systems',
    streak: 18,
    points: 245,
    level: 7,
    personality: 'High-energy, enthusiastic, passionate about beauty and UX micro-interactions.',
    goals: 'Complete an interactive dark-mode component library.',
    systemPrompt: 'You are Zoe, a passionate UI/UX Designer learning Figma, SVG animations, and design systems. Your current streak is 18 days. Respond to the user in a high-energy, friendly, and visual-focused tone. Use standard design terms (hierarchy, visual balance, micro-animations) and casual emojis. Keep your response concise (1-2 sentences).'
  },
  {
    id: 'kai',
    name: 'Kai',
    role: 'AI Researcher',
    avatar: '🧠',
    skills: 'PyTorch, Transformers, Data Science',
    streak: 8,
    points: 110,
    level: 5,
    personality: 'Deep-thinking, philosophical, calm, focused on theory.',
    goals: 'Train a local language model on specialized documentation.',
    systemPrompt: 'You are Kai, an AI Researcher learning Deep Learning & NLP models. Your current streak is 8 days. Respond to the user in a calm, highly thoughtful, slightly philosophical, and theoretical tone. Focus on conceptual clarity, understanding the mathematics, and the nature of learning. Keep your response concise (1-2 sentences).'
  }
];

export default function BuddyView({ SD, ENTRIES }) {
  const [selBuddyId, setSelBuddyId] = useState('alex');
  const [nudgeReply, setNudgeReply] = useState('');
  const [nudgeType, setNudgeType] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState({
    alex: [{ type: 'bot', text: 'Hey there! I am currently optimizing some memory allocations in my Rust compiler. What skills are you building today?' }],
    zoe: [{ type: 'bot', text: 'OMG hi! I am literally styling the most gorgeous glassmorphism dashboard in Figma right now. How is your streak going?' }],
    kai: [{ type: 'bot', text: 'Greetings. I have been exploring matrix transformations in self-attention layers. Let us share our learning trajectories.' }]
  });
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const activeBuddy = BUDDIES.find(b => b.id === selBuddyId);
  const userStreak = Math.max(...SD.map(s => s.stk), 0);
  const userPoints = ENTRIES.reduce((acc, curr) => acc + curr.pts, 0);
  const userLevel = Math.max(...SD.map(s => s.lv), 1);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, selBuddyId]);

  const handleNudge = (type) => {
    setNudgeType(type);
    let reply = '';
    
    if (type === 'coffee') {
      if (selBuddyId === 'alex') {
        reply = "☕ 'Ah, caffeine injection! Thanks. This will fuel another 3 hours of memory leak debugging. Let's get to work!'";
      } else if (selBuddyId === 'zoe') {
        reply = "☕ 'A cup of pure motivation! Literally the best thing ever. I am so hyped right now, let's ship this!'";
      } else {
        reply = "☕ 'Ah, hot coffee. A perfect stimulant for neural pathways. Thank you, colleague. Let us focus together.'";
      }
    } else if (type === 'poke') {
      if (selBuddyId === 'alex') {
        reply = "⚡ 'Ouch! Alright, compilation successful. No slacking! Have you logged your practice evidence yet?'";
      } else if (selBuddyId === 'zoe') {
        reply = "⚡ 'Ah! *poked!* Fine, fine, closing Pinterest now and starting on the layout! Go log your progress too!'";
      } else {
        reply = "⚡ 'An external signal. Understood. Returning to active learning loop immediately.'";
      }
    } else {
      if (selBuddyId === 'alex') {
        reply = "🤝 'Challenge accepted. Let's push 2 built commits to GitHub tonight. Whoever slacks buys dinner!'";
      } else if (selBuddyId === 'zoe') {
        reply = "🤝 'Oh my gosh, YES! Let's do a screen-share design sprints session tonight. Let's push each other!'";
      } else {
        reply = "🤝 'Collaborative learning yields superior cognitive retention. I am ready. Let us coordinate our focus.'";
      }
    }

    setNudgeReply(reply);
    
    // Add to chat too!
    const logText = type === 'coffee' ? 'Sent coffee ☕' : type === 'poke' ? 'Nudged buddy ⚡' : 'Proposed 1v1 challenge 🤝';
    setChatLog(prev => ({
      ...prev,
      [selBuddyId]: [
        ...prev[selBuddyId],
        { type: 'user', text: `[Action] ${logText}` },
        { type: 'bot', text: reply }
      ]
    }));

    setTimeout(() => {
      setNudgeReply('');
      setNudgeType('');
    }, 4500);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const msgText = chatInput;
    setChatInput('');

    // Add user message & typing indicator
    setChatLog(prev => ({
      ...prev,
      [selBuddyId]: [
        ...prev[selBuddyId],
        { type: 'user', text: msgText },
        { type: 'typing', text: '...' }
      ]
    }));
    setIsTyping(true);

    try {
      // Build message context for Gemini API
      const buddyChatHistory = chatLog[selBuddyId].filter(c => c.type !== 'typing');
      const messages = [
        { role: 'system', content: activeBuddy.systemPrompt },
        ...buddyChatHistory.map(m => ({
          role: m.type === 'bot' ? 'assistant' : 'user',
          content: m.text
        })),
        { role: 'user', content: msgText }
      ];

      const replyText = await chatWithAi(messages);

      setChatLog(prev => {
        const cleanHistory = prev[selBuddyId].filter(c => c.type !== 'typing');
        return {
          ...prev,
          [selBuddyId]: [
            ...cleanHistory,
            { type: 'bot', text: replyText }
          ]
        };
      });
    } catch (e) {
      setChatLog(prev => {
        const cleanHistory = prev[selBuddyId].filter(c => c.type !== 'typing');
        return {
          ...prev,
          [selBuddyId]: [
            ...cleanHistory,
            { type: 'bot', text: `Sorry, lost connection for a second. Let's keep working!` }
          ]
        };
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="view active">
      <div className="vtit">Skill Buddy</div>
      <div className="vsub">Interactive accountability companions to ensure you never learn alone.</div>

      {/* Buddy Selection Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '22px' }}>
        {BUDDIES.map(b => (
          <div 
            key={b.id} 
            className={`card hover-3d ${selBuddyId === b.id ? 'active-buddy-card' : ''}`}
            onClick={() => setSelBuddyId(b.id)}
            style={{ 
              cursor: 'pointer', 
              border: selBuddyId === b.id ? '1px solid var(--lime)' : '0.5px solid var(--bd)',
              background: selBuddyId === b.id ? 'rgba(184, 232, 48, 0.04)' : 'rgba(15, 15, 15, 0.85)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px'
            }}
          >
            <div style={{ fontSize: '2rem' }}>{b.avatar}</div>
            <div>
              <div style={{ fontWeight: '700', color: 'var(--ink)' }}>{b.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--ink2)' }}>{b.role}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--lime)', marginTop: '3px' }}>🔥 {b.streak}d streak</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
        
        {/* Core Accountability Dashboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Side by side stats card */}
          <div className="card" style={{ padding: '22px' }}>
            <div className="ctit">Active Comparison vs {activeBuddy.name}</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '18px' }}>
              
              {/* Streak Comparison */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--ink)' }}>Your Streak: <strong>{userStreak} days</strong></span>
                  <span style={{ color: 'var(--amber)' }}>{activeBuddy.name}'s Streak: <strong>{activeBuddy.streak} days</strong></span>
                </div>
                <div className="sk-bar-bg" style={{ height: '8px', background: 'rgba(237,234,228,.04)' }}>
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <div style={{ 
                      width: `${(userStreak / (userStreak + activeBuddy.streak || 1)) * 100}%`, 
                      background: 'var(--lime)', 
                      borderRadius: '4px 0 0 4px',
                      transition: 'all 0.3s'
                    }} />
                    <div style={{ 
                      width: `${(activeBuddy.streak / (userStreak + activeBuddy.streak || 1)) * 100}%`, 
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
                  <span style={{ color: '#2898D8' }}>{activeBuddy.name}'s Points: <strong>{activeBuddy.points} pts</strong></span>
                </div>
                <div className="sk-bar-bg" style={{ height: '8px', background: 'rgba(237,234,228,.04)' }}>
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <div style={{ 
                      width: `${(userPoints / (userPoints + activeBuddy.points || 1)) * 100}%`, 
                      background: 'var(--lime)', 
                      borderRadius: '4px 0 0 4px',
                      transition: 'all 0.3s'
                    }} />
                    <div style={{ 
                      width: `${(activeBuddy.points / (userPoints + activeBuddy.points || 1)) * 100}%`, 
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
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--ink3)' }}>{activeBuddy.name}'s Level</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--ink)', marginTop: '4px' }}>Lv {activeBuddy.level}</div>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Actions / Nudges Card */}
          <div className="card">
            <div className="ctit">Send accountability Nudges</div>
            <div className="vsub" style={{ margin: '4px 0 16px 0', fontSize: '0.78rem' }}>Interact with {activeBuddy.name} in real-time to trigger instant visual responses.</div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="gbtn hover-3d" 
                onClick={() => handleNudge('coffee')}
                style={{ flex: 1, padding: '12px', fontSize: '0.82rem' }}
              >
                ☕ Send Coffee
              </button>
              <button 
                className="gbtn hover-3d" 
                onClick={() => handleNudge('poke')}
                style={{ flex: 1, padding: '12px', fontSize: '0.82rem' }}
              >
                ⚡ Poke Buddy
              </button>
              <button 
                className="gbtn hover-3d" 
                onClick={() => handleNudge('challenge')}
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
                <strong>{activeBuddy.name} says:</strong> {nudgeReply}
              </div>
            )}
          </div>

          {/* Shared Weekly Challenge Card */}
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
                <div style={{ fontSize: '0.7rem', color: 'var(--ink3)' }}>38 / 50 pts</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(237,234,228,.02)', padding: '10px 14px', borderRadius: '6px', border: '0.5px solid var(--bd)' }}>
                <div style={{ color: 'var(--ink3)' }}>○</div>
                <div style={{ flex: 1, fontSize: '0.8rem' }}>Log at least 1 "Taught" evidence session each to reinforce absolute depth</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--ink3)' }}>1 / 2 done</div>
              </div>
            </div>
          </div>

        </div>

        {/* Live Interactive Dialogue & AI Chat window */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ borderBottom: '0.5px solid var(--bd)', paddingBottom: '12px' }}>
            <div className="ctit">Active Channel: Chat with {activeBuddy.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink3)', marginTop: '4px' }}>
              Focusing on: <span style={{ color: 'var(--ink2)' }}>{activeBuddy.skills}</span>
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
            {chatLog[selBuddyId].map((c, i) => (
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
              placeholder={`Ask ${activeBuddy.name} about ${activeBuddy.id === 'alex' ? 'Rust allocations' : activeBuddy.id === 'zoe' ? 'Figma layout grids' : 'Transformers'}...`}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendChat()}
              disabled={isTyping}
            />
            <button 
              className="sbmt" 
              style={{ padding: '8px 18px', fontSize: '0.8rem' }}
              onClick={handleSendChat}
              disabled={isTyping}
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
