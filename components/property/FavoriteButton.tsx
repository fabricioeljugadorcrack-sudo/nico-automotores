'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { Heart } from 'lucide-react';

const STORAGE_KEY = 'plus:favoritos';
const COOKIE_NAME = 'plus_favs';
const CHANGE_EVENT = 'plus:favoritos-change';
const MAX_FAVORITES = 60;

export function readFavorites(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

/** La página /favoritos se arma en el servidor, por eso también se guarda en una cookie. */
function writeCookie(ids: string[]) {
  const value = encodeURIComponent(ids.join(','));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=31536000; samesite=lax`;
}

export function hasFavoritesCookie(): boolean {
  return document.cookie.split('; ').some((part) => part.startsWith(`${COOKIE_NAME}=`));
}

export function writeFavorites(ids: string[]) {
  const unique = [...new Set(ids)].slice(-MAX_FAVORITES);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
  } catch {
    // Sin almacenamiento disponible (modo privado): sigue funcionando con la cookie.
  }
  writeCookie(unique);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeFavorites(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function FavoriteButton({ id, className = '' }: { id: string; className?: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sync = () => setActive(readFavorites().includes(id));
    sync();
    return subscribeFavorites(sync);
  }, [id]);

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const current = readFavorites();
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    writeFavorites(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      className={`grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-card transition hover:scale-105 ${className}`}
    >
      <Heart
        className={active ? 'h-5 w-5 fill-primary-700 text-primary-700' : 'h-5 w-5 text-primary-700'}
        aria-hidden
      />
    </button>
  );
}
