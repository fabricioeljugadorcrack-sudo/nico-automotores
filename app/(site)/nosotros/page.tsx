import type { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/SiteHeader';

export const metadata: Metadata = {
  title: 'Nosotros',
  description:
    'NICO Automotores: venta de autos usados y 0 km en Santo Tomé, Santa Fe. Consignaciones, gestoría del automotor, financiación y permuta con la confianza de siempre.',
  alternates: { canonical: '/nosotros' },
};

const VALUES = [
  ['Transparencia', 'Te mostramos el estado real de cada auto. Nada de sorpresas después de la compra.'],
  ['Confianza', 'Somos de Santo Tomé y damos la cara. Nuestra mejor publicidad son los clientes que vuelven.'],
  ['Acompañamiento', 'Te asesoramos sin apuro, antes y después de la compra, hasta que el auto esté a tu nombre.'],
  ['Compromiso', 'Resolvemos la transferencia, la gestoría y la financiación por vos. Vos solo manejás.'],
];

const SERVICES = [
  ['Venta de usados y 0 km', 'Unidades seleccionadas y revisadas, usadas y nuevas, al mejor precio del mercado.'],
  ['Consignaciones', 'Dejá tu auto en nuestras manos: lo exhibimos, lo mostramos y nos encargamos de la venta.'],
  ['Gestoría del automotor', 'Transferencias, formularios, informes de dominio y todo el trámite resuelto por nosotros.'],
  ['Financiación y permuta', 'Cuotas a tu medida y tomamos tu usado como parte de pago por otra unidad.'],
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-plus py-14">
        <p className="eyebrow">Nosotros</p>
        <h1 className="mt-3 max-w-[18ch] font-display text-fluid-2xl font-bold leading-tight">
          Tu concesionaria de confianza en Santo Tomé
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <section>
            <h2 className="font-display text-fluid-lg font-bold">Quiénes somos</h2>
            <p className="mt-2 text-cement">
              NICO Automotores nació para que comprar o vender un auto sea simple y seguro. Trabajamos
              con unidades seleccionadas, las revisamos antes de publicarlas y acompañamos a cada
              cliente de principio a fin, desde que elige el auto hasta que lo tiene a su nombre.
            </p>
          </section>
          <section>
            <h2 className="font-display text-fluid-lg font-bold">Cómo trabajamos</h2>
            <p className="mt-2 text-cement">
              Precios claros, autos revisados y toda la parte burocrática resuelta por nosotros:
              financiación, permuta, transferencia y gestoría del automotor. Querés comprar, vender
              o consignar tu auto, lo hacemos fácil.
            </p>
          </section>
        </div>

        <section className="mt-16" aria-labelledby="valores">
          <h2 id="valores" className="font-display text-fluid-xl font-bold">Nuestros valores</h2>
          <ul className="mt-8 grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map(([title, text]) => (
              <li key={title} className="border-b border-line py-6 pr-6">
                <strong className="block font-display text-fluid-lg font-bold">{title}</strong>
                <span className="text-cement">{text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="servicios">
          <h2 id="servicios" className="font-display text-fluid-xl font-bold">Qué hacemos</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {SERVICES.map(([title, text]) => (
              <li key={title} className="rounded-card border border-line bg-white p-6">
                <strong className="block font-display text-fluid-lg font-bold">{title}</strong>
                <span className="mt-1 block text-cement">{text}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-14 text-fluid-sm text-cement">
          NICO Automotores · Santo Tomé, Santa Fe · WhatsApp 342 409 1487
        </p>
      </main>
    </>
  );
}
