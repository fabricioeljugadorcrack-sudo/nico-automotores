'use client';

import { Phone } from 'lucide-react';
import { WhatsappCta } from './WhatsappCta';
import { trackContact } from '@/lib/tracking/events';
import { formatPrice } from '@/lib/format';
import type { Currency } from '@/types';

interface Props {
  whatsappUrl: string;
  phoneHref: string;
  propertyId: string;
  agentId: string | null;
  propertyCode: string;
  price: number | null;
  currency: Currency | null;
  priceNote?: string | null;
}

/** Sticky conversion bar on mobile. Respects the home indicator area. */
export function MobileActionBar({
  whatsappUrl,
  phoneHref,
  propertyId,
  agentId,
  propertyCode,
  price,
  currency,
  priceNote,
}: Props) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-fluid-lg font-bold leading-tight">
            {formatPrice(price, currency)}
          </p>
          {priceNote ? (
            <p className="truncate text-fluid-xs text-cement">{priceNote}</p>
          ) : null}
        </div>

        <a
          href={phoneHref}
          onClick={() =>
            trackContact({
              property_id: propertyId,
              agent_id: agentId,
              source: 'call_click',
              contentIds: [propertyCode],
              useBeacon: true,
            })
          }
          aria-label="Llamar"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-primary-700"
        >
          <Phone className="h-5 w-5" aria-hidden />
        </a>

        <WhatsappCta
          href={whatsappUrl}
          propertyId={propertyId}
          agentId={agentId}
          propertyCode={propertyCode}
          variant="bar"
          className="max-w-[9.5rem]"
        >
          WhatsApp
        </WhatsappCta>
      </div>
    </div>
  );
}
