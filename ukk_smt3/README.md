# UKK SMT 4 — Dokumentasi Arsitektur, Perbandingan Versi & Panduan Perintah Lengkap

Repositori ini merupakan aplikasi web modern berbasis **Next.js (App Router)**, **TypeScript**, **Prisma ORM**, **MySQL**, dan **Tailwind CSS / Shadcn UI**.  
Dokumen ini disusun sebagai panduan teknis lengkap mencakup arsitektur proyek, perbandingan antara ekosistem versi lama (**Next.js 12 / Prisma lama**) dengan **versi terbaru**, serta seluruh daftar perintah terminal (CMD/Bash) yang digunakan dalam pengembangan.

---

## Daftar Isi
1. [Arsitektur & Perbandingan: Next.js Terbaru vs Next.js 12](#1-arsitektur--perbandingan-nextjs-terbaru-vs-nextjs-12)
2. [Perbandingan & Bedah Lengkap Prisma ORM (Lama vs Terbaru)](#2-perbandingan--bedah-lengkap-prisma-orm-lama-vs-terbaru)
3. [Struktur Direktori Proyek](#3-struktur-direktori-proyek)
4. [Perintah Next.js & NPM Lengkap](#4-perintah-nextjs--npm-lengkap)
5. [Perintah Prisma ORM & Database MySQL Lengkap](#5-perintah-prisma-orm--database-mysql-lengkap)
6. [Perintah Shadcn UI & Tailwind CSS](#6-perintah-shadcn-ui--tailwind-css)
7. [Perintah MySQL & Docker (Port 3307)](#7-perintah-mysql--docker-port-3307)
8. [Perintah Git & GitHub Lengkap (Version Control)](#8-perintah-git--github-lengkap-version-control)
9. [Troubleshooting Error Umum (Catatan Teknis)](#9-troubleshooting-error-umum-catatan-teknis)

---

## 1. Arsitektur & Perbandingan: Next.js Terbaru vs Next.js 12

Perbedaan paling mendasar antara **Next.js 12** (era Pages Router) dan **Next.js versi terbaru** (era App Router) terletak pada cara menangani routing, rendering server/client, dan pengambilan data.

| Aspek Teknis | Proyek Ini (Next.js Terbaru / App Router) | Next.js 12 (Versi Lama / Pages Router) | Penjelasan & Keunggulan Versi Terbaru |
| :--- | :--- | :--- | :--- |
| **Direktori Routing** | `app/` — Berbasis folder. Halaman wajib bernama `page.tsx`. | `pages/` — Berbasis nama file (misal `pages/users.tsx` -> `/users`). | Lebih terstruktur; satu folder rute bisa menampung `page.tsx`, `layout.tsx`, `loading.tsx`, dan `error.tsx` sekaligus. |
| **Komponen Default** | **React Server Components (RSC)** secara default. | **Client Components** secara default (dirender di server lalu di-hydrate penuh di browser). | Kode database/Prisma bisa ditulis langsung di komponen server tanpa bocor ke browser, ukuran JS client jauh lebih kecil. |
| **Interaktivitas Browser** | Wajib menambahkan direktif `"use client"` di baris paling atas jika memakai `useState`, `useEffect`, atau `onClick`. | Tidak mengenal `"use client"`, semua hook React langsung jalan di semua file. | Memisahkan logika tampilan statis (server) dengan logika interaktif (client) secara tegas. |
| **Data Fetching** | Cukup `async function Page()` + `await prisma.user.findMany()` langsung di komponen. | Wajib memakai `getServerSideProps`, `getStaticProps`, atau `fetch()` di dalam `useEffect`. | Menghilangkan *boilerplate code* dan *prop drilling* berlapis-lapis. |
| **Backend API** | **Route Handlers (`app/api/.../route.ts`)** mengekspor fungsi `GET`, `POST`, `PUT`, `DELETE`. | **API Routes (`pages/api/...`)** memakai satu handler `export default function handler(req, res)`. | Menggunakan standar Web `Request` dan `Response` modern; lebih rapi karena setiap metode HTTP punya fungsinya sendiri. |
| **Layouting** | **Nested Layouts (`layout.tsx`)** — Sidebar/Navbar tidak ikut me-render ulang saat pindah sub-halaman. | Harus membungkus `_app.tsx` atau memanggil komponen `<Layout>` manual di setiap halaman. | Navigasi antar halaman admin terasa instan seperti SPA (*Single Page Application*). |
| **Compiler & Bundler** | **Turbopack / SWC terbaru** (berbasis bahasa Rust). | **Webpack 5 / SWC generasi awal**. | Proses `npm run dev` dan *Fast Refresh* saat simpan file jauh lebih cepat. |

---

## 2. Perbandingan & Bedah Lengkap Prisma ORM (Lama vs Terbaru)

**Prisma** adalah ORM (*Object-Relational Mapping*) modern untuk Node.js dan TypeScript yang menjembatani kode aplikasi dengan database MySQL secara *type-safe* (otomatis mendeteksi tipe kolom tabel).

### A. Perbandingan Prisma Versi Lama (Era Next.js 12) vs Prisma Terbaru
| Fitur / Konsep | Prisma Terbaru (v6 / v7 / v8+) | Prisma Lama (v3 / v4 — Era Next.js 12) | Keterangan |
| :--- | :--- | :--- | :--- |
| **Konfigurasi Koneksi** | Mendukung `prisma.config.ts` / driver adapters (seperti `@prisma/adapter-mariadb` / MySQL) serta pemisahan konfigurasi CLI dan runtime. | Semua URL koneksi dan generator hanya ditaruh di dalam `prisma/schema.prisma`. | Versi terbaru jauh lebih fleksibel untuk *edge runtime*, serverless, dan kontrol *connection pool*. |
| **Generator Client** | Output client bisa dikustomisasi path-nya (misal `generated/prisma` atau `@prisma/client`) dengan validasi *contract* yang ketat. | Selalu menghasilkan file ke `node_modules/.prisma/client`. | Jika ada ketidaksesuaian versi CLI dan Client, versi terbaru langsung memunculkan error *contract* agar bug tidak lolos ke produksi. |
| **Performa Query & Join** | Mendukung strategi `relationLoadStrategy: "join"` (melakukan `JOIN` langsung di level SQL). | Sering melakukan beberapa query terpisah di balik layar untuk relasi data. | Query relasi antar tabel di MySQL menjadi jauh lebih cepat dan hemat beban CPU database. |
| **TypedSQL** | Mendukung penulisan query SQL mentah di file `.sql` yang otomatis diubah menjadi fungsi TypeScript *type-safe*. | Hanya memiliki `$queryRaw` yang tipe kembaliannya `unknown` / `any`. | Sangat membantu jika butuh query laporan kompleks tanpa kehilangan *autocomplete* TypeScript. |

### B. Fungsi Utama Bagian-Bagian Prisma di Proyek Ini
1. **`prisma/schema.prisma` (Blueprint Database):**
   * `datasource db`: Menentukan jenis database (`mysql`) dan mengambil alamat koneksi dari `.env` (`env("DATABASE_URL")`).
   * `generator client`: Menginstruksikan Prisma untuk membuat kode TypeScript (*Prisma Client*) berdasarkan model tabel.
   * `model User { ... }`: Mendefinisikan struktur tabel, tipe data (`Int`, `String`, `DateTime`), *Primary Key* (`@id @default(autoincrement())`), nilai unik (`@unique`), serta pemetaan nama tabel asli (`@@map("users")`).
2. **Prisma Client Singleton (`lib/prisma.ts`):**
   * Berfungsi mencegah pembuatan koneksi MySQL berulang-ulang setiap kali Next.js melakukan *hot-reload* saat pengembangan (yang sering menyebabkan error `Too many connections`).
3. **Operasi CRUD Utama di Backend (`app/api/.../route.ts`):**
   * `prisma.user.findMany()` -> Mengambil semua data (`SELECT * FROM users`).
   * `prisma.user.findUnique({ where: { id } })` -> Mencari 1 data spesifik berdasarkan ID/Email.
   * `prisma.user.create({ data: { ... } })` -> Menambah baris data baru (`INSERT INTO`).
   * `prisma.user.update({ where: { id }, data: { ... } })` -> Memperbarui data (`UPDATE`).
   * `prisma.user.delete({ where: { id } })` -> Menghapus data (`DELETE`).
   * `prisma.user.count()` -> Menghitung total baris data (`SELECT COUNT(*)`).

---

## 3. Struktur Direktori Proyek

```text
ukk_smt4/
├── app/                        # [App Router] Seluruh halaman & endpoint API
│   ├── api/                    # Backend API Route Handlers (GET, POST, PUT, DELETE)
│   │   ├── auth/               # Endpoint autentikasi (login, logout, session)
│   │   └── users/              # Endpoint CRUD manajemen user
│   ├── admin/                  # Halaman dashboard & manajemen data
│   ├── globals.css             # Konfigurasi CSS global & variabel tema Tailwind
│   ├── layout.tsx              # Root layout utama aplikasi
│   └── page.tsx                # Halaman beranda (/)
├── components/                 # Komponen UI modular
│   └── ui/                     # Komponen dasar dari Shadcn UI (Button, Input, Table, Dialog)
├── lib/                        # Fungsi utilitas & konfigurasi library
│   ├── prisma.ts               # Instance tunggal (Singleton) Prisma Client
│   └── utils.ts                # Helper penggabungan class Tailwind (cn)
├── prisma/                     # Konfigurasi & skema database ORM
│   └── schema.prisma           # Definisi tabel, relasi, dan generator Prisma
├── public/                     # Aset statis (gambar, ikon, logo) yang diakses via /nama-file
├── .env                        # Variabel rahasia lokal (DATABASE_URL, JWT_SECRET) - JANGAN DI-PUSH
├── .gitignore                  # Daftar file/folder yang diabaikan oleh Git
├── next.config.ts              # Konfigurasi Next.js (image domains, redirects, dll.)
├── package.json                # Daftar library/dependencies dan skrip perintah NPM
└── tsconfig.json               # Konfigurasi compiler TypeScript & path alias (@/*)

# ==============================================================================
# INISIALISASI, INSTALASI & SERVER NEXT.JS
# ==============================================================================

# 1. Membuat proyek Next.js baru (versi terbaru dengan App Router, TypeScript, Tailwind)
npx create-next-app@latest nama-proyek
# [Perbandingan Next.js 12]: Dulu menggunakan `npx create-next-app@12 nama-proyek` (struktur folder pages/)

# 2. Menginstall seluruh paket/library yang tercatat di package.json
npm install

# 3. Menginstall library tambahan (contoh: icon lucide-react, bcryptjs untuk hash password)
npm install lucide-react bcryptjs
npm install -D @types/bcryptjs

# 4. Menjalankan server development lokal (default: http://localhost:3000)
npm run dev

# 5. Menjalankan server development di port khusus (misal port 3001 jika 3000 dipakai)
npx next dev -p 3001

# 6. Mem-build aplikasi untuk produksi (mengecek error TypeScript, ESLint, dan optimasi bundle)
npm run build

# 7. Menjalankan hasil build produksi secara lokal (wajib `npm run build` terlebih dahulu)
npm run start

# 8. Mengecek standar penulisan kode menggunakan ESLint
npm run lint

# 9. Membersihkan cache build Next.js jika terjadi error aneh pada routing/komponen
# [Windows CMD]:
rmdir /s /q .next
# [Git Bash / Linux / Mac]:
rm -rf .next

# ==============================================================================
# INISIALISASI & GENERATE CLIENT
# ==============================================================================

# 1. Inisialisasi Prisma pertama kali (membuat folder prisma/schema.prisma & template .env)
npx prisma init

# 2. Inisialisasi Prisma dengan provider database langsung diset ke MySQL
npx prisma init --datasource-provider mysql

# 3. Generate ulang Prisma Client (WAJIB dijalankan setiap selesai edit schema.prisma)
# Mengompilasi model tabel menjadi fungsi TypeScript di dalam aplikasi
npx prisma generate

# ==============================================================================
# SINKRONISASI SKEMA & MIGRASI DATABASE
# ==============================================================================

# 4. Mendorong perubahan schema.prisma langsung ke MySQL tanpa membuat file riwayat migrasi
# Sangat cepat untuk tahap prototyping/development agar tabel langsung terbuat di MySQL
npx prisma db push

# 5. Mendorong skema dengan memaksa reset jika ada perubahan kolom yang berpotensi menghilangkan data
npx prisma db push --force-reset

# 6. Membuat migrasi resmi & menerapkannya ke database (menyimpan file SQL di prisma/migrations/)
npx prisma migrate dev --name deskripsi_perubahan

# 7. Mengecek status migrasi (apakah semua file migrasi sudah diterapkan ke database)
npx prisma migrate status

# 8. Menerapkan migrasi pada server produksi (tidak membuat migrasi baru, hanya mengeksekusi yang ada)
npx prisma migrate deploy

# 9. Mereset total seluruh database (MENGHAPUS SEMUA DATA) lalu menjalankan ulang semua migrasi
npx prisma migrate reset

# ==============================================================================
# INTROSPECTION, SEEDING, STUDIO & VALIDASI
# ==============================================================================

# 10. Menarik struktur tabel dari MySQL yang sudah ada ke dalam schema.prisma (Introspection)
# Berguna jika tabel dibuat manual melalui DBeaver / phpMyAdmin
npx prisma db pull

# 11. Membuka Prisma Studio (antarmuka web di http://localhost:5555 untuk lihat/tambah/edit data)
npx prisma studio

# 12. Menjalankan script seeding (mengisi data awal otomatis seperti akun admin default)
npx prisma db seed

# 13. Merapikan indentasi dan format penulisan file prisma/schema.prisma
npx prisma format

# 14. Memvalidasi apakah ada kesalahan syntax atau relasi pada file prisma/schema.prisma
npx prisma validate

# 15. Mengecek versi CLI Prisma dan versi Engine yang sedang terpasang
npx prisma -v

# ==============================================================================
# KOMPONEN ANTARMUKA (SHADCN UI)
# ==============================================================================

# 1. Inisialisasi konfigurasi Shadcn UI (membuat components.json & lib/utils.ts)
npx shadcn@latest init
# [Perbandingan Versi Lama]: Dulu menggunakan `npx shadcn-ui@latest init`

# 2. Menambahkan komponen UI spesifik ke folder components/ui/
npx shadcn@latest add button input label table dialog card badge select alert

# 3. Menginstall semua komponen Shadcn UI sekaligus
npx shadcn@latest add --all

# ==============================================================================
# CEK KONEKSI & MANAJEMEN CONTAINER MYSQL (PORT 3307)
# ==============================================================================

# 1. Format standar variabel koneksi di dalam file .env:
# DATABASE_URL="mysql://root:password_kamu@localhost:3307/nama_database"

# 2. Mengecek container Docker MySQL yang sedang berjalan
docker ps

# 3. Menyalakan / menghentikan container MySQL jika memakai Docker
docker start nama_container_mysql
docker stop nama_container_mysql

# 4. Masuk ke terminal CLI MySQL secara langsung melalui Docker
docker exec -it nama_container_mysql mysql -u root -p

# 5. Mengecek apakah port 3307 sudah aktif/listening di Windows CMD
netstat -ano | findstr :3307

# ==============================================================================
# ALUR KERJA HARIAN (MENYIMPAN & MENGIRIM PERUBAHAN KE GITHUB)
# ==============================================================================

# 1. Mengecek status file (untracked / merah = baru, modified = diubah, staged / hijau = siap commit)
git status

# 2. Menambahkan seluruh perubahan file ke Staging Area
# (File/folder di dalam .gitignore seperti .env, node_modules/, .next/ otomatis dilewati)
git add .

# 3. Menambahkan satu file atau folder tertentu saja ke Staging Area
git add app/api/users/route.ts

# 4. Menyimpan riwayat perubahan (snapshot) ke repositori lokal
git commit -m "feat: melengkapi modul user management dan dokumentasi"

# 5. Mengirim commit terbaru dari komputer lokal ke GitHub (branch main)
git push origin main

# 6. Mengambil & menggabungkan update terbaru dari GitHub ke komputer lokal
git pull origin main

# ==============================================================================
# SETUP AWAL REPOSITORI & REMOTE GITHUB
# ==============================================================================

# 7. Menginisialisasi folder proyek menjadi repositori Git lokal
git init

# 8. Mengatur nama dan email identitas pembuat commit
git config user.name "Cepi Handani"
git config user.email "email_github_kamu@example.com"

# 9. Menghubungkan repositori lokal ke URL repositori GitHub
git remote add origin [https://github.com/Ceps-Sys/UKK_SMT4_Cepi.git](https://github.com/Ceps-Sys/UKK_SMT4_Cepi.git)

# 10. Mengecek daftar URL remote yang terhubung
git remote -v

# 11. Mengubah URL remote jika salah ketik alamat repositori
git remote set-url origin [https://github.com/Ceps-Sys/UKK_SMT4_Cepi.git](https://github.com/Ceps-Sys/UKK_SMT4_Cepi.git)

# 12. Mengganti nama branch default menjadi main
git branch -M main

# 13. Push pertama kali sekaligus mengatur upstream (-u) agar selanjutnya cukup ketik `git push`
git push -u origin main

# ==============================================================================
# INSPEKSI RIWAYAT, BRANCHING & PERBAIKAN KESALAHAN GIT
# ==============================================================================

# 14. Melihat riwayat commit secara ringkas dalam 1 baris per commit
git log --oneline -n 10

# 15. Melihat perbedaan baris kode yang diubah sebelum di-add/commit
git diff

# 16. Membatalkan file yang sudah terlanjur masuk `git add` (mengembalikan ke unstaged)
git reset HEAD nama_file.tsx

# 17. Menghapus file dari pelacakan Git TANPA menghapus file fisik di komputer
# (Wajib dipakai jika file .env atau folder AI tools terlanjur ter-commit sebelum masuk .gitignore)
git rm --cached .env
git rm -r --cached .agents/ .claude/ .cursor/

# 18. Membuat branch baru untuk eksperimen fitur tanpa mengganggu branch main
git checkout -b fitur-baru



# UKK SMT 4 — Dokumentasi Arsitektur, Panduan CRUD (Next.js Terbaru vs v12) & Perintah Lengkap

Repositori ini merupakan aplikasi web modern berbasis **Next.js (App Router)**, **TypeScript**, **Prisma ORM**, **MySQL**, dan **Tailwind CSS / Shadcn UI**.  
Dokumen ini disusun sebagai panduan teknis lengkap mencakup arsitektur proyek, perbandingan ekosistem **Next.js versi terbaru** dengan **Next.js 12**, panduan lengkap pembuatan **CRUD** pada kedua versi, serta daftar seluruh perintah terminal (CMD/Bash).

---

## Daftar Isi
1. [Arsitektur & Perbandingan: Next.js Terbaru vs Next.js 12](#1-arsitektur--perbandingan-nextjs-terbaru-vs-nextjs-12)
2. [Perbandingan & Bedah Lengkap Prisma ORM (Lama vs Terbaru)](#2-perbandingan--bedah-lengkap-prisma-orm-lama-vs-terbaru)
3. [Panduan Lengkap Pembuatan CRUD: Next.js Terbaru vs Next.js 12](#3-panduan-lengkap-pembuatan-crud-nextjs-terbaru-vs-nextjs-12)
4. [Struktur Direktori Proyek](#4-struktur-direktori-proyek)
5. [Perintah Next.js & NPM Lengkap](#5-perintah-nextjs--npm-lengkap)
6. [Perintah Prisma ORM & Database MySQL Lengkap](#6-perintah-prisma-orm--database-mysql-lengkap)
7. [Perintah Shadcn UI & Tailwind CSS](#7-perintah-shadcn-ui--tailwind-css)
8. [Perintah MySQL & Docker (Port 3307)](#8-perintah-mysql--docker-port-3307)
9. [Perintah Git & GitHub Lengkap (Version Control)](#9-perintah-git--github-lengkap-version-control)
10. [Troubleshooting Error Umum (Catatan Teknis)](#10-troubleshooting-error-umum-catatan-teknis)

---

## 1. Arsitektur & Perbandingan: Next.js Terbaru vs Next.js 12

Perbedaan paling mendasar antara **Next.js 12** (era Pages Router) dan **Next.js versi terbaru** (era App Router) terletak pada cara menangani routing, rendering server/client, dan pengambilan data.

| Aspek Teknis | Proyek Ini (Next.js Terbaru / App Router) | Next.js 12 (Versi Lama / Pages Router) | Penjelasan & Keunggulan Versi Terbaru |
| :--- | :--- | :--- | :--- |
| **Direktori Routing** | `app/` — Berbasis folder. Halaman wajib bernama `page.tsx`. | `pages/` — Berbasis nama file (misal `pages/users.tsx` -> `/users`). | Lebih terstruktur; satu folder rute bisa menampung `page.tsx`, `layout.tsx`, `loading.tsx`, dan `error.tsx` sekaligus. |
| **Komponen Default** | **React Server Components (RSC)** secara default. | **Client Components** secara default (dirender di server lalu di-hydrate penuh di browser). | Kode database/Prisma bisa ditulis langsung di komponen server tanpa bocor ke browser, ukuran JS client jauh lebih kecil. |
| **Interaktivitas Browser** | Wajib menambahkan direktif `"use client"` di baris paling atas jika memakai `useState`, `useEffect`, atau `onClick`. | Tidak mengenal `"use client"`, semua hook React langsung jalan di semua file. | Memisahkan logika tampilan statis (server) dengan logika interaktif (client) secara tegas. |
| **Data Fetching** | Cukup `async function Page()` + `await prisma.user.findMany()` langsung di komponen. | Wajib memakai `getServerSideProps`, `getStaticProps`, atau `fetch()` di dalam `useEffect`. | Menghilangkan *boilerplate code* dan *prop drilling* berlapis-lapis. |
| **Backend API** | **Route Handlers (`app/api/.../route.ts`)** mengekspor fungsi `GET`, `POST`, `PUT`, `DELETE`. | **API Routes (`pages/api/...`)** memakai satu handler `export default function handler(req, res)`. | Menggunakan standar Web `Request` dan `Response` modern; lebih rapi karena setiap metode HTTP punya fungsinya sendiri. |
| **Layouting** | **Nested Layouts (`layout.tsx`)** — Sidebar/Navbar tidak ikut me-render ulang saat pindah sub-halaman. | Harus membungkus `_app.tsx` atau memanggil komponen `<Layout>` manual di setiap halaman. | Navigasi antar halaman admin terasa instan seperti SPA (*Single Page Application*). |
| **Compiler & Bundler** | **Turbopack / SWC terbaru** (berbasis bahasa Rust). | **Webpack 5 / SWC generasi awal**. | Proses `npm run dev` dan *Fast Refresh* saat simpan file jauh lebih cepat. |

---

## 2. Perbandingan & Bedah Lengkap Prisma ORM (Lama vs Terbaru)

**Prisma** adalah ORM (*Object-Relational Mapping*) modern untuk Node.js dan TypeScript yang menjembatani kode aplikasi dengan database MySQL secara *type-safe* (otomatis mendeteksi tipe kolom tabel).

### A. Perbandingan Prisma Versi Lama (Era Next.js 12) vs Prisma Terbaru
| Fitur / Konsep | Prisma Terbaru (v6 / v7 / v8+) | Prisma Lama (v3 / v4 — Era Next.js 12) | Keterangan |
| :--- | :--- | :--- | :--- |
| **Konfigurasi Koneksi** | Mendukung `prisma.config.ts` / driver adapters (seperti `@prisma/adapter-mariadb` / MySQL) serta pemisahan konfigurasi CLI dan runtime. | Semua URL koneksi dan generator hanya ditaruh di dalam `prisma/schema.prisma`. | Versi terbaru jauh lebih fleksibel untuk *edge runtime*, serverless, dan kontrol *connection pool*. |
| **Generator Client** | Output client bisa dikustomisasi path-nya (misal `generated/prisma` atau `@prisma/client`) dengan validasi *contract* yang ketat. | Selalu menghasilkan file ke `node_modules/.prisma/client`. | Jika ada ketidaksesuaian versi CLI dan Client, versi terbaru langsung memunculkan error *contract* agar bug tidak lolos ke produksi. |
| **Performa Query & Join** | Mendukung strategi `relationLoadStrategy: "join"` (melakukan `JOIN` langsung di level SQL). | Sering melakukan beberapa query terpisah di balik layar untuk relasi data. | Query relasi antar tabel di MySQL menjadi jauh lebih cepat dan hemat beban CPU database. |
| **TypedSQL** | Mendukung penulisan query SQL mentah di file `.sql` yang otomatis diubah menjadi fungsi TypeScript *type-safe*. | Hanya memiliki `$queryRaw` yang tipe kembaliannya `unknown` / `any`. | Sangat membantu jika butuh query laporan kompleks tanpa kehilangan *autocomplete* TypeScript. |

### B. Fungsi Utama Bagian-Bagian Prisma di Proyek Ini
1. **`prisma/schema.prisma` (Blueprint Database):**
   * `datasource db`: Menentukan jenis database (`mysql`) dan mengambil alamat koneksi dari `.env` (`env("DATABASE_URL")`).
   * `generator client`: Menginstruksikan Prisma untuk membuat kode TypeScript (*Prisma Client*) berdasarkan model tabel.
   * `model User { ... }`: Mendefinisikan struktur tabel, tipe data (`Int`, `String`, `DateTime`), *Primary Key* (`@id @default(autoincrement())`), nilai unik (`@unique`), serta pemetaan nama tabel asli (`@@map("users")`).
2. **Prisma Client Singleton (`lib/prisma.ts`):**
   * Berfungsi mencegah pembuatan koneksi MySQL berulang-ulang setiap kali Next.js melakukan *hot-reload* saat pengembangan (yang sering menyebabkan error `Too many connections`).

---

## 3. Panduan Lengkap Pembuatan CRUD: Next.js Terbaru vs Next.js 12

Bagian ini membandingkan secara langsung alur pembuatan fitur **CRUD (Create, Read, Update, Delete)** dari lapisan database hingga tampilan antarmuka pada kedua versi Next.js.

### Tahap 1: Model Database (`prisma/schema.prisma`) & Singleton (`lib/prisma.ts`)
*(Bagian ini berlaku untuk kedua versi agar koneksi database stabil)*

```prisma
// prisma/schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  role      String   @default("user")
  createdAt DateTime @default(now())

  @@map("users")
}

// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

#Backend API CRUD (Read, Create, Update, Delete)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// READ: Ambil semua data user (GET /api/users)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil data" }, { status: 500 });
  }
}

// CREATE: Tambah user baru (POST /api/users)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        role: body.role || "user",
      },
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Gagal menambah user" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// UPDATE: Edit data berdasarkan ID (PUT /api/users/1)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
      },
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengupdate user" }, { status: 500 });
  }
}

// DELETE: Hapus data berdasarkan ID (DELETE /api/users/1)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "User berhasil dihapus" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Gagal menghapus user" }, { status: 500 });
  }
}


