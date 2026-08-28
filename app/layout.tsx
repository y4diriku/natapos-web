import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NATA POS PRO - Software Kasir Ritel & Jasa',
  description: 'Software kasir offline-first untuk bisnis ritel, fotokopi, percetakan, dan aneka layanan jasa. Pantau omzet toko dari mana saja secara real-time.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="antialiased font-sans bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
