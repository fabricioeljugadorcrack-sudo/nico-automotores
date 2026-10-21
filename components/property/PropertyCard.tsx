import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Gauge, Fuel as FuelIcon, Cog } from 'lucide-react';
import { effectivePrice } from '@/lib/properties';
import { formatPrice, formatKm, operationLabel, fuelLabel, transmissionLabel, typeLabel } from '@/lib/format';
import { propertyWhatsappUrl } from '@/lib/whatsapp';
import { WhatsappCta } from '@/components/property/WhatsappCta';
import { FavoriteButton } from '@/components/property/FavoriteButton';
import type { PropertyWithRelations } from '@/types';

function statusBadge(status: PropertyWithRelations['status']) {
  if (status === 'reserved') return { label: 'Reservado', className: 'bg-cement text-white' };
  if (status === 'sold') return { label: 'Vendido', className: 'bg-primary-950 text-white' };
  return null;
}

export function PropertyCard({ property }: { property: PropertyWithRelations }) {
  const href = `/vehiculos/${property.slug}`;
  const cover = property.images[0];
  const { price, currency } = effectivePrice(property);

  const status = statusBadge(property.status);
  const isAvailable = property.status === 'available';
  const is0km = property.operation === '0km';
  const priceDropped =
    isAvailable &&
    property.previous_price != null &&
    property.price != null &&
    property.previous_price > property.price;

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[5/4] overflow-hidden bg-sand">
        <Link href={href} aria-label={property.title} className="absolute inset-0">
          {cover ? (
            <Image
              src={cover.url}
              alt={cover.alt ?? property.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : null}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex max-w-[75%] flex-wrap gap-2">
          <span className="rounded-pill bg-primary-700 px-3 py-1 text-fluid-xs text-white">
            {operationLabel(property.operation)}
          </span>
          {status ? (
            <span className={`rounded-pill px-3 py-1 text-fluid-xs ${status.className}`}>
              {status.label}
            </span>
          ) : null}
          {is0km ? (
            <span className="rounded-pill bg-white px-3 py-1 text-fluid-xs font-semibold text-primary-700">
              Entrega inmediata
            </span>
          ) : null}
          {priceDropped ? (
            <span className="rounded-pill bg-amber-500 px-3 py-1 text-fluid-xs font-semibold text-white">
              Bajó de precio
            </span>
          ) : null}
        </div>

        <FavoriteButton id={property.id} className="absolute right-3 top-3" />

        {property.financiacion ? (
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-pill bg-white/95 px-3 py-1 text-fluid-xs text-primary-700">
            Financiación
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Link href={href} className="block flex-1">
          <p className="text-fluid-xs text-cement">
            {typeLabel(property.type)} · {property.city}
          </p>
          <h3 className="mt-1 font-display text-fluid-lg font-bold leading-tight">
            {property.title}
          </h3>

          <div className="mt-3 flex flex-wrap items-baseline gap-x-3">
            <p className="font-display text-fluid-xl font-bold tabular-nums text-primary-700">
              {formatPrice(price, currency)}
            </p>
            {priceDropped ? (
              <p className="text-fluid-sm tabular-nums text-cement line-through">
                {formatPrice(property.previous_price, property.currency)}
              </p>
            ) : null}
          </div>

          <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-fluid-sm text-cement">
            <li className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden />
              {property.year}
            </li>
            <li className="flex items-center gap-1.5">
              <Gauge className="h-4 w-4" aria-hidden />
              {formatKm(property.km)}
            </li>
            <li className="flex items-center gap-1.5">
              <FuelIcon className="h-4 w-4" aria-hidden />
              {fuelLabel(property.fuel)}
            </li>
            <li className="flex items-center gap-1.5">
              <Cog className="h-4 w-4" aria-hidden />
              {transmissionLabel(property.transmission)}
            </li>
          </ul>
        </Link>

        {isAvailable || property.status === 'reserved' ? (
          <div className="mt-5">
            <WhatsappCta
              href={propertyWhatsappUrl(property, property.agent)}
              propertyId={property.id}
              agentId={property.agent_id}
              propertyCode={property.code}
              variant="bar"
            >
              Consultar por WhatsApp
            </WhatsappCta>
          </div>
        ) : null}
      </div>
    </article>
  );
}
