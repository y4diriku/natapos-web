import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.natapos.web.id'),
  title: 'NATA POS PRO - Software Kasir Ritel & Jasa #1 di Indonesia',
  description: 'Software kasir offline-first untuk bisnis ritel, fotokopi, percetakan, dan aneka layanan jasa. Transaksi cepat, QRIS dinamis otomatis, dan pantau omzet dari smartphone.',
  keywords: [
    'software kasir',
    'aplikasi kasir ritel',
    'pos percetakan',
    'software kasir fotokopi',
    'aplikasi kasir toko',
    'pos offline first',
    'qris dinamis pos',
    'nata pos pro',
    'program kasir indonesia'
  ],
  authors: [{ name: 'NATA Developer' }],
  creator: 'NATA Developer',
  publisher: 'NATA Developer',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  verification: {
    google: 'pX6QcS2Mk_t3FAnm5aATeSOtJ-A5621E5fz7xR6Jekg',
  },
  openGraph: {
    title: 'NATA POS PRO - Software Kasir Ritel & Jasa',
    description: 'Sistem POS Hybrid cerdas untuk toko ritel, fotokopi, digital printing, dan usaha jasa. Pantau omzet toko secara live dari mana saja.',
    url: 'https://www.natapos.web.id',
    siteName: 'NATA POS PRO',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'NATA POS PRO Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'NATA POS PRO - Software Kasir Ritel & Jasa',
    description: 'Software kasir offline-first untuk ritel, fotokopi, dan percetakan.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'NATA POS PRO',
    operatingSystem: 'Windows 10, Windows 11',
    applicationCategory: 'BusinessApplication',
    description: 'Software POS Hybrid Cerdas untuk Penjualan Ritel, Fotokopi, Digital Printing, dan Aneka Jasa.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
    },
  };

  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <meta name="google-site-verification" content="pX6QcS2Mk_t3FAnm5aATeSOtJ-A5621E5fz7xR6Jekg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased font-sans bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
