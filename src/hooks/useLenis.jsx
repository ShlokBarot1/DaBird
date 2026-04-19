import { useEffect } from 'react';

export default function useLenis() {
  useEffect(() => {
    let lenis;
    let frameId;
    let cancelled = false;

    const initLenis = async () => {
      const { default: Lenis } = await import('lenis');
      if (cancelled) return;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time) {
        lenis.raf(time);
        frameId = requestAnimationFrame(raf);
      }

      frameId = requestAnimationFrame(raf);
    };

    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(initLenis, { timeout: 2000 })
      : window.setTimeout(initLenis, 1200);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
      if (frameId) cancelAnimationFrame(frameId);
      if (lenis) lenis.destroy();
    };
  }, []);
}
