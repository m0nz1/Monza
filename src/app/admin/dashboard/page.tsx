'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Profile, Skill, Project } from '@/lib/supabase';
import Image from 'next/image';

type Tab = 'profile' | 'skills' | 'projects';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => { checkAuth(); fetchAll(); }, []);

  async function checkAuth() {
    const res = await fetch('/api/admin/check');
    if (!res.ok) router.push('/admin');
  }

  async function fetchAll() {
    const [{ data: p, error: e1 }, { data: s, error: e2 }, { data: pr, error: e3 }] = await Promise.all([
      supabase.from('profile').select('*').single(),
      supabase.from('skills').select('*').order('sort_order'),
      supabase.from('projects').select('*').order('sort_order'),
    ]);
    
    // Tambah ini untuk debug
    if (e1 || e2 || e3) {
      alert('Error: ' + JSON.stringify(e1 || e2 || e3));
    }
    
    if (p) setProfile(p);
    if (s && s.length > 0) setSkills(s);
    if (pr && pr.length > 0) setProjects(pr);
  }

  async function saveProfile() {
    setSaving(true);
    const { error } = await supabase.from('profile').upsert({ ...profile, id: profile.id || '1' });
    setMsg(error ? '❌ Gagal menyimpan' : '✅ Profile berhasil disimpan!');
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  }

  async function uploadPhoto(file: File) {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `profile-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('photos').upload(fileName, file, { upsert: true });
    if (!error && data) {
      const { data: urlData } = supabase.storage.from('photos').getPublicUrl(data.path);
      setProfile(p => ({ ...p, photo_url: urlData.publicUrl }));
    }
    setUploading(false);
  }

  async function saveSkill(skill: Skill) {
    await supabase.from('skills').upsert(skill);
    setMsg('✅ Skill disimpan!');
    setTimeout(() => setMsg(''), 2000);
  }

  async function deleteSkill(id: string) {
    await supabase.from('skills').delete().eq('id', id);
    setSkills(s => s.filter(x => x.id !== id));
  }

  async function addSkill() {
    const newSkill: Skill = {
      id: crypto.randomUUID(),
      name: 'Skill Baru',
      level: 50,
      category: 'General',
      sort_order: skills.length + 1,
    };
    const { error } = await supabase.from('skills').insert(newSkill);
    if (!error) setSkills(s => [...s, newSkill]);
  }

  async function saveProject(proj: Project) {
    await supabase.from('projects').upsert(proj);
    setMsg('✅ Project disimpan!');
    setTimeout(() => setMsg(''), 2000);
  }

  async function deleteProject(id: string) {
    await supabase.from('projects').delete().eq('id', id);
    setProjects(p => p.filter(x => x.id !== id));
  }

  async function addProject() {
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: 'Project Baru',
      description: 'Deskripsi project',
      type: 'website',
      tech_stack: ['React'],
      image_url: '',
      live_url: '',
      github_url: '',
      sort_order: projects.length + 1,
    };
    const { error } = await supabase.from('projects').insert(newProject);
    if (!error) setProjects(p => [...p, newProject]);
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profile', label: '👤 Profile' },
    { key: 'skills', label: '⚡ Skills' },
    { key: 'projects', label: '🚀 Projects' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '32px', paddingTop: '16px',
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif" }}>Admin Panel</h1>
          <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: '13px' }}>Kelola konten portfolio kamu</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/" target="_blank" style={{
            padding: '8px 16px', borderRadius: '10px', fontSize: '13px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(240,237,232,0.6)',
          }}>Lihat Site ↗</a>
          <button onClick={logout} style={{
            padding: '8px 16px', borderRadius: '10px', fontSize: '13px',
            background: 'transparent', border: '1px solid rgba(255,100,100,0.25)',
            color: 'rgba(255,120,120,0.7)', cursor: 'pointer',
          }}>Keluar</button>
        </div>
      </div>

      {/* Notification */}
      {msg && (
        <div style={{
          padding: '12px 20px', marginBottom: '24px', borderRadius: '12px',
          background: msg.includes('❌') ? 'rgba(255,80,80,0.1)' : 'rgba(100,255,150,0.08)',
          border: `1px solid ${msg.includes('❌') ? 'rgba(255,80,80,0.2)' : 'rgba(100,255,150,0.15)'}`,
          fontSize: '14px',
        }}>{msg}</div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '32px',
        background: 'rgba(255,255,255,0.03)', padding: '6px',
        borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)',
        width: 'fit-content',
      }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '10px 20px', borderRadius: '10px', fontSize: '13px',
            background: tab === t.key ? 'rgba(255,255,255,0.1)' : 'transparent',
            border: tab === t.key ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
            color: tab === t.key ? '#f0ede8' : 'rgba(240,237,232,0.45)',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {tab === 'profile' && (
        <div style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.09)', padding: '40px',
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '32px', fontFamily: "'Playfair Display', serif" }}>
            Edit Profile
          </h2>

          {/* Photo */}
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              overflow: 'hidden', position: 'relative', flexShrink: 0,
            }}>
              {profile.photo_url ? (
                <Image src={profile.photo_url} alt="Profile" fill style={{ objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                  {profile.name?.charAt(0) || '?'}
                </div>
              )}
            </div>
            <div>
              <button onClick={() => fileRef.current?.click()} style={{
                padding: '10px 20px', borderRadius: '10px', fontSize: '13px',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#f0ede8', cursor: 'pointer', marginBottom: '6px',
              }}>
                {uploading ? 'Mengupload...' : '📸 Ganti Foto'}
              </button>
              <p style={{ fontSize: '12px', color: 'rgba(240,237,232,0.3)' }}>PNG, JPG max 5MB</p>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => { if (e.target.files?.[0]) uploadPhoto(e.target.files[0]); }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <Field label="Nama Lengkap" value={profile.name || ''} onChange={v => setProfile(p => ({ ...p, name: v }))} />
            <Field label="Judul / Title" value={profile.title || ''} onChange={v => setProfile(p => ({ ...p, title: v }))} />
            <Field label="Email" value={profile.email || ''} onChange={v => setProfile(p => ({ ...p, email: v }))} />
            <Field label="GitHub URL" value={profile.github_url || ''} onChange={v => setProfile(p => ({ ...p, github_url: v }))} />
            <Field label="LinkedIn URL" value={profile.linkedin_url || ''} onChange={v => setProfile(p => ({ ...p, linkedin_url: v }))} />
            <Field label="Instagram URL" value={profile.instagram_url || ''} onChange={v => setProfile(p => ({ ...p, instagram_url: v }))} />
          </div>
          <div style={{ marginTop: '20px' }}>
            <label style={labelStyle}>Tentang Saya</label>
            <textarea value={profile.about || ''} onChange={e => setProfile(p => ({ ...p, about: e.target.value }))}
              rows={5} style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} />
          </div>

          <button onClick={saveProfile} disabled={saving} style={{
            marginTop: '28px', padding: '14px 32px', borderRadius: '12px',
            background: 'rgba(240,237,232,0.9)', color: '#080808',
            fontWeight: 500, fontSize: '14px', border: 'none', cursor: 'pointer',
            opacity: saving ? 0.6 : 1,
          }}>
            {saving ? 'Menyimpan...' : 'Simpan Profile'}
          </button>
        </div>
      )}

      {/* ── SKILLS TAB ── */}
      {tab === 'skills' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontFamily: "'Playfair Display', serif" }}>Edit Skills</h2>
            <button onClick={addSkill} style={{
              padding: '10px 20px', borderRadius: '10px', fontSize: '13px',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#f0ede8', cursor: 'pointer',
            }}>+ Tambah Skill</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {skills.map(skill => (
              <div key={skill.id} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '20px 24px',
                display: 'grid', gridTemplateColumns: '1fr 1fr auto auto auto', gap: '12px', alignItems: 'center',
              }}>
                <input value={skill.name} onChange={e => setSkills(s => s.map(x => x.id === skill.id ? { ...x, name: e.target.value } : x))}
                  style={inputStyle} placeholder="Nama Skill" />
                <input value={skill.category} onChange={e => setSkills(s => s.map(x => x.id === skill.id ? { ...x, category: e.target.value } : x))}
                  style={inputStyle} placeholder="Kategori" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="range" min={0} max={100}
                    value={skill.level}
                    onChange={e => setSkills(s => s.map(x => x.id === skill.id ? { ...x, level: +e.target.value } : x))}
                    style={{ width: '80px', accentColor: 'rgba(240,237,232,0.7)' }} />
                  <span style={{ fontSize: '13px', color: 'rgba(240,237,232,0.5)', width: '30px' }}>{skill.level}</span>
                </div>
                <button onClick={() => saveSkill(skill)} style={{
                  padding: '8px 14px', borderRadius: '8px', fontSize: '12px',
                  background: 'rgba(100,200,130,0.1)', border: '1px solid rgba(100,200,130,0.2)',
                  color: 'rgba(150,230,160,0.8)', cursor: 'pointer',
                }}>Simpan</button>
                <button onClick={() => deleteSkill(skill.id)} style={{
                  padding: '8px 14px', borderRadius: '8px', fontSize: '12px',
                  background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.15)',
                  color: 'rgba(255,120,120,0.7)', cursor: 'pointer',
                }}>Hapus</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PROJECTS TAB ── */}
      {tab === 'projects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontFamily: "'Playfair Display', serif" }}>Edit Projects</h2>
            <button onClick={addProject} style={{
              padding: '10px 20px', borderRadius: '10px', fontSize: '13px',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#f0ede8', cursor: 'pointer',
            }}>+ Tambah Project</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {projects.map(proj => (
              <div key={proj.id} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px', padding: '28px',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <Field label="Judul Project" value={proj.title}
                    onChange={v => setProjects(p => p.map(x => x.id === proj.id ? { ...x, title: v } : x))} />
                  <div>
                    <label style={labelStyle}>Tipe</label>
                    <select value={proj.type}
                      onChange={e => setProjects(p => p.map(x => x.id === proj.id ? { ...x, type: e.target.value as 'app' | 'website' } : x))}
                      style={{ ...inputStyle }}>
                      <option value="app">📱 Mobile App</option>
                      <option value="website">🌐 Website</option>
                    </select>
                  </div>
                  <Field label="Live URL" value={proj.live_url}
                    onChange={v => setProjects(p => p.map(x => x.id === proj.id ? { ...x, live_url: v } : x))} />
                  <Field label="GitHub URL" value={proj.github_url}
                    onChange={v => setProjects(p => p.map(x => x.id === proj.id ? { ...x, github_url: v } : x))} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Deskripsi</label>
                  <textarea value={proj.description} rows={3}
                    onChange={e => setProjects(p => p.map(x => x.id === proj.id ? { ...x, description: e.target.value } : x))}
                    style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Tech Stack (pisahkan dengan koma)</label>
                  <input value={proj.tech_stack.join(', ')}
                    onChange={e => setProjects(p => p.map(x => x.id === proj.id ? { ...x, tech_stack: e.target.value.split(',').map(t => t.trim()) } : x))}
                    style={inputStyle} placeholder="React, Node.js, Supabase" />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => saveProject(proj)} style={{
                    padding: '10px 20px', borderRadius: '10px', fontSize: '13px',
                    background: 'rgba(100,200,130,0.1)', border: '1px solid rgba(100,200,130,0.2)',
                    color: 'rgba(150,230,160,0.8)', cursor: 'pointer',
                  }}>Simpan Project</button>
                  <button onClick={() => deleteProject(proj.id)} style={{
                    padding: '10px 20px', borderRadius: '10px', fontSize: '13px',
                    background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.15)',
                    color: 'rgba(255,120,120,0.7)', cursor: 'pointer',
                  }}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'rgba(240,237,232,0.35)', marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', color: '#f0ede8',
  fontSize: '14px', outline: 'none',
  fontFamily: "'DM Sans', sans-serif",
};

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />
    </div>
  );
}
