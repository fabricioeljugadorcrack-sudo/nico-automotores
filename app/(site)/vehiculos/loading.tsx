import { SiteHeader } from '@/components/layout/SiteHeader';

/** Se muestra al instante mientras llega el listado. */
export default function Loading() {
  return (
    <>
      <SiteHeader />
      <main className="container-plus py-10" aria-busy="true" aria-label="Cargando autos">
        <div className="h-9 w-48 animate-pulse rounded-xl bg-sand" />
        <div className="mt-3 h-5 w-40 animate-pulse rounded-xl bg-sand" />
        <div className="mt-8 h-28 animate-pulse rounded-card bg-sand" />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-card border border-line bg-white">
              <div className="aspect-[5/4] animate-pulse bg-sand" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-1/3 animate-pulse rounded bg-sand" />
                <div className="h-6 w-2/3 animate-pulse rounded bg-sand" />
                <div className="h-7 w-1/2 animate-pulse rounded bg-sand" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-sand" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
