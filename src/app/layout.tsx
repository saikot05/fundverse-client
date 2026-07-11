import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientProviders from '../components/ClientProviders';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FunVerse | Secure Crowdfunding Platform',
  description:
    'Empower builders and creators. Pledge credits, initiate Stripe checkouts, and withdraw funds transparently on FunVerse.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-950 text-white scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-950 text-white`}>
        <ClientProviders>
          <Navbar />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
