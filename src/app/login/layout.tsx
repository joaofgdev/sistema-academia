import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studio Duo Personal Trainer",
  description: "Gerenciamento de alunos da academia Studio Duo Personal Trainer",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-cover bg-center min-h-screen`}>
        <div className="bg-gray-900 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
