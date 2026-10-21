import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { Heart } from 'lucide-react';

import { getPropertiesByIds } from '@/lib/properties';
import { PropertyCard } from '@/components/property/PropertyCard';
import { FavoritesRefresher } from '@/components/property/FavoritesRefresher';
import { SiteHeader } from '@/components/layout/SiteHeader';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mis favoritos',
  robots: { index: false, follow: true },
};

export default async function FavoritesPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get('plus_favs')?.value ?? '';
  const ids = decodeURIComponent(raw).split(',').filter(Boolean);
  const properties = await getPropertiesByIds(ids);

  return (
    <>
      <SiteHeader />
      <FavoritesRefresher />

      <main className="container-plus py-10">
        <h1 className="font-display text-fluid-2xl font-bold">Mis favoritos</h1>
        <p className="mt-2 text-cement">
          {properties.length === 0
            ? 'Todavía no guardaste ningún auto.'
            : `${properties.length} auto${properties.length > 1 ? 's' : ''} guardado${properties.length > 1 ? 's' : ''} en este dispositivo.`}
        </p>

        {properties.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-card border border-line bg-white px-8 py-16 text-center">
            <Heart className="mx-auto h-10 w-10 text-primary-700" aria-hidden />
            <p className="mx-auto mt-4 max-w-[44ch] text-cement">
              Tocá el corazón en cualquier auto para guardarlo acá y compararlo después con calma.
            </p>
            <Link
              href="/vehiculos"
              className="mt-8 inline-block rounded-pill bg-primary-700 px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5"
            >
              Ver autos
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
