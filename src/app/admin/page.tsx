'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('Password salah. Coba lagi.');
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: '400px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: '24px',
        padding: '48px 40px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: '24px',
          }}>⚙</div>
          <h1 style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif", marginBottom: '8px' }}>
            Admin Panel
          </h1>
          <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: '14px' }}>
            Masukkan password untuk lanjut
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block', fontSize: '12px', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(240,237,232,0.4)',
              marginBottom: '8px',
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '14px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${error ? 'rgba(255,100,100,0.4)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px', color: '#f0ede8',
                fontSize: '16px', outline: 'none',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'border 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.35)'}
              onBlur={e => e.target.style.borderColor = error ? 'rgba(255,100,100,0.4)' : 'rgba(255,255,255,0.1)'}
            />
            {error && <p style={{ color: 'rgba(255,120,120,0.8)', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? 'rgba(240,237,232,0.5)' : 'rgba(240,237,232,0.92)',
            color: '#080808', border: 'none', borderRadius: '12px',
            fontSize: '15px', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.2s',
          }}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
            ← Kembali ke Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
