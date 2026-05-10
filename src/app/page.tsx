'use client';

import { useEffect, useState } from 'react';
import { supabase, Profile, Skill, Project } from '@/lib/supabase';
import Image from 'next/image';

const defaultProfile: Profile = {
  id: '1',
  name: 'Nama Kamu',
  title: 'Full Stack Developer',
  about: 'Saya adalah seorang pengembang yang bersemangat dalam menciptakan pengalaman digital yang bermakna. Dengan keahlian dalam pengembangan web dan mobile, saya mengubah ide-ide kompleks menjadi solusi yang elegan dan fungsional.',
  photo_url: '',
  github_url: 'https://github.com',
  linkedin_url: 'https://linkedin.com',
  instagram_url: 'https://instagram.com',
  email: 'hello@email.com',
  updated_at: '',
};

const defaultSkills: Skill[] = [
  { id: '1', name: 'React / Next.js', level: 90, category: 'Frontend', sort_order: 1 },
  { id: '2', name: 'TypeScript', level: 85, category: 'Frontend', sort_order: 2 },
  { id: '3', name: 'Node.js', level: 80, category: 'Backend', sort_order: 3 },
  { id: '4', name: 'Supabase / PostgreSQL', level: 75, category: 'Backend', sort_order: 4 },
  { id: '5', name: 'React Native', level: 70, category: 'Mobile', sort_order: 5 },
  { id: '6', name: 'UI/UX Design', level: 65, category: 'Design', sort_order: 6 },
];

const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'TrackHabit',
    description: 'Aplikasi mobile untuk melacak kebiasaan harian dengan visualisasi data yang indah. Dilengkapi dengan reminder cerdas dan statistik mingguan.',
    type: 'app',
    tech_stack: ['React Native', 'Supabase', 'Expo'],
    image_url: '',
    live_url: '#',
    github_url: 'https://github.com',
    sort_order: 1,
  },
  {
    id: '2',
    title: 'Nusantara Store',
    description: 'Platform e-commerce modern untuk produk lokal Indonesia. Dilengkapi dengan sistem pembayaran terintegrasi dan dashboard analytics real-time.',
    type: 'website',
    tech_stack: ['Next.js', 'TypeScript', 'Stripe', 'Supabase'],
    image_url: '',
    live_url: '#',
    github_url: 'https://github.com',
    sort_order: 2,
  },
];

