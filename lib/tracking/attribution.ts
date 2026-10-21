'use client';

import type { Attribution } from '@/types';

const COOKIE = 'plus_attr';
const MAX_AGE_DAYS = 90;

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.*+?^${}()|[\]\\])/g, '\\$1') + '=([^;]*)'),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
}

/**
 * First-touch attribution: the first landing wins and is kept for 90 days.
 * A later visit only fills gaps, so an organic revisit never overwrites the ad
 * that actually brought the person in.
 */
export function captureAttribution(): Attribution {
  const stored = getAttribution();
  const params = new URLSearchParams(window.location.search);

  const incoming: Attribution = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) incoming[key] = value;
  }
  const fbclid = params.get('fbclid');
  if (fbclid) incoming.fbclid = fbclid;

  const hasIncoming = Object.keys(incoming).length > 0;
  const hasStored = Object.keys(stored).length > 0;

  if (!hasIncoming && hasStored) return stored;

  const merged: Attribution = {
    ...incoming,
    ...Object.fromEntries(Object.entries(stored).filter(([, v]) => v)),
    ...(hasIncoming ? incoming : {}),
    landing_page: stored.landing_page ?? window.location.pathname + window.location.search,
    referrer: stored.referrer ?? document.referrer ?? undefined,
    first_seen: stored.first_seen ?? new Date().toISOString(),
  };

  writeCookie(COOKIE, JSON.stringify(merged), MAX_AGE_DAYS);
  return merged;
}

export function getAttribution(): Attribution {
  const raw = readCookie(COOKIE);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Attribution;
  } catch {
    return {};
  }
}

/** Meta browser cookies, needed for CAPI deduplication and match quality. */
export function getMetaCookies(): { fbp?: string; fbc?: string } {
  const fbp = readCookie('_fbp') ?? undefined;
  let fbc = readCookie('_fbc') ?? undefined;

  if (!fbc) {
    const fbclid = getAttribution().fbclid;
    if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  return { fbp, fbc };
}

/** Shared id so the Pixel event and the CAPI event collapse into one. */
export function newEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
