'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { trackContact } from '@/lib/tracking/events';

const schema = z.object({
  name: z.string().min(2, 'Necesitamos tu nombre'),
  phone: z.string().min(6, 'Necesitamos un teléfono para responderte'),
  email: z.string().email('Revisá el email').optional().or(z.literal('')),
  message: z.string().min(5, 'Contanos brevemente qué necesitás'),
});

type Values = z.infer<typeof schema>;

const field = 'w-full rounded-xl border border-line bg-white px-4 py-3 text-ink';
const label = 'block text-fluid-sm font-medium text-cement mb-1.5';

export function ContactForm({ propertyId }: { propertyId?: string }) {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: 'onBlur' });

  if (sent) {
    return (
      <p className="rounded-card border border-line bg-white p-8 text-center">
        Gracias, ya recibimos tu consulta. Te respondemos por WhatsApp en el día.
      </p>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(async (values) => {
        trackContact({ ...values, property_id: propertyId ?? null, source: 'form' });
        setSent(true);
      })}
      className="grid gap-5 rounded-card border border-line bg-white p-6 sm:p-8"
    >
      <div>
        <label className={label} htmlFor="c-name">Nombre</label>
        <input id="c-name" className={field} aria-invalid={!!errors.name} {...register('name')} />
        {errors.name ? (
          <p aria-live="polite" className="mt-1.5 text-fluid-sm text-primary-600">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="c-phone">WhatsApp</label>
          <input id="c-phone" inputMode="tel" className={field} aria-invalid={!!errors.phone} {...register('phone')} />
          {errors.phone ? (
            <p aria-live="polite" className="mt-1.5 text-fluid-sm text-primary-600">{errors.phone.message}</p>
          ) : null}
        </div>
        <div>
          <label className={label} htmlFor="c-email">Email (opcional)</label>
          <input id="c-email" type="email" className={field} {...register('email')} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="c-message">¿En qué podemos ayudarte?</label>
        <textarea id="c-message" rows={4} className={field} aria-invalid={!!errors.message} {...register('message')} />
        {errors.message ? (
          <p aria-live="polite" className="mt-1.5 text-fluid-sm text-primary-600">{errors.message.message}</p>
        ) : null}
      </div>

      <button type="submit" disabled={isSubmitting}
        className="justify-self-start rounded-pill bg-primary-700 px-7 py-3.5 font-semibold text-white transition hover:bg-primary-600 disabled:opacity-60">
        {isSubmitting ? 'Enviando…' : 'Enviar consulta'}
      </button>
    </form>
  );
}
