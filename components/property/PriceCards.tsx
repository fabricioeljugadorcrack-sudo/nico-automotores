import { formatPrice } from '@/lib/format';
import type { PropertyWithRelations } from '@/types';

/** Precio del vehículo con las condiciones comerciales. */
export function PriceCards({ property }: { property: PropertyWithRelations }) {
  if (property.price == null || !property.currency) {
    return (
      <p className="rounded-card border border-line bg-white p-8 font-display text-fluid-xl">
        Consultar precio
      </p>
    );
  }

  const conditions = [
    property.financiacion ? 'Financiación en cuotas' : null,
    property.permuta ? 'Recibimos tu usado' : null,
    'Transferencia y gestoría incluidas',
  ].filter(Boolean) as string[];

  return (
    <div className="grid gap-5 sm:grid-cols-[1.1fr_1fr]">
      <article className="relative rounded-card border border-primary-700 bg-gradient-to-br from-primary-700 to-primary-900 p-8 text-white shadow-card">
        <span className="absolute -top-3 left-8 rounded-pill bg-white px-3.5 py-1 text-fluid-xs text-primary-700">
          {property.operation === '0km' ? 'Precio 0 km' : 'Precio contado'}
        </span>
        <h3 className="font-display text-fluid-lg text-primary-100">
          {property.brand} {property.model}
        </h3>
        <p className="mt-4 font-display text-fluid-3xl font-bold leading-none tabular-nums">
          {formatPrice(property.price, property.currency)}
        </p>
        {property.previous_price != null && property.previous_price > property.price ? (
          <p className="mt-2 text-primary-100">
            <span className="line-through">
              {formatPrice(property.previous_price, property.currency)}
            </span>{' '}
            · ¡Bajó de precio!
          </p>
        ) : (
          <p className="mt-2 text-primary-100">Precio final, listo para transferir.</p>
        )}
      </article>

      <article className="rounded-card border border-line bg-white p-8">
        <h3 className="font-display text-fluid-lg text-primary-700">Cómo lo comprás</h3>
        <ul className="mt-5 space-y-3 text-fluid-sm text-cement">
          {conditions.map((c) => (
            <li key={c} className="flex items-start gap-2.5">
              <span aria-hidden className="mt-1 block h-2 w-2 shrink-0 rounded-full bg-primary-700" />
              {c}
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
