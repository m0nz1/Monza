-- ============================================================
-- PORTFOLIO SUPABASE SCHEMA
-- Jalankan file ini di Supabase SQL Editor
-- ============================================================

-- TABEL: profile
CREATE TABLE IF NOT EXISTS profile (
  id TEXT PRIMARY KEY DEFAULT '1',
  name TEXT NOT NULL DEFAULT 'Nama Kamu',
  title TEXT NOT NULL DEFAULT 'Full Stack Developer',
  about TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  email TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABEL: skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level INTEGER DEFAULT 50 CHECK (level >= 0 AND level <= 100),
  category TEXT DEFAULT 'General',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABEL: projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT DEFAULT 'website' CHECK (type IN ('app', 'website')),
  tech_stack TEXT[] DEFAULT '{}',
  image_url TEXT DEFAULT '',
  live_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public READ untuk semua tabel (portfolio publik)
CREATE POLICY "Public can read profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public can read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public can read projects" ON projects FOR SELECT USING (true);

-- Allow ALL untuk anon (karena kita pakai server-side auth sendiri)
CREATE POLICY "Anon can manage profile" ON profile FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon can manage skills" ON skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon can manage projects" ON projects FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view photos"
ON storage.objects FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Anyone can upload photos"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Anyone can update photos"
ON storage.objects FOR UPDATE USING (bucket_id = 'photos');

CREATE POLICY "Anyone can delete photos"
ON storage.objects FOR DELETE USING (bucket_id = 'photos');

-- ============================================================
-- DATA AWAL (seed)
-- ============================================================

INSERT INTO profile (id, name, title, about, email, github_url, linkedin_url, instagram_url)
VALUES (
  '1',
  'Nama Kamu',
  'Full Stack Developer',
  'Saya adalah seorang pengembang yang bersemangat dalam menciptakan pengalaman digital yang bermakna. Dengan keahlian dalam pengembangan web dan mobile, saya mengubah ide-ide kompleks menjadi solusi yang elegan dan fungsional.',
  'hello@email.com',
  'https://github.com',
  'https://linkedin.com',
  'https://instagram.com'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO skills (name, level, category, sort_order) VALUES
  ('React / Next.js', 90, 'Frontend', 1),
  ('TypeScript', 85, 'Frontend', 2),
  ('Node.js', 80, 'Backend', 3),
  ('Supabase / PostgreSQL', 75, 'Backend', 4),
  ('React Native', 70, 'Mobile', 5),
  ('UI/UX Design', 65, 'Design', 6)
ON CONFLICT DO NOTHING;

INSERT INTO projects (title, description, type, tech_stack, live_url, github_url, sort_order) VALUES
  (
    'TrackHabit',
    'Aplikasi mobile untuk melacak kebiasaan harian dengan visualisasi data yang indah. Dilengkapi dengan reminder cerdas dan statistik mingguan.',
    'app',
    ARRAY['React Native', 'Supabase', 'Expo'],
    'https://trackhabit.app',
    'https://github.com',
    1
  ),
  (
    'Nusantara Store',
    'Platform e-commerce modern untuk produk lokal Indonesia. Dilengkapi dengan sistem pembayaran terintegrasi dan dashboard analytics real-time.',
    'website',
    ARRAY['Next.js', 'TypeScript', 'Stripe', 'Supabase'],
    'https://nusantara.store',
    'https://github.com',
    2
  )
ON CONFLICT DO NOTHING;
