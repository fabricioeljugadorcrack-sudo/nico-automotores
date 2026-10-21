import type { Agent, Property } from '@/types';

const DEFAULT_WHATSAPP =
  process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP ?? '+5493424091487';

/** wa.me quiere solo dígitos. */
function toWaDigits(number: string): string {
  return number.replace(/[^\d]/g, '');
}

export function resolveWhatsappNumber(agent?: Agent | null): string {
  return agent?.whatsapp_number ?? DEFAULT_WHATSAPP;
}

/**
 * Mensaje para consultar por un vehículo. Mantiene el código de referencia:
 * así el vendedor encuentra el auto al instante.
 */
export function propertyWhatsappMessage(
  property: Pick<Property, 'title' | 'code'>,
  advisorFirstName = 'Nico',
): string {
  return (
    `Hola ${advisorFirstName}! Me interesa el ${property.title} ` +
    `(Ref: ${property.code}) que vi en la web. ¿Sigue disponible?`
  );
}

export function buildWhatsappUrl(number: string, message: string): string {
  return `https://wa.me/${toWaDigits(number)}?text=${encodeURIComponent(message)}`;
}

export function propertyWhatsappUrl(
  property: Pick<Property, 'title' | 'code'>,
  agent?: Agent | null,
): string {
  const number = resolveWhatsappNumber(agent);
  const firstName = agent?.name?.split(' ')[0] ?? 'Nico';
  return buildWhatsappUrl(number, propertyWhatsappMessage(property, firstName));
}

/** Consulta general, usada en el estado vacío del listado y en el footer. */
export function generalWhatsappUrl(
  message = 'Hola! Estoy buscando un auto y me gustaría que me asesoren.',
  agent?: Agent | null,
): string {
  return buildWhatsappUrl(resolveWhatsappNumber(agent), message);
}

export function telHref(number?: string | null): string {
  return `tel:${(number ?? DEFAULT_WHATSAPP).replace(/[^\d+]/g, '')}`;
}
