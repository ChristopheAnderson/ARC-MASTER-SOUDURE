import { useLocation } from 'react-router-dom';
import { company } from '@/config/company';

interface SeoProps {
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
}

/** Métadonnées par page (React 19 hisse automatiquement <title>/<meta>/<link> dans <head>). */
export function Seo({ title, description, image = '/images/og-cover.jpg', noindex }: SeoProps) {
  const { pathname } = useLocation();
  const url = `${company.siteUrl}${pathname === '/' ? '' : pathname}`;
  const full = title.includes('ARC MASTER') ? title : `${title} | ARC MASTER SOUDURE`;
  const img = image.startsWith('http') ? image : `${company.siteUrl}${image}`;
  return (
    <>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </>
  );
}
