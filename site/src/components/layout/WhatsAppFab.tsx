import { motion } from 'framer-motion';
import { whatsappUrl, defaultWhatsappMessage } from '@/lib/whatsapp';

export function WhatsAppFab() {
  return (
    <motion.a
      href={whatsappUrl(defaultWhatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter avec ARC MASTER SOUDURE sur WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.6, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 sm:bottom-7 sm:right-7"
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-deep opacity-0 shadow-lift transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
        Écrivez-nous sur WhatsApp
      </span>
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#1FAF54] text-white shadow-[0_12px_32px_-8px_rgba(31,175,84,0.7)]">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#1FAF54] opacity-25 [animation-duration:2.4s]" />
        <svg viewBox="0 0 32 32" className="relative h-7 w-7 fill-current" aria-hidden>
          <path d="M16.04 3C9.4 3 4 8.36 4 14.97c0 2.12.56 4.18 1.62 6L4 29l8.27-1.58a12.1 12.1 0 0 0 3.77.6C22.66 28.02 28 22.65 28 16.04 28 9.4 22.66 3 16.04 3Zm0 22.86c-1.2 0-2.38-.2-3.5-.6l-.25-.09-4.9.94.97-4.74-.16-.26a9.7 9.7 0 0 1-1.55-5.14c0-5.4 4.4-9.8 9.4-9.8 5.4 0 9.6 4.42 9.6 9.86 0 5.43-4.21 9.83-9.6 9.83Zm5.4-7.3c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07a8.1 8.1 0 0 1-2.39-1.47 9 9 0 0 1-1.65-2.06c-.17-.3 0-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.57-.48-.5-.66-.5h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.45 1.06 2.86 1.21 3.06.15.2 2.09 3.18 5.06 4.46.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
        </svg>
      </span>
    </motion.a>
  );
}
