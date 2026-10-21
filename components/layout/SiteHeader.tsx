import Image from 'next/image';
import Link from 'next/link';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { FavoritesLink } from '@/components/layout/FavoritesLink';
import { generalWhatsappUrl } from '@/lib/whatsapp';

const NAV = [
  { href: '/vehiculos', label: 'Usados' },
  { href: '/vehiculos?operacion=0km', label: '0 km' },
  { href: '/vende-tu-auto', label: 'Vendé tu auto' },
  { href: '/contacto', label: 'Contacto' },
];

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const whatsappHref = generalWhatsappUrl('Hola! Estoy viendo la web de NICO Automotores y tengo una consulta.');

  return (
    <header
      className={
        transparent
          ? 'absolute inset-x-0 top-0 z-30'
          : 'sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur'
      }
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="container-plus flex items-center justify-between gap-4 py-3 md:py-5">
        <Link href="/" aria-label="NICO Automotores — inicio" className="shrink-0">
          <Image
            src={transparent ? '/logo-nico-cream.svg' : '/logo-nico.svg'}
            alt="NICO Automotores"
            width={300}
            height={56}
            priority
            className="h-10 w-auto md:h-12"
          />
        </Link>

        {/* Compu y tablet */}
        <div className="hidden items-center gap-6 md:flex">
          <nav aria-label="Principal">
            <ul
              className={[
                'flex items-center gap-7 text-fluid-sm',
                transparent ? 'text-white' : 'text-cement',
              ].join(' ')}
            >
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:opacity-70">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <FavoritesLink transparent={transparent} />

          <Link
            href="/vende-tu-auto"
            className={[
              'rounded-pill px-5 py-2.5 text-fluid-sm font-semibold transition hover:-translate-y-0.5',
              transparent ? 'bg-white text-primary-700' : 'bg-primary-700 text-white',
            ].join(' ')}
          >
            Vendé tu auto
          </Link>
        </div>

        {/* Celular */}
        <div className="flex items-center gap-1 md:hidden">
          <FavoritesLink transparent={transparent} />
          <MobileMenu links={NAV} whatsappHref={whatsappHref} transparent={transparent} />
        </div>
      </div>
    </header>
  );
}
