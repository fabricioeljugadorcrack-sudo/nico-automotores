'use client';

import { usePathname } from 'next/navigation';
import { WhatsappCta } from '@/components/property/WhatsappCta';

export function WhatsappFloat({ href }: { href: string }) {
  const pathname = usePathname() ?? '';
  const isPropertyPage = /^\/vehiculos\/[^/]+/.test(pathname);

  return (
    <div className={isPropertyPage ? 'fixed bottom-5 right-5 z-50 hidden md:block' : 'fixed bottom-5 right-5 z-50'}>
      <WhatsappCta href={href} variant="fab">
        Escribinos por WhatsApp
      </WhatsappCta>
    </div>
  );
}
