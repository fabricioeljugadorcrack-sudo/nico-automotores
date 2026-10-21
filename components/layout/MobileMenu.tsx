'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart } from 'lucide-react';
import { WhatsappCta } from '@/components/property/WhatsappCta';

interface Props {
  links: Array<{ href: string; label: string }>;
  whatsappHref: string;
  transparent?: boolean;
}

export function MobileMenu({ links, whatsappHref, transparent = false }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Se cierra solo al cambiar de página.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Evita que la página de atrás se desplace con el menú abierto.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
        className={[
          'grid h-11 w-11 place-items-center rounded-full transition hover:opacity-80',
          transparent ? 'text-white' : 'text-ink',
        ].join(' ')}
      >
        <Menu className="h-7 w-7" aria-hidden />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-paper"
          style={{
            paddingTop: 'env(safe-area-inset-top, 0px)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          <div className="container-plus flex items-center justify-between py-4">
            <Link href="/" aria-label="Inicio" onClick={() => setOpen(false)}>
              <Image src="/logo-nico.svg" alt="NICO Automotores" width={240} height={45} className="h-10 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="grid h-11 w-11 place-items-center rounded-full text-ink hover:opacity-80"
            >
              <X className="h-7 w-7" aria-hidden />
            </button>
          </div>

          <nav aria-label="Menú principal" className="container-plus flex-1 py-6">
            <ul className="divide-y divide-line border-y border-line">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-5 font-display text-2xl font-bold text-ink"
                  >
                    {link.label}
                    <span aria-hidden className="text-primary-700">→</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/favoritos"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-5 font-display text-2xl font-bold text-ink"
                >
                  <span className="flex items-center gap-3">
                    <Heart className="h-6 w-6 text-primary-700" aria-hidden />
                    Mis favoritos
                  </span>
                  <span aria-hidden className="text-primary-700">→</span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="container-plus grid gap-3 pb-8">
            <Link
              href="/vende-tu-auto"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-primary-700 px-4 py-4 text-center text-lg font-semibold text-white"
            >
              Vendé o permutá tu auto
            </Link>
            <WhatsappCta href={whatsappHref} variant="bar">
              Escribinos por WhatsApp
            </WhatsappCta>
          </div>
        </div>
      ) : null}
    </>
  );
}
