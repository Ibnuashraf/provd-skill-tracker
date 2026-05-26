import React, { useState, useEffect } from 'react';
import { QUOTES } from './Data';
import LoginModal from './LoginModal';
import Logo from './Logo';

export default function Landing({ setUName, setView }) {
  const [qIdx, setQIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [heroStreak, setHeroStreak] = useState(24);
  const [heroBuddyStreak, setHeroBuddyStreak] = useState(21);
  const [heroNudgeMsg, setHeroNudgeMsg] = useState('');

  const handleHeroNudge = (type) => {
    if (type === 'coffee') {
      setHeroStreak(prev => prev + 1);
      setHeroNudgeMsg("☕ 'Thanks for the coffee! Hot caffeinated focus! Your turn to log!' — Ryan");
    } else if (type === 'poke') {
      setHeroNudgeMsg("⚡ 'Ouch! Poked! Fine, fine, closing Twitter and coding now!' — Ryan");
    } else {
      setHeroNudgeMsg("🤝 '1v1 accountability sprint accepted! Let's build!' — Ryan");
    }
    setTimeout(() => setHeroNudgeMsg(''), 4500);
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setQIdx((prev) => (prev + 1) % QUOTES.length);
    }, 6000);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-pop').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, []);

  const handleStart = () => {
    setShowModal(true);
  };

  const handleLogin = (name) => {
    setUName(name);
    setShowModal(false);
    setView('dashboard');
  };

  return (
    <div id="page-landing" className="page active">
      <nav style={{position:'absolute'}}>
        <Logo size="large" />
        <div className="nav-links">
          <a href="#problems" onClick={(e) => {e.preventDefault(); document.getElementById('problems').scrollIntoView({behavior:'smooth'})}}>The problem</a>
          <a href="#how" onClick={(e) => {e.preventDefault(); document.getElementById('how').scrollIntoView({behavior:'smooth'})}}>How it works</a>
          <a href="#features" onClick={(e) => {e.preventDefault(); document.getElementById('features').scrollIntoView({behavior:'smooth'})}}>Features</a>
          <button className="nbtn nbtn-lime" onClick={() => setShowModal(true)}>Sign in</button>
        </div>
      </nav>

      {showModal && <LoginModal onClose={() => setShowModal(false)} onLogin={handleLogin} />}

      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-in">
          <div className="eyebrow" style={{justifyContent:'center'}}>
            <div className="eln"></div>
            <div className="etx">Skill Tracking Protocol v2.5</div>
            <div className="eln"></div>
          </div>
          <h1>Track depth,<br /><span className="il">not</span> <span className="out">delusion</span>.</h1>
          <div className="hero-desc">Most people collect skills on their resume without ever building real competence. Provd is a minimalist tracker for people who actually want to get good.</div>
          <div className="btns">
            <button className="nbtn-lg" onClick={handleStart}>Start tracking free →</button>
            <button className="nbtn-ghost" onClick={() => document.getElementById('problems').scrollIntoView({behavior:'smooth'})}>Read the manifesto</button>
          </div>
        </div>
        
        <div className="mock-ui hover-3d" style={{ maxWidth: '640px', margin: '0 auto', transition: 'all 0.3s ease' }}>
          <div style={{padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:'10px', alignItems:'center'}}>
            <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#E04A20'}}></div>
            <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#FBBC05'}}></div>
            <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#B8E830'}}></div>
            <div style={{marginLeft:'auto', fontSize:'.72rem', color:'var(--ink2)', letterSpacing: '0.04em'}}>🤝 INVITATION ENGINE & COMPARATIVE HUD</div>
          </div>
          
          <div style={{padding:'24px', display:'flex', flexDirection: 'column', gap:'16px'}}>
             <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
               <div style={{flex: 1, minWidth: '180px', background:'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius:'8px', padding:'16px'}}>
                  <div style={{fontSize:'.68rem', textTransform:'uppercase', letterSpacing: '0.05em', color:'var(--ink3)', marginBottom:'6px'}}>Your Active Streak</div>
                  <div style={{fontSize:'1.8rem', color:'var(--lime)', fontWeight:800}}>🔥 {heroStreak} <span style={{fontSize: '0.8rem', color: 'var(--ink2)'}}>days</span></div>
               </div>
               <div style={{flex: 1, minWidth: '180px', background:'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius:'8px', padding:'16px'}}>
                  <div style={{fontSize:'.68rem', textTransform:'uppercase', letterSpacing: '0.05em', color:'var(--ink3)', marginBottom:'6px'}}>Buddy (Ryan) Streak</div>
                  <div style={{fontSize:'1.8rem', color:'var(--amber)', fontWeight:800}}>🔥 {heroBuddyStreak} <span style={{fontSize: '0.8rem', color: 'var(--ink2)'}}>days</span></div>
               </div>
             </div>

             <div style={{ background: 'rgba(255,255,255,0.01)', padding: '14px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.03)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '8px', color: 'var(--ink2)' }}>
                 <span>Streak Ratio comparison meter (Interactive)</span>
                 <span style={{ color: 'var(--lime)' }}>{Math.round((heroStreak/(heroStreak+heroBuddyStreak))*100)}% Yours</span>
               </div>
               <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                 <div style={{ width: `${(heroStreak / (heroStreak + heroBuddyStreak)) * 100}%`, background: 'var(--lime)', transition: 'width 0.4s' }} />
                 <div style={{ width: `${(heroBuddyStreak / (heroStreak + heroBuddyStreak)) * 100}%`, background: 'var(--amber)', transition: 'width 0.4s' }} />
               </div>
             </div>

             <div style={{ display: 'flex', gap: '10px' }}>
               <button className="gbtn hover-3d" onClick={() => handleHeroNudge('coffee')} style={{ padding: '8px 12px', fontSize: '0.74rem', flex: 1 }}>☕ Send Coffee</button>
               <button className="gbtn hover-3d" onClick={() => handleHeroNudge('poke')} style={{ padding: '8px 12px', fontSize: '0.74rem', flex: 1 }}>⚡ Poke Ryan</button>
               <button className="gbtn hover-3d" onClick={() => handleHeroNudge('challenge')} style={{ padding: '8px 12px', fontSize: '0.74rem', flex: 1 }}>🤝 1v1 Sprint</button>
             </div>

             {heroNudgeMsg && (
               <div style={{ 
                 background: 'rgba(184,232,48,0.06)', 
                 border: '0.5px solid rgba(184,232,48,0.2)', 
                 borderRadius: '6px', 
                 padding: '10px 14px', 
                 fontSize: '0.78rem', 
                 color: 'var(--lime)', 
                 fontStyle: 'italic',
                 animation: 'vfade 0.2s ease'
               }}>
                 {heroNudgeMsg}
               </div>
             )}
          </div>
        </div>

        <div className="sc-hint" style={{bottom: '20px'}}>
          <span>Scroll</span>
          <div className="scl"></div>
        </div>
      </section>

      <div className="ticker">
        <div className="tkw">
          {Array(4).fill(['Milestone-based levels','Evidence logging','Consistency streaks','Skill buddy','Activity heatmap','Achievement badges','Growth charts','Depth flag','Free forever']).flat().map((t, i) => (
            <span key={i} className="tki">{t}</span>
          ))}
        </div>
      </div>

      <section id="problems" className="sec">
        <div className="sec-head reveal">
          <div>
            <div className="stag">The Reality Check</div>
            <div className="shd">We are building a generation of shallow experts.</div>
          </div>
          <div className="ssub">Tutorials give the illusion of competence. Certificates prove you paid, not that you can build. Provd exposes the gap between knowing and doing.</div>
        </div>
        <div className="prob-list">
          {[
            { tag: 'Tutorial Hell', class: 'tR', title: 'Passive consumption over active creation', desc: 'Watching a 4-hour video on React feels like work. It\'s not. Until you build something and get stuck, you haven\'t learned anything.', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E04A20" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M10 16v-8l5 4-5 4z"/></svg>' },
            { tag: 'The Breadth Trap', class: 'tB', title: 'Collecting tools instead of mastering them', desc: 'Knowing the syntax of 5 languages is useless if you can\'t build a complete application in one. Breadth is a distraction from true depth.', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2898D8" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>' },
            { tag: 'No Accountability', class: 'tG', title: 'Quitting when the hand-holding stops', desc: 'When the tutorial ends and the real debugging begins, 90% of people quit. Without a system to track small daily wins, motivation dies.', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#96C020" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' }
          ].map((p, i) => (
            <div className={`prob-row hover-3d reveal-left delay-${i+1}`} key={i}>
              <div className="pidx">0{i+1}</div>
              <div style={{flexShrink:0, marginTop:'4px'}} dangerouslySetInnerHTML={{__html: p.icon}}></div>
              <div>
                <div className="ptit">{p.title}</div>
                <div className="pdsc">{p.desc}</div>
              </div>
              <div className={`ptag ${p.class}`}>{p.tag}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="sec-bg">
        <div className="sec-bg-in">
          <div className="sec-head reveal">
            <div>
              <div className="stag">The Protocol</div>
              <div className="shd">How to actually get good.</div>
            </div>
            <div className="ssub">A stripped-down, brutally honest system for tracking your journey from absolute beginner to deep mastery. Powered by AI.</div>
          </div>
          <div className="stps">
            {[
              { num: 'Step 1', title: 'Pick one high-leverage skill', desc: 'Ignore the noise. Pick the highest leverage skill you need right now and commit.' },
              { num: 'Step 2', title: 'AI drafts 10 sequential levels', desc: 'Our curriculum engine instantly breaks down any skill into 10 achievable steps.' },
              { num: 'Step 3', title: 'Invite your Skill Buddy', desc: 'Generate a link. Let your friend observe your growth or pair up as 1v1 competitors.' },
              { num: 'Step 4', title: 'Log raw evidence', desc: 'Build it, solve it, teach it, read it. Earn points only by shipping real work.' }
            ].map((s, i) => (
              <div className={`stp hover-3d reveal-pop delay-${i+1}`} key={i}>
                <div className="snum">{s.num}</div>
                <div className="stit">{s.title}</div>
                <div className="sdsc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="sec">
        <div className="sec-head reveal">
          <div>
            <div className="stag">Features</div>
            <div className="shd">Everything you need. Nothing you don't.</div>
          </div>
          <div className="ssub">No social feeds. No comparison. Just a quiet, focused environment for you to document your growth.</div>
        </div>
        <div className="feat-g">
          {[
            { title: 'Evidence Logging', desc: 'A frictionless way to log what you actually did today. Built, solved, taught, or read.', tag: 'Core mechanism' },
            { title: 'AI 10-Level Curriculum', desc: 'Type any skill, and our AI instantly drafts a customized, sequential 10-step roadmap from beginner to master.', tag: 'Smart planning' },
            { title: 'Consistency Streaks', desc: 'Visual streaks and activity heatmaps to keep you strictly accountable.', tag: 'Psychology' },
            { title: 'Skill Buddy Invites', desc: 'Generate a serverless link. Accountability partners can observe in read-only or join to compare streaks 1v1.', tag: 'Accountability' },
            { title: 'Gemini Weekly Planner', desc: 'Type a specific learning goal, and Gemini will instantly generate an actionable 3-day roadmap.', tag: 'Personalized Coach' },
            { title: 'Progress Analytics', desc: 'Track your learning velocity with detailed insights. See patterns in your growth and identify what works.', tag: 'Data-driven' }
          ].map((f, i) => (
            <div className={`feat-c hover-3d reveal-pop delay-${i+1}`} key={i}>
              <div className="ftit">{f.title}</div>
              <div className="fdsc">{f.desc}</div>
              <div className="ftag">{f.tag}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="promise reveal">
        <div className="promise-in">
          <div className="promise-q">
            {QUOTES[qIdx].q} <br />
            <strong>{QUOTES[qIdx].a}</strong>
          </div>
          <div className="quote-nav" style={{marginBottom:'32px'}}>
            {QUOTES.map((_, i) => (
              <div key={i} className={`q-dot ${i === qIdx ? 'on' : ''}`} onClick={() => setQIdx(i)}></div>
            ))}
          </div>
          <div className="promise-body">
            We built Provd because we were tired of lying to ourselves about our progress. We wanted a tool that rewarded actual building, not just reading about building. It's free, it's private, and it works.
          </div>
        </div>
      </section>

      <section className="cta reveal">
        <div className="cta-rings">
          <div className="cr"></div><div className="cr"></div><div className="cr"></div>
        </div>
        <div className="cta-in">
          <div className="cta-tit">Ready to start?</div>
          <div className="cta-sub">Stop collecting tutorials. Start building competence.</div>
          <button className="nbtn-lg" onClick={handleStart}>Create your free account</button>
        </div>
      </section>

      <footer>
        <Logo size="small" />
        <div className="fcopy" style={{marginTop:'10px'}}>© 2026 Provd. Depth over breadth.</div>
      </footer>
    </div>
  );
}