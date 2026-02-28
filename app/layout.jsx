import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import ToastProvider from '@/components/ToastProvider';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Brewood Cricket Club',
  description: 'Family friendly club. Idyllic setting. Cricket for all ages and abilities. Everyone Welcome'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="">
          {children}
        </main>
        <Footer />
        <CookieBanner />
        <ToastProvider />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
