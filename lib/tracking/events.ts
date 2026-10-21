'use client';

import type { LeadPayload, LeadSource } from '@/types';
import { getAttribution, getMetaCookies, newEventId } from './attribution';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

interface ContentPayload {
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  value?: number;
  currency?: string;
  search_string?: string;
}

// Sin pixel/analytics configurados no se hacen llamadas al backend de tracking.
// Cargá NEXT_PUBLIC_META_PIXEL_ID (y el endpoint /api/meta-capi) para activarlo.
const TRACKING_ENABLED = Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID);

function fireBrowserEvent(name: string, payload: ContentPayload, eventId: string) {
  window.fbq?.('track', name, payload, { eventID: eventId });
  window.gtag?.('event', name.toLowerCase(), payload);
}

/** Server side of the same event, hashed and deduplicated by event_id. */
async function fireServerEvent(
  name: string,
  payload: ContentPayload,
  eventId: string,
  user: { phone?: string; email?: string } = {},
) {
  if (!TRACKING_ENABLED) return;
  const { fbp, fbc } = getMetaCookies();

  try {
    await fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        event_name: name,
        event_id: eventId,
        event_source_url: window.location.href,
        custom_data: payload,
        user_data: { ...user, fbp, fbc },
      }),
    });
  } catch {
    // Tracking must never break the user flow.
  }
}

export function trackViewContent(property: {
  code: string;
  title: string;
  price: number | null;
  currency: string | null;
}) {
  const eventId = newEventId();
  const payload: ContentPayload = {
    content_ids: [property.code],
    content_name: property.title,
    content_type: 'product',
    ...(property.price != null && property.currency
      ? { value: property.price, currency: property.currency }
      : {}),
  };

  fireBrowserEvent('ViewContent', payload, eventId);
  void fireServerEvent('ViewContent', payload, eventId);
}

export function trackSearch(query: string) {
  const eventId = newEventId();
  const payload: ContentPayload = { search_string: query, content_type: 'product' };
  fireBrowserEvent('Search', payload, eventId);
  void fireServerEvent('Search', payload, eventId);
}

/**
 * Logs the lead and fires Contact/Lead.
 * Uses sendBeacon so the record survives the redirect to wa.me.
 */
export function trackContact(
  input: Omit<LeadPayload, 'event_id' | 'attribution'> & {
    contentIds?: string[];
    useBeacon?: boolean;
  },
) {
  const eventId = newEventId();
  const { fbp, fbc } = getMetaCookies();
  const attribution = getAttribution();

  const body: LeadPayload = {
    property_id: input.property_id ?? null,
    agent_id: input.agent_id ?? null,
    source: input.source,
    name: input.name,
    phone: input.phone,
    email: input.email,
    message: input.message,
    event_id: eventId,
    attribution,
    fbp,
    fbc,
  };

  if (TRACKING_ENABLED) {
    const serialized = JSON.stringify(body);
    const sent =
      input.useBeacon && typeof navigator !== 'undefined' && 'sendBeacon' in navigator
        ? navigator.sendBeacon(
            '/api/leads',
            new Blob([serialized], { type: 'application/json' }),
          )
        : false;

    if (!sent) {
      void fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: serialized,
      }).catch(() => undefined);
    }
  }

  const eventName = metaEventFor(input.source);
  const payload: ContentPayload = input.contentIds
    ? { content_ids: input.contentIds, content_type: 'product' }
    : {};

  fireBrowserEvent(eventName, payload, eventId);
  void fireServerEvent(eventName, payload, eventId, {
    phone: input.phone,
    email: input.email,
  });

  return eventId;
}

function metaEventFor(source: LeadSource): 'Contact' | 'Lead' {
  return source === 'whatsapp_click' || source === 'call_click' ? 'Contact' : 'Lead';
}
