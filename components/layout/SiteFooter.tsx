import Link from 'next/link';
import { Instagram, MapPin, Phone } from 'lucide-react';

const YEAR = new Date().getFullYear();

const INSTAGRAM =
  process.env.NEXT_PUBLIC_AGENCY_INSTAGRAM ?? 'https://www.instagram.com/nicoautomotoressantotome';
const PHONE = process.env.NEXT_PUBLIC_AGENCY_PHONE ?? '342 409 1487';
const ADDRESS = process.env.NEXT_PUBLIC_AGENCY_ADDRESS ?? 'Santo Tomé, Santa Fe';

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line pb-28 pt-12 md:pb-12">
      <div className="container-plus grid gap-8 text-fluid-sm text-cement md:grid-cols-3">
        <div>
          <p className="font-display text-fluid-lg font-bold text-ink">NICO Automotores</p>
          <p className="mt-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" aria-hidden /> {ADDRESS}
          </p>
          <p className="mt-1 flex items-center gap-2">
            <Phone className="h-4 w-4" aria-hidden /> {PHONE}
          </p>
        </div>

        <nav aria-label="Pie de página">
          <ul className="space-y-2">
            <li><Link href="/vehiculos" className="hover:text-primary-700">Autos disponibles</Link></li>
            <li><Link href="/vehiculos?operacion=0km" className="hover:text-primary-700">0 km</Link></li>
            <li><Link href="/vende-tu-auto" className="hover:text-primary-700">Vendé tu auto</Link></li>
            <li><Link href="/nosotros" className="hover:text-primary-700">Nosotros</Link></li>
            <li><Link href="/contacto" className="hover:text-primary-700">Contacto</Link></li>
            <li><Link href="/politica-de-privacidad" className="hover:text-primary-700">Política de privacidad</Link></li>
          </ul>
        </nav>

        <div className="space-y-2">
          <p>Venta de usados y 0 km · Consignaciones · Gestoría del automotor</p>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-primary-700"
          >
            <Instagram className="h-4 w-4" aria-hidden />
            @nicoautomotoressantotome
          </a>
        </div>
      </div>

      <p className="container-plus mt-10 text-center text-fluid-xs text-cement">
        © {YEAR} NICO Automotores. Precios y disponibilidad sujetos a confirmación.
      </p>
    </footer>
  );
}
