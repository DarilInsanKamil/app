## a. Lihat Landing Page

```mermaid
flowchart TD
    Start([Mulai]) --> AksesURL[Akses URL Website]
    AksesURL --> FetchData[Sistem Mengambil Data Armada & Testimoni]
    FetchData --> TampilLanding[Tampilkan Halaman Landing Page]
    TampilLanding --> LihatKonten[Pelanggan Melihat Informasi & FAQ]
    LihatKonten --> End([Selesai])
```

---

## b. Reservasi Armada

```mermaid
flowchart TD
    Start([Mulai]) --> PilihKatalog[Pilih Armada atau Paket Bundle]
    PilihKatalog --> CekTanggal[Pilih Tanggal Reservasi]
    CekTanggal --> Validasi{Tersedia?}
    Validasi -- Tidak --> CekTanggal
    Validasi -- Ya --> IsiForm[Isi Data Diri & Alamat Penjemputan]
    IsiForm --> Konfirmasi[Klik Konfirmasi Reservasi]
    Konfirmasi --> SimpanPending[Sistem Simpan Reservasi Status Pending]
    SimpanPending --> End([Selesai])
```

---

## c. Pembayaran

```mermaid
flowchart TD
    Start([Mulai]) --> RequestToken[Sistem Minta Snap Token ke Midtrans]
    RequestToken --> TampilSnap[Tampilkan Popup Pembayaran Midtrans]
    TampilSnap --> PilihMetode[Pelanggan Pilih Metode Pembayaran]
    PilihMetode --> Bayar[Lakukan Transaksi]
    Bayar --> NotifMidtrans[Midtrans Kirim Notifikasi ke Server]
    NotifMidtrans --> UpdateStatus[Sistem Perbarui Status Reservasi & Pembayaran]
    UpdateStatus --> TampilHasil[Tampilkan Status Berhasil/Gagal di UI]
    TampilHasil --> End([Selesai])
```

---

## d. Lihat Bukti Reservasi

```mermaid
flowchart TD
    Start([Mulai]) --> BukaCekBooking[Buka Menu Cek Booking]
    BukaCekBooking --> InputKode[Masukkan Kode Booking]
    InputKode --> CariData[Sistem Mencari Data di Database]
    CariData --> Ada{Ditemukan?}
    Ada -- Tidak --> TampilPesan[Tampilkan Pesan Data Tidak Ada]
    Ada -- Ya --> TampilDetail[Tampilkan Detail Reservasi & QR Code]
    TampilDetail --> End([Selesai])
```

---

## e. Login Admin

```mermaid
flowchart TD
    Start([Mulai]) --> AksesLogin[Buka Halaman Login Admin]
    AksesLogin --> InputKredensial[Input Email & Password]
    InputKredensial --> CekAkun[Sistem Validasi Database]
    CekAkun --> Valid{Valid?}
    Valid -- Tidak --> TampilError[Tampilkan Pesan Error]
    Valid -- Ya --> BuatSession[Sistem Membuat Session Login]
    BuatSession --> RedirectDash[Masuk ke Halaman Dashboard]
    RedirectDash --> End([Selesai])
```

---

## f. Kelola Armada

```mermaid
flowchart TD
    Start([Mulai]) --> BukaMenuArmada[Buka Menu Armada]
    BukaMenuArmada --> TampilList[Tampilkan Daftar Armada]
    TampilList --> PilihAksi{Pilih Aksi}
    PilihAksi -- Tambah --> FormInput[Isi Data & Upload Foto ke Cloudinary]
    PilihAksi -- Edit --> FormEdit[Ubah Data Armada]
    PilihAksi -- Hapus --> HapusData[Hapus Data Armada]
    FormInput --> Simpan[Simpan ke Database]
    FormEdit --> Simpan
    HapusData --> Simpan
    Simpan --> End([Selesai])
```

---

## g. Kelola Gallery

```mermaid
flowchart TD
    Start([Mulai]) --> BukaMenuGallery[Buka Menu Gallery]
    BukaMenuGallery --> UploadFoto[Pilih File Foto]
    UploadFoto --> ProsesCloud[Proses Upload ke Cloudinary]
    ProsesCloud --> SimpanDB[Simpan URL Foto ke Database]
    SimpanDB --> TampilGallery[Tampilkan Foto Baru di Gallery]
    TampilGallery --> End([Selesai])
```

---

## h. Kelola Akomodasi (Package Bundle)

```mermaid
flowchart TD
    Start([Mulai]) --> BukaMenuBundle[Buka Menu Bundle]
    BukaMenuBundle --> SetPaket[Input Detail Paket & Fasilitas]
    SetPaket --> SetHarga[Atur Harga Paket]
    SetHarga --> SimpanBundle[Simpan Data Bundle]
    SimpanBundle --> End([Selesai])
```

---

## i. Kelola Reservasi

```mermaid
flowchart TD
    Start([Mulai]) --> BukaMenuReservasi[Buka Menu Reservasi]
    BukaMenuReservasi --> PantauStatus[Lihat Daftar Reservasi & Status Bayar]
    PantauStatus --> Detail[Lihat Detail Reservasi]
    Detail --> HubungiWA[Klik Hubungi via WhatsApp]
    HubungiWA --> RedirectWA[Terhubung ke WhatsApp Customer]
    RedirectWA --> End([Selesai])
```

---

## j. Kelola Laporan

```mermaid
flowchart TD
    Start([Mulai]) --> BukaDashboard[Buka Halaman Statistik Dashboard]
    BukaDashboard --> HitungData[Sistem Menghitung Total Reservasi & Pendapatan]
    HitungData --> TampilGrafik[Tampilkan Grafik & Ringkasan Laporan]
    TampilGrafik --> End([Selesai])
```

---

## k. Logout

```mermaid
flowchart TD
    Start([Mulai]) --> KlikLogout[Klik Tombol Logout]
    KlikLogout --> HapusSession[Sistem Menghapus Session & Cookie]
    HapusSession --> RedirectHome[Kembali ke Halaman Login/Home]
    RedirectHome --> End([Selesai])
```
