'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { readFavorites, subscribeFavorites } from '@/components/property/FavoriteButton';

export function FavoritesLink({ transparent = false }: { transparent?: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readFavorites().length);
    sync();
    return subscribeFavorites(sync);
  }, []);

  return (
    <Link
      href="/favoritos"
      aria-label={count > 0 ? `Favoritos (${count})` : 'Favoritos'}
      className={[
        'relative grid h-11 w-11 place-items-center rounded-full transition hover:opacity-80',
        transparent ? 'text-white' : 'text-primary-700',
      ].join(' ')}
    >
      <Heart className={count > 0 ? 'h-6 w-6 fill-current' : 'h-6 w-6'} aria-hidden />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary-700 px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
