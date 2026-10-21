import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container-plus grid min-h-[60svh] place-items-center py-20 text-center">
      <div>
        <p className="font-display text-fluid-2xl font-bold">No encontramos esta página</p>
        <p className="mx-auto mt-3 max-w-[42ch] text-cement">
          Puede que el auto ya se haya vendido. Mirá el resto del stock:
          seguro hay algo parecido.
        </p>
        <Link
          href="/vehiculos"
          className="mt-8 inline-block rounded-pill bg-primary-700 px-7 py-3.5 font-semibold text-white"
        >
          Ver autos
        </Link>
      </div>
    </main>
  );
}
