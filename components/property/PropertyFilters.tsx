'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { SlidersHorizontal, X, Loader2, ChevronDown } from 'lucide-react';

const OPERATIONS = [
  ['', 'Usados y 0 km'],
  ['usado', 'Usados'],
  ['0km', '0 km'],
] as const;

const TYPES = [
  ['', 'Todas las carrocerías'],
  ['pickup', 'Pick-up'],
  ['suv', 'SUV'],
  ['hatchback', 'Hatchback'],
  ['sedan', 'Sedán'],
  ['coupe', 'Coupé'],
  ['familiar', 'Familiar'],
  ['monovolumen', 'Monovolumen'],
  ['utilitario', 'Utilitario'],
] as const;

const FUELS = [
  ['', 'Combustible'],
  ['nafta', 'Nafta'],
  ['diesel', 'Diésel'],
  ['gnc', 'GNC'],
  ['hibrido', 'Híbrido'],
  ['electrico', 'Eléctrico'],
] as const;

const TRANSMISSIONS = [
  ['', 'Transmisión'],
  ['manual', 'Manual'],
  ['automatica', 'Automática'],
] as const;

const SORTS = [
  ['recent', 'Más recientes'],
  ['price_asc', 'Menor precio'],
  ['price_desc', 'Mayor precio'],
  ['year_desc', 'Más nuevos'],
  ['km_asc', 'Menos km'],
] as const;

const TOGGLES = [
  ['financiacion', 'Financiación'],
  ['permuta', 'Permuta'],
] as const;

