'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { trackContact } from '@/lib/tracking/events';
import type { LeadSource } from '@/types';

interface Props {
  href: string;
  children: React.ReactNode;
  propertyId?: string | null;
  agentId?: string | null;
  propertyCode?: string;
  source?: LeadSource;
  className?: string;
  variant?: 'solid' | 'bar' | 'fab';
}

/**
 * Every WhatsApp entry point goes through here: it logs the lead with
 * sendBeacon and fires Contact before handing the click to wa.me.
 */
export function WhatsappCta({
  href,
  children,
  propertyId,
  agentId,
  propertyCode,
  source = 'whatsapp_click',
  className,
  variant = 'solid',
}: Props) {
  function handleClick() {
    trackContact({
      property_id: propertyId ?? null,
      agent_id: agentId ?? null,
      source,
      contentIds: propertyCode ? [propertyCode] : undefined,
      useBeacon: true,
    });
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center gap-3 font-semibold text-white',
        'bg-whatsapp transition duration-200 ease-out hover:brightness-110',
        variant === 'solid' && 'rounded-pill px-7 py-4 text-fluid-base shadow-lift hover:-translate-y-0.5',
        variant === 'bar' && 'w-full rounded-xl px-4 py-3.5 text-fluid-sm',
        variant === 'fab' && 'h-14 w-14 rounded-full shadow-lift',
        className,
      )}
    >
            <FaWhatsapp className={variant === 'fab' ? 'h-7 w-7 shrink-0' : 'h-5 w-5 shrink-0'} aria-hidden />
      {variant === 'fab' ? <span className="sr-only">{children}</span> : children}
    </a>
  );
}
