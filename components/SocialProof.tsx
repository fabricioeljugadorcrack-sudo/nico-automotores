import { Star } from 'lucide-react';

const GOOGLE_URL = 'https://www.instagram.com/nicoautomotoressantotome';

// Si un cliente da permiso para usar su foto, subila a la carpeta public/resenas/
// y poné la ruta en "photo", por ejemplo: photo: '/resenas/diego.jpg'
const reviews: Array<{ name: string; text: string; photo?: string }> = [
  {
    name: 'Diego Benito',
    text: 'Compré mi camioneta con Nico y fue todo clarísimo. Me recibieron el usado por un precio justo y la transferencia la hicieron ellos. Recomendables 100%.',
  },
  {
    name: 'Natalia Colman',
    text: 'Excelente atención. Me mostraron el auto sin apuro, lo probé y me explicaron todo el estado real. Gente seria y de confianza.',
  },
  {
    name: 'Augusto Deppeler',
    text: 'Financiaron parte de la compra y me resolvieron toda la gestoría. En una semana ya tenía el auto a mi nombre. Impecables.',
  },
];

const AVATAR_COLORS = ['bg-primary-700', 'bg-primary-900', 'bg-primary-800'];

function Avatar({ name, photo, index }: { name: string; photo?: string; index: number }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold text-white ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

export function SocialProof() {
  return (
    <section className="container-plus py-16" aria-labelledby="confianza">
      <p className="eyebrow">Confianza</p>
      <p className="mt-3 font-display text-6xl font-bold leading-none text-primary-700 md:text-8xl">+500</p>
      <h2 id="confianza" className="mt-2 font-display text-fluid-2xl font-bold">autos entregados</h2>

      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {reviews.map((review, index) => (
          <li key={review.name} className="flex flex-col rounded-2xl border border-line bg-white p-6">
            <div className="flex items-center gap-3">
              <Avatar name={review.name} photo={review.photo} index={index} />
              <div>
                <p className="font-semibold leading-tight">{review.name}</p>
                <div className="mt-1 flex gap-0.5" aria-label="5 de 5 estrellas">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" aria-hidden />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 flex-1 leading-relaxed">{review.text}</p>
            <p className="mt-5 text-sm text-cement">Cliente de NICO Automotores</p>
          </li>
        ))}
      </ul>

      <p className="mt-8">
        <a href={GOOGLE_URL} target="_blank" rel="noopener noreferrer" className="text-primary-700 underline underline-offset-4">
          Ver más en nuestro Instagram
        </a>
      </p>
    </section>
  );
}
