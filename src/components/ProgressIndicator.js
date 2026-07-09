"use client";
import React, { useState, useEffect } from 'react';
import { useScroll } from 'framer-motion';

const STAGES = [
  { label: 'Overview',    target: 0.00, color: 'rgba(200,200,200,0.9)' },
  { label: 'Outsole',     target: 0.22, color: 'rgba(245,166,35,0.9)'  },
  { label: 'Midsole',     target: 0.44, color: 'rgba(0,232,135,0.9)'   },
  { label: 'Insole',      target: 0.65, color: 'rgba(74,171,240,0.9)'  },
  { label: 'Final',       target: 0.88, color: 'rgba(232,41,28,0.9)'   },
];

export default function ProgressIndicator() {
  const { scrollYProgress } = useScroll();
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      setVisible(v > 0.015);
      if      (v < 0.20) setActive(0);
      else if (v < 0.43) setActive(1);
      else if (v < 0.64) setActive(2);
      else if (v < 0.85) setActive(3);
      else               setActive(4);
    });
  }, [scrollYProgress]);

  const scrollTo = (t) => {
    const max = document.body.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * t, behavior: 'smooth' });
  };

  return (
    <div style={{
      position: 'fixed',
      right: isMobile ? '16px' : '2vw',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: isMobile ? '0.4rem' : '1.2rem', // slightly reduce gap since padding provides natural spacing
      zIndex: 300,
      pointerEvents: 'auto',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.8s ease',
    }}>
      {STAGES.map((s, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            onClick={() => scrollTo(s.target)}
            title={s.label}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              background: 'none', border: 'none',
              padding: isMobile ? '10px 8px' : '4px 0',
              cursor: 'pointer',
            }}
          >
            {/* Label — hidden on mobile */}
            {!isMobile && (
              <span style={{
                fontSize: '9px', fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: isActive ? s.color : 'transparent',
                transition: 'color 0.5s ease, opacity 0.5s ease',
                whiteSpace: 'nowrap',
              }}>
                {s.label}
              </span>
            )}

            {/* Dot */}
            <span style={{
              display: 'block',
              width: '2px',
              height: isActive ? (isMobile ? '16px' : '22px') : (isMobile ? '4px' : '5px'),
              borderRadius: '99px',
              background: isActive ? s.color : 'rgba(255,255,255,0.18)',
              boxShadow: isActive ? `0 0 8px ${s.color}` : 'none',
              transition: 'height 0.5s cubic-bezier(0.16,1,0.3,1), background 0.4s ease, box-shadow 0.4s ease',
              flexShrink: 0,
            }} />
          </button>
        );
      })}
    </div>
  );
}
