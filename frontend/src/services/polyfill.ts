// Polyfill para el objeto global en el navegador
if (typeof window !== 'undefined' && !window.global) {
  (window as any).global = window;
}

export {}; 