/** Todo el estado del filtro vive en la URL, así cada búsqueda se puede compartir. */
export function PropertyFilters({ brands }: { brands: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const go = useCallback(
    (url: string) => {
      startTransition(() => {
        router.push(url, { scroll: false });
      });
    },
    [router],
  );

  const update = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete('pagina');
      const query = params.toString();
      go(query ? `${pathname}?${query}` : pathname);
    },
    [go, pathname, searchParams],
  );

  const value = (key: string) => searchParams.get(key) ?? '';
  const toggled = (key: string) => searchParams.get(key) === '1';
  const activeCount = [...searchParams.keys()].filter(
    (key) => !['orden', 'pagina', 'vista'].includes(key),
  ).length;

  // text-base en celular evita que el iPhone haga zoom al tocar un casillero.
  const field =
    'w-full rounded-xl border border-line bg-white px-3.5 py-3 text-base text-ink md:w-auto md:py-2.5 md:text-fluid-sm';

  const sortSelect = (id: string) => (
    <>
      <label className="sr-only" htmlFor={id}>Ordenar</label>
      <select id={id} className={field} value={value('orden') || 'recent'}
        onChange={(e) => update('orden', e.target.value)}>
        {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </>
  );

  return (
    <section
      aria-label="Filtros"
      aria-busy={pending}
      className="rounded-card border border-line bg-white p-4 md:p-5"
    >
      {/* Celular: botón para desplegar + orden */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-3.5 py-3 text-base font-semibold text-ink"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary-700" aria-hidden />
          ) : (
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
          )}
          {pending ? 'Buscando…' : `Filtros${activeCount > 0 ? ` (${activeCount})` : ''}`}
          <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} aria-hidden />
        </button>
        <div>{sortSelect('f-orden-movil')}</div>
      </div>

      {/* Filtros: plegables en celular, siempre visibles en compu */}
      <div
        className={[
          open ? 'mt-4 grid grid-cols-2 gap-3' : 'hidden',
          'md:mt-0 md:flex md:flex-wrap md:items-center md:gap-3',
        ].join(' ')}
      >
        <span className="hidden items-center gap-2 text-fluid-sm text-cement md:flex">
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary-700" aria-hidden />
          ) : (
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
          )}
          {pending ? <span className="text-primary-700">Buscando…</span> : 'Filtros'}
        </span>

        <div className="col-span-2 md:col-span-1">
          <label className="sr-only" htmlFor="f-operacion">Condición</label>
          <select id="f-operacion" className={field} value={value('operacion')}
            onChange={(e) => update('operacion', e.target.value || null)}>
            {OPERATIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="sr-only" htmlFor="f-tipo">Carrocería</label>
          <select id="f-tipo" className={field} value={value('tipo')}
            onChange={(e) => update('tipo', e.target.value || null)}>
            {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        {brands.length > 0 ? (
          <div className="col-span-2 md:col-span-1">
            <label className="sr-only" htmlFor="f-marca">Marca</label>
            <select id="f-marca" className={field} value={value('marca')}
              onChange={(e) => update('marca', e.target.value || null)}>
              <option value="">Todas las marcas</option>
              {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
            </select>
          </div>
        ) : null}

        <div className="col-span-1">
          <label className="sr-only" htmlFor="f-combustible">Combustible</label>
          <select id="f-combustible" className={field} value={value('combustible')}
            onChange={(e) => update('combustible', e.target.value || null)}>
            {FUELS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        <div className="col-span-1">
          <label className="sr-only" htmlFor="f-transmision">Transmisión</label>
          <select id="f-transmision" className={field} value={value('transmision')}
            onChange={(e) => update('transmision', e.target.value || null)}>
            {TRANSMISSIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        <div className="col-span-1">
          <label className="sr-only" htmlFor="f-moneda">Moneda</label>
          <select id="f-moneda" className={field} value={value('moneda')}
            onChange={(e) => update('moneda', e.target.value || null)}>
            <option value="">Cualquier moneda</option>
            <option value="USD">Dólares</option>
            <option value="ARS">Pesos</option>
          </select>
        </div>

        <div>
          <label className="sr-only" htmlFor="f-precio-min">Precio mínimo</label>
          <input id="f-precio-min" inputMode="numeric" placeholder="Precio mín."
            className={`${field} md:w-32`} defaultValue={value('precio_min')}
            onBlur={(e) => update('precio_min', e.target.value.replace(/\D/g, '') || null)} />
        </div>

        <div>
          <label className="sr-only" htmlFor="f-precio-max">Precio máximo</label>
          <input id="f-precio-max" inputMode="numeric" placeholder="Precio máx."
            className={`${field} md:w-32`} defaultValue={value('precio_max')}
            onBlur={(e) => update('precio_max', e.target.value.replace(/\D/g, '') || null)} />
        </div>

        <div>
          <label className="sr-only" htmlFor="f-anio">Año desde</label>
          <input id="f-anio" inputMode="numeric" placeholder="Año desde"
            className={`${field} md:w-28`} defaultValue={value('anio_min')}
            onBlur={(e) => update('anio_min', e.target.value.replace(/\D/g, '') || null)} />
        </div>

        <div>
          <label className="sr-only" htmlFor="f-km">Km máximo</label>
          <input id="f-km" inputMode="numeric" placeholder="Km máx."
            className={`${field} md:w-28`} defaultValue={value('km_max')}
            onBlur={(e) => update('km_max', e.target.value.replace(/\D/g, '') || null)} />
        </div>

        <div className="hidden items-center gap-3 md:ml-auto md:flex">
          {sortSelect('f-orden')}
          {activeCount > 0 ? (
            <button type="button" onClick={() => go(pathname)}
              className="inline-flex items-center gap-1.5 text-fluid-sm text-primary-700 hover:underline">
              <X className="h-4 w-4" aria-hidden />
              Limpiar ({activeCount})
            </button>
          ) : null}
        </div>

        <div className="col-span-2 flex flex-wrap gap-2 border-t border-line pt-4 md:w-full md:pt-4">
          {TOGGLES.map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={toggled(key)}
              onClick={() => update(key, toggled(key) ? null : '1')}
              className={
                toggled(key)
                  ? 'rounded-pill bg-primary-700 px-4 py-2 text-fluid-sm text-white'
                  : 'rounded-pill border border-line px-4 py-2 text-fluid-sm text-cement hover:border-primary-700 hover:text-primary-700'
              }
            >
              {label}
            </button>
          ))}
        </div>

        {activeCount > 0 ? (
          <button type="button" onClick={() => go(pathname)}
            className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl border border-line py-3 text-base text-primary-700 md:hidden">
            <X className="h-4 w-4" aria-hidden />
            Limpiar filtros ({activeCount})
          </button>
        ) : null}
      </div>
    </section>
  );
}
