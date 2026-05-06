Rangkaian Sequence Diagram Jeep Station PuncakDokumen ini berisi detail sequence diagram untuk setiap proses utama dalam sistem, menggambarkan interaksi antar objek dan aktor.

---
a. Sequence Diagram: Lihat Landing Page
```mermaid
sequenceDiagram
    autonumber
    actor Pelanggan
    participant FE as Frontend (Svelte)
    participant BE as Server (SvelteKit)
    participant DB as Database (Postgres)

    Pelanggan->>FE: Akses URL Website
    FE->>BE: Request Data Landing Page
    activate BE
    BE->>DB: Query Data Armada & Testimoni
    DB-->>BE: Result Data
    BE-->>FE: Response HTML & Data
    deactivate BE
    FE-->>Pelanggan: Tampilkan Informasi & FAQ
```
b. Sequence Diagram: Reservasi Armada
```mermaid
sequenceDiagram
    autonumber
    actor Pelanggan
    participant FE as Frontend (Checkout)
    participant BE as Server (SvelteKit Action)
    participant DB as Database (Postgres)

    Pelanggan->>FE: Pilih Armada & Tanggal
    FE->>BE: Cek Ketersediaan (API /avail)
    activate BE
    BE->>DB: Query Availability
    DB-->>BE: Result Tersedia
    BE-->>FE: Status OK
    deactivate BE
    Pelanggan->>FE: Isi Data Diri & Alamat
    Pelanggan->>FE: Klik Konfirmasi
    FE->>BE: Submit Form Reservasi
    activate BE
    BE->>DB: Insert Data Reservasi (Pending)
    DB-->>BE: ID Reservasi
    BE-->>FE: Success Message
    deactivate BE
```
c. Sequence Diagram: Pembayaran
```mermaid
sequenceDiagram
    autonumber
    actor Pelanggan
    participant FE as Frontend (Snap UI)
    participant BE as Server (Notification Handler)
    participant MT as Midtrans API
    participant DB as Database

    Pelanggan->>FE: Pilih Metode Bayar
    FE->>MT: Buka Popup Snap
    Pelanggan->>MT: Lakukan Pembayaran
    MT-->>FE: Result Transaksi
    Note over MT, BE: Proses Webhook (Async)
    MT->>BE: Kirim Notifikasi Status (POST)
    activate BE
    BE->>DB: Update Status Reservasi & Pembayaran
    DB-->>BE: OK
    BE-->>MT: 200 OK
    deactivate BE
    FE-->>Pelanggan: Tampilkan Status Berhasil
```
d. Sequence Diagram: Lihat Bukti Reservasi
```mermaid
sequenceDiagram
    autonumber
    actor Pelanggan
    participant FE as Frontend (Cek Booking)
    participant BE as Server (SvelteKit)
    participant DB as Database

    Pelanggan->>FE: Masukkan Kode Booking
    FE->>BE: Query Booking Detail
    activate BE
    BE->>DB: SELECT * FROM reservasi WHERE kode
    DB-->>BE: Data Reservasi
    BE-->>FE: Response Data + QR Code URL
    deactivate BE
    FE-->>Pelanggan: Tampilkan Detail Bukti Reservasi
```
e. Sequence Diagram: Login
```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant FE as Frontend (Login)
    participant BE as Server (Better Auth)
    participant DB as Database

    Admin->>FE: Input Email & Password
    FE->>BE: POST Sign In
    activate BE
    BE->>DB: Verifikasi Kredensial
    DB-->>BE: User Data / Match
    BE->>BE: Create Session Cookie
    BE-->>FE: Success (Set-Cookie)
    deactivate BE
    FE-->>Admin: Redirect ke Dashboard
```
f. Sequence Diagram: Kelola Armada
```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant FE as Frontend (Armada CRUD)
    participant BE as Server (Action)
    participant CLD as Cloudinary
    participant DB as Database

    Admin->>FE: Input Data Armada & Foto
    FE->>BE: POST FormData
    activate BE
    BE->>CLD: Upload Image
    CLD-->>BE: Image URL
    BE->>DB: INSERT/UPDATE data_armada
    DB-->>BE: OK
    BE-->>FE: Success Response
    deactivate BE
    FE-->>Admin: Tampilkan List Terbaru
```
g. Sequence Diagram: Kelola Gallery
```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant FE as Frontend (Gallery)
    participant BE as Server (Action)
    participant CLD as Cloudinary
    participant DB as Database

    Admin->>FE: Pilih Foto Gallery
    FE->>BE: Submit Upload
    activate BE
    BE->>CLD: Upload Image
    CLD-->>BE: Secure URL
    BE->>DB: INSERT INTO gallery
    DB-->>BE: OK
    BE-->>FE: Success
    deactivate BE
```
h. Sequence Diagram: Kelola Akomodasi (Package Bundle)
```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant FE as Frontend (Bundle)
    participant BE as Server (Action)
    participant DB as Database

    Admin->>FE: Input Detail Paket & Harga
    FE->>BE: POST Data Bundle
    activate BE
    BE->>DB: INSERT/UPDATE data_bundle
    DB-->>BE: OK
    BE-->>FE: Success
    deactivate BE
```
i. Sequence Diagram: Kelola Reservasi
```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant FE as Frontend (Reservasi List)
    participant BE as Server (SvelteKit)
    participant DB as Database

    Admin->>FE: Akses Menu Reservasi
    FE->>BE: Request Daftar Reservasi
    activate BE
    BE->>DB: SELECT * FROM reservasi
    DB-->>BE: Result List
    BE-->>FE: Response Data
    deactivate BE
    Admin->>FE: Klik Tombol WhatsApp
    FE-->>Admin: Redirect ke api.whatsapp.com
```
j. Sequence Diagram: Kelola Laporan
```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant FE as Frontend (Dashboard Stats)
    participant BE as Server (SvelteKit)
    participant DB as Database

    Admin->>FE: Akses Halaman Dashboard
    FE->>BE: Request Statistik
    activate BE
    BE->>DB: Aggregation Query (Total Revenue/Orders)
    DB-->>BE: Calculated Data
    BE-->>FE: Data JSON (Stats)
    deactivate BE
    FE-->>Admin: Tampilkan Grafik & Laporan
```
k. Sequence Diagram: Kelola Logout
```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant FE as Frontend (Navbar)
    participant BE as Server (Logout Handler)

    Admin->>FE: Klik Tombol Logout
    FE->>BE: POST /logout
    activate BE
    BE->>BE: Clear Session Cookie
    BE-->>FE: Redirect ke Home/Login
    deactivate BE
    FE-->>Admin: Tampilan Halaman Login
```