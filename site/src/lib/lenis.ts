import type Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  lenisInstance = l;
};

export const getLenis = () => lenisInstance;

