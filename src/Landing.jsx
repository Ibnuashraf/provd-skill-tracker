import React, { useState, useEffect } from 'react';
import { QUOTES } from './Data';
import LoginModal from './LoginModal';
import Logo from './Logo';

export default function Landing({ setUName, setView }) {
  const [qIdx, setQIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);

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
            <div className="etx">Skill Tracking Protocol v2.0</div>
            <div className="eln"></div>
          </div>
          <h1>Track depth,<br /><span className="il">not</span> <span className="out">delusion</span>.</h1>
          <div className="hero-desc">Most people collect skills on their resume without ever building real competence. Provd is a minimalist tracker for people who actually want to get good.</div>
          <div className="btns">
            <button className="nbtn-lg" onClick={handleStart}>Start tracking free →</button>
            <button className="nbtn-ghost" onClick={() => document.getElementById('problems').scrollIntoView({behavior:'smooth'})}>Read the manifesto</button>
          </div>
        </div>
        
        <div className="mock-ui">
          <div style={{padding:'20px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:'10px', alignItems:'center'}}>
            <div style={{width:'12px',height:'12px',borderRadius:'50%',background:'#E04A20'}}></div>
            <div style={{width:'12px',height:'12px',borderRadius:'50%',background:'#FBBC05'}}></div>
            <div style={{width:'12px',height:'12px',borderRadius:'50%',background:'#B8E830'}}></div>
            <div style={{marginLeft:'auto', fontSize:'.8rem', color:'var(--ink2)'}}>provd.app/dashboard</div>
          </div>
          <div style={{padding:'30px', display:'flex', gap:'20px'}}>
             <div style={{width:'200px', height:'140px', background:'rgba(255,255,255,0.03)', borderRadius:'8px', padding:'20px'}}>
                <div style={{fontSize:'.8rem', color:'var(--ink2)', marginBottom:'10px'}}>Current Streak</div>
                <div style={{fontSize:'2rem', color:'var(--lime)', fontWeight:800}}>24 days</div>
             </div>
             <div style={{flex:1, height:'140px', background:'rgba(255,255,255,0.03)', borderRadius:'8px', padding:'20px'}}>
                <div style={{fontSize:'.8rem', color:'var(--ink2)', marginBottom:'10px'}}>Activity Heatmap</div>
                <div style={{display:'flex', gap:'4px', flexWrap:'wrap'}}>
                   {Array.from({length: 60}).map((_, i) => (
                      <div key={i} style={{width:'12px', height:'12px', borderRadius:'2px', background: Math.random() > 0.6 ? 'rgba(184,232,48,'+(Math.random()*0.8+0.2)+')' : 'rgba(255,255,255,0.05)'}}></div>
                   ))}
                </div>
             </div>
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
              { num: 'Step 1', title: 'Pick one high-leverage skill', desc: 'Ignore the noise. Pick the highest leverage skill you need right now and commit to it.' },
              { num: 'Step 2', title: 'AI generates your roadmap', desc: 'Our AI instantly breaks down any skill into 5 sequential, achievable milestones.' },
              { num: 'Step 3', title: 'Log the raw evidence', desc: 'Did you build it? Solve it? Read it? Log it. Only real work earns you points.' },
              { num: 'Step 4', title: 'Maintain your streak', desc: 'Don\'t break the streak. Small daily inputs compound rapidly into mastery.' }
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
            { title: 'AI Curriculum Designer', desc: 'Type any skill, and our AI instantly drafts a customized 5-step roadmap tailored for you.', tag: 'Smart planning' },
            { title: 'Consistency Streaks', desc: 'Visual streaks and activity heatmaps to keep you strictly accountable.', tag: 'Psychology' }
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
