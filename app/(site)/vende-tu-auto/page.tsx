import type { Metadata } from 'next';
import { Repeat, Store, FileCheck } from 'lucide-react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { WhatsappCta } from '@/components/property/WhatsappCta';
import { generalWhatsappUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Vendé o permutá tu auto',
  description:
    'Te compramos tu auto, lo tomamos como parte de pago o lo dejás en consignación. Tasación sin cargo y gestoría del automotor incluida.',
  alternates: { canonical: '/vende-tu-auto' },
};

const OPTIONS = [
  {
    icon: FileCheck,
    title: 'Te lo compramos',
    text: 'Tasamos tu auto con valores reales de mercado y te hacemos una oferta en el día. Pago rápido y seguro.',
  },
  {
    icon: Repeat,
    title: 'Permuta',
    text: 'Entregás tu usado como parte de pago y te llevás otra unidad de nuestro stock. La diferencia, financiada.',
  },
  {
    icon: Store,
    title: 'Consignación',
    text: 'Dejás tu auto con nosotros: lo exhibimos, lo mostramos y nos encargamos de toda la venta por vos.',
  },
];

const WHATSAPP_MESSAGE =
  'Hola! Quiero vender/permutar mi auto. Te paso los datos: Marca y modelo, Año, Kilómetros, Estado general.';

export default function SellYourCarPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-primary-950">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(50,107,255,.5),transparent_55%)]" />
        <SiteHeader transparent />
        <div className="container-plus relative z-10 pb-16 pt-24">
          <p className="eyebrow !text-primary-100">Vendé tu auto</p>
          <h1 className="mt-3 max-w-[20ch] font-display text-fluid-3xl font-bold leading-[0.98] text-white">
            Tasamos tu auto sin cargo
          </h1>
          <p className="mt-5 max-w-[48ch] text-fluid-lg text-primary-50">
            Te lo compramos, lo tomamos como parte de pago o lo dejás en consignación. Vos elegís.
            La tasación es gratis y sin compromiso.
          </p>
          <div className="mt-8">
            <WhatsappCta href={generalWhatsappUrl(WHATSAPP_MESSAGE)} source="whatsapp_click">
              Tasar mi auto por WhatsApp
            </WhatsappCta>
          </div>
        </div>
      </section>

      <main className="container-plus py-14">
        <ul className="grid gap-6 md:grid-cols-3">
          {OPTIONS.map((option) => (
            <li key={option.title} className="rounded-card border border-line bg-white p-7">
              <option.icon className="h-7 w-7 text-primary-700" aria-hidden />
              <h2 className="mt-4 font-display text-fluid-lg font-bold">{option.title}</h2>
              <p className="mt-2 text-cement">{option.text}</p>
            </li>
          ))}
        </ul>

        <section className="mt-14 rounded-card border border-line bg-sand p-8 md:p-12">
          <h2 className="font-display text-fluid-xl font-bold">Cómo es el proceso</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              ['1', 'Contanos del auto', 'Escribinos por WhatsApp con marca, modelo, año, kilómetros y estado.'],
              ['2', 'Tasación sin cargo', 'Te damos un valor real de mercado y coordinamos para verlo.'],
              ['3', 'Cerramos la operación', 'Te pagamos, permutamos o lo consignamos. La gestoría la hacemos nosotros.'],
            ].map(([n, title, text]) => (
              <li key={n}>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-700 font-display text-lg font-bold text-white">
                  {n}
                </span>
                <h3 className="mt-3 font-display text-fluid-base font-bold">{title}</h3>
                <p className="mt-1 text-fluid-sm text-cement">{text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10">
            <WhatsappCta href={generalWhatsappUrl(WHATSAPP_MESSAGE)} source="whatsapp_click">
              Empezar por WhatsApp
            </WhatsappCta>
          </div>
        </section>
      </main>
    </>
  );
}
