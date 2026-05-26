import { useState } from 'react';
import Logo from './Logo';
import { useAuth } from './AuthContext';

export default function LoginModal({ onClose, onLogin }) {
  const { signIn, signUp, isLocalAuth, toggleLocalAuth } = useAuth();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const { error: err, data } = await signIn(email, password);
    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    if (data?.user) {
      const displayName = data.user.user_metadata?.name || email.split('@')[0] || 'User';
      onLogin(displayName);
    }
  };

  const handleSignup = async () => {
    setError('');
    setLoading(true);

    if (!email || !password || !name) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    const { error: err, data } = await signUp(email, password, name);
    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    if (data?.user) {
      onLogin(name.trim() || email.split('@')[0] || 'User');
    }
  };

  return (
    <div className="ov on" onClick={(e) => e.target.className === 'ov on' && onClose()}>
      <div className="modal">
        <button className="mclose" onClick={onClose}>×</button>
        <div style={{display:'flex',justifyContent:'center',marginBottom:'24px'}}><Logo size="large" showText={false} /></div>
        <div className="mtit">{tab === 'login' ? 'Welcome back' : 'Start your journey'}</div>
        <div className="msub2">{tab === 'login' ? 'Continue your streak' : 'Free forever. No card needed.'}</div>
        
        <div className="tabs">
          <button className={`tab ${tab === 'login' ? 'on' : ''}`} onClick={() => { setTab('login'); setError(''); }}>Sign in</button>
          <button className={`tab ${tab === 'signup' ? 'on' : ''}`} onClick={() => { setTab('signup'); setError(''); }}>Create account</button>
        </div>
        
        {error && (
          <div className="fserr">
            {error}
            {error.toLowerCase().includes('rate limit') && (
              <div style={{ marginTop: '8px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4' }}>
                💡 <strong>Rate Limit Exceeded:</strong> Click the "Switch to Local Mode" button below to bypass cloud limits and test/sign-up instantly!
              </div>
            )}
          </div>
        )}
        
        {tab === 'login' ? (
          <div id="fl">
            <div className="fg"><label className="flbl">Email</label><input type="email" className="finp" placeholder="you@college.edu" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="fg"><label className="flbl">Password</label><input type="password" className="finp" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} /></div>
            <button className="msbt" onClick={handleLogin} disabled={loading}>{loading ? 'Signing in...' : 'Sign in →'}</button>
          </div>
        ) : (
          <div id="fs">
            <div className="fg"><label className="flbl">Name</label><input type="text" className="finp" value={name} onChange={e => setName(e.target.value)} placeholder="What should we call you?" /></div>
            <div className="fg"><label className="flbl">Email</label><input type="email" className="finp" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@college.edu" /></div>
            <div className="fg"><label className="flbl">Password</label><input type="password" className="finp" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" /></div>
            <button className="msbt" onClick={handleSignup} disabled={loading}>{loading ? 'Creating account...' : 'Start free →'}</button>
          </div>
        )}
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginTop: '16px', 
          background: 'rgba(237,234,228,.02)', 
          padding: '10px 14px', 
          borderRadius: '4px', 
          border: '0.5px solid var(--bd)' 
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--ink)' }}>Storage Mode</span>
            <span style={{ fontSize: '0.66rem', color: 'var(--ink3)' }}>{isLocalAuth ? '⚡ Local (Offline/Unlimited)' : '🌐 Supabase Cloud Database'}</span>
          </div>
          <button 
            className="tbtn" 
            style={{ 
              fontSize: '0.7rem', 
              padding: '4px 10px', 
              borderColor: isLocalAuth ? 'var(--lime)' : 'var(--bd)', 
              color: isLocalAuth ? 'var(--lime)' : 'var(--ink2)',
              background: isLocalAuth ? 'rgba(184,232,48,0.06)' : 'transparent',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
            onClick={() => {
              toggleLocalAuth(!isLocalAuth);
              setError('');
            }}
          >
            {isLocalAuth ? 'Switch to Cloud' : 'Switch to Local'}
          </button>
        </div>

        <div className="mdiv">or</div>
        <button className="gbtn" onClick={() => alert('Google sign-in coming soon')}>
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
