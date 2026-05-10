# 🖤 Portfolio — Glassmorphism Black & White

Website portfolio personal dengan desain glassmorphism hitam-putih, dilengkapi halaman admin untuk mengelola konten. Dibangun dengan **Next.js 14**, **Supabase**, dan di-deploy ke **Vercel**.

---

## 📁 Struktur Project

```
portfolio/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Halaman utama portfolio
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles (glassmorphism)
│   │   ├── admin/
│   │   │   ├── page.tsx          # Halaman login admin
│   │   │   └── dashboard/
│   │   │       └── page.tsx      # Dashboard admin
│   │   └── api/
│   │       └── admin/
│   │           ├── auth/route.ts     # API login
│   │           ├── check/route.ts    # API cek sesi
│   │           └── logout/route.ts   # API logout
│   └── lib/
│       └── supabase.ts           # Supabase client & types
├── supabase-schema.sql           # SQL schema untuk Supabase
├── .env.local.example            # Contoh environment variables
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## 🚀 LANGKAH PEMASANGAN LENGKAP

### BAGIAN 1 — GITHUB

#### 1.1 Buat Repository Baru
1. Buka [github.com](https://github.com) → Login
2. Klik tombol **"New"** (atau tanda `+` → New repository)
3. Isi nama repo, contoh: `portfolio`
4. Pilih **Public** atau **Private**
5. **Jangan** centang "Initialize this repository" (karena kita akan push dari lokal)
6. Klik **"Create repository"**

#### 1.2 Push Kode ke GitHub
Buka terminal di folder project, lalu jalankan:

```bash
# Inisialisasi git
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "feat: initial portfolio setup"

# Hubungkan ke GitHub (ganti USERNAME dan REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Push ke branch main
git branch -M main
git push -u origin main
```

---

### BAGIAN 2 — SUPABASE

#### 2.1 Buat Project Supabase
1. Buka [supabase.com](https://supabase.com) → Login / Daftar
2. Klik **"New Project"**
3. Pilih organisasi (buat baru jika belum ada)
4. Isi:
   - **Name**: `portfolio` (atau nama bebas)
   - **Database Password**: buat password yang kuat, **simpan baik-baik!**
   - **Region**: pilih yang terdekat (contoh: `Southeast Asia (Singapore)`)
5. Klik **"Create new project"** — tunggu ~2 menit sampai selesai

#### 2.2 Ambil Credentials Supabase
1. Di dashboard Supabase, buka **Project Settings** (ikon gear ⚙️ di sidebar kiri bawah)
2. Klik menu **"API"**
3. Catat 3 nilai berikut:
   - **Project URL** → untuk `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role / secret key** → untuk `SUPABASE_SERVICE_ROLE_KEY`

   > ⚠️ **PENTING**: `service_role` key adalah secret — jangan pernah expose ke frontend!

#### 2.3 Jalankan SQL Schema
1. Di sidebar Supabase, klik **"SQL Editor"** (ikon database)
2. Klik **"New query"**
3. Buka file `supabase-schema.sql` dari project ini
4. Copy SELURUH isinya, paste ke SQL Editor
5. Klik tombol **"Run"** (atau tekan `Ctrl+Enter` / `Cmd+Enter`)
6. Pastikan muncul pesan `Success. No rows returned`

#### 2.4 Verifikasi Tabel & Data
1. Di sidebar klik **"Table Editor"**
2. Pastikan ada 3 tabel: `profile`, `skills`, `projects`
3. Klik setiap tabel — pastikan sudah ada data awal (seed)

#### 2.5 Konfigurasi Storage (untuk Upload Foto)
Storage bucket sudah dibuat otomatis oleh SQL schema. Untuk verifikasi:
1. Di sidebar klik **"Storage"**
2. Pastikan ada bucket bernama `photos` dengan status **Public**
3. Jika belum ada, klik **"New bucket"** → nama: `photos` → centang **Public** → Save

---

### BAGIAN 3 — VERCEL (Deploy)

