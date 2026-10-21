'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Loader2 } from 'lucide-react';
import type { PropertyImage } from '@/types';

interface Props {
  images: PropertyImage[];
}

/** Descarga una foto en segundo plano para que después aparezca al instante. */
const preloaded = new Set<string>();
function preload(url: string | undefined) {
  if (!url || preloaded.has(url) || typeof window === 'undefined') return;
  preloaded.add(url);
  const img = new window.Image();
  img.decoding = 'async';
  img.src = url;
}

/**
 * Grilla 4:5 — 4 columnas en compu, 2 en celular — con visor que soporta
 * flechas del teclado, Escape, deslizar con el dedo y foco atrapado.
 * El visor carga las fotos directo (ya están optimizadas al subirlas)
 * y precarga las vecinas para que el cambio sea instantáneo.
 */
export function PropertyGallery({ images }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const isOpen = openIndex !== null;

  const markLoaded = useCallback((id: string) => {
    setLoaded((previous) => (previous[id] ? previous : { ...previous, [id]: true }));
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    lastFocused.current?.focus();
  }, []);

  const go = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + delta + images.length) % images.length;
      });
    },
    [images.length],
  );

  // Precarga la anterior y las dos siguientes a la que se está viendo.
  useEffect(() => {
    if (openIndex === null || images.length === 0) return;
    for (const offset of [1, -1, 2]) {
      const index = (openIndex + offset + images.length) % images.length;
      preload(images[index]?.url);
    }
  }, [openIndex, images]);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
      if (event.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button');
        if (!focusables?.length) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, go]);

  if (images.length === 0) return null;

  const current = openIndex !== null ? images[openIndex] : null;
  const currentLoaded = current ? Boolean(loaded[current.id]) : false;

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {images.map((image, index) => (
          <li key={image.id}>
            <button
              type="button"
              onPointerEnter={() => preload(image.url)}
              onPointerDown={() => preload(image.url)}
              onClick={(event) => {
                lastFocused.current = event.currentTarget;
                preload(image.url);
                setOpenIndex(index);
              }}
              className="group relative block w-full overflow-hidden rounded-[5px] border border-line bg-sand aspect-card"
              aria-label={`Ampliar foto ${index + 1} de ${images.length}: ${image.alt ?? ''}`}
            >
              <Image
                src={image.url}
                alt={image.alt ?? ''}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                placeholder={image.blur_data ? 'blur' : 'empty'}
                blurDataURL={image.blur_data ?? undefined}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/60 to-transparent to-[48%] opacity-0 transition-opacity group-hover:opacity-100 md:opacity-0" />
              {image.alt ? (
                <span className="pointer-events-none absolute bottom-3 left-3 right-11 truncate text-left text-fluid-xs text-white opacity-0 transition-opacity group-hover:opacity-100 md:opacity-0">
                  {image.alt}
                </span>
              ) : null}
              <span className="pointer-events-none absolute bottom-2.5 right-2.5 grid h-7 w-7 place-items-center rounded-full bg-white/90 opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn className="h-3.5 w-3.5 text-primary-700" aria-hidden />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {current ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ampliada ${openIndex! + 1} de ${images.length}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          onTouchStart={(event) => {
            touchStartX.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const start = touchStartX.current;
            touchStartX.current = null;
            if (start === null) return;
            const delta = (event.changedTouches[0]?.clientX ?? start) - start;
            if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/95 p-2 md:p-6"
          style={{
            paddingTop: 'max(env(safe-area-inset-top, 0px), 0.5rem)',
            paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0.5rem)',
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/30 text-white hover:bg-white/10 md:right-5 md:top-5"
          >
            <X className="h-6 w-6" aria-hidden />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white hover:bg-white/20 md:left-4"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Foto siguiente"
                className="absolute right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white hover:bg-white/20 md:right-4"
              >
                <ChevronRight className="h-6 w-6" aria-hidden />
              </button>
            </>
          ) : null}

          <div className="relative h-[82vh] w-full max-w-5xl">
            {/* Versión borrosa mientras llega la nítida */}
            {!currentLoaded && current.blur_data ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.blur_data}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full scale-105 object-contain blur-lg"
              />
            ) : null}

            {!currentLoaded ? (
              <div className="absolute inset-0 grid place-items-center">
                <Loader2 className="h-8 w-8 animate-spin text-white/80" aria-hidden />
              </div>
            ) : null}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={current.id}
              ref={(element) => {
                if (element?.complete && element.naturalWidth > 0) markLoaded(current.id);
              }}
              src={current.url}
              alt={current.alt ?? ''}
              decoding="async"
              fetchPriority="high"
              onLoad={() => markLoaded(current.id)}
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-200 ${
                currentLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

          <p
            aria-live="polite"
            className="absolute bottom-3 left-0 right-0 px-16 text-center text-fluid-sm text-primary-100 md:bottom-6"
          >
            {current.alt ? `${current.alt} · ` : ''}
            {openIndex! + 1}/{images.length}
          </p>
        </div>
      ) : null}
    </>
  );
}
