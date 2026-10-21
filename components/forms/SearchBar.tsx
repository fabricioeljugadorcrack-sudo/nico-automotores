'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { trackSearch } from '@/lib/tracking/events';

const TYPES = [
  ['', 'Todas las carrocerías'],
  ['pickup', 'Pick-up'],
  ['suv', 'SUV'],
  ['hatchback', 'Hatchback'],
  ['sedan', 'Sedán'],
  ['familiar', 'Familiar'],
  ['utilitario', 'Utilitario'],
] as const;

/** Buscador de la home. Escribe directo en el query string de /vehiculos. */
export function SearchBar() {
  const router = useRouter();
  const [operation, setOperation] = useState('');
  const [type, setType] = useState('');
  const [q, setQ] = useState('');

  function submit() {
    const params = new URLSearchParams();
    if (operation) params.set('operacion', operation);
    if (type) params.set('tipo', type);
    if (q.trim()) params.set('q', q.trim());

    trackSearch([operation, type, q].filter(Boolean).join(' '));
    router.push(`/vehiculos?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 rounded-card bg-white/95 p-3 shadow-lift backdrop-blur sm:flex-row sm:items-center">
      <label className="sr-only" htmlFor="operacion">Condición</label>
      <select
        id="operacion"
        value={operation}
        onChange={(event) => setOperation(event.target.value)}
        className="rounded-xl border border-line bg-white px-4 py-3 text-ink"
      >
        <option value="">Usados y 0 km</option>
        <option value="usado">Usados</option>
        <option value="0km">0 km</option>
      </select>

      <label className="sr-only" htmlFor="tipo">Carrocería</label>
      <select
        id="tipo"
        value={type}
        onChange={(event) => setType(event.target.value)}
        className="rounded-xl border border-line bg-white px-4 py-3 text-ink"
      >
        {TYPES.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <label className="sr-only" htmlFor="q">Marca o modelo</label>
      <input
        id="q"
        value={q}
        onChange={(event) => setQ(event.target.value)}
        onKeyDown={(event) => event.key === 'Enter' && submit()}
        placeholder="Marca o modelo (ej: Hilux)"
        className="min-w-0 flex-1 rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-cement/70"
      />

      <button
        type="button"
        onClick={submit}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-700 px-6 py-3 font-semibold text-white transition hover:bg-primary-600"
      >
        <Search className="h-4 w-4" aria-hidden />
        Buscar
      </button>
    </div>
  );
}
