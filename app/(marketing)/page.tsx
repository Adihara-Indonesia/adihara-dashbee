import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashbee — Dashboard custom untuk UMKM",
  description:
    "Satu dashboard untuk semua angka toko Anda. Sekali bayar, punya selamanya.",
};

export default function MarketingHomePage() {
  return (
    <div className="dashbee-marketing">
      <header className="site">
        <div className="wrap row">
          <a className="brand" href="#top">
            <svg
              className="mark"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M14 1.6 25.4 8v12L14 26.4 2.6 20V8Z"
                stroke="#f2a53c"
                strokeWidth="1.6"
              />
              <path
                d="M9 17.5 9 12.5 12 15 15 10.5 15 17.5"
                stroke="#f2a53c"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            Dashbee
          </a>
          <nav className="links">
            <a href="#masalah">Masalah</a>
            <a href="#fitur">Fitur</a>
            <a href="#harga">Harga</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link
              href="/login"
              style={{ fontSize: "13px", color: "var(--ink-muted)" }}
            >
              Masuk
            </Link>
            <a className="btn btn-honey" href="#kontak">
              Jadwalkan Demo
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="bg-ink comb">
          <div className="wrap">
            <div className="hero-grid">
              <div className="hero-copy">
                <span className="eyebrow">
                  <span className="dot" />
                  Dashboard custom untuk UMKM Jakarta &amp; Jabodetabek
                </span>
                <h1>
                  Satu dashboard untuk semua angka toko Anda. Sekali bayar,
                  punya selamanya.
                </h1>
                <p className="lede">
                  Data jualan di satu Excel, stok di Excel lain, pembelian
                  dicatat manual di WhatsApp. Tiap akhir bulan Anda rekap
                  sendiri jam 11 malam cuma buat tahu untung atau rugi.
                  Dashbee menyatukan semuanya jadi satu dashboard yang
                  otomatis terisi dari Google Sheets, Excel, atau database
                  apa pun yang sudah Anda miliki dan pakai — tanpa pindah
                  sistem, tanpa langganan yang naik terus tiap tahun.
                </p>
                <div className="hero-ctas">
                  <a className="btn btn-honey" href="#kontak">
                    Jadwalkan demo gratis
                  </a>
                  <a className="btn btn-ghost-dark" href="#fitur">
                    Lihat cara kerjanya ↓
                  </a>
                </div>
                <div className="trust-line">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 8.5 6 12l8-8"
                      stroke="#f2a53c"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Dibangun di atas Next.js + Supabase — arsitektur yang sama
                  dipakai produk SaaS, bukan template generik.
                </div>
              </div>

              <div className="browser">
                <div className="chrome">
                  <div className="dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="addr">app.dashbee.id/overview</div>
                </div>
                <div className="app">
                  <div className="app-nav">
                    <div className="left">
                      <span className="app-logo">Dashbee</span>
                      <div className="app-links">
                        <span className="on">Overview</span>
                        <span>Sales</span>
                        <span>Purchases</span>
                        <span>Admin</span>
                      </div>
                    </div>
                    <div className="app-user">
                      Bu Rina <span className="role-chip">owner</span>
                    </div>
                  </div>
                  <div className="app-body">
                    <div className="app-h1row">
                      <span className="app-h1">Overview</span>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        <div className="pill-group">
                          <span className="pill">7h</span>
                          <span className="pill on">30h</span>
                          <span className="pill">90h</span>
                        </div>
                        <span className="refresh">⟳ Refresh</span>
                      </div>
                    </div>

                    <div className="kpi-grid">
                      <div className="kpi">
                        <div className="lbl">Omzet 30 hari</div>
                        <div className="val">Rp184,5jt</div>
                        <span className="badge good">▲ 12.4%</span>
                      </div>
                      <div className="kpi">
                        <div className="lbl">Transaksi</div>
                        <div className="val">342</div>
                        <span className="badge good">▲ 8.1%</span>
                      </div>
                      <div className="kpi">
                        <div className="lbl">Margin kotor</div>
                        <div className="val">31.2%</div>
                        <span className="badge good">▲ 2.0%</span>
                      </div>
                      <div className="kpi">
                        <div className="lbl">Stok menipis</div>
                        <div className="val">6 item</div>
                        <span className="badge warn">● Perlu cek</span>
                      </div>
                    </div>

                    <div className="card-white" style={{ marginBottom: "10px" }}>
                      <div className="card-title">
                        <span>Omzet harian</span>
                        <span className="sample-tag">Data contoh</span>
                      </div>
                      <svg
                        viewBox="0 0 560 130"
                        width="100%"
                        height="120"
                        preserveAspectRatio="none"
                        role="img"
                        aria-label="Grafik omzet harian tujuh hari, naik dari 18 juta ke 29 juta"
                      >
                        <line x1="0" y1="20" x2="560" y2="20" stroke="#f0f1f3" strokeWidth="1" />
                        <line x1="0" y1="60" x2="560" y2="60" stroke="#f0f1f3" strokeWidth="1" />
                        <line x1="0" y1="100" x2="560" y2="100" stroke="#f0f1f3" strokeWidth="1" />
                        <polygon
                          points="10,84 90,68 170,78 250,44 330,56 410,20 490,32 490,120 10,120"
                          fill="#2563eb"
                          opacity="0.09"
                        />
                        <polyline
                          points="10,84 90,68 170,78 250,44 330,56 410,20 490,32"
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <g fill="#2563eb">
                          <circle cx="10" cy="84" r="3" />
                          <circle cx="90" cy="68" r="3" />
                          <circle cx="170" cy="78" r="3" />
                          <circle cx="250" cy="44" r="3" />
                          <circle cx="330" cy="56" r="3" />
                          <circle cx="410" cy="20" r="3" />
                          <circle cx="490" cy="32" r="3" />
                        </g>
                        <g fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="#9ca3af">
                          <text x="10" y="128">Sen</text>
                          <text x="88" y="128">Sel</text>
                          <text x="166" y="128">Rab</text>
                          <text x="246" y="128">Kam</text>
                          <text x="326" y="128">Jum</text>
                          <text x="404" y="128">Sab</text>
                          <text x="482" y="128">Min</text>
                        </g>
                      </svg>
                    </div>

                    <div className="card-white" style={{ marginBottom: "10px" }}>
                      <div className="card-title">
                        <span>Penjualan terbaru</span>
                        <span className="sample-tag">Data contoh</span>
                      </div>
                      <table className="mini">
                        <thead>
                          <tr>
                            <th>No. Pesanan</th>
                            <th>Produk</th>
                            <th>Tanggal</th>
                            <th style={{ textAlign: "right" }}>Jumlah</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>INV-1042</td>
                            <td>Kopi Arabika 250g</td>
                            <td>17 Sep</td>
                            <td className="num">Rp450.000</td>
                            <td><span className="status lunas">Lunas</span></td>
                          </tr>
                          <tr>
                            <td>INV-1041</td>
                            <td>Paket Hampers B</td>
                            <td>17 Sep</td>
                            <td className="num">Rp1.250.000</td>
                            <td><span className="status lunas">Lunas</span></td>
                          </tr>
                          <tr>
                            <td>INV-1040</td>
                            <td>Kemasan Botol 500ml</td>
                            <td>16 Sep</td>
                            <td className="num">Rp210.000</td>
                            <td><span className="status pending">Pending</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="two-col">
                      <div className="card-white">
                        <div className="card-title">
                          <span>Pembelian bulan ini</span>
                          <span className="sample-tag">Data contoh</span>
                        </div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: "15px", fontWeight: 600 }}>
                          Rp62.300.000
                        </div>
                        <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                          12 transaksi dari 4 pemasok
                        </div>
                      </div>
                      <div className="card-white">
                        <div className="card-title">
                          <span>Stock opname</span>
                          <span className="sample-tag">Data contoh</span>
                        </div>
                        <table className="mini">
                          <tbody>
                            <tr>
                              <td>Kopi Arabika 250g</td>
                              <td className="num" style={{ color: "var(--warn)" }}>8 (menipis)</td>
                            </tr>
                            <tr>
                              <td>Kemasan Botol 500ml</td>
                              <td className="num">140</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAIN */}
        <section id="masalah" className="bg-paper">
          <div className="wrap">
            <span className="eyebrow">
              <span className="dot" />
              Kalau ini kedengaran familiar
            </span>
            <h2 style={{ marginTop: "14px" }}>
              Anda enggak sendirian — ini yang biasanya dialami pemilik UMKM
              sebelum pakai Dashbee.
            </h2>

            <div className="pain-grid">
              <div className="pain-card">
                <span className="pain-num">01</span>
                <p>
                  Mayoritas UMKM di Indonesia masih mencatat transaksi manual
                  pakai buku atau Excel, dan riset menunjukkan sekitar 35%
                  pemilik usaha masih kesulitan dengan literasi digital dasar
                  — jadi wajar kalau pindah ke sistem baru terasa berat.
                  <span className="src">
                    Sumber: Studi barrier digital UMKM (2024–2025)
                  </span>
                </p>
              </div>
              <div className="pain-card">
                <span className="pain-num">02</span>
                <p>
                  Sudah coba aplikasi kasir atau software akuntansi, tapi
                  ujungnya bayar sekitar Rp250rb–360rb per bulan, sering per
                  outlet atau per user — dan biayanya terus naik setiap kali
                  usaha Anda berkembang.
                  <span className="src">
                    Sumber: Harga publik Majoo, Moka POS, Mekari Jurnal —
                    estimasi Sep 2026
                  </span>
                </p>
              </div>
              <div className="pain-card">
                <span className="pain-num">03</span>
                <p>
                  Fitur software akuntansi kebanyakan dirancang untuk staf
                  pembukuan, bukan untuk pemilik yang cuma mau lihat &ldquo;untung
                  bulan ini berapa&rdquo; dalam lima detik dari HP.
                  <span className="src">
                    Sumber: Review pengguna software akuntansi UMKM, 2026
                  </span>
                </p>
              </div>
              <div className="pain-card">
                <span className="pain-num">04</span>
                <p>
                  Software yang katanya &ldquo;siap pakai&rdquo; tetap butuh waktu setup
                  dan pelatihan tim yang enggak sebentar sebelum benar-benar
                  jalan menggantikan cara lama.
                  <span className="src">
                    Sumber: Studi kasus implementasi software akuntansi
                    UMKM, 2026
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="fitur" className="bg-ink">
          <div className="wrap">
            <span className="eyebrow">
              <span className="dot" />
              Kenapa custom, bukan software jadi
            </span>
            <h2 style={{ marginTop: "14px", maxWidth: "26ch" }}>
              Dashbee dibangun di sekitar data yang sudah Anda punya — bukan
              sebaliknya.
            </h2>
            <p className="lede" style={{ marginTop: "14px" }}>
              Tidak ada migrasi data yang ribet dan tidak ada modul yang
              tidak Anda butuhkan. Dashbee mengambil sumber data yang sudah
              biasa dipakai tim Anda, lalu menyajikannya dalam satu tampilan
              yang bisa dibaca dalam hitungan detik.
            </p>

            <div className="feat-grid">
              <div className="feat-card">
                <div className="feat-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2 14V9M9 14V4M16 14v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>Overview real-time, satu layar</h3>
                <p>
                  Omzet, jumlah transaksi, margin, dan stok menipis tampil
                  sebagai kartu KPI dengan grafik tren — bisa difilter per 7,
                  30, atau 90 hari, tinggal klik refresh untuk data terbaru.
                </p>
              </div>
              <div className="feat-card">
                <div className="feat-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="3" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M2 7h14" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </div>
                <h3>Penjualan &amp; pembelian tercatat rapi</h3>
                <p>
                  Tambah, cari, edit, dan hapus transaksi penjualan maupun
                  pembelian langsung dari dashboard — tanpa rumus
                  spreadsheet yang gampang rusak kalau salah klik.
                </p>
              </div>
              <div className="feat-card">
                <div className="feat-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 2 3 5v4c0 4 2.7 6.6 6 7.5 3.3-.9 6-3.5 6-7.5V5L9 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3>Login aman, akses sesuai peran</h3>
                <p>
                  Masuk pakai akun Google atau email dengan sistem whitelist
                  — hanya email yang Anda izinkan yang bisa masuk. Peran
                  owner, admin, dan staf punya batas akses masing-masing.
                </p>
              </div>
              <div className="feat-card">
                <div className="feat-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
                    <rect x="10" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
                    <rect x="2" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
                    <rect x="10" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </div>
                <h3>Stok opname yang saling terhubung</h3>
                <p>
                  Data stok tersambung ke penjualan dan pembelian, jadi Anda
                  tahu barang mana yang mulai menipis tanpa harus menghitung
                  manual satu per satu.
                </p>
              </div>
              <div className="feat-card">
                <div className="feat-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 9h12M9 3v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>Sinkron dari Google Sheets Anda</h3>
                <p>
                  Sumber data awal Dashbee adalah spreadsheet yang sudah
                  Anda pakai sehari-hari — bukan sistem baru yang
                  mengharuskan Anda input ulang semua data lama dari nol.
                </p>
              </div>
              <div className="feat-card">
                <div className="feat-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="5" y="1.5" width="8" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M8 14.2h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>Bisa dicek kapan saja dari HP</h3>
                <p>
                  Tampilan menyesuaikan otomatis di layar kecil, jadi Anda
                  bisa intip omzet hari ini di sela-sela kesibukan, tanpa
                  perlu buka laptop.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ADMIN MOCKUP */}
        <section className="bg-ink2">
          <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "22px" }}>
            <div style={{ maxWidth: "56ch" }}>
              <span className="eyebrow">
                <span className="dot" />
                Kontrol penuh untuk pemilik
              </span>
              <h2 style={{ marginTop: "14px", fontSize: "clamp(22px,3vw,30px)" }}>
                Anda yang menentukan siapa lihat apa.
              </h2>
            </div>
            <div className="two-col" style={{ gridTemplateColumns: "1fr", marginTop: "6px" }}>
              <div className="browser" style={{ maxWidth: "640px" }}>
                <div className="chrome">
                  <div className="dots"><span /><span /><span /></div>
                  <div className="addr">app.dashbee.id/admin</div>
                </div>
                <div className="app">
                  <div className="app-nav">
                    <div className="left">
                      <span className="app-logo">Dashbee</span>
                      <div className="app-links">
                        <span>Overview</span>
                        <span>Sales</span>
                        <span>Purchases</span>
                        <span className="on">Admin</span>
                      </div>
                    </div>
                    <div className="app-user">
                      Bu Rina <span className="role-chip">owner</span>
                    </div>
                  </div>
                  <div className="app-body">
                    <div className="app-h1row">
                      <span className="app-h1">Admin</span>
                    </div>
                    <div className="card-white" style={{ marginBottom: "10px" }}>
                      <div className="card-title">
                        <span>User &amp; peran</span>
                        <span className="sample-tag">Data contoh</span>
                      </div>
                      <table className="mini">
                        <thead>
                          <tr><th>Nama</th><th>Email</th><th>Role</th></tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Rina Wulandari</td>
                            <td>rina@tokosaya.id</td>
                            <td><select className="role-select" defaultValue="owner"><option>owner</option></select></td>
                          </tr>
                          <tr>
                            <td>Dimas Prasetyo</td>
                            <td>dimas@tokosaya.id</td>
                            <td><select className="role-select" defaultValue="admin"><option>admin</option></select></td>
                          </tr>
                          <tr>
                            <td>Sari Ayu</td>
                            <td>sari@tokosaya.id</td>
                            <td><select className="role-select" defaultValue="staff"><option>staff</option></select></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="card-white">
                      <div className="card-title"><span>Informasi bisnis</span></div>
                      <div style={{ fontSize: "11.5px", color: "#6b7280", lineHeight: "1.7" }}>
                        Nama usaha, kategori, dan alamat toko — dipakai di
                        seluruh laporan dashboard.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON / PRICING */}
        <section id="harga" className="bg-paper">
          <div className="wrap">
            <span className="eyebrow">
              <span className="dot" />
              Sekali bayar vs langganan selamanya
            </span>
            <h2 style={{ marginTop: "14px", maxWidth: "24ch" }}>
              Kenapa bayar sekali lebih masuk akal daripada langganan yang
              tidak pernah selesai.
            </h2>
            <p className="lede" style={{ marginTop: "14px" }}>
              Software akuntansi dan kasir populer di Indonesia memang
              berguna — tapi biayanya jalan terus, dan tumbuh setiap kali
              Anda tambah outlet, tambah user, atau upgrade paket. Dashbee
              dibayar sekali di depan, lalu jadi milik Anda.
            </p>

            <div className="compare">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Perbandingan</th>
                    <th>Software langganan umum*</th>
                    <th className="col-dashbee">Dashbee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Model biaya</td>
                    <td>Rp249rb–360rb / bulan, per outlet atau per user</td>
                    <td className="col-dashbee win">Rp10.000.000 sekali bayar</td>
                  </tr>
                  <tr>
                    <td>Biaya tahun ke-2 dan seterusnya</td>
                    <td className="lose">Terus berjalan, biasanya naik</td>
                    <td className="col-dashbee win">Rp0 — sudah milik Anda</td>
                  </tr>
                  <tr>
                    <td>Tampilan &amp; laporan</td>
                    <td>Template generik untuk semua jenis usaha</td>
                    <td className="col-dashbee win">Dibangun sesuai alur bisnis Anda</td>
                  </tr>
                  <tr>
                    <td>Waktu sampai bisa dipakai penuh</td>
                    <td>Butuh minggu untuk setup &amp; pelatihan tim</td>
                    <td className="col-dashbee win">5–7 hari kerja</td>
                  </tr>
                  <tr>
                    <td>Sumber data awal</td>
                    <td>Input ulang / migrasi data</td>
                    <td className="col-dashbee win">Google Sheets, Excel, atau database yang sudah Anda miliki</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: "12px", color: "var(--paper-muted)", marginTop: "10px" }}>
              *Estimasi berdasarkan harga publik software akuntansi &amp;
              kasir UMKM populer di Indonesia, per September 2026. Harga
              dapat berubah sewaktu-waktu — silakan cek harga terbaru
              langsung ke masing-masing penyedia.
            </p>

            <div className="price-card" style={{ marginTop: "56px" }}>
              <div>
                <span className="eyebrow" style={{ color: "var(--honey)" }}>
                  <span className="dot" />
                  Paket flagship
                </span>
                <h3 style={{ fontSize: "24px", fontFamily: "var(--serif)", marginTop: "10px", color: "var(--ink-text)" }}>
                  Simple Custom Dashboard
                </h3>
                <div style={{ marginTop: "14px" }}>
                  <span className="price-tag">Rp10.000.000</span>
                </div>
                <p style={{ color: "var(--ink-muted)", marginTop: "10px", fontSize: "14.5px", lineHeight: "1.6" }}>
                  Sekali bayar, dikerjakan tuntas dalam 5–7 hari kerja.
                  &ldquo;Simple&rdquo; artinya tidak dibuat berlebihan — tapi tetap
                  mencakup semua kebutuhan pelaporan standar bisnis Anda.
                </p>
                <div className="dp-note">
                  DP 50% di awal untuk mulai pengerjaan. Setelah DP lunas,
                  Anda sudah bisa lihat skeleton dashboardnya untuk
                  referensi kustomisasi — sebelum sisa pembayaran
                  ditagihkan.
                </div>
              </div>
              <ul className="includes">
                {[
                  "Dashboard overview: omzet, transaksi, margin, stok",
                  "Modul penjualan & pembelian (tambah/cari/edit/hapus)",
                  "Stock opname terhubung otomatis",
                  "Login Google + email, whitelist akses",
                  "Manajemen role: owner, admin, staf",
                  "Sinkron data dari Google Sheets Anda",
                  "Desain responsif, nyaman dibuka dari HP",
                ].map((item) => (
                  <li key={item}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8.5 6 12l8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="bg-ink">
          <div className="wrap">
            <span className="eyebrow">
              <span className="dot" />
              Belum ada portofolio publik? Ini gantinya
            </span>
            <h2 style={{ marginTop: "14px", maxWidth: "26ch" }}>
              Transparansi penuh dari diskusi pertama sampai dashboard jadi.
            </h2>
            <p className="lede" style={{ marginTop: "14px" }}>
              Karena setiap dashboard dibangun custom, Anda ikut melihat
              prosesnya — bukan cuma menerima produk jadi di akhir.
            </p>
            <div className="steps">
              <div className="step">
                <div className="n">01</div>
                <h3>Diskusi kebutuhan</h3>
                <p>
                  Ceritakan alur penjualan, pembelian, dan pencatatan stok
                  bisnis Anda saat ini — gratis, tanpa komitmen.
                </p>
              </div>
              <div className="step">
                <div className="n">02</div>
                <h3>DP 50% &amp; mulai dibangun</h3>
                <p>
                  Setelah sepakat, pengerjaan dimulai berdasarkan data dan
                  alur kerja bisnis Anda.
                </p>
              </div>
              <div className="step">
                <div className="n">03</div>
                <h3>Lihat skeleton dashboard</h3>
                <p>
                  Begitu DP lunas, Anda sudah bisa melihat skeleton
                  dashboardnya untuk referensi kustomisasi lanjutan.
                </p>
              </div>
              <div className="step">
                <div className="n">04</div>
                <h3>Selesai dalam 5–7 hari</h3>
                <p>
                  Dashboard final diserahkan, lengkap dengan pelunasan dan
                  pendampingan pemakaian awal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-paper">
          <div className="wrap">
            <span className="eyebrow">
              <span className="dot" />
              Pertanyaan yang sering muncul
            </span>
            <h2 style={{ marginTop: "14px" }}>Sebelum Anda tanya, ini jawabannya.</h2>
            <div className="faq">
              <details open>
                <summary>
                  Saya enggak terlalu paham teknologi, ribet enggak
                  pakainya? <span className="plus">+</span>
                </summary>
                <p>
                  Tidak. Tampilannya sengaja dibuat sederhana — kartu angka,
                  grafik, dan tabel yang bisa langsung dibaca tanpa training
                  khusus. Kalau Anda sudah biasa pakai Google Sheets, Anda
                  sudah cukup siap.
                </p>
              </details>
              <details>
                <summary>
                  Data di Google Sheets saya aman enggak kalau
                  disambungkan? <span className="plus">+</span>
                </summary>
                <p>
                  Aman. Koneksi menggunakan akun layanan khusus yang hanya
                  diberi akses ke spreadsheet yang Anda bagikan, dan setiap
                  tabel di database dilindungi aturan akses (row level
                  security) sehingga hanya user yang berwenang yang bisa
                  melihat datanya.
                </p>
              </details>
              <details>
                <summary>
                  Kalau bisnis saya berkembang, bisa ditambah fitur?{" "}
                  <span className="plus">+</span>
                </summary>
                <p>
                  Bisa. &ldquo;Simple&rdquo; di nama paket ini artinya versi awal tidak
                  dibuat berlebihan, bukan berarti terbatas selamanya —
                  modul tambahan bisa dikerjakan terpisah begitu kebutuhan
                  Anda tumbuh.
                </p>
              </details>
              <details>
                <summary>
                  Kenapa harus custom, bukan pakai software yang sudah
                  jadi? <span className="plus">+</span>
                </summary>
                <p>
                  Software jadi harus melayani ribuan jenis bisnis
                  sekaligus, jadi wajar kalau terasa ada fitur yang tidak
                  relevan dan tetap ada biaya bulanan yang berjalan terus.
                  Dashbee hanya berisi apa yang bisnis Anda butuhkan, dan
                  lunas di depan.
                </p>
              </details>
              <details>
                <summary>
                  Bagaimana kalau saya butuh bantuan setelah dashboard
                  selesai? <span className="plus">+</span>
                </summary>
                <p>
                  Ada pendampingan di masa awal pemakaian untuk memastikan
                  tim Anda nyaman menggunakannya. Kebutuhan perubahan atau
                  penambahan fitur di luar itu bisa didiskusikan sebagai
                  pekerjaan terpisah.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="kontak" className="bg-ink comb">
          <div className="wrap">
            <div className="final-grid">
              <span className="eyebrow">
                <span className="dot" />
                Mulai dari satu percakapan singkat
              </span>
              <h2 style={{ maxWidth: "20ch" }}>
                Berhenti rekap manual tengah malam. Mulai sekarang.
              </h2>
              <p className="lede">
                Ceritakan alur bisnis Anda, dan lihat sendiri seperti apa
                dashboard yang sesuai dengan angka-angka Anda — sebelum
                memutuskan apa pun.
              </p>
              <div className="hero-ctas">
                <a
                  className="btn btn-honey"
                  href="mailto:adihara.solutions@adihara.com?subject=Konsultasi%20Dashbee&body=Halo%20Adihara%20Solutions%2C%20saya%20ingin%20diskusi%20soal%20Dashbee%20untuk%20bisnis%20saya."
                >
                  Jadwalkan demo gratis
                </a>
                <a className="btn btn-ghost-dark" href="#harga">
                  Lihat detail paket
                </a>
              </div>
              <div className="kicker-strip">
                <span className="kicker">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8.5 6 12l8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Konsultasi awal gratis
                </span>
                <span className="kicker">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8.5 6 12l8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  DP 50%, sisanya setelah lihat skeleton
                </span>
                <span className="kicker">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8.5 6 12l8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Selesai 5–7 hari kerja
                </span>
              </div>
            </div>
          </div>
        </section>

        <footer className="site bg-ink">
          <div className="wrap foot-row">
            <span>
              Dashbee oleh <strong>Adihara Solutions</strong> — 2026
            </span>
            <div className="foot-links">
              <a href="#fitur">Fitur</a>
              <a href="#harga">Harga</a>
              <a href="#faq">FAQ</a>
              <a href="mailto:adihara.solutions@adihara.com">
                adihara.solutions@adihara.com
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
