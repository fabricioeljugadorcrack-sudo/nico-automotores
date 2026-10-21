import type { MetadataRoute } from 'next';
import { VEHICLES } from '@/lib/data/vehicles';

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/vehiculos`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/vehiculos?operacion=usado`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/vehiculos?operacion=0km`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/vende-tu-auto`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/nosotros`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/contacto`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/politica-de-privacidad`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const vehicles: MetadataRoute.Sitemap = VEHICLES.filter(
    (v) => v.status === 'available' || v.status === 'reserved',
  ).map((v) => ({
    url: `${base}/vehiculos/${v.slug}`,
    lastModified: new Date(v.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...vehicles];
}
