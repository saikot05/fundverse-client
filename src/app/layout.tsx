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
  title: 'FundVerse | Secure Crowdfunding Platform',
  description:
    'Empower builders and creators. Pledge credits, initiate Stripe checkouts, and withdraw funds transparently on FundVerse.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is required by next-themes to avoid SSR mismatch
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      {/* bg-background and text-foreground come from HeroUI's CSS variables */}
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <ClientProviders>
          <Navbar />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
