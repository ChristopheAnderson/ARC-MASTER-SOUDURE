export function PageLoader() {
  return (
    <div className="grid min-h-[70vh] place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <span className="relative block h-1 w-40 overflow-hidden rounded-full bg-mist-2">
          <span className="absolute inset-y-0 left-0 w-1/3 animate-[loader_1.1s_ease-in-out_infinite] rounded-full bg-ember" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-steel">Chargement</span>
      </div>
      <style>{`@keyframes loader{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
    </div>
  );
}
