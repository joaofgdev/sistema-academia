'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import './globals.css'; // ✅ Importa o Tailwind

// (Opcional) Se estiver usando fontes do Google com next/font:
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = pathname !== '/login';

  return (
    <html
      lang="pt-br"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="flex bg-gray-100 min-h-screen">
        {showSidebar && <Sidebar />}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