#[id]
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  // UPDATE (PUT)
  if (req.method === "PUT") {
    const { name, email, role } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, role },
    });
    return res.status(200).json(updatedUser);
  }

  // DELETE (DELETE)
  if (req.method === "DELETE") {
    await prisma.user.delete({ where: { id } });
    return res.status(200).json({ message: "Berhasil dihapus" });
  }

  return res.status(405).json({ message: "Method tidak diizinkan" });
}

# ==============================================================================
# ALUR KERJA HARIAN (MENYIMPAN & MENGIRIM PERUBAHAN KE GITHUB)
# ==============================================================================

# 1. Mengecek status file (untracked / merah = baru, modified = diubah, staged / hijau = siap commit)
git status

# 2. Menambahkan seluruh perubahan file ke Staging Area
# (File/folder di dalam .gitignore seperti .env, node_modules/, .next/ otomatis dilewati)
git add .

# 3. Menambahkan satu file atau folder tertentu saja ke Staging Area
git add app/api/users/route.ts

# 4. Menyimpan riwayat perubahan (snapshot) ke repositori lokal
git commit -m "feat: melengkapi modul user management dan dokumentasi CRUD"

# 5. Mengirim commit terbaru dari komputer lokal ke GitHub (branch main)
git push origin main

# 6. Mengambil & menggabungkan update terbaru dari GitHub ke komputer lokal
git pull origin main

