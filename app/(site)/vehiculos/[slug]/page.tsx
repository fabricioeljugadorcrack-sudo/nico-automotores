import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Calendar, Gauge, Fuel as FuelIcon, Cog, DoorOpen, Palette, Zap } from 'lucide-react';

import {
  getAllPropertySlugs,
  getPropertyBySlug,
  getSimilarProperties,
  effectivePrice,
} from '@/lib/properties';
import {
  formatPrice,
  formatKm,
  propertyEyebrow,
  typeLabel,
  fuelLabel,
  transmissionLabel,
} from '@/lib/format';
import { propertyWhatsappUrl, telHref, resolveWhatsappNumber } from '@/lib/whatsapp';
import { PriceCards } from '@/components/property/PriceCards';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyCard } from '@/components/property/PropertyCard';
import { MobileActionBar } from '@/components/property/MobileActionBar';
import { WhatsappCta } from '@/components/property/WhatsappCta';
import { ViewContentTracker } from '@/components/tracking/ViewContentTracker';
import { SiteHeader } from '@/components/layout/SiteHeader';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: 'Vehículo no encontrado' };

  const { price, currency } = effectivePrice(property);
  const title = `${property.title} — ${property.year} · ${formatKm(property.km)}`;
  const description =
    property.description ??
    `${property.title}, ${property.year}. ${formatPrice(price, currency)}.`;
  const cover = property.images[0];

  return {
    title,
    description,
    alternates: { canonical: `/vehiculos/${property.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      images: cover ? [{ url: cover.url, width: 1200, height: 630, alt: property.title }] : [],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const similar = await getSimilarProperties(property);
  const { price, currency } = effectivePrice(property);
  const hero = property.images[0];
  const whatsappUrl = propertyWhatsappUrl(property, property.agent);
  const phone = resolveWhatsappNumber(property.agent);

  const facts = [
    { icon: Calendar, label: `${property.year}` },
    { icon: Gauge, label: formatKm(property.km)! },
    { icon: FuelIcon, label: fuelLabel(property.fuel) },
    { icon: Cog, label: transmissionLabel(property.transmission) },
    property.engine && { icon: Zap, label: property.engine },
    property.doors != null && { icon: DoorOpen, label: `${property.doors} puertas` },
    property.color && { icon: Palette, label: property.color },
  ].filter(Boolean) as Array<{ icon: typeof Calendar; label: string }>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: property.title,
    description: property.description ?? undefined,
    brand: property.brand,
    model: property.model,
    vehicleModelDate: String(property.year),
    mileageFromOdometer: { '@type': 'QuantitativeValue', value: property.km, unitCode: 'KMT' },
    fuelType: fuelLabel(property.fuel),
    vehicleTransmission: transmissionLabel(property.transmission),
    image: property.images.map((image) => image.url),
    ...(price != null && currency
      ? {
          offers: {
            '@type': 'Offer',
            price,
            priceCurrency: currency,
            availability:
              property.status === 'available'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/LimitedAvailability',
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewContentTracker
        code={property.code}
        title={property.title}
        price={price}
        currency={currency}
      />

      {/* ---------- Hero ---------- */}
      <header className="relative flex min-h-[82svh] flex-col justify-between overflow-hidden bg-primary-950">
        {hero ? (
          <Image
            src={hero.url}
            alt={hero.alt ?? property.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/70 via-primary-950/20 to-primary-950/95" />

        <SiteHeader transparent />

        <div className="container-plus relative z-10 pb-16 pt-20">
          <p className="eyebrow !text-primary-100">{propertyEyebrow(property)}</p>
          <h1 className="mt-3 font-display text-fluid-hero font-bold leading-[0.94] tracking-tight text-white">
            {property.title}
          </h1>
          <p className="mt-4 font-display text-fluid-2xl font-bold text-white tabular-nums">
            {formatPrice(price, currency)}
          </p>

          <ul className="mt-7 flex flex-wrap gap-2.5">
            {facts.slice(0, 4).map((fact) => (
              <li
                key={fact.label}
                className="flex items-center gap-2 rounded-pill border border-white/30 bg-white/10 px-4 py-1.5 text-fluid-sm text-white backdrop-blur"
              >
                <fact.icon className="h-4 w-4" aria-hidden />
                {fact.label}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <main className="container-plus">
        {/* ---------- Ficha técnica ---------- */}
        <section className="py-12" aria-labelledby="ficha">
          <p className="eyebrow">Ficha técnica</p>
          <h2 id="ficha" className="mt-2 font-display text-fluid-2xl font-bold">
            {typeLabel(property.type)} {property.brand} {property.model}
          </h2>
          <ul className="mt-8 grid gap-x-8 gap-y-4 border-t border-line pt-8 sm:grid-cols-2 md:grid-cols-3">
            {facts.map((fact) => (
              <li key={fact.label} className="flex items-center gap-2.5 text-fluid-base text-cement">
                <fact.icon className="h-5 w-5 shrink-0 text-primary-700" aria-hidden />
                {fact.label}
              </li>
            ))}
            {property.traction ? (
              <li className="flex items-center gap-2.5 text-fluid-base text-cement">
                <Cog className="h-5 w-5 shrink-0 text-primary-700" aria-hidden />
                Tracción {property.traction}
              </li>
            ) : null}
          </ul>

          {property.description ? (
            <p className="mt-8 max-w-[70ch] text-fluid-lg text-cement">{property.description}</p>
          ) : null}
        </section>

        {/* ---------- Precio ---------- */}
        <section className="border-t border-line py-16" aria-labelledby="valores">
          <p className="eyebrow">Precio</p>
          <h2 id="valores" className="mt-2 font-display text-fluid-2xl font-bold">
            Cuánto sale y cómo lo comprás
          </h2>
          <div className="mt-8">
            <PriceCards property={property} />
          </div>
        </section>

        {/* ---------- Equipamiento ---------- */}
        {property.amenities.length > 0 ? (
          <section className="border-t border-line py-16" aria-labelledby="detalle">
            <p className="eyebrow">Equipamiento</p>
            <h2 id="detalle" className="mt-2 font-display text-fluid-2xl font-bold">
              Lo que trae
            </h2>
            <ul className="mt-8 grid border-t border-line sm:grid-cols-2 md:grid-cols-3">
              {property.amenities.map((amenity) => {
                const [title, detail] = amenity.split(/:\s(.+)/);
                return (
                  <li key={amenity} className="border-b border-line py-6 pr-6">
                    <strong className="block font-display text-fluid-base font-bold">
                      {title}
                    </strong>
                    {detail ? <span className="text-cement">{detail}</span> : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {/* ---------- Galería ---------- */}
        {property.images.length > 0 ? (
          <section className="border-t border-line py-16" aria-labelledby="fotos">
            <p className="eyebrow">Fotos</p>
            <h2 id="fotos" className="mt-2 font-display text-fluid-2xl font-bold">
              Mirá el vehículo
            </h2>
            <p className="mb-8 mt-2 text-cement">Tocá cualquier foto para verla en grande.</p>
            <PropertyGallery images={property.images} />
          </section>
        ) : null}

        {/* ---------- Contacto ---------- */}
        <section className="border-t border-line py-16 text-center" aria-labelledby="contacto">
          <h2 id="contacto" className="font-display text-fluid-2xl font-bold">
            ¿Te interesa? Escribinos
          </h2>
          <p className="mx-auto mt-3 max-w-[46ch] text-cement">
            Te respondemos personalmente por WhatsApp y coordinamos para que lo veas y lo pruebes
            en el día y horario que te quede cómodo.
          </p>

          <div className="mt-8">
            <WhatsappCta
              href={whatsappUrl}
              propertyId={property.id}
              agentId={property.agent_id}
              propertyCode={property.code}
            >
              Consultar por este auto
            </WhatsappCta>
            <p className="mt-4 text-fluid-sm text-cement">Ref. {property.code}</p>
          </div>
        </section>

        {/* ---------- Similares ---------- */}
        {similar.length > 0 ? (
          <section className="border-t border-line py-16" aria-labelledby="similares">
            <h2 id="similares" className="font-display text-fluid-xl font-bold">
              Otros autos que te pueden gustar
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {similar.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
            <Link
              href="/vehiculos"
              className="mt-8 inline-block text-primary-700 underline underline-offset-4"
            >
              Ver todos los autos
            </Link>
          </section>
        ) : null}
      </main>

      <MobileActionBar
        whatsappUrl={whatsappUrl}
        phoneHref={telHref(phone)}
        propertyId={property.id}
        agentId={property.agent_id}
        propertyCode={property.code}
        price={price}
        currency={currency}
        priceNote={`${property.year} · ${formatKm(property.km)}`}
      />
    </>
  );
}
