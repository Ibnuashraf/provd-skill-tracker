import React, { useState } from 'react';
import { LEVEL_NAMES } from './Data';

export default function Dashboard({ SD, ENTRIES, maxStk, setView }) {
  const [dgDone, setDgDone] = useState(false);

  const topSkill = SD.length > 0 ? SD[0].nm : 'a skill';

  return (
    <div className="view active">
      <div className="vtit">Overview</div>
      <div className="vsub">Consistency is the only metric that matters.</div>

      <div className="stat4">
        <div className="card">
          <div className="ctit">Current streak</div>
          <div className="stat-icon flame-svg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
          </div>
          <div className="cval">{maxStk} <span style={{fontSize:'.9rem',color:'var(--ink2)'}}>days</span></div>
          <div className="csub">Show up tomorrow.</div>
          {maxStk > 7 && (
            <div style={{marginTop:'8px',background:'rgba(224,74,32,.1)',border:'.5px solid rgba(224,74,32,.2)',padding:'4px 8px',borderRadius:'4px',fontSize:'.65rem',color:'var(--rust)',fontWeight:600,display:'inline-block'}}>
              ⚠️ Don't break it!
            </div>
          )}
        </div>

        <div className="card">
          <div className="ctit">Total entries</div>
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="count-ring"><circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="60"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className="cval">{ENTRIES.length}</div>
          <div className="csub">Actions taken</div>
        </div>

        <div className="card">
          <div className="ctit">Total points</div>
          <div className="stat-icon star-spin">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/><circle cx="12" cy="12" r="3" fill="var(--lime)"/></svg>
          </div>
          <div className="cval">{ENTRIES.reduce((a, b) => a + b.pts, 0)}</div>
          <div className="csub">Earned via depth</div>
        </div>

        <div className="card">
          <div className="ctit">Tracked skills</div>
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2898D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10" className="bar-a"/><path d="M12 20V4" className="bar-b"/><path d="M6 20v-6" className="bar-c"/></svg>
          </div>
          <div className="cval">{SD.length}</div>
          <div className="csub">Fewer is better</div>
        </div>
      </div>

      <div className="card" style={{padding:'20px',marginBottom:'20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div className="ctit" style={{marginBottom:'4px',color:'var(--lime)'}}>Today's goal</div>
          <div style={{fontSize:'.9rem',color: dgDone ? 'var(--lime)' : 'var(--ink)', textDecoration: dgDone ? 'line-through' : 'none',transition:'all .2s'}}>
            Log at least 1 Built entry in {topSkill}
          </div>
        </div>
        <button 
          onClick={() => setDgDone(!dgDone)}
          style={{
            width:'28px',height:'28px',borderRadius:'6px',
            border:`1px solid ${dgDone ? 'var(--lime)' : 'var(--bd)'}`,
            background: dgDone ? 'var(--lime)' : 'transparent',
            color: dgDone ? '#080808' : 'transparent',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:'1rem',fontWeight:700,transition:'all .2s'
          }}
        >
          {dgDone ? '✓' : ''}
        </button>
      </div>

      <div className="sec-lbl" style={{marginTop:'4px'}}>Active Skills</div>
      <div className="skill-g">
        {SD.map((s) => (
          <div key={s.id} className="sk-card" onClick={() => setView('milestones')}>
            <div className="sk-top">
              <div className="sk-nm">{s.ic} {s.nm}</div>
              <div className="sk-bg" style={{background:s.bc, color:s.bt}}>{LEVEL_NAMES[s.lv-1].name}</div>
            </div>
            <div className="sk-bar-bg">
              <div className="sk-bar" style={{width: `${s.lv * 10}%`}}></div>
            </div>
            <div className="sk-meta">
              <span>Lv {s.lv}/{s.tgt}</span>
              <span>🔥{s.stk}d</span>
              <span>📋{s.ents}</span>
              <span style={{color:'var(--lime)'}}>⭐{s.pts}pts</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:'16px',marginTop:'20px'}}>
        <div className="card">
          <div className="ctit">Last 4 Weeks Activity</div>
          <div className="hm-g">
            {Array.from({length: 4}).map((_, colIdx) => (
              <div key={colIdx} className="hm-col">
                {Array.from({length: 7}).map((_, rowIdx) => {
                  const intensity = Math.floor(Math.random() * 5); // Simulated intensity 0-4
                  return <div key={rowIdx} className={`hm-cel ${intensity > 0 ? 'hc-'+intensity : ''}`}></div>
                })}
              </div>
            ))}
            <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', paddingLeft:'4px', color:'var(--ink3)', fontSize:'.65rem'}}>
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
          </div>
          <div style={{fontSize:'.75rem',color:'var(--ink2)',marginTop:'12px'}}>14 entries in the last 28 days</div>
        </div>

        <div className="card">
          <div className="ctit">Points Velocity</div>
          <div className="ch-w">
            {[45, 12, 89, 34, 102, 60, 20].map((val, i) => (
              <div key={i} className="ch-b" style={{height: `${Math.max(10, (val/102)*100)}%`}}>
                <div className="ch-lbl">W{i+1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