# ==============================================================================
# SETUP AWAL REPOSITORI & REMOTE GITHUB
# ==============================================================================

# 7. Menginisialisasi folder proyek menjadi repositori Git lokal
git init

# 8. Mengatur nama dan email identitas pembuat commit
git config user.name "Cepi Handani"
git config user.email "email_github_kamu@example.com"

# 9. Menghubungkan repositori lokal ke URL repositori GitHub
git remote add origin [https://github.com/Ceps-Sys/UKK_SMT4_Cepi.git](https://github.com/Ceps-Sys/UKK_SMT4_Cepi.git)

# 10. Mengecek daftar URL remote yang terhubung
git remote -v

# 11. Mengubah nama branch default menjadi main
git branch -M main

# 12. Push pertama kali sekaligus mengatur upstream (-u) agar selanjutnya cukup ketik `git push`
git push -u origin main

# ==============================================================================
# INSPEKSI RIWAYAT, BRANCHING & PERBAIKAN KESALAHAN GIT
# ==============================================================================

# 13. Melihat riwayat commit secara ringkas dalam 1 baris per commit
git log --oneline -n 10

# 14. Melihat perbedaan baris kode yang diubah sebelum di-add/commit
git diff

# 15. Membatalkan file yang sudah terlanjur masuk `git add` (mengembalikan ke unstaged)
git reset HEAD nama_file.tsx

# 16. Menghapus file dari pelacakan Git TANPA menghapus file fisik di komputer
# (Wajib dipakai jika file .env atau folder AI tools terlanjur ter-commit sebelum masuk .gitignore)
git rm --cached .env
git rm -r --cached .agents/ .claude/ .cursor/

# 17. Membuat branch baru untuk eksperimen fitur tanpa mengganggu branch main
git checkout -b fitur-baru

# Dokumentasi Lengkap Daftar Command CLI: Prisma (v8 & v7) dan Next.js (Terbaru & v12)

Dokumen ini memuat seluruh daftar perintah CLI resmi yang terdaftar pada **Prisma ORM** (arsitektur **Prisma 8 Contract** maupun **Prisma 7/Standar**) serta **Next.js** (**Versi Terbaru / App Router** dan **Versi 12 / Pages Router**) beserta fungsi dan opsi (*flag*) pentingnya.

---

## 1. Daftar Lengkap Command Prisma 8 (Contract-Based CLI)

Prisma 8 memisahkan kompilasi contract, perencanaan migrasi, dan eksekusi database ke dalam kelompok perintah `contract`, `migration`, dan `db`.

### A. Command Utama & Contract (`prisma contract`)
| Command | Opsi / Flag Penting | Penjelasan |
| :--- | :--- | :--- |
| `npx prisma contract emit` | `--config <path>`, `--help` | Mengompilasi `src/prisma/contract.prisma` menjadi `contract.json` dan menghasilkan tipe TypeScript (`contract.d.ts`). |
| `npx prisma --version` | `-v` | Menampilkan versi Prisma 8 CLI, engine, dan informasi environment. |
| `npx prisma --help` | `-h` | Menampilkan daftar seluruh kategori perintah yang tersedia pada Prisma 8 CLI. |

### B. Command Perencanaan Migrasi (`prisma migration`)
| Command | Opsi / Flag Penting | Penjelasan |
| :--- | :--- | :--- |
| `npx prisma migration plan` | `--name <nama>`, `--from <hash>`, `--create-only` | Menganalisis selisih `contract.json` dengan database, membuat folder migrasi baru, dan menampilkan *preview* DDL SQL. |
| `npx prisma migration new` | `--name <nama>` | Membuat file migrasi kosong (`migration.ts`) untuk ditulis secara manual (misalnya mengubah tipe kolom atau *constraint*). |
| `npx prisma migration status` | — | Mengecek riwayat dan status migrasi yang sudah diterapkan maupun yang masih tertunda. |

### C. Command Operasi Database (`prisma db`)
| Command | Opsi / Flag Penting | Penjelasan |
| :--- | :--- | :--- |
| `npx prisma db migrate` | `--advance-ref <ref>` (contoh: `db`) | Mengeksekusi rencana migrasi ke database dan memajukan referensi state database agar sinkron dengan contract. |
| `npx prisma db update` | — | Menyinkronkan perubahan `contract.json` langsung ke database tanpa membuat file migrasi (pengganti `db push`). |
| `npx prisma db init` | — | Menginisialisasi seluruh tabel dari contract pada database kosong tanpa mengubah tabel yang sudah ada. |
| `npx prisma db introspect` | — | Membaca struktur tabel database yang sudah ada (pengganti `db pull`). |
| `npx prisma db seed` | — | Menjalankan script *seeding* untuk mengisi data awal ke database. |
| `npx prisma db execute` | `--file <path>`, `--stdin` | Menjalankan perintah SQL mentah secara langsung ke database. |

### D. Bridge Kompatibilitas Prisma 7 di Proyek Prisma 8
| Command | Penjelasan |
| :--- | :--- |
| `npm install --save-dev @prisma/prisma7@7` | Memasang CLI Prisma 7 secara berdampingan untuk proyek yang masih menyimpan riwayat migrasi lama Prisma 7. |
| `npx prisma7 <command>` | Menjalankan perintah migrasi lawas menggunakan CLI Prisma 7 (contoh: `npx prisma7 migrate dev`). |

---

## 2. Daftar Lengkap Command Prisma 7 / Standar (Semua Subcommand Terdaftar)

Pada Prisma versi standar (v5–v7), seluruh perintah berbasis file `prisma/schema.prisma` dan terbagi menjadi beberapa kelompok utama: **Root**, **`migrate`**, **`db`**, **`studio`**, dan **`platform`**.

### A. Root & Schema Commands
| Command | Opsi / Flag Penting | Penjelasan |
| :--- | :--- | :--- |
| `npx prisma init` | `--datasource-provider <provider>`, `--url <url>`, `--preview-feature <nama>`, `--output <path>`, `--with-model` | Membuat direktori `prisma/schema.prisma` dan file `.env` awal untuk proyek baru. |
| `npx prisma generate` | `--schema <path>`, `--watch`, `--data-proxy`, `--accelerate`, `--no-engine`, `--no-hints`, `--allow-no-models`, `--sql` | Menghasilkan `@prisma/client` (serta query TypedSQL jika memakai `--sql`) agar dikenali TypeScript/JavaScript. |
| `npx prisma validate` | `--schema <path>`, `--config <path>` | Memvalidasi sintaks, tipe data, dan relasi antar-model di dalam `schema.prisma`. |
| `npx prisma format` | `--schema <path>`, `--check` | Merapikan format penulisan, indentasi, dan perataan kolom pada `schema.prisma`. |
| `npx prisma version` | `-v`, `--version` | Menampilkan versi Prisma CLI, Query Engine, Schema Engine, dan platform OS. |
| `npx prisma debug` | `--schema <path>` | Menampilkan informasi diagnostik konfigurasi Prisma dan environment untuk keperluan debugging. |
| `npx prisma mcp` | — | Menjalankan server *Model Context Protocol* (MCP) Prisma untuk integrasi AI tools. |

### B. Subcommand `prisma migrate` (Manajemen Migrasi)
| Command | Opsi / Flag Penting | Penjelasan |
| :--- | :--- | :--- |
| `npx prisma migrate dev` | `--name <nama>`, `--create-only`, `--skip-seed`, `--skip-generate`, `--schema <path>` | Membuat file migrasi SQL baru dari perubahan schema, menerapkannya ke database lokal, dan otomatis menjalankan `prisma generate`. |
| `npx prisma migrate deploy` | `--schema <path>` | Menerapkan seluruh file migrasi yang tertunda ke server *production* tanpa membuat migrasi baru. |
| `npx prisma migrate reset` | `--force`, `--skip-seed`, `--skip-generate`, `--schema <path>` | Menghapus database, membuat ulang dari awal, menjalankan semua migrasi, dan mengeksekusi `db seed`. |
| `npx prisma migrate status` | `--schema <path>` | Memeriksa apakah database sudah sinkron dengan folder `prisma/migrations`. |
| `npx prisma migrate resolve` | `--applied <nama>`, `--rolled-back <nama>`, `--schema <path>` | Menandai file migrasi tertentu sebagai sudah diterapkan atau dibatalkan saat terjadi konflik migrasi. |
| `npx prisma migrate diff` | `--from-empty`, `--from-url`, `--from-schema-datamodel`, `--from-migrations`, `--to-empty`, `--to-url`, `--to-schema-datamodel`, `--to-migrations`, `--shadow-database-url`, `--script`, `--exit-code` | Membandingkan dua sumber schema/database dan menghasilkan ringkasan perbedaan atau script SQL DDL-nya. |

### C. Subcommand `prisma db` (Operasi Database Langsung)
| Command | Opsi / Flag Penting | Penjelasan |
| :--- | :--- | :--- |
| `npx prisma db push` | `--skip-generate`, `--force-reset`, `--accept-data-loss`, `--schema <path>` | Mendorong perubahan `schema.prisma` langsung ke database tanpa membuat riwayat file migrasi. |
| `npx prisma db pull` | `--force`, `--print`, `--composite-type-depth <n>`, `--schema <path>` | Melakukan *introspection* pada database yang sudah ada dan menuliskan modelnya ke `schema.prisma`. |
| `npx prisma db seed` | `--schema <path>` | Mengeksekusi script seeding yang dikonfigurasi pada bagian `"prisma": { "seed": "..." }` di `package.json`. |
| `npx prisma db execute` | `--file <path>`, `--stdin`, `--url <url>`, `--schema <path>` | Menjalankan perintah SQL secara langsung ke database tanpa melalui schema Prisma. |

### D. Subcommand `prisma studio` (Database GUI)
| Command | Opsi / Flag Penting | Penjelasan |
| :--- | :--- | :--- |
| `npx prisma studio` | `-p, --port <port>`, `-b, --browser <nama>`, `-n, --hostname <host>`, `--schema <path>` | Membuka antarmuka web GUI di browser (`http://localhost:5555`) untuk melihat, menambah, dan mengedit data tabel. |

### E. Subcommand `prisma platform` (Prisma Data Platform / Accelerate / Pulse)
| Command | Penjelasan |
| :--- | :--- |
| `npx prisma platform auth login` | Login ke akun Prisma Data Platform melalui browser. |
| `npx prisma platform auth logout` | Keluar dari sesi akun Prisma Data Platform di CLI. |
| `npx prisma platform auth show` | Menampilkan informasi akun Prisma Data Platform yang sedang aktif. |
| `npx prisma platform workspace show` | Menampilkan daftar *workspace* yang tersedia pada akun. |
| `npx prisma platform project create` | Membuat proyek baru di Prisma Data Platform. |
| `npx prisma platform project show` | Menampilkan daftar proyek dalam *workspace*. |
| `npx prisma platform project delete` | Menghapus proyek dari Prisma Data Platform. |
| `npx prisma platform environment create` | Membuat *environment* baru (misalnya `staging` atau `production`) di dalam proyek. |
| `npx prisma platform environment show` | Menampilkan daftar *environment* pada proyek. |
| `npx prisma platform environment delete` | Menghapus *environment* tertentu dari proyek. |
| `npx prisma platform apikey create` | Membuat API key baru untuk koneksi layanan Prisma. |
| `npx prisma platform apikey show` | Menampilkan daftar API key yang aktif. |
| `npx prisma platform apikey delete` | Mencabut/menghapus API key tertentu. |
| `npx prisma platform accelerate enable` | Mengaktifkan fitur *connection pooling* & *caching* (Prisma Accelerate) pada environment. |
| `npx prisma platform accelerate disable` | Menonaktifkan layanan Prisma Accelerate. |
| `npx prisma platform pulse enable` | Mengaktifkan layanan *real-time database events* (Prisma Pulse). |
| `npx prisma platform pulse disable` | Menonaktifkan layanan Prisma Pulse. |
| `npx prisma platform serviceToken create` | Membuat *service token* untuk otomasi CI/CD. |
| `npx prisma platform serviceToken show` | Menampilkan daftar *service token* yang tersedia. |
| `npx prisma platform serviceToken delete` | Menghapus *service token*. |

---

## 3. Daftar Lengkap Command Next.js Terbaru (App Router: v13.4 – v16)

Next.js modern menggunakan direktori `app/` (atau `src/app/`), mendukung **React Server Components**, serta menggunakan bundler **Turbopack**.

### A. Inisialisasi Proyek (`create-next-app`)
| Command | Opsi / Flag Penting | Penjelasan |
| :--- | :--- | :--- |
| `npx create-next-app@latest <nama-app>` | `--ts` / `--js`, `--tailwind` / `--no-tailwind`, `--eslint` / `--no-eslint`, `--app` / `--no-app`, `--src-dir` / `--no-src-dir`, `--turbopack` / `--no-turbopack`, `--import-alias <alias>`, `--use-npm` / `--use-pnpm` / `--use-yarn` / `--use-bun`, `--empty`, `--example <nama>` | Membuat kerangka proyek Next.js versi terbaru lengkap dengan konfigurasi TypeScript, Tailwind CSS, ESLint, dan App Router. |

### B. Semua Command `next` CLI Terbaru
| Command | Opsi / Flag Penting | Penjelasan |
| :--- | :--- | :--- |
| `npx next dev` (`npm run dev`) | `-p, --port <port>`, `-H, --hostname <host>`, `--turbo` / `--turbopack`, `--webpack`, `--experimental-https`, `--experimental-https-key <path>`, `--experimental-https-cert <path>`, `--experimental-https-ca <path>`, `--experimental-upload-trace <url>` | Menjalankan server *development* lokal (default port `3000`) dengan *Fast Refresh* dan dukungan Turbopack. |
| `npx next build` (`npm run build`) | `--profile`, `--debug`, `--no-lint`, `--no-mangling`, `--experimental-app-only`, `--experimental-build-mode [compile\|generate]` | Mengompilasi seluruh halaman, Server Components, dan API Routes menjadi bundel siap *production* di folder `.next`. |
| `npx next start` (`npm run start`) | `-p, --port <port>`, `-H, --hostname <host>`, `--keepAliveTimeout <ms>` | Menjalankan server *production* dari hasil kompilasi `next build`. |
| `npx next lint` (`npm run lint`) | `--fix`, `--dir <dirs>`, `--file <files>`, `--ext <exts>`, `--max-warnings <n>`, `--no-cache`, `--quiet`, `--strict`, `--output-file <path>`, `--format <fmt>` | Menjalankan pemeriksaan aturan ESLint pada seluruh proyek (catatan: mulai Next.js 16 digantikan langsung oleh `npx eslint .`). |
| `npx next typegen` | — | Menghasilkan definisi tipe TypeScript otomatis untuk seluruh rute App Router tanpa harus menjalankan `next build` penuh. |
| `npx next info` | — | Mencetak detail versi OS, Node.js, npm/pnpm/yarn, Next.js, React, dan paket relevan lainnya untuk keperluan debugging. |
| `npx next telemetry` | `enable`, `disable`, `status` | Mengaktifkan, menonaktifkan, atau mengecek status pengiriman data telemetri anonim ke tim Next.js. |
| `npx next experimental-compile` | — | Menjalankan tahap kompilasi kode saja pada mode *modular build* eksperimental. |
| `npx next experimental-generate` | — | Menjalankan tahap pembuatan halaman statis & metadata setelah proses `experimental-compile`. |

---

## 4. Daftar Lengkap Command Next.js 12 (Pages Router)

Next.js 12 menggunakan direktori `pages/`, bundler **Webpack**, dan mendukung ekspor statis melalui perintah CLI khusus (`next export`).

### A. Inisialisasi & Semua Command `next` CLI v12
| Command | Opsi / Flag Penting | Penjelasan |
| :--- | :--- | :--- |
| `npx create-next-app@12 <nama-app>` | `--ts` / `--typescript`, `--use-npm`, `--use-yarn`, `--use-pnpm`, `--example <nama>` | Membuat kerangka proyek khusus menggunakan Next.js versi 12 (Pages Router). |
| `npx next dev` (`npm run dev`) | `-p, --port <port>`, `-H, --hostname <host>` | Menjalankan server *development* Next.js 12 menggunakan Webpack di `http://localhost:3000`. |
| `npx next build` (`npm run build`) | `--profile`, `--debug`, `--no-lint` | Mengompilasi halaman `pages/` dan API Routes `pages/api/` ke dalam folder `.next`. |
| `npx next start` (`npm run start`) | `-p, --port <port>`, `-H, --hostname <host>`, `--keepAliveTimeout <ms>` | Menjalankan server Node.js *production* dari hasil build `.next`. |
| `npx next export` | `-o, --outdir <dir>`, `-s, --silent`, `-t, --threads <n>` | Mengekspor aplikasi menjadi file HTML/CSS/JS statis murni ke folder `out/` (pada Next.js 14+ perintah ini dihapus dan diganti opsi `output: 'export'` di `next.config.js`). |
| `npx next lint` (`npm run lint`) | `--fix`, `--dir <dirs>`, `--file <files>`, `--ext <exts>`, `--max-warnings <n>`, `--no-cache`, `--quiet`, `--strict` | Menjalankan ESLint bawaan Next.js 12 untuk mengecek struktur halaman dan aturan React. |
| `npx next info` | — | Menampilkan informasi sistem dan versi dependensi proyek Next.js 12. |
| `npx next telemetry` | `enable`, `disable`, `status` | Mengatur status pengumpulan data telemetri Next.js. |

### B. Ringkasan Perbedaan Next.js Terbaru vs Next.js 12
| Aspek | Next.js Terbaru (App Router) | Next.js 12 (Pages Router) |
| :--- | :--- | :--- |
| **Direktori Routing** | `app/` atau `src/app/` | `pages/` atau `src/pages/` |
| **File Halaman** | `app/users/page.tsx` | `pages/users/index.tsx` atau `pages/users.tsx` |
| **File API Endpoint** | `app/api/users/route.ts` (`export async function GET/POST`) | `pages/api/users.ts` (`export default function handler(req, res)`) |
| **Komponen Default** | **Server Component** (tulis `'use client'` untuk komponen interaktif) | **Client Component** (seluruh halaman berjalan sebagai komponen React standar) |
| **Bundler Dev** | **Turbopack** (`--turbo` / `--turbopack`) | **Webpack** |
| **Static Site Export** | `output: 'export'` di `next.config.ts` / `next.config.mjs` | Perintah CLI `npx next export` |
| **Validasi Tipe Rute** | `npx next typegen` | Tidak tersedia |