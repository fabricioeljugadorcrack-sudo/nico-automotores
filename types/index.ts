// Dominio: concesionaria de autos (NICO AUTOMOTORES).
// Se conservan los nombres de tipo (Property, PropertyWithRelations, etc.) para
// no romper imports, pero los campos modelan un vehículo.

/** Condición del vehículo. Se usa como "operación" en filtros y badges. */
export type Operation = 'usado' | '0km';

/** Carrocería / segmento. */
export type PropertyType =
  | 'sedan'
  | 'hatchback'
  | 'suv'
  | 'pickup'
  | 'familiar'
  | 'coupe'
  | 'monovolumen'
  | 'utilitario';

export type PropertyStatus = 'available' | 'reserved' | 'sold';

export type Currency = 'ARS' | 'USD';

export type Fuel = 'nafta' | 'diesel' | 'gnc' | 'hibrido' | 'electrico';

export type Transmission = 'manual' | 'automatica';

export type PropertySource = 'local' | 'admin';

export type LeadSource =
  | 'whatsapp_click'
  | 'form'
  | 'valuation'
  | 'call_click'
  | 'app_interna'
  | 'manual';

export type LeadStatus =
  | 'nuevo'
  | 'contactado'
  | 'visita_agendada'
  | 'cerrado'
  | 'descartado';

export interface Agent {
  id: string;
  name: string;
  photo_url: string | null;
  whatsapp_number: string;
  email: string | null;
  active: boolean;
  position: number;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  blur_data: string | null;
  is_floorplan: boolean;
  position: number;
}

export interface PriceOption {
  id: string;
  property_id: string;
  label: string;
  price: number;
  currency: Currency;
  expensas: number | null;
  position: number;
}

export interface Property {
  id: string;
  code: string;
  slug: string;
  title: string;
  description: string | null;
  operation: Operation;
  type: PropertyType;
  status: PropertyStatus;

  // Precio
  price: number | null;
  currency: Currency | null;
  previous_price: number | null;
  price_dropped_at: string | null;
  notes: string | null;

  // Ficha técnica del vehículo
  brand: string;
  model: string;
  version: string | null;
  year: number;
  km: number;
  fuel: Fuel;
  transmission: Transmission;
  doors: number | null;
  color: string | null;
  engine: string | null;
  traction: string | null;

  // Condiciones comerciales (chips)
  financiacion: boolean;
  permuta: boolean;
  amenities: string[];

  city: string;

  featured: boolean;
  source: PropertySource;
  agent_id: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyWithRelations extends Property {
  images: PropertyImage[];
  price_options: PriceOption[];
  agent: Agent | null;
}

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  landing_page?: string;
  referrer?: string;
  first_seen?: string;
}

export interface LeadPayload {
  property_id?: string | null;
  agent_id?: string | null;
  source: LeadSource;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  event_id?: string;
  attribution?: Attribution;
  fbp?: string;
  fbc?: string;
}

export interface PropertyFilters {
  operation?: Operation;
  type?: PropertyType;
  brand?: string;
  q?: string;
  currency?: Currency;
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  kmMax?: number;
  fuel?: Fuel;
  transmission?: Transmission;
  financiacion?: boolean;
  permuta?: boolean;
  sort?: 'recent' | 'price_asc' | 'price_desc' | 'year_desc' | 'km_asc';
  page?: number;
  view?: 'grid';
}
