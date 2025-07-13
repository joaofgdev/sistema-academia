'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = pathname !== '/login';

  return (
    <html lang="pt-br">
      <body className="flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
