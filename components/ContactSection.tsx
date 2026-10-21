'use client';

import { useRef, useState, useTransition, type FormEvent } from 'react';
import { sendContact } from '@/lib/contact-actions';

const field = 'mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 font-normal';
const label = 'block text-fluid-sm font-medium';

export function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const phone = process.env.NEXT_PUBLIC_AGENCY_PHONE ?? '342 409 1487';
  const email = process.env.NEXT_PUBLIC_AGENCY_EMAIL;
  const address = process.env.NEXT_PUBLIC_AGENCY_ADDRESS ?? 'Santo Tomé, Santa Fe';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await sendContact(formData);
      if (!result.ok) {
        setError(result.error ?? 'No pudimos enviar tu consulta.');
        return;
      }
      formRef.current?.reset();
      setSent(true);
      const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
      fbq?.('track', 'Lead');
    });
  }

  return (
    <section id="contacto" className="container-plus border-t border-line py-16" aria-labelledby="contacto-titulo">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className="eyebrow">Contacto</p>
          <h2 id="contacto-titulo" className="mt-2 font-display text-fluid-2xl font-bold">
            ¿Tenés alguna consulta?
          </h2>
          <p className="mt-3 max-w-[42ch] text-cement">
            Dejanos tus datos y te escribimos por WhatsApp a la brevedad. Sin compromiso.
          </p>
          <ul className="mt-6 space-y-2 text-fluid-sm">
            {phone ? <li><strong>WhatsApp:</strong> {phone}</li> : null}
            {email ? <li><strong>Email:</strong> <a href={`mailto:${email}`} className="text-primary-700 underline underline-offset-4">{email}</a></li> : null}
            {address ? <li><strong>Oficina:</strong> {address}</li> : null}
          </ul>
        </div>

        <div className="rounded-card border border-line bg-white p-6 md:p-8">
          {sent ? (
            <div className="py-8 text-center">
              <p className="font-display text-fluid-lg font-bold">¡Gracias! Recibimos tu consulta.</p>
              <p className="mt-2 text-cement">Te escribimos por WhatsApp a la brevedad.</p>
              <button type="button" onClick={() => setSent(false)} className="mt-6 text-primary-700 underline underline-offset-4">
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4">
              <label className={label}>
                Nombre
                <input name="name" required autoComplete="name" className={field} />
              </label>
              <label className={label}>
                Teléfono (WhatsApp)
                <input name="phone" required inputMode="tel" autoComplete="tel" placeholder="Ej: 342 4123456" className={field} />
              </label>
              <label className={label}>
                ¿Qué estás buscando?
                <select name="interest" defaultValue="Comprar un auto" className={field}>
                  <option>Comprar un auto</option>
                  <option>Vender / permutar mi auto</option>
                  <option>Consignar mi auto</option>
                  <option>Gestoría del automotor</option>
                  <option>Otra consulta</option>
                </select>
              </label>
              <label className={label}>
                Mensaje (opcional)
                <textarea name="message" rows={3} placeholder="Contanos qué buscás: marca, modelo, presupuesto…" className={field} />
              </label>

              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

              {error ? <p className="text-fluid-sm text-red-700">{error}</p> : null}

              <button type="submit" disabled={pending}
                className="rounded-pill bg-primary-700 px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60">
                {pending ? 'Enviando…' : 'Enviar consulta'}
              </button>
              <p className="text-fluid-xs text-cement">Usamos tus datos solo para responder tu consulta.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
