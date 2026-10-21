import type {
  Currency,
  Fuel,
  Operation,
  Property,
  PropertyType,
  Transmission,
} from '@/types';

const AR = 'es-AR';

const numberFmt = new Intl.NumberFormat(AR, { maximumFractionDigits: 0 });

/**
 * "USD 18.500" / "$ 12.500.000".
 * Devuelve "Consultar precio" cuando no hay monto.
 */
export function formatPrice(
  price: number | null | undefined,
  currency: Currency | null | undefined,
): string {
  if (price == null || !currency) return 'Consultar precio';
  const amount = numberFmt.format(price);
  return currency === 'USD' ? `USD ${amount}` : `$ ${amount}`;
}

/** "45.000 km" o "0 km". */
export function formatKm(km: number | null | undefined): string | null {
  if (km == null) return null;
  if (km === 0) return '0 km';
  return `${numberFmt.format(km)} km`;
}

export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat(AR, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat(AR, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

const OPERATION_LABELS: Record<Operation, string> = {
  usado: 'Usado',
  '0km': '0 km',
};

const TYPE_LABELS: Record<PropertyType, string> = {
  sedan: 'Sedán',
  hatchback: 'Hatchback',
  suv: 'SUV',
  pickup: 'Pick-up',
  familiar: 'Familiar',
  coupe: 'Coupé',
  monovolumen: 'Monovolumen',
  utilitario: 'Utilitario',
};

const FUEL_LABELS: Record<Fuel, string> = {
  nafta: 'Nafta',
  diesel: 'Diésel',
  gnc: 'GNC',
  hibrido: 'Híbrido',
  electrico: 'Eléctrico',
};

const TRANSMISSION_LABELS: Record<Transmission, string> = {
  manual: 'Manual',
  automatica: 'Automática',
};

export const operationLabel = (op: Operation) => OPERATION_LABELS[op];
export const typeLabel = (t: PropertyType) => TYPE_LABELS[t];
export const fuelLabel = (f: Fuel) => FUEL_LABELS[f];
export const transmissionLabel = (t: Transmission) => TRANSMISSION_LABELS[t];

/** "SUV · Usado · Santo Tomé" — el eyebrow de la ficha. */
export function propertyEyebrow(
  property: Pick<Property, 'type' | 'operation' | 'city'>,
) {
  return `${typeLabel(property.type)} · ${operationLabel(property.operation)} · ${property.city}`;
}

/** Slug a partir de marca+modelo+año: "Toyota Hilux 2019" -> "toyota-hilux-2019". */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
