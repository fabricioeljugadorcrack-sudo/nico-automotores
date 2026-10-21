'use client';

import { useEffect } from 'react';
import { trackViewContent } from '@/lib/tracking/events';
import type { Currency } from '@/types';

/** Fires ViewContent once per property view, browser + CAPI, deduplicated. */
export function ViewContentTracker({
  code,
  title,
  price,
  currency,
}: {
  code: string;
  title: string;
  price: number | null;
  currency: Currency | null;
}) {
  useEffect(() => {
    trackViewContent({ code, title, price, currency });
  }, [code, title, price, currency]);

  return null;
}
