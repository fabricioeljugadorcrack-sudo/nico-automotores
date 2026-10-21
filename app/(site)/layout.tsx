import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { WhatsappFloat } from '@/components/WhatsappFloat';
import { generalWhatsappUrl } from '@/lib/whatsapp';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <SiteFooter />
      <WhatsappFloat
        href={generalWhatsappUrl('Hola! Estoy viendo la web de NICO Automotores y tengo una consulta.')}
      />
    </>
  );
}
