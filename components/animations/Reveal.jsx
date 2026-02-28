'use client';

import { useEffect, useRef, useState } from 'react';

export default function Reveal({
  children,
  className = '',
  variant = 'fade-up',
  delay = 0,
  as = 'div',
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [visible]);

  const Component = as;

  return (
    <Component
      ref={ref}
      className={[
        'reveal-base',
        variant === 'fade-in' ? 'reveal-fade-in' : 'reveal-fade-up',
        visible ? 'reveal-visible' : '',
        className,
      ].join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}
