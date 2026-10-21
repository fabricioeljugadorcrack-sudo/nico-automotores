import type { Metadata } from 'next';
import Link from 'next/link';

import { listProperties, parseFilters, getBrands, PAGE_SIZE } from '@/lib/properties';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { WhatsappCta } from '@/components/property/WhatsappCta';
import { generalWhatsappUrl } from '@/lib/whatsapp';

export const revalidate = 300;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const filters = parseFilters(await searchParams);
  const condicion = filters.operation === '0km' ? '0 km' : filters.operation === 'usado' ? 'usados' : '';
  const title = `Autos ${condicion} en Santo Tomé y Santa Fe`.replace(/\s+/g, ' ').trim();

  return {
    title,
    description:
      'Autos usados y 0 km seleccionados en NICO Automotores. Filtrá por marca, carrocería, precio, año y kilometraje. Financiación y permuta.',
    robots:
      Object.keys(filters).filter(
        (key) => !['sort', 'page', 'view', 'operation'].includes(key),
      ).length > 0
        ? { index: false, follow: true }
        : { index: true, follow: true },
  };
}

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const [{ properties, total, page, pages }, brands] = await Promise.all([
    listProperties(filters),
    getBrands(),
  ]);

  const queryFor = (nextPage: number) => {
    const next = new URLSearchParams(
      Object.entries(params).flatMap(([key, value]) =>
        value == null ? [] : [[key, Array.isArray(value) ? value[0]! : value] as [string, string]],
      ),
    );
    next.set('pagina', String(nextPage));
    return `/vehiculos?${next.toString()}`;
  };

  return (
    <>
      <SiteHeader />

      <main className="container-plus py-10">
        <h1 className="font-display text-fluid-2xl font-bold">Autos disponibles</h1>
        <p className="mt-2 text-cement">
          {total === 0
            ? 'Sin resultados para esta búsqueda'
            : `${total} auto${total > 1 ? 's' : ''} disponible${total > 1 ? 's' : ''}`}
        </p>

        <div className="mt-8">
          <PropertyFilters brands={brands} />
        </div>

        {properties.length > 0 ? (
          <>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {pages > 1 ? (
              <nav
                aria-label="Paginación"
                className="mt-12 flex items-center justify-center gap-3"
              >
                {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
                  <Link
                    key={number}
                    href={queryFor(number)}
                    aria-current={number === page ? 'page' : undefined}
                    className={
                      number === page
                        ? 'grid h-10 w-10 place-items-center rounded-full bg-primary-700 text-white'
                        : 'grid h-10 w-10 place-items-center rounded-full border border-line text-cement hover:border-primary-700 hover:text-primary-700'
                    }
                  >
                    {number}
                  </Link>
                ))}
              </nav>
            ) : null}

            <p className="mt-6 text-center text-fluid-sm text-cement">
              Mostrando {properties.length} de {total} · {PAGE_SIZE} por página
            </p>
          </>
        ) : (
          <div className="mt-16 rounded-card border border-line bg-white px-8 py-16 text-center">
            <h2 className="font-display text-fluid-xl font-bold">
              ¿No encontrás el auto que buscás?
            </h2>
            <p className="mx-auto mt-3 max-w-[44ch] text-cement">
              Ingresan autos nuevos todas las semanas y también conseguimos el que buscás a pedido.
              Contanos qué estás buscando y te avisamos apenas entra.
            </p>
            <div className="mt-8">
              <WhatsappCta
                href={generalWhatsappUrl(
                  'Hola! Estoy buscando un auto y no lo encontré en la web. ¿Me ayudan?',
                )}
              >
                Escribinos
              </WhatsappCta>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
