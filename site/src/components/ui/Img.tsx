import type { ImgHTMLAttributes } from 'react';
import type { ImageAsset } from '@/data/images';
import { cn } from '@/lib/cn';

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  image: ImageAsset;
  priority?: boolean;
  /** Affiche la mention "Visuel d'illustration". */
  illustration?: boolean;
  wrapperClassName?: string;
}

/** Image optimisée : dimensions explicites, lazy-loading, décodage asynchrone. */
export function Img({ image, priority, illustration, className, wrapperClassName, ...rest }: Props) {
  const el = (
    <img
      src={image.src}
      alt={image.alt}
      width={image.w}
      height={image.h}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      {...(priority ? { fetchPriority: 'high' as const } : {})}
      className={cn('h-full w-full object-cover', className)}
      {...rest}
    />
  );
  if (!illustration) return el;
  return (
    <div className={cn('relative h-full w-full', wrapperClassName)}>
      {el}
      <span className="badge-illus absolute bottom-3 left-3 z-10">Visuel d'illustration</span>
    </div>
  );
}
