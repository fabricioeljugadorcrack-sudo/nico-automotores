import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { display, sans } from '@/lib/fonts';
import { MetaPixel } from '@/components/tracking/MetaPixel';
import { GoogleAnalytics } from '@/components/tracking/GoogleAnalytics';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'NICO Automotores — Autos usados y 0 km en Santo Tomé',
    template: '%s | NICO Automotores',
  },
  description:
    'Venta de autos usados y 0 km seleccionados en Santo Tomé, Santa Fe. Consignaciones, gestoría del automotor, financiación y permuta.',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'NICO Automotores',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0b1240',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const agencyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'NICO Automotores',
    url: siteUrl,
    areaServed: 'Santa Fe, Argentina',
    telephone: '+5493424091487',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Santo Tomé',
      addressRegion: 'Santa Fe',
      addressCountry: 'AR',
    },
    sameAs: ['https://www.instagram.com/nicoautomotoressantotome'],
    ...(process.env.NEXT_PUBLIC_AGENCY_EMAIL
      ? { email: process.env.NEXT_PUBLIC_AGENCY_EMAIL }
      : {}),
  };

  return (
    <html lang="es-AR" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans text-fluid-base antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(agencyJsonLd) }}
        />
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <GoogleAnalytics />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
