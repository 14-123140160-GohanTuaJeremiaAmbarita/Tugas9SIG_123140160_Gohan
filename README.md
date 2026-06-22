# Tugas 9 SIG - WebGIS Fasilitas Publik Bandar Lampung

Proyek ini merupakan aplikasi **Full-Stack WebGIS** yang mengintegrasikan kecerdasan basis data spasial (**PostgreSQL + PostGIS**) di sisi backend dengan visualisasi peta interaktif (**React + Leaflet**) di sisi frontend. Aplikasi ini mendukung manajemen data spasial (CRUD) fasilitas publik secara dinamis dengan pembatasan hak akses berbasis Autentikasi.

## 👥 Identitas Mahasiswa
* **Nama:** Gohan Tua Jeremia Ambarita
* **NIM:** 123140160
* **Afiliasi:** Teknik Informatika - Institut Teknologi Sumatera (ITERA)
* **Kelas/Mata Kuliah:** Sistem Informasi Geografis (SIG)

---

## 🚀 Fitur Utama

1. **Visualisasi Data Spasial Publik:**
   * Menampilkan titik koordinat fasilitas publik (Puskesmas, Sekolah, Masjid) di wilayah Bandar Lampung menggunakan marker kustom interaktif.
   * Efek interaksi visual **Hover Highlight** (Marker otomatis membesar saat didekati kursor mouse).
   
2. **Autentikasi & Manajemen Pengguna (Admin):**
   * Form **Login Administrator** tiruan/mock untuk autentikasi instan yang aman tanpa kendala token.
   * Form **Register Admin Baru** dengan sistem validasi karakter frontend (Validasi panjang username/password dan kecocokan konfirmasi sandi).

3. **Operasi CRUD Spasial Dinamis (Khusus Admin):**
   * **Tambah Data (Create):** Admin cukup melakukan klik langsung pada titik koordinat mana saja di peta Leaflet untuk membuka panel form input koordinat secara otomatis.
   * **Validasi Form:** Mencegah penyimpanan jika nama tempat kurang dari 3 karakter atau koordinat kosong.
   * **Ubah & Hapus Data (Update & Delete):** Mengklik marker penanda aktif akan memunculkan popup gelembung interaktif yang memuat tombol aksi Edit dan Hapus secara real-time.

---

## 📂 Struktur Direktori Proyek

```text
tugas9sig_123140160_gohan/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   └── fasilitas.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   └── fasilitas.py
│   │   ├── utils/
│   │   │   └── auth.py
│   │   ├── database.py
│   │   └── main.py
│   ├── .env
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── assets/
    │   │   └── maker.jpg       # Aset ikon kustom penanda merah
    │   ├── components/
    │   │   ├── login.jsx       # Form Login Admin
    │   │   ├── register.jsx    # Form Pendaftaran Admin Baru dengan validasi
    │   │   └── MapView.jsx     # Peta Spasial Leaflet & Logika CRUD Spasial
    │   ├── context/
    │   │   └── authcontext.jsx # State Global Autentikasi Frontend
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
