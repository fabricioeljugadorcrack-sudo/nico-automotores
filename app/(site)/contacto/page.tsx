import type { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ContactForm } from '@/components/forms/ContactForm';
import { WhatsappCta } from '@/components/property/WhatsappCta';
import { generalWhatsappUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Escribinos por WhatsApp o dejanos tu consulta sobre nuestros autos. Respondemos en el día.',
  alternates: { canonical: '/contacto' },
};

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_AGENCY_EMAIL;
  const address = process.env.NEXT_PUBLIC_AGENCY_ADDRESS ?? 'Santo Tomé, Santa Fe';

  return (
    <>
      <SiteHeader />
      <main className="container-plus py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow">Contacto</p>
            <h1 className="mt-3 font-display text-fluid-2xl font-bold leading-tight">
              Hablemos
            </h1>
            <p className="mt-4 text-cement">
              La vía más rápida es WhatsApp: respondemos en el día. Contanos qué auto buscás o
              qué querés vender y te asesoramos sin compromiso.
            </p>

            <div className="mt-8">
              <WhatsappCta href={generalWhatsappUrl()}>Escribinos por WhatsApp</WhatsappCta>
            </div>

            <dl className="mt-10 space-y-4 text-fluid-sm text-cement">
              {address ? (
                <div><dt className="font-medium text-ink">Oficina</dt><dd>{address}</dd></div>
              ) : null}
              {email ? (
                <div>
                  <dt className="font-medium text-ink">Email</dt>
                  <dd><a className="hover:text-primary-700" href={`mailto:${email}`}>{email}</a></dd>
                </div>
              ) : null}
              <div>
                <dt className="font-medium text-ink">WhatsApp</dt>
                <dd>342 409 1487</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Zona</dt>
                <dd>Santo Tomé y Santa Fe capital</dd>
              </div>
            </dl>
          </div>

          <ContactForm />
        </div>
      </main>
    </>
  );
}
