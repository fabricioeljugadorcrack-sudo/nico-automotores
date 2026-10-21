import { VEHICLES } from '@/lib/data/vehicles';
import type { PropertyFilters, PropertyWithRelations } from '@/types';

export const PAGE_SIZE = 12;

const VISIBLE = new Set<PropertyWithRelations['status']>(['available', 'reserved']);

/** Precio efectivo del aviso, usado para ordenar y para la tarjeta. */
export function effectivePrice(property: PropertyWithRelations) {
  if (property.price != null && property.currency) {
    return { price: property.price, currency: property.currency };
  }
  return { price: null, currency: null };
}

/** Normaliza USD y ARS a una escala común solo para ordenar por precio. */
function sortablePrice(property: PropertyWithRelations): number {
  const { price, currency } = effectivePrice(property);
  if (price == null) return Number.POSITIVE_INFINITY;
  return currency === 'USD' ? price * 1000 : price;
}

export async function getPropertyBySlug(
  slug: string,
): Promise<PropertyWithRelations | null> {
  return VEHICLES.find((v) => v.slug === slug) ?? null;
}

export async function getAllPropertySlugs(): Promise<string[]> {
  return VEHICLES.filter((v) => VISIBLE.has(v.status)).map((v) => v.slug);
}

export async function getFeaturedProperties(limit = 6) {
  return VEHICLES.filter((v) => v.status === 'available')
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return +new Date(b.created_at) - +new Date(a.created_at);
    })
    .slice(0, limit);
}

/** Favoritos: devuelve los autos con el último guardado primero. */
export async function getPropertiesByIds(ids: string[]): Promise<PropertyWithRelations[]> {
  const wanted = [...new Set(ids)].slice(0, 60);
  const byId = new Map(VEHICLES.map((v) => [v.id, v]));
  return wanted
    .slice()
    .reverse()
    .map((id) => byId.get(id))
    .filter((v): v is PropertyWithRelations => Boolean(v));
}

export async function listProperties(filters: PropertyFilters) {
  let results = VEHICLES.filter((v) => VISIBLE.has(v.status));

  if (filters.q) {
    const q = filters.q
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim();
    if (q) {
      results = results.filter((v) =>
        `${v.brand} ${v.model} ${v.version ?? ''} ${v.year}`
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .toLowerCase()
          .includes(q),
      );
    }
  }

  if (filters.operation) results = results.filter((v) => v.operation === filters.operation);
  if (filters.type) results = results.filter((v) => v.type === filters.type);
  if (filters.brand) results = results.filter((v) => v.brand.toLowerCase() === filters.brand!.toLowerCase());
  if (filters.currency) results = results.filter((v) => v.currency === filters.currency);
  if (filters.fuel) results = results.filter((v) => v.fuel === filters.fuel);
  if (filters.transmission) results = results.filter((v) => v.transmission === filters.transmission);
  if (filters.priceMin != null) results = results.filter((v) => (v.price ?? 0) >= filters.priceMin!);
  if (filters.priceMax != null) results = results.filter((v) => (v.price ?? Infinity) <= filters.priceMax!);
  if (filters.yearMin != null) results = results.filter((v) => v.year >= filters.yearMin!);
  if (filters.kmMax != null) results = results.filter((v) => v.km <= filters.kmMax!);
  if (filters.financiacion) results = results.filter((v) => v.financiacion);
  if (filters.permuta) results = results.filter((v) => v.permuta);

  switch (filters.sort) {
    case 'price_asc':
      results = [...results].sort((a, b) => sortablePrice(a) - sortablePrice(b));
      break;
    case 'price_desc':
      results = [...results].sort((a, b) => sortablePrice(b) - sortablePrice(a));
      break;
    case 'year_desc':
      results = [...results].sort((a, b) => b.year - a.year);
      break;
    case 'km_asc':
      results = [...results].sort((a, b) => a.km - b.km);
      break;
    default:
      results = [...results].sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return +new Date(b.created_at) - +new Date(a.created_at);
      });
  }

  const total = results.length;
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  return {
    properties: results.slice(from, from + PAGE_SIZE),
    total,
    page,
    pages: Math.ceil(total / PAGE_SIZE),
  };
}

/** Misma marca primero, después mismo segmento. */
export async function getSimilarProperties(
  property: PropertyWithRelations,
  limit = 3,
) {
  const pool = VEHICLES.filter(
    (v) => v.status === 'available' && v.id !== property.id,
  );
  const sameBrand = pool.filter((v) => v.brand === property.brand);
  const sameType = pool.filter((v) => v.type === property.type && v.brand !== property.brand);
  const rest = pool.filter((v) => v.brand !== property.brand && v.type !== property.type);
  return [...sameBrand, ...sameType, ...rest].slice(0, limit);
}

/** Marcas disponibles, para el filtro. */
export async function getBrands(): Promise<string[]> {
  return [...new Set(
    VEHICLES.filter((v) => VISIBLE.has(v.status)).map((v) => v.brand),
  )].sort();
}

/** Convierte los search params de la URL en filtros tipados. */
export function parseFilters(params: Record<string, string | string[] | undefined>): PropertyFilters {
  const get = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const num = (key: string) => {
    const value = get(key);
    if (!value) return undefined;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  };
  const bool = (key: string) => (get(key) === '1' ? true : undefined);

  return {
    operation: get('operacion') as PropertyFilters['operation'],
    type: get('tipo') as PropertyFilters['type'],
    brand: get('marca'),
    q: get('q'),
    currency: get('moneda') as PropertyFilters['currency'],
    fuel: get('combustible') as PropertyFilters['fuel'],
    transmission: get('transmision') as PropertyFilters['transmission'],
    priceMin: num('precio_min'),
    priceMax: num('precio_max'),
    yearMin: num('anio_min'),
    kmMax: num('km_max'),
    financiacion: bool('financiacion'),
    permuta: bool('permuta'),
    sort: (get('orden') as PropertyFilters['sort']) ?? 'recent',
    page: num('pagina') ?? 1,
    view: 'grid',
  };
}
