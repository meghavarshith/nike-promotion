"use client";
import React, { useRef, useEffect } from 'react';
import { motion, useTransform } from 'framer-motion';

// Generates a stable random value seeded by index (so it's the same every render)
function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export default function TextMolecules({ text, isHero, scrollProgress, exitRange, style }) {
  const chars = text.split('');
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} style={{ 
      display: 'block', 
      whiteSpace: 'normal',
      lineHeight: style?.lineHeight || '1', 
      ...style, 
      overflow: 'visible' 
    }}>
      {chars.map((char, i) => {
        const seed = i * 7.3;
        // Each character gets its own random trajectory for the disintegration
        const randX = (seededRandom(seed) - 0.5) * 300;
        const randY = (seededRandom(seed + 1) - 0.5) * 300;
        const randRotate = (seededRandom(seed + 2) - 0.5) * 720;
        const randScale = seededRandom(seed + 3) * 0.5;
        const delay = seededRandom(seed + 4) * 0.3; // stagger within exit range

        // Map scroll progress for exit: character flies off
        const exitStart = exitRange[0] + delay * (exitRange[1] - exitRange[0]);
        const exitEnd = exitRange[1];

        const charX = useTransform(scrollProgress, [exitStart, exitEnd], [0, randX]);
        const charY = useTransform(scrollProgress, [exitStart, exitEnd], [0, randY]);
        const charRotate = useTransform(scrollProgress, [exitStart, exitEnd], [0, randRotate]);
        const charOpacity = useTransform(scrollProgress, [exitStart, exitEnd], [1, 0]);
        const charScale = useTransform(scrollProgress, [exitStart, exitEnd], [1, randScale]);

        return (
          <motion.span
            key={i}
            initial={isHero ? { y: -120, opacity: 0 } : { y: 0, opacity: 1 }}
            animate={isHero ? { y: 0, opacity: 1 } : {}}
            transition={isHero ? {
              delay: 0.05 + i * 0.03,
              type: 'spring',
              stiffness: 200,
              damping: 20
            } : {}}
            style={{
              display: 'inline-block',
              x: charX,
              y: charY,
              rotate: charRotate,
              opacity: charOpacity,
              scale: charScale,
              whiteSpace: char === ' ' ? 'pre' : 'normal',
              transformOrigin: 'center center',
              fontFamily: 'inherit',
              fontWeight: 'inherit',
              fontSize: 'inherit',
              color: 'inherit',
              textShadow: 'inherit',
              letterSpacing: 'inherit',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        );
      })}
    </div>
  );
}
