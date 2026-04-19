import { useEffect, useRef, useState } from 'react';

export default function useInViewport({
  root = null,
  rootMargin = '300px 0px',
  threshold = 0.01,
} = {}) {
  const ref = useRef(null);
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (!('IntersectionObserver' in window)) {
      const fallback = window.setTimeout(() => setIsInViewport(true), 0);
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInViewport(true);
          observer.disconnect();
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold]);

  return [ref, isInViewport];
}