#### 3.1 Import Project ke Vercel
1. Buka [vercel.com](https://vercel.com) → Login dengan akun GitHub
2. Klik **"Add New..."** → **"Project"**
3. Pilih repository `portfolio` dari daftar → Klik **"Import"**
4. Di bagian **"Configure Project"**:
   - **Framework Preset**: Next.js (terdeteksi otomatis ✓)
   - **Root Directory**: `./` (biarkan default)
   - **Build Command**: `npm run build` (biarkan default)
   - **Output Directory**: `.next` (biarkan default)

#### 3.2 Tambahkan Environment Variables
Masih di halaman "Configure Project", scroll ke bawah ke bagian **"Environment Variables"**. Tambahkan satu per satu:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase kamu |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon/public key dari Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key dari Supabase |
| `ADMIN_PASSWORD` | password admin pilihan kamu (contoh: `MySecurePass123!`) |

> 💡 Klik **"Add"** setelah mengisi setiap baris

#### 3.3 Deploy!
1. Klik tombol **"Deploy"**
2. Tunggu proses build (~1-2 menit)
3. Jika berhasil, Vercel akan menampilkan konfeti 🎉 dan URL deployment kamu

---

### BAGIAN 4 — KONFIGURASI LOKAL (Development)

#### 4.1 Install Dependencies
```bash
# Clone repo (jika belum)
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME

# Install packages
npm install
```

#### 4.2 Buat File .env.local
```bash
# Copy contoh env
cp .env.local.example .env.local
```

Buka `.env.local` dan isi dengan credentials dari Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_PASSWORD=passwordAdminKamu
```

#### 4.3 Jalankan Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — selesai! 🎉

---

## 🔧 CARA MENGGUNAKAN ADMIN PANEL

### Akses Admin
- URL: `https://domain-kamu.vercel.app/admin`
- Masukkan `ADMIN_PASSWORD` yang kamu set di environment variables

### Yang Bisa Diubah
| Tab | Yang Bisa Diedit |
|-----|-----------------|
| 👤 **Profile** | Nama, judul, tentang saya, foto profile, email, link sosmed |
| ⚡ **Skills** | Tambah/hapus skill, ubah nama, kategori, level (0-100) |
| 🚀 **Projects** | Tambah/hapus project, ubah judul, deskripsi, tipe, tech stack, URL |

---

## 🛠️ TROUBLESHOOTING

### ❌ Error: "Invalid API key"
→ Cek kembali `NEXT_PUBLIC_SUPABASE_ANON_KEY` di Vercel environment variables. Pastikan tidak ada spasi di awal/akhir.

### ❌ Error: "relation 'profile' does not exist"
→ SQL schema belum dijalankan. Ulangi **Langkah 2.3**.

### ❌ Foto tidak bisa diupload
→ Pastikan bucket `photos` di Supabase sudah di-set sebagai **Public**. Ulangi **Langkah 2.5**.

### ❌ Admin tidak bisa login
→ Cek `ADMIN_PASSWORD` di Vercel. Setelah mengubah env variable di Vercel, kamu perlu **Redeploy**: Vercel Dashboard → Deployments → klik titik tiga di deployment terbaru → **Redeploy**.

### ❌ Build gagal di Vercel
→ Cek tab "Build Logs" di Vercel untuk detail error. Paling umum: salah isi environment variable.

---

## 📦 Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| **Next.js 14** | React framework dengan App Router |
| **TypeScript** | Type safety |
| **Supabase** | Database (PostgreSQL) + Storage |
| **Vercel** | Hosting & deployment |
| **Playfair Display** | Font display (judul) |
| **DM Sans** | Font body |

---

## 🔄 Update Kode

Setelah perubahan kode, cukup:
```bash
git add .
git commit -m "update: deskripsi perubahan"
git push
```
Vercel akan otomatis mendeteksi push dan re-deploy dalam ~1-2 menit.

---

## 📄 Lisensi

MIT — bebas digunakan dan dimodifikasi.
