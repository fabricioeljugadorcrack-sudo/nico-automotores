import type { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/SiteHeader';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description:
    'Cómo tratamos los datos personales en Inmobiliaria Plus, conforme a la Ley 25.326 de Protección de Datos Personales.',
  alternates: { canonical: '/politica-de-privacidad' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  const name = process.env.NEXT_PUBLIC_AGENCY_LEGAL_NAME ?? 'Plus Inmobiliaria + Desarrollos';
  const email = process.env.NEXT_PUBLIC_AGENCY_EMAIL;
  const address = process.env.NEXT_PUBLIC_AGENCY_ADDRESS;

  return (
    <>
      <SiteHeader />
      <main className="container-plus max-w-3xl py-14">
        <h1 className="font-display text-fluid-2xl font-bold">Política de privacidad</h1>
        <p className="mt-2 text-fluid-sm text-cement">
          Ley 25.326 de Protección de los Datos Personales — República Argentina.
        </p>

        <div className="mt-10 space-y-8 text-cement [&_h2]:font-display [&_h2]:text-fluid-lg [&_h2]:font-bold [&_h2]:text-ink">
          <section>
            <h2>Responsable de la base de datos</h2>
            <p className="mt-2">
              {name}
              {address ? `, con domicilio en ${address}` : ''}
              {email ? `. Contacto: ${email}` : ''}.
            </p>
          </section>

          <section>
            <h2>Qué datos recolectamos</h2>
            <p className="mt-2">
              Nombre, teléfono y, opcionalmente, email cuando completás un formulario o nos
              escribís por WhatsApp desde el sitio. También registramos datos técnicos de
              navegación: páginas vistas, origen de la visita y parámetros de campaña
              publicitaria.
            </p>
          </section>

          <section>
            <h2>Para qué los usamos</h2>
            <p className="mt-2">
              Para responder tu consulta, coordinar visitas y tasaciones, enviarte propiedades
              que se ajusten a lo que buscás y medir el rendimiento de nuestras campañas. No
              vendemos ni cedemos tus datos a terceros con fines comerciales.
            </p>
          </section>

          <section>
            <h2>Publicidad y cookies</h2>
            <p className="mt-2">
              Usamos Meta Pixel y su API de Conversiones para medir resultados publicitarios.
              Cuando compartimos datos de contacto con Meta a esos fines, viajan cifrados con
              un hash irreversible (SHA-256). Podés desactivar la publicidad personalizada
              desde la configuración de tu cuenta de Facebook o Instagram, y bloquear cookies
              desde tu navegador.
            </p>
          </section>

          <section>
            <h2>Conservación</h2>
            <p className="mt-2">
              Conservamos los datos mientras dure la relación comercial y por el plazo legal
              posterior que corresponda. Los datos de atribución publicitaria se guardan por 90
              días.
            </p>
          </section>

          <section>
            <h2>Tus derechos</h2>
            <p className="mt-2">
              Podés acceder, rectificar y suprimir tus datos en cualquier momento escribiéndonos
              {email ? ` a ${email}` : ''}. El titular de los datos personales tiene la facultad
              de ejercer el derecho de acceso en forma gratuita a intervalos no inferiores a seis
              meses, salvo que se acredite un interés legítimo (art. 14, inc. 3, Ley 25.326).
            </p>
            <p className="mt-2">
              La Agencia de Acceso a la Información Pública, órgano de control de la Ley 25.326,
              tiene la atribución de atender las denuncias y reclamos que se interpongan con
              relación al incumplimiento de las normas sobre protección de datos personales.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
