import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldCheck, Repeat, BadgeDollarSign } from 'lucide-react';

import { getFeaturedProperties } from '@/lib/properties';
import { PropertyCard } from '@/components/property/PropertyCard';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SocialProof } from '@/components/SocialProof';
import { ContactSection } from '@/components/ContactSection';
import { SearchBar } from '@/components/forms/SearchBar';
import { WhatsappCta } from '@/components/property/WhatsappCta';
import { generalWhatsappUrl } from '@/lib/whatsapp';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Autos usados y 0 km en Santo Tomé, Santa Fe',
  description:
    'NICO Automotores: venta de autos usados y 0 km seleccionados en Santo Tomé. Consignaciones, gestoría del automotor, financiación y permuta.',
  alternates: { canonical: '/' },
};

const PILLARS = [
  { icon: ShieldCheck, title: 'Autos revisados', text: 'Cada unidad pasa por una revisión mecánica antes de publicarse. Sin sorpresas.' },
  { icon: Repeat, title: 'Tomamos tu usado', text: 'Recibimos tu auto como parte de pago y te hacemos la mejor tasación del día.' },
  { icon: BadgeDollarSign, title: 'Financiación', text: 'Cuotas a tu medida y toda la gestoría del automotor resuelta por nosotros.' },
];

export default async function HomePage() {
  const featured = await getFeaturedProperties(6);

  return (
    <>
      <section className="relative flex min-h-[70svh] flex-col justify-between bg-primary-950 md:min-h-[78svh]">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(50,107,255,.55),transparent_55%)]" />
        <SiteHeader transparent />
        <div className="container-plus relative z-10 pb-12 pt-24 md:pb-16">
          <h1 className="max-w-[16ch] font-display text-fluid-3xl font-bold leading-[0.96] text-white">
            Tu próximo auto en Santo Tomé
          </h1>
          <p className="mt-5 max-w-[46ch] text-fluid-lg text-primary-50">
            Usados seleccionados y 0 km. Financiación, permuta y gestoría, todo en un solo lugar.
          </p>
          <div className="mt-8 md:mt-10">
            <SearchBar />
          </div>
          <p className="mt-5 text-fluid-sm text-primary-50">
            ¿Querés vender o permutar tu auto?{' '}
            <Link href="/vende-tu-auto" className="font-semibold text-white underline underline-offset-4">
              Te lo tasamos sin cargo
            </Link>
          </p>
        </div>
      </section>

      <main>
        <section className="container-plus py-12 md:py-16" aria-labelledby="destacados">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Stock</p>
              <h2 id="destacados" className="mt-2 font-display text-fluid-2xl font-bold">Autos destacados</h2>
            </div>
            <Link href="/vehiculos" className="shrink-0 text-primary-700 underline underline-offset-4">Ver todos</Link>
          </div>
          {featured.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-cement">Estamos cargando el stock. Escribinos y te pasamos las unidades disponibles.</p>
          )}
        </section>

        <section className="bg-sand py-12 md:py-16" aria-labelledby="por-que">
          <div className="container-plus">
            <p className="eyebrow">Por qué NICO</p>
            <h2 id="por-que" className="mt-2 font-display text-fluid-2xl font-bold">Comprá tranquilo</h2>
            <ul className="mt-8 grid gap-8 md:mt-10 md:grid-cols-3">
              {PILLARS.map((pillar) => (
                <li key={pillar.title}>
                  <pillar.icon className="h-7 w-7 text-primary-700" aria-hidden />
                  <h3 className="mt-4 font-display text-fluid-lg font-bold">{pillar.title}</h3>
                  <p className="mt-2 text-cement">{pillar.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <SocialProof />

        <section className="container-plus py-12 md:py-16" aria-labelledby="vende">
          <div className="rounded-card bg-gradient-to-br from-primary-700 to-primary-900 px-6 py-12 text-center text-white md:px-16 md:py-14">
            <h2 id="vende" className="font-display text-fluid-2xl font-bold">¿Querés vender o permutar tu auto?</h2>
            <p className="mx-auto mt-3 max-w-[48ch] text-primary-50">
              Lo tasamos sin cargo con valores reales de mercado. Te lo compramos o lo tomamos como
              parte de pago por otra unidad. También lo dejamos en consignación.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link href="/vende-tu-auto" className="rounded-pill bg-white px-7 py-4 text-center font-semibold text-primary-700 transition hover:-translate-y-0.5">
                Tasar mi auto
              </Link>
              <WhatsappCta href={generalWhatsappUrl('Hola! Quiero saber cuánto me pagan por mi auto.')} source="whatsapp_click">
                Consultar por WhatsApp
              </WhatsappCta>
            </div>
          </div>
        </section>

        <ContactSection />
      </main>
    </>
  );
}
