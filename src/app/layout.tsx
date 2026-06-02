import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RGU RPET 2026 | Research & PhD Entrance Test Portal | Rathinam Global University',
  description: 'Apply for prestigious doctoral and research programmes at Rathinam Global University. Step-by-step admissions, online mock tests, interactive slot booking, and real-time status tracking.',
  keywords: 'PhD admission, research entrance test, RPET 2026, Rathinam Global University, doctoral research, university admission',
  authors: [{ name: 'Rathinam Global University Research Wing' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-bg-slate text-text-navy">
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#0F172A',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.05)',
            },
          }} 
        />
      </body>
    </html>
  );
}
