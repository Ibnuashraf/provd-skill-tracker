import React, { useState, useRef, useEffect } from 'react';
import { LEVEL_NAMES } from './Data';
import { chatWithAi, generateMilestones, generateWeeklyPlan } from './AiService';

export function LogView({ SD, ENTRIES, setENTRIES, observerMode }) {
  const [selType, setSelType] = useState('built');
  const [note, setNote] = useState('');
  const [selSk, setSelSk] = useState(SD.length > 0 ? SD[0].id : '');

  const ptsMap = { built: 4, solved: 3, taught: 5, read: 1 };
  const icMap = { built: '⚒', solved: '🧩', taught: '🗣', read: '📖' };

  const submitLog = () => {
    if (!note.trim()) return alert('Write one sentence about what you did!');
    const skObj = SD.find(s => s.id === selSk) || SD[0];
    const newEnt = { sk: skObj.nm, tp: selType, nt: note, pts: ptsMap[selType], dt: 'Just now' };
    setENTRIES([newEnt, ...ENTRIES]);
    setNote('');
  };

  return (
    <div className="view active">
      <div className="vtit">Log Evidence</div>
      <div className="vsub">What did you build, solve, or learn today?</div>

      {SD.length === 0 ? (
        <div style={{ padding: '20px', background: 'rgba(237,234,228,.03)', border: '.5px dashed var(--bd)', borderRadius: 'var(--r)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>🚀 No skills yet</div>
          <div style={{ color: 'var(--ink3)', marginBottom: '12px' }}>
            Add a skill first (click "+ Add new skill" in the Skills tab) to start logging entries.
          </div>
          <button className="sbmt" onClick={() => setView && setView('skills')} disabled={observerMode}>
            Go to Skills →
          </button>
        </div>
      ) : (
        <div className="lform">
          <div className="lform-tit">New Entry</div>
          <div className="frow">
            <div>
              <label className="flb">Skill</label>
              <select className="fi" value={selSk} onChange={e => setSelSk(e.target.value)}>
                {SD.map(s => <option key={s.id} value={s.id}>{s.ic} {s.nm}</option>)}
              </select>
            </div>
            <div>
              <label className="flb">Evidence type</label>
              <div className="type-row">
                {['built', 'solved', 'taught', 'read'].map(tp => (
                  <button key={tp} className={`tbtn ${selType === tp ? 'sel' : ''}`} onClick={() => setSelType(tp)}>
                    {icMap[tp]} {tp.charAt(0).toUpperCase() + tp.slice(1)} ({ptsMap[tp]}pts)
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="ffull">
            <label className="flb">What did you do? (one sentence)</label>
            <input type="text" className="fi" value={note} onChange={e => setNote(e.target.value)} placeholder="Built a CLI app using lists and file storage…" />
          </div>
          <button className="sbmt" onClick={submitLog} disabled={observerMode} style={{ opacity: observerMode ? 0.5 : 1 }}>
            {observerMode ? 'Disabled in Observer Mode' : 'Log it →'}
          </button>
        </div>
      )}

      <div className="sec-lbl">Recent entries</div>
      <div className="ent-list">
        {ENTRIES.map((e, i) => (
          <div key={i} className="ent">
            <div className={`et et-${e.tp}`}>{icMap[e.tp]}</div>
            <div>
              <div className="en">{e.nt}</div>
              <div className="ensk">{e.sk}</div>
            </div>
            <div className="emet">
              <div className="epts">+{e.pts}pts</div>
              <div className="edt">{e.dt}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
  const [selType, setSelType] = useState('built');
  const [note, setNote] = useState('');
  const [selSk, setSelSk] = useState(SD.length > 0 ? SD[0].id : '');

  const ptsMap = { built: 4, solved: 3, taught: 5, read: 1 };
  const icMap = { built: '⚒', solved: '🧩', taught: '🗣', read: '📖' };

  const submitLog = () => {
    if(!note.trim()) return alert('Write one sentence about what you did!');
    const skObj = SD.find(s => s.id === selSk) || SD[0];
    const newEnt = { sk: skObj.nm, tp: selType, nt: note, pts: ptsMap[selType], dt: 'Just now' };
    setENTRIES([newEnt, ...ENTRIES]);
    setNote('');
  };

  return (
    <div className="view active">
      <div className="vtit">Log Evidence</div>
      <div className="vsub">What did you build, solve, or learn today?</div>
      
      <div className="lform">
        <div className="lform-tit">New Entry</div>
        <div className="frow">
          <div>
            <label className="flb">Skill</label>
            <select className="fi" value={selSk} onChange={e => setSelSk(e.target.value)}>
              {SD.map(s => <option key={s.id} value={s.id}>{s.ic} {s.nm}</option>)}
            </select>
          </div>
          <div>
            <label className="flb">Evidence type</label>
            <div className="type-row">
              {['built', 'solved', 'taught', 'read'].map(tp => (
                <button key={tp} className={`tbtn ${selType === tp ? 'sel' : ''}`} onClick={() => setSelType(tp)}>
                  {icMap[tp]} {tp.charAt(0).toUpperCase() + tp.slice(1)} ({ptsMap[tp]}pts)
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="ffull">
          <label className="flb">What did you do? (one sentence)</label>
          <input type="text" className="fi" value={note} onChange={e => setNote(e.target.value)} placeholder="Built a CLI app using lists and file storage…" />
        </div>
        <button className="sbmt" onClick={submitLog} disabled={observerMode} style={{ opacity: observerMode ? 0.5 : 1 }}>{observerMode ? 'Disabled in Observer Mode' : 'Log it →'}</button>
      </div>
      
      <div className="sec-lbl">Recent entries</div>
      <div className="ent-list">
        {ENTRIES.map((e, i) => (
          <div key={i} className="ent">
            <div className={`et et-${e.tp}`}>{icMap[e.tp]}</div>
            <div><div className="en">{e.nt}</div><div className="ensk">{e.sk}</div></div>
            <div className="emet"><div className="epts">+{e.pts}pts</div><div className="edt">{e.dt}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

const COMMON_SKILLS = [
  { cat: '💻 Tech', skills: [
    { nm: 'Python', ic: '🐍' },
    { nm: 'JavaScript', ic: '⚡' },
    { nm: 'React', ic: '⚛️' },
    { nm: 'SQL', ic: '🗄️' },
    { nm: 'Machine Learning', ic: '🤖' },
    { nm: 'UI Design', ic: '🎨' },
  ]},
  { cat: '🎯 Soft Skills', skills: [
    { nm: 'Public Speaking', ic: '🎤' },
    { nm: 'Writing', ic: '✍️' },
    { nm: 'Leadership', ic: '🦁' },
    { nm: 'Time Management', ic: '⏰' },
    { nm: 'Critical Thinking', ic: '🧠' },
    { nm: 'Negotiation', ic: '🤝' },
  ]},
  { cat: '📊 Business', skills: [
    { nm: 'Marketing', ic: '📣' },
    { nm: 'Product Management', ic: '📋' },
    { nm: 'Data Analysis', ic: '📊' },
    { nm: 'Sales', ic: '💼' },
    { nm: 'Finance', ic: '💰' },
    { nm: 'Project Management', ic: '🗂️' },
  ]},
  { cat: '🎨 Creative', skills: [
    { nm: 'Photography', ic: '📷' },
    { nm: 'Video Editing', ic: '🎬' },
    { nm: 'Graphic Design', ic: '🖌️' },
    { nm: 'Music', ic: '🎵' },
    { nm: 'Content Creation', ic: '📱' },
    { nm: '3D Modeling', ic: '🧊' },
  ]},
];

const SKILL_COLORS = [
  { bc: 'rgba(184,232,48,.14)', bt: '#96C020' },
  { bc: 'rgba(40,152,216,.12)', bt: '#2898D8' },
  { bc: 'rgba(136,120,232,.12)', bt: '#8878E8' },
  { bc: 'rgba(232,120,40,.12)', bt: '#E87828' },
  { bc: 'rgba(232,40,120,.12)', bt: '#E82878' },
  { bc: 'rgba(40,232,200,.12)', bt: '#28E8C8' },
];

export function SkillsView({ SD, setSD, MS, setMS, setView, observerMode }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newSk, setNewSk] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingName, setGeneratingName] = useState('');

  const doAddSkill = async (name, ic) => {
    if (!name.trim() || isGenerating) return;
    setIsGenerating(true);
    setGeneratingName(name);
    setShowAdd(false);

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    // Avoid duplicates
    if (SD.find(s => s.id === id)) { setIsGenerating(false); setGeneratingName(''); return; }

    const colorIdx = SD.length % SKILL_COLORS.length;
    const col = SKILL_COLORS[colorIdx];
    const newObj = { id, nm: name, ic: ic || '✨', lv: 1, tgt: 10, ents: 0, pts: 0, stk: 0, bc: col.bc, bt: col.bt };
    setSD(prev => [...prev, newObj]);

    const newMilestones = await generateMilestones(name);
    setMS(prev => ({ ...prev, [id]: newMilestones }));

    setNewSk('');
    setIsGenerating(false);
    setGeneratingName('');
  };

  return (
    <div className="view active">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'4px'}}>
        <div>
          <div className="vtit">My Skills</div>
          <div className="vsub">Depth over breadth. Every time.</div>
        </div>
        {!observerMode && (
          <button className="nbtn-ghost" style={{padding:'8px 14px',fontSize:'.78rem'}} onClick={() => setShowAdd(v => !v)}>
            {showAdd ? '✕ Cancel' : '+ Add new skill'}
          </button>
        )}
        {observerMode && <span style={{fontSize:'.78rem',color:'var(--ink3)'}}>Read-only Mode</span>}
      </div>

      {/* Generating indicator */}
      {isGenerating && (
        <div style={{background:'rgba(184,232,48,.07)',border:'.5px solid rgba(184,232,48,.2)',borderRadius:'var(--r)',padding:'12px 16px',marginBottom:'16px',fontSize:'.84rem',color:'var(--lime)',display:'flex',alignItems:'center',gap:'10px'}}>
          <span className="star-spin" style={{display:'inline-block'}}>⭐</span>
          Generating milestones for <strong>{generatingName}</strong>… this takes a moment.
        </div>
      )}

      {/* Add Skill Panel */}
      {showAdd && (
        <div style={{background:'rgba(237,234,228,.03)',border:'.5px solid var(--bd)',borderRadius:'var(--r)',padding:'20px',marginBottom:'20px'}}>
          <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.9rem',color:'var(--ink)',marginBottom:'16px'}}>Choose a skill to track</div>

          {COMMON_SKILLS.map(cat => (
            <div key={cat.cat} style={{marginBottom:'16px'}}>
              <div style={{fontSize:'.72rem',fontWeight:600,color:'var(--ink3)',letterSpacing:'.06em',textTransform:'uppercase',marginBottom:'8px'}}>{cat.cat}</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                {cat.skills.map(sk => {
                  const exists = SD.find(s => s.nm === sk.nm);
                  return (
                    <button
                      key={sk.nm}
                      onClick={() => !exists && doAddSkill(sk.nm, sk.ic)}
                      style={{
                        display:'flex',alignItems:'center',gap:'6px',
                        padding:'7px 13px',borderRadius:'30px',fontSize:'.8rem',fontWeight:500,cursor: exists ? 'not-allowed' : 'pointer',
                        background: exists ? 'rgba(184,232,48,.12)' : 'rgba(237,234,228,.06)',
                        border: exists ? '.5px solid rgba(184,232,48,.35)' : '.5px solid var(--bd)',
                        color: exists ? 'var(--lime)' : 'var(--ink2)',
                        transition:'all 0.18s ease',opacity: exists ? 0.7 : 1,
                      }}
                      onMouseEnter={e => { if(!exists) { e.currentTarget.style.background='rgba(184,232,48,.1)'; e.currentTarget.style.color='var(--lime)'; e.currentTarget.style.borderColor='rgba(184,232,48,.4)'; }}}
                      onMouseLeave={e => { if(!exists) { e.currentTarget.style.background='rgba(237,234,228,.06)'; e.currentTarget.style.color='var(--ink2)'; e.currentTarget.style.borderColor='var(--bd)'; }}}
                    >
                      <span>{sk.ic}</span> {sk.nm} {exists ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{borderTop:'.5px solid var(--bd)',paddingTop:'16px',marginTop:'4px'}}>
            <div style={{fontSize:'.72rem',fontWeight:600,color:'var(--ink3)',letterSpacing:'.06em',textTransform:'uppercase',marginBottom:'8px'}}>✏️ Custom skill</div>
            <div style={{display:'flex',gap:'8px'}}>
              <input
                type="text" className="fi" value={newSk}
                onChange={e => setNewSk(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doAddSkill(newSk, '✨')}
                placeholder="Type any skill name…"
                style={{flex:1,padding:'8px 12px',fontSize:'.84rem'}}
              />
              <button className="sbmt" style={{padding:'8px 18px',fontSize:'.8rem'}} onClick={() => doAddSkill(newSk, '✨')} disabled={!newSk.trim()}>
                Add →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {SD.length === 0 && !showAdd && (
        <div style={{textAlign:'center',padding:'60px 20px',background:'rgba(237,234,228,.02)',border:'.5px dashed var(--bd)',borderRadius:'var(--r)',marginBottom:'24px'}}>
          <div style={{fontSize:'3rem',marginBottom:'14px'}}>🎯</div>
          <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.1rem',color:'var(--ink)',marginBottom:'8px'}}>No skills tracked yet</div>
          <div style={{fontSize:'.84rem',color:'var(--ink3)',lineHeight:1.6,maxWidth:'320px',margin:'0 auto 20px auto'}}>
            Add your first skill to start tracking progress, building streaks, and unlocking achievements.
          </div>
          {!observerMode && (
            <button className="sbmt" style={{padding:'10px 24px',fontSize:'.84rem'}} onClick={() => setShowAdd(true)}>
              + Add your first skill
            </button>
          )}
        </div>
      )}

      {SD.filter(s => s.lv < 3).length >= 2 && (
        <div style={{background:'rgba(224,74,32,.08)',border:'.5px solid rgba(224,74,32,.24)',borderRadius:'var(--r)',padding:'11px 15px',marginBottom:'18px',fontSize:'.84rem',color:'#E04A20'}}>
          ⚠️ You're spread thin. Consider going deeper in one skill before adding more.
        </div>
      )}

      <div className="skill-g">
        {SD.map(s => (
          <div key={s.id} className="sk-card" onClick={() => setView('milestones')}>
            <div className="sk-top">
              <div className="sk-nm">{s.ic} {s.nm}</div>
              <div className="sk-bg" style={{background:s.bc, color:s.bt}}>{LEVEL_NAMES[s.lv-1].name}</div>
            </div>
            <div style={{fontSize:'.72rem',color:'var(--ink3)',marginBottom:'9px'}}>{LEVEL_NAMES[s.lv-1].desc}</div>
            <div className="sk-bar-bg" style={{height:'5px'}}><div className="sk-bar" style={{width:`${s.lv*10}%`}}></div></div>
            <div className="sk-meta" style={{marginTop:'8px'}}><span>Lv {s.lv} to {s.tgt}</span><span>🔥{s.stk}d</span><span style={{color:'var(--lime)'}}>⭐{s.pts}pts</span></div>
          </div>
        ))}
      </div>

      {SD.length > 0 && (
        <>
          <div className="sec-lbl" style={{marginTop:'4px'}}>Skill level names — your roadmap</div>
          <div className="lvlname-g">
            {LEVEL_NAMES.map(l => {
              const reached = SD.some(s => s.lv >= l.n);
              return (
                <div key={l.n} className={`lvlname-c ${reached ? 'reached' : 'locked'}`}>
                  <div className="lvl-num">{l.ic} {l.n}</div>
                  <div className="lvl-nm">{l.nm}</div>
                  <div className="lvl-dsc">{l.desc}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function MilestonesView({ SD, MS, setMS, observerMode }) {
  const [curSk, setCurSk] = useState(SD.length > 0 ? SD[0].id : '');
  const list = curSk && MS[curSk] ? MS[curSk] : [];
  const [editingIdx, setEditingIdx] = useState(null);
  const [editTx, setEditTx] = useState('');

  const toggleMs = (i) => {
    if (observerMode) return;
    if (i > 0 && !list[i - 1].done) return;
    const newMs = [...list];
    newMs[i].done = !newMs[i].done;
    setMS({ ...MS, [curSk]: newMs });
  };

  const startEdit = (i, tx) => {
    if (observerMode) return;
    setEditingIdx(i);
    setEditTx(tx);
  };

  const saveEdit = (i) => {
    if(!editTx.trim()) return;
    const newMs = [...list];
    newMs[i].tx = editTx;
    setMS({ ...MS, [curSk]: newMs });
    setEditingIdx(null);
  };

  const addCustomMs = () => {
    const newMs = [...list, { tx: 'Custom milestone', lv: list.length + 1, done: false }];
    setMS({ ...MS, [curSk]: newMs });
  };

  return (
    <div className="view active">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'18px'}}>
        <div>
          <div className="vtit">Milestones</div>
          <div className="vsub">Click any text to edit or manually add steps below.</div>
        </div>
        <button className="nbtn-ghost" style={{padding:'8px 14px',fontSize:'.78rem'}} onClick={addCustomMs} disabled={observerMode}>{observerMode ? 'Read-only' : '+ Add step'}</button>
      </div>
      <div style={{display:'flex',gap:'8px',marginBottom:'18px',flexWrap:'wrap'}}>
        {SD.map(s => (
          <button key={s.id} className={`tbtn ${s.id === curSk ? 'sel' : ''}`} onClick={() => setCurSk(s.id)}>{s.ic} {s.nm}</button>
        ))}
      </div>
      <div className="ms-list">
        {list.map((m, i) => {
          const cur = !m.done && (i === 0 || (list[i - 1] && list[i - 1].done));
          return (
            <div key={i} className={`ms-it ${m.done ? 'done' : cur ? 'cur' : ''}`}>
              <div className="ms-ck" onClick={() => toggleMs(i)}>{m.done ? '✓' : cur ? '○' : ''}</div>
              
              {editingIdx === i ? (
                <input 
                  autoFocus
                  type="text" 
                  className="fi" 
                  style={{flex:1, padding:'6px 10px', fontSize:'.85rem'}}
                  value={editTx}
                  onChange={e => setEditTx(e.target.value)}
                  onBlur={() => saveEdit(i)}
                  onKeyDown={e => e.key === 'Enter' && saveEdit(i)}
                />
              ) : (
                <div className="ms-tx" style={{cursor:'pointer'}} onClick={() => startEdit(i, m.tx)}>Level {m.lv} — {m.tx}</div>
              )}
              
              <div className={`ms-lb ${m.done ? 'ml-done' : cur ? 'ml-cur' : 'ml-lock'}`}>{m.done ? 'Done' : cur ? 'You are here' : 'Locked'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AchievementsView({ ACHS }) {
  const unCount = ACHS.filter(a => a.un).length;
  
  return (
    <div className="view active">
      <div className="vtit">Achievements</div>
      <div className="vsub">Earned through showing up. Not handed out.</div>
      <div style={{fontSize:'.84rem',color:'var(--ink)',fontWeight:500,marginBottom:'8px'}}>
        {unCount} of {ACHS.length} achievements unlocked
      </div>
      <div className="ach-prog-wrap">
        <div className="ach-prog-bar" style={{width: `${(unCount / ACHS.length) * 100}%`}}></div>
      </div>
      <div className="lvl-g">
        {ACHS.map((a, i) => (
          <div key={i} className={`ach-card ${a.un ? 'unlocked' : 'locked'}`}>
            <div className="ach-ic">{a.ic}</div>
            <div className="ach-nm">{a.nm}</div>
            <div className="ach-rq">{a.rq}</div>
            <div className={`ach-st ${a.un ? 'ast-un' : 'ast-lk'}`}>{a.un ? 'Unlocked' : 'Locked'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AiAssistantView({ SD, observerMode }) {
  const [plan, setPlan] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [goal, setGoal] = useState('');
  const [skId, setSkId] = useState(SD.length > 0 ? SD[0].id : '');
  const [chat, setChat] = useState([{ type: 'bot', text: "Hey! I'm here to help you learn. Ask me anything about your skills, concepts you're stuck on, or how to practice more effectively." }]);
  const [msg, setMsg] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const genPlan = async () => {
    const skObj = SD.find(s => s.id === skId);
    if(!skObj) return;
    const g = goal || 'Improve basics';
    setIsPlanning(true);
    setPlan('Generating a custom actionable plan...');
    
    const newPlan = await generateWeeklyPlan(skObj.nm, g);
    
    setPlan(`Goal: ${g}\n\nMon: 30min — ${newPlan[0]}\nWed: 45min — ${newPlan[1]}\nFri: 30min — ${newPlan[2]}`);
    setIsPlanning(false);
  };

  const sendChat = async () => {
    if(!msg.trim()) return;
    const userMsg = msg;
    setMsg('');
    setChat(prev => [...prev, { type: 'user', text: userMsg }, { type: 'typing', text: '...' }]);
    
    // Prepare message history for OpenAI (skip typing indicator)
    const history = chat.filter(c => c.type !== 'typing').map(c => ({
      role: c.type === 'bot' ? 'assistant' : 'user',
      content: c.text
    }));
    history.push({ role: 'user', content: userMsg });

    // Call real OpenAI API
    const replyText = await chatWithAi(history);

    setChat(prev => {
      const nc = [...prev];
      nc.pop(); // remove typing indicator
      nc.push({ type: 'bot', text: replyText });
      return nc;
    });
  };

  return (
    <div className="view active">
      <div className="vtit">AI Study Assistant</div>
      <div className="vsub">Powered by OpenAI to help you plan and learn.</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
        <div className="card" style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <div className="ctit" style={{marginBottom:0}}>Plan your week</div>
          <div>
            <label className="flb">Skill</label>
            <select className="fi" value={skId} onChange={e => setSkId(e.target.value)}>
              {SD.map(s => <option key={s.id} value={s.id}>{s.ic} {s.nm}</option>)}
            </select>
          </div>
          <div>
            <label className="flb">What do you want to achieve this week?</label>
            <input type="text" className="fi" value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g., Learn to use APIs" />
          </div>
          <button className="sbmt" onClick={genPlan} disabled={isPlanning || observerMode}>{isPlanning ? 'Thinking...' : observerMode ? 'Read-only' : 'Generate plan →'}</button>
          {plan && (
            <div style={{marginTop:'12px',background:'rgba(237,234,228,.02)',border:'.5px solid var(--bd)',borderRadius:'var(--r)',padding:'14px',fontSize:'.85rem',color:'var(--ink2)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>
              {plan}
            </div>
          )}
        </div>
        <div className="card" style={{display:'flex',flexDirection:'column'}}>
          <div className="ctit" style={{marginBottom:0}}>Study assistant</div>
          <div style={{flex:1,height:'320px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'10px',marginBottom:'12px',paddingRight:'8px',marginTop:'12px'}}>
            {chat.map((c, i) => (
              <div key={i} className={c.type === 'bot' ? 'chat-msg-bot' : c.type === 'user' ? 'chat-msg-user' : 'chat-typing'}>{c.text}</div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <input type="text" className="fi" value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder={observerMode ? 'Chat disabled in Observer Mode' : 'Ask anything...'} disabled={observerMode} />
            <button className="sbmt" style={{padding:'10px 16px'}} onClick={sendChat} disabled={observerMode}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
