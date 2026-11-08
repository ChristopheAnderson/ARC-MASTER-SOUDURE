import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, FileImage, MessageCircle, Phone, Send, ShieldCheck, Trash2, UploadCloud } from 'lucide-react';
import { Seo } from '@/components/ui/Seo';
import { PageHero } from '@/components/shared/PageHero';
import { Button } from '@/components/ui/Button';
import { useCms, type QuoteAttachmentRecord, type QuoteRequestRecord } from '@/context/CmsContext';
import { buildQuoteMessage } from '@/lib/whatsapp';

const MAX_FILES = 4;
const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 MB

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function QuotePage() {
  const [params] = useSearchParams();
  const { activeServices, company, submitQuoteRequest } = useCms();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceSlug, setServiceSlug] = useState(params.get('service') || activeServices[0]?.slug || 'autres-prestations');
  const [location, setLocation] = useState('Cotonou');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [desiredDeadline, setDesiredDeadline] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [attachments, setAttachments] = useState<QuoteAttachmentRecord[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<QuoteRequestRecord | null>(null);

  useEffect(() => {
    const s = params.get('service');
    if (s && activeServices.some((item) => item.slug === s)) {
      setServiceSlug(s);
    }
  }, [params, activeServices]);

  const onFilesSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const next: QuoteAttachmentRecord[] = [...attachments];
    for (const f of files) {
      if (next.length >= MAX_FILES) break;
      if (!f.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, files: 'Seules les images (JPG, PNG, WebP) sont autorisées.' }));
        continue;
      }
      if (f.size > MAX_FILE_BYTES) {
        setErrors((prev) => ({ ...prev, files: 'Chaque image doit faire moins de 4 Mo.' }));
        continue;
      }
      const dataUrl = await fileToDataUrl(f);
      next.push({
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        fileName: f.name,
        mimeType: f.type,
        size: f.size,
        dataUrl,
      });
    }
    setAttachments(next);
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (fullName.trim().length < 2) errs.fullName = 'Veuillez indiquer votre nom et prénom.';
    if (phone.trim().replace(/\s+/g, '').length < 8) errs.phone = 'Veuillez indiquer un numéro de téléphone valide.';
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Adresse e-mail invalide.';
    }
    if (!serviceSlug) errs.serviceSlug = 'Veuillez choisir un type de prestation.';
    if (location.trim().length < 2) errs.location = 'Veuillez préciser la localisation du chantier.';
    if (projectDescription.trim().length < 12) {
      errs.projectDescription = 'Veuillez décrire votre besoin (dimensions approximatives, usage, quantités...).';
    }
    if (!consent) errs.consent = 'Veuillez accepter le traitement de votre demande.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Anti-spam
    if (!validate()) return;

    setSubmitting(true);
    try {
      const svc = activeServices.find((s) => s.slug === serviceSlug);
      const record = await submitQuoteRequest({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        serviceSlug,
        serviceTitle: svc?.title ?? 'Autre prestation',
        projectDescription: projectDescription.trim(),
        location: location.trim(),
        estimatedBudget: estimatedBudget.trim() || undefined,
        desiredDeadline: desiredDeadline.trim() || undefined,
        attachments,
      });
      setSubmittedQuote(record);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedQuote) {
    const waText = buildQuoteMessage({
      reference: submittedQuote.reference,
      fullName: submittedQuote.fullName,
      phone: submittedQuote.phone,
      email: submittedQuote.email,
      service: submittedQuote.serviceTitle,
      location: submittedQuote.location,
      description: submittedQuote.projectDescription,
      budget: submittedQuote.estimatedBudget,
      deadline: submittedQuote.desiredDeadline,
    });
    const waLink = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(waText)}`;

    return (
      <>
        <Seo title="Demande de devis enregistrée" description="Votre demande de devis a bien été enregistrée." noindex />
        <section className="bg-white pb-24 pt-36 sm:pt-44">
          <div className="container-x max-w-3xl">
            <div className="card p-8 sm:p-12">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </span>
              <span className="mt-6 block font-display text-xs font-semibold uppercase tracking-[0.22em] text-ember">
                Référence : {submittedQuote.reference}
              </span>
              <h1 className="display-md mt-2 text-navy-deep">Votre demande de devis est bien enregistrée.</h1>
              <p className="lead mt-4">
                Merci <strong className="font-semibold text-navy-deep">{submittedQuote.fullName}</strong>. Votre dossier (réf.{' '}
                <code className="rounded bg-mist px-2 py-0.5 font-mono text-sm text-navy-deep">{submittedQuote.reference}</code>) a été
                transmis à notre équipe.
              </p>

              <div className="mt-8 rounded-2xl border border-mist-2 bg-mist/60 p-6">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-navy-deep">Récapitulatif</h2>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-ink-soft">Prestation</dt>
                    <dd className="font-semibold text-navy-deep">{submittedQuote.serviceTitle}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">Localisation</dt>
                    <dd className="font-semibold text-navy-deep">{submittedQuote.location}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">Téléphone</dt>
                    <dd className="font-semibold text-navy-deep">{submittedQuote.phone}</dd>
                  </div>
                  {submittedQuote.desiredDeadline && (
                    <div>
                      <dt className="text-ink-soft">Délai souhaité</dt>
                      <dd className="font-semibold text-navy-deep">{submittedQuote.desiredDeadline}</dd>
                    </div>
                  )}
                </dl>
                <div className="mt-4 border-t border-mist-2 pt-4 text-sm">
                  <span className="text-ink-soft">Description :</span>
                  <p className="mt-1 whitespace-pre-line text-navy-deep">{submittedQuote.projectDescription}</p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-navy-deep p-6 text-white sm:p-8">
                <h3 className="font-display text-xl font-semibold text-white">Accélérer le traitement sur WhatsApp</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  Vous pouvez maintenant envoyer directement ce récapitulatif prérempli sur notre WhatsApp professionnel ({company.phoneDisplay})
                  pour échanger en direct ou partager des photos complémentaires.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={waLink} external size="lg" variant="whatsapp" icon={<MessageCircle className="h-5 w-5" />}>
                    Poursuivre sur WhatsApp
                  </Button>
                  <Button href={`tel:${company.phoneE164}`} size="lg" variant="ghost">
                    Appeler le {company.phoneDisplay}
                  </Button>
                </div>
              </div>

              <div className="mt-8 flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedQuote(null);
                    setProjectDescription('');
                    setAttachments([]);
                  }}
                  className="font-semibold text-ember hover:underline"
                >
                  Envoyer une autre demande
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Demander un devis — Soudure & construction métallique à Cotonou"
        description="Obtenez un devis rapide pour votre portail, escalier, garde-corps ou charpente métallique à Cotonou et au Bénin. Réponse directe et suivi par WhatsApp."
      />
      <PageHero
        eyebrow="Demande de devis"
        title={'Décrivez votre projet,\nnous étudions chaque détail.'}
        highlight={[2, 6]}
        intro="Remplissez ce formulaire en quelques instants. Une référence unique est générée et vous pouvez poursuivre immédiatement l'échange sur WhatsApp."
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <form onSubmit={onSubmit} noValidate className="card space-y-6 p-6 sm:p-10 lg:col-span-8">
            {/* Champ honeypot anti-robot */}
            <input
              type="text"
              name="website_url"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="q-name" className="label">
                  Nom et prénom <span className="text-ember">*</span>
                </label>
                <input
                  id="q-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex. : Koffi Mensah"
                  aria-invalid={!!errors.fullName}
                  className="field"
                />
                {errors.fullName && <p className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="q-phone" className="label">
                  Téléphone / WhatsApp <span className="text-ember">*</span>
                </label>
                <input
                  id="q-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex. : +229 01 97 00 00 00"
                  aria-invalid={!!errors.phone}
                  className="field"
                />
                {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="q-email" className="label">
                  Adresse e-mail <span className="text-xs font-normal text-steel">(facultatif)</span>
                </label>
                <input
                  id="q-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  aria-invalid={!!errors.email}
                  className="field"
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="q-service" className="label">
                  Type de prestation <span className="text-ember">*</span>
                </label>
                <select
                  id="q-service"
                  value={serviceSlug}
                  onChange={(e) => setServiceSlug(e.target.value)}
                  aria-invalid={!!errors.serviceSlug}
                  className="field"
                >
                  {activeServices.map((s) => (
                    <option key={s.id} value={s.slug}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="q-location" className="label">
                  Localisation du chantier <span className="text-ember">*</span>
                </label>
                <input
                  id="q-location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Cotonou, Abomey-Calavi..."
                  aria-invalid={!!errors.location}
                  className="field"
                />
                {errors.location && <p className="mt-1.5 text-xs text-red-600">{errors.location}</p>}
              </div>

              <div>
                <label htmlFor="q-budget" className="label">
                  Budget indicatif <span className="text-xs font-normal text-steel">(facultatif)</span>
                </label>
                <input
                  id="q-budget"
                  type="text"
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value)}
                  placeholder="Ex. : à définir / FCFA"
                  className="field"
                />
              </div>

              <div>
                <label htmlFor="q-deadline" className="label">
                  Délai souhaité <span className="text-xs font-normal text-steel">(facultatif)</span>
                </label>
                <input
                  id="q-deadline"
                  type="text"
                  value={desiredDeadline}
                  onChange={(e) => setDesiredDeadline(e.target.value)}
                  placeholder="Ex. : Sous 3 semaines"
                  className="field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="q-desc" className="label">
                Description du besoin <span className="text-ember">*</span>
              </label>
              <textarea
                id="q-desc"
                rows={5}
                required
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Précisez le type d'ouvrage souhaité, les dimensions approximatives (largeur, hauteur), le style ou toute contrainte particulière..."
                aria-invalid={!!errors.projectDescription}
                className="field"
              />
              {errors.projectDescription && <p className="mt-1.5 text-xs text-red-600">{errors.projectDescription}</p>}
            </div>

            {/* Pièces jointes photographiques */}
            <div>
              <span className="label">
                Joindre des photos ou croquis <span className="text-xs font-normal text-steel">(facultatif, max {MAX_FILES} images)</span>
              </span>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-steel-light bg-mist/40 px-6 py-8 text-center transition-colors hover:border-ember hover:bg-mist">
                <UploadCloud className="h-7 w-7 text-ember" />
                <span className="mt-2 font-display text-sm font-semibold text-navy-deep">
                  Cliquez pour sélectionner une photo ou un modèle d'inspiration
                </span>
                <span className="mt-1 text-xs text-ink-soft">JPG, PNG ou WebP — jusqu'à 4 Mo par fichier (stockage privé)</span>
                <input type="file" accept="image/*" multiple onChange={onFilesSelected} className="hidden" />
              </label>
              {errors.files && <p className="mt-1.5 text-xs text-red-600">{errors.files}</p>}

              {attachments.length > 0 && (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {attachments.map((att) => (
                    <li key={att.id} className="flex items-center justify-between gap-3 rounded-xl border border-mist-2 bg-mist/60 p-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {att.dataUrl ? (
                          <img src={att.dataUrl} alt={att.fileName} className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                        ) : (
                          <FileImage className="h-8 w-8 shrink-0 text-ember" />
                        )}
                        <div className="truncate">
                          <p className="truncate text-xs font-semibold text-navy-deep">{att.fileName}</p>
                          <p className="text-[11px] text-ink-soft">{Math.round(att.size / 1024)} Ko</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id)}
                        className="rounded-lg p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600"
                        aria-label={`Retirer ${att.fileName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl bg-mist/70 p-4">
              <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-steel accent-ember"
                />
                <span>
                  J'accepte que ces informations soient enregistrées par <strong>{company.companyName}</strong> afin d'étudier ma demande de
                  devis et de me recontacter. Vos données restent strictement confidentielles.
                </span>
              </label>
              {errors.consent && <p className="mt-1.5 text-xs text-red-600">{errors.consent}</p>}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <p className="inline-flex items-center gap-2 text-xs text-ink-soft">
                <ShieldCheck className="h-4 w-4 text-ember" /> Dossier confidentiel — aucune donnée partagée à des tiers
              </p>
              <Button type="submit" size="lg" disabled={submitting} icon={<Send className="h-4 w-4" />}>
                {submitting ? 'Enregistrement...' : 'Enregistrer ma demande de devis'}
              </Button>
            </div>
          </form>

          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-xl3 bg-navy-deep p-8 text-white">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Contact direct</span>
              <h2 className="mt-3 font-display text-2xl font-semibold text-white">Besoin d'un échange immédiat ?</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                Vous pouvez également nous joindre directement par téléphone ou sur WhatsApp pour nous présenter votre besoin à{' '}
                {company.city}.
              </p>
              <div className="mt-6 space-y-3">
                <a
                  href={`tel:${company.phoneE164}`}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                >
                  <Phone className="h-4 w-4 text-ember" /> {company.phoneDisplay}
                </a>
                <a
                  href={`https://wa.me/${company.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-[#1FAF54] px-4 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-95"
                >
                  <MessageCircle className="h-4 w-4" /> Discuter sur WhatsApp
                </a>
              </div>
            </div>

            <div className="card p-7">
              <h3 className="font-display text-lg font-semibold text-navy-deep">Conseils pour un devis précis</h3>
              <ul className="mt-4 space-y-3 text-sm text-ink-soft">
                <li>• Indiquez les dimensions approximatives (largeur, hauteur, longueur).</li>
                <li>• Précisez s'il s'agit d'une création neuve, d'un remplacement ou d'une réparation.</li>
                <li>• Mentionnez le quartier ou la ville du chantier pour estimer la livraison et la pose.</li>
                <li>• Joignez une photo de l'emplacement ou d'un modèle qui vous plaît.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