export default function Home() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    fetchData();
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.3 }
    );
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  async function fetchData() {
    try {
      const [{ data: pData }, { data: sData }, { data: prData }] = await Promise.all([
        supabase.from('profile').select('*').single(),
        supabase.from('skills').select('*').order('sort_order'),
        supabase.from('projects').select('*').order('sort_order'),
      ]);
      if (pData) setProfile(pData);
      if (sData && sData.length > 0) setSkills(sData);
      if (prData && prData.length > 0) setProjects(prData);
    } catch (e) { /* use defaults */ }
    setLoading(false);
  }

  const navLinks = ['Profile', 'Tentang', 'Skill', 'Project', 'Kontak'];

  return (
    <>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, padding: '10px 28px',
        background: 'rgba(8,8,8,0.7)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: '100px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        display: 'flex', gap: '6px', alignItems: 'center',
      }}>
        {navLinks.map(n => (
          <a key={n} href={`#${n.toLowerCase()}`} style={{
            padding: '6px 14px',
            borderRadius: '100px',
            fontSize: '13px',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            letterSpacing: '0.02em',
            color: activeSection === n.toLowerCase() ? '#080808' : 'rgba(240,237,232,0.6)',
            background: activeSection === n.toLowerCase() ? 'rgba(240,237,232,0.9)' : 'transparent',
            transition: 'all 0.3s ease',
          }}>{n}</a>
        ))}
      </nav>

      <main style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO / PROFILE ── */}
        <section id="profile" style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '120px 24px 80px',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '680px' }}>
            {/* Avatar */}
            <div style={{
              width: 160, height: 160, borderRadius: '50%', margin: '0 auto 32px',
              position: 'relative', animation: 'float 6s ease-in-out infinite',
            }}>
              <div style={{
                position: 'absolute', inset: '-4px', borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.05))',
                animation: 'pulse-ring 3s ease-out infinite',
              }} />
              {profile.photo_url ? (
                <Image src={profile.photo_url} alt={profile.name} fill
                  style={{ objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '56px', fontFamily: "'Playfair Display', serif",
                  color: 'rgba(255,255,255,0.4)',
                }}>
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Name */}
            <div style={{
              display: 'inline-block', padding: '4px 16px', marginBottom: '16px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '100px', fontSize: '12px', letterSpacing: '0.15em',
              color: 'rgba(240,237,232,0.5)', textTransform: 'uppercase',
            }}>
              {profile.title}
            </div>
            <h1 style={{
              fontSize: 'clamp(48px, 10vw, 88px)', lineHeight: '1',
              fontFamily: "'Playfair Display', serif", fontWeight: 900,
              marginBottom: '24px',
              background: 'linear-gradient(180deg, #f0ede8 0%, rgba(240,237,232,0.4) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {profile.name}
            </h1>
            <p style={{
              color: 'rgba(240,237,232,0.5)', fontSize: '16px',
              maxWidth: '480px', margin: '0 auto 40px',
            }}>
              {profile.about.substring(0, 120)}...
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={`mailto:${profile.email}`} style={{
                padding: '12px 28px', borderRadius: '100px',
                background: 'rgba(240,237,232,0.9)', color: '#080808',
                fontWeight: 500, fontSize: '14px', letterSpacing: '0.02em',
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(240,237,232,0.9)')}
              >
                Hubungi Saya
              </a>
              <a href="#project" style={{
                padding: '12px 28px', borderRadius: '100px',
                background: 'transparent', color: 'rgba(240,237,232,0.7)',
                border: '1px solid rgba(255,255,255,0.15)',
                fontWeight: 400, fontSize: '14px',
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#f0ede8'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(240,237,232,0.7)'; }}
              >
                Lihat Project
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            color: 'rgba(255,255,255,0.25)', fontSize: '11px', letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            <span>Scroll</span>
            <div style={{
              width: '1px', height: '60px',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
            }} />
          </div>
        </section>

        {/* ── TENTANG ── */}
        <section id="tentang" style={{ padding: '100px 24px', maxWidth: '1000px', margin: '0 auto' }}>
          <SectionLabel>01 — Tentang Saya</SectionLabel>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px', marginTop: '48px',
          }}>
            <div className="glass" style={{ padding: '48px 40px' }}>
              <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.1, marginBottom: '24px' }}>
                Membangun<br />
                <em>hal-hal yang<br />berarti.</em>
              </h2>
              <p style={{ color: 'rgba(240,237,232,0.6)', lineHeight: '1.8', fontSize: '15px' }}>
                {profile.about}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: '⚡', label: 'Pengalaman', value: '3+ Tahun' },
                { icon: '🚀', label: 'Project Selesai', value: '20+ Project' },
                { icon: '🌐', label: 'Klien Happy', value: '15+ Klien' },
              ].map(stat => (
                <div key={stat.label} className="glass" style={{
                  padding: '28px 32px', display: 'flex', alignItems: 'center', gap: '20px',
                  transition: 'all 0.3s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--glass-bg)'; }}
                >
                  <span style={{ fontSize: '28px' }}>{stat.icon}</span>
                  <div>
                    <div style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(240,237,232,0.45)', letterSpacing: '0.05em' }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SKILL ── */}
        <section id="skill" style={{ padding: '100px 24px', maxWidth: '1000px', margin: '0 auto' }}>
          <SectionLabel>02 — Skill Saya</SectionLabel>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px', marginTop: '48px',
          }}>
            {skills.map((skill, i) => (
              <div key={skill.id} className="glass" style={{
                padding: '24px 28px', transition: 'all 0.3s',
                animationDelay: `${i * 0.08}s`,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--glass-bg)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '2px' }}>{skill.name}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(240,237,232,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {skill.category}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '22px', fontFamily: "'Playfair Display', serif",
                    color: 'rgba(240,237,232,0.3)',
                  }}>{skill.level}</span>
                </div>
                <div style={{ height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '1px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${skill.level}%`,
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0.2))',
                    borderRadius: '1px',
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROJECT ── */}
        <section id="project" style={{ padding: '100px 24px', maxWidth: '1000px', margin: '0 auto' }}>
          <SectionLabel>03 — Project Saya</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '48px' }}>
            {projects.map((proj, i) => (
              <div key={proj.id} className="glass" style={{
                padding: '40px',
                display: 'grid',
                gridTemplateColumns: proj.image_url ? '1fr 1fr' : '1fr',
                gap: '40px', alignItems: 'center',
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--glass-bg)'; }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '100px', fontSize: '11px',
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      background: proj.type === 'app' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'rgba(240,237,232,0.6)',
                    }}>
                      {proj.type === 'app' ? '📱 Mobile App' : '🌐 Website'}
                    </span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '32px', marginBottom: '12px', lineHeight: 1.1 }}>{proj.title}</h3>
                  <p style={{ color: 'rgba(240,237,232,0.55)', lineHeight: '1.75', fontSize: '15px', marginBottom: '24px' }}>
                    {proj.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                    {proj.tech_stack.map(t => (
                      <span key={t} style={{
                        padding: '4px 12px', borderRadius: '6px', fontSize: '12px',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(240,237,232,0.5)',
                      }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {proj.live_url && proj.live_url !== '#' && (
                      <a href={proj.live_url} target="_blank" rel="noopener noreferrer" style={{
                        padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 500,
                        background: 'rgba(240,237,232,0.9)', color: '#080808',
                        transition: 'all 0.2s',
                      }}>Live Demo →</a>
                    )}
                    {proj.github_url && (
                      <a href={proj.github_url} target="_blank" rel="noopener noreferrer" style={{
                        padding: '10px 20px', borderRadius: '10px', fontSize: '13px',
                        background: 'transparent', color: 'rgba(240,237,232,0.6)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        transition: 'all 0.2s',
                      }}>GitHub</a>
                    )}
                  </div>
                </div>
                {/* Project visual placeholder */}
                <div style={{
                  aspectRatio: '16/10', borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '48px', position: 'relative', overflow: 'hidden',
                }}>
                  {proj.image_url ? (
                    <Image src={proj.image_url} alt={proj.title} fill style={{ objectFit: 'cover', borderRadius: '12px' }} />
                  ) : (
                    <span style={{ opacity: 0.25 }}>{proj.type === 'app' ? '📱' : '🌐'}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SOCIAL / KONTAK ── */}
        <section id="kontak" style={{ padding: '100px 24px 140px', maxWidth: '1000px', margin: '0 auto' }}>
          <SectionLabel>04 — Social Media</SectionLabel>
          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(36px, 7vw, 72px)', lineHeight: 1.1, marginBottom: '20px' }}>
              Mari Berkolaborasi<br /><em>Bersama.</em>
            </h2>
            <p style={{ color: 'rgba(240,237,232,0.45)', marginBottom: '48px', fontSize: '16px' }}>
              Terbuka untuk project freelance, kolaborasi, dan peluang baru.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
              {[
                { label: 'GitHub', href: profile.github_url, icon: '⌥' },
                { label: 'LinkedIn', href: profile.linkedin_url, icon: 'in' },
                { label: 'Instagram', href: profile.instagram_url, icon: '◎' },
                { label: 'Email', href: `mailto:${profile.email}`, icon: '✉' },
              ].map(s => (
                <a key={s.label} href={s.href} target={s.label !== 'Email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '14px 24px', borderRadius: '14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(240,237,232,0.7)', fontSize: '14px',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)';
                    (e.currentTarget as HTMLElement).style.color = '#f0ede8';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(240,237,232,0.7)';
                  }}
                >
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px' }}>{s.icon}</span>
                  {s.label}
                </a>
              ))}
            </div>
            <a href="/admin" style={{
              fontSize: '12px', color: 'rgba(255,255,255,0.15)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>Admin ↗</a>
          </div>
        </section>
      </main>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <span style={{
        fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'rgba(240,237,232,0.35)',
      }}>{children}</span>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
    </div>
  );
}
