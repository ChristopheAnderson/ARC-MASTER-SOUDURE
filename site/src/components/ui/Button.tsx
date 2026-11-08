import { forwardRef, useRef, type ReactNode, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'whatsapp';
type Size = 'md' | 'lg';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  magnetic?: boolean;
  icon?: ReactNode;
}

interface LinkProps extends BaseProps {
  to: string;
  href?: never;
}
interface AnchorProps extends BaseProps {
  href: string;
  to?: never;
  external?: boolean;
}
interface ButtonProps extends BaseProps {
  to?: never;
  href?: never;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-ember text-white shadow-ember hover:bg-ember-dark',
  secondary: 'bg-navy-deep text-white hover:bg-navy shadow-lift',
  ghost: 'bg-white text-navy-deep border border-steel-light hover:border-navy-deep',
  whatsapp: 'bg-[#1FAF54] text-white hover:bg-[#178f44] shadow-[0_10px_30px_-10px_rgba(31,175,84,0.6)]',
};
const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-14 px-7 text-[15px]',
};

/** Bouton avec effet magnétique subtil (désactivé sur écrans tactiles). */
export const Button = forwardRef<HTMLDivElement, LinkProps | AnchorProps | ButtonProps>(function Button(props, _ref) {
  const { children, variant = 'primary', size = 'md', className, magnetic = true, icon } = props;
  const wrap = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e: MouseEvent) => {
    if (!magnetic || !wrap.current || window.matchMedia('(hover: none)').matches) return;
    const r = wrap.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cls = cn(
    'group relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden rounded-full font-semibold tracking-tight transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  );

  const inner = (
    <>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      <span className="relative">{children}</span>
      {icon && <span className="relative transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>}
    </>
  );

  let el: ReactNode;
  if ('to' in props && props.to) {
    el = (
      <Link to={props.to} className={cls}>
        {inner}
      </Link>
    );
  } else if ('href' in props && props.href) {
    const ext = (props as AnchorProps).external;
    el = (
      <a href={props.href} className={cls} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    );
  } else {
    const bp = props as ButtonProps;
    el = (
      <button type={bp.type ?? 'button'} onClick={bp.onClick} disabled={bp.disabled} className={cls}>
        {inner}
      </button>
    );
  }

  return (
    <motion.div ref={wrap} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x: sx, y: sy }} className="inline-flex">
      {el}
    </motion.div>
  );
});
