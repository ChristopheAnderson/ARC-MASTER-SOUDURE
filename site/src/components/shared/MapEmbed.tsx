import { useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { company } from '@/config/company';

const embedKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY as string | undefined;

/**
 * Carte Google Maps chargée à la demande (performance + confidentialité).
 * Avec une clé Maps Embed API, la carte pointe exactement sur le place_id fourni.
 */
export function MapEmbed({ className = '' }: { className?: string }) {
  const [load, setLoad] = useState(false);
  const placeId = 'ChIJtSnmnBBVIxARLgVfBzpx7vg';
  const src = embedKey
    ? `https://www.google.com/maps/embed/v1/place?key=${embedKey}&q=place_id:${placeId}&language=fr`
    : `https://maps.google.com/maps?q=${encodeURIComponent(company.mapsEmbedQuery)}&z=14&output=embed&hl=fr`;

  return (
    <div className={`relative overflow-hidden rounded-xl3 border border-mist-2 bg-mist ${className}`}>
      {load ? (
        <iframe
          title={`Localisation de ${company.companyName} sur Google Maps`}
          src={src}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="grid-lines relative flex h-full w-full flex-col items-center justify-center gap-5 p-8 text-center">
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-ember text-white shadow-ember">
            <span className="absolute inset-0 animate-ping rounded-full bg-ember/40 [animation-duration:2.2s]" />
            <MapPin className="relative h-7 w-7" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold text-navy-deep">
              {company.companyName}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{company.address ?? `${company.city}, ${company.country}`}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setLoad(true)}
              className="rounded-full bg-navy-deep px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy"
            >
              Afficher la carte
            </button>
            <a
              href={company.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-steel-light bg-white px-5 py-2.5 text-sm font-semibold text-navy-deep transition-colors hover:border-ember hover:text-ember"
            >
              Ouvrir dans Google Maps <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
