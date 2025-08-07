'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import './globals.css';

import { Geist, Geist_Mono } from 'next/font/google';

// ✅ IMPORTA O AMPLIFY
import { Amplify } from 'aws-amplify';
import amplifyconfig from '../amplifyconfiguration.json'; // ajuste o caminho se necessário

// ✅ CONFIGURA O AMPLIFY FORA DO COMPONENTE
Amplify.configure(amplifyconfig);

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
