'use server';

function text(value: FormDataEntryValue | null, max = 1000): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed ? trimmed : null;
}

/**
 * Recibe la consulta del formulario. En esta versión (sin base de datos) valida
 * y registra el lead en el log del servidor. Para persistirlo, conectá acá tu
 * CRM, un Google Sheet, un email o una base de datos.
 */
export async function sendContact(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  // Campo trampa: las personas no lo ven, los robots lo completan.
  if (text(formData.get('website'))) return { ok: true };

  const name = text(formData.get('name'), 120);
  const phone = text(formData.get('phone'), 40);
  const interest = text(formData.get('interest'), 60);
  const message = text(formData.get('message'));

  if (!name || !phone) return { ok: false, error: 'Completá tu nombre y tu teléfono.' };
  if (phone.replace(/\D/g, '').length < 8) return { ok: false, error: 'Revisá el teléfono, parece incompleto.' };

  console.info('[lead] nueva consulta', {
    name,
    phone,
    interest,
    message,
    at: new Date().toISOString(),
  });

  return { ok: true };
}
