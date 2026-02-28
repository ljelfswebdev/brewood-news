'use client';

import { useEffect, useRef, useState } from 'react';

export default function TypewriterText({
  text = '',
  className = '',
  as = 'div',
  delay = 0,
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
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [visible]);

  const Component = as;
  const steps = Math.max(12, String(text || '').length);

  return (
    <Component ref={ref} className={className}>
      <span
        className={[
          'typewriter-text',
          visible ? 'typewriter-visible' : '',
        ].join(' ')}
        style={{
          animationDelay: `${delay}ms`,
          ['--typewriter-steps']: steps,
        }}
      >
        {text}
      </span>
    </Component>
  );
}
