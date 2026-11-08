export type QuoteStatus = 'NEW' | 'PENDING' | 'IN_PROGRESS' | 'SENT' | 'ACCEPTED' | 'REFUSED' | 'CLOSED';

export const quoteStatusLabels: Record<QuoteStatus, { label: string; badge: string }> = {
  NEW: { label: 'Nouveau', badge: 'bg-ember-soft text-ember-dark border-ember/30' },
  PENDING: { label: 'En attente', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
  IN_PROGRESS: { label: 'En cours', badge: 'bg-sky-50 text-sky-800 border-sky-200' },
  SENT: { label: 'Devis envoyé', badge: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  ACCEPTED: { label: 'Accepté', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  REFUSED: { label: 'Refusé', badge: 'bg-rose-50 text-rose-800 border-rose-200' },
  CLOSED: { label: 'Clôturé', badge: 'bg-mist-2 text-ink-soft border-steel-light' },
};

export interface QuoteAttachmentRecord {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  dataUrl?: string;
  storagePath?: string;
}

export interface QuoteRequestRecord {
  id: string;
  reference: string;
  fullName: string;
  phone: string;
  email?: string;
  serviceSlug: string;
  serviceTitle: string;
  projectDescription: string;
  location: string;
  estimatedBudget?: string;
  desiredDeadline?: string;
  status: QuoteStatus;
  internalNotes: string;
  attachments: QuoteAttachmentRecord[];
  createdAt: string;
  updatedAt: string;
}

export function generateQuoteReference(): string {
  const d = new Date();
  const year = d.getFullYear().toString().slice(-2);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ARC-${year}${month}${day}-${rand}`;
}
