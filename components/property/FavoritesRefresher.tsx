'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  hasFavoritesCookie,
  readFavorites,
  subscribeFavorites,
  writeFavorites,
} from '@/components/property/FavoriteButton';

/** Mantiene /favoritos al día cuando se agrega o quita un corazón. */
export function FavoritesRefresher() {
  const router = useRouter();

  useEffect(() => {
    // Si alguien guardó favoritos antes de que existiera la cookie, la crea y recarga.
    const saved = readFavorites();
    if (saved.length > 0 && !hasFavoritesCookie()) writeFavorites(saved);

    return subscribeFavorites(() => router.refresh());
  }, [router]);

  return null;
}
