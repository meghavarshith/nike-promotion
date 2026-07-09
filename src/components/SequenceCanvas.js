"use client";
import React, { useRef, useEffect, useCallback } from 'react';
import { useScroll, useTransform, useSpring, motion, useMotionTemplate } from 'framer-motion';

export default function SequenceCanvas({ children }) {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const imagesRef    = useRef([]);
  const totalFrames  = 240;

  // ── Scroll tracking ──────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /**
   * CINEMATIC SPRING PHYSICS
   * stiffness 45 + damping 22 → slight inertia lag behind scroll input.
   * This creates the "premium weight" feel — animation trails the user
   * fractionally, giving a filmed-through-glass quality.
   */
  const smooth = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 22,
    restDelta: 0.0002,
  });

  // ── Frame mapping  ───────────────────────────────────────────────────────
  // Each stage follows:  ramp-up → animate → hold → settle
  //
  //  0.00–0.20  Hero assembled   (frame 0, long hold for scanning the shoe)
  //  0.20–0.37  Outsole drops    (0 → 79)
  //  0.37–0.43  HOLD outsole     (79)  — viewer reads the text
  //  0.43–0.58  Midsole drops    (79 → 159)
  //  0.58–0.64  HOLD midsole     (159)
  //  0.64–0.78  Insole drops     (159 → 239)
  //  0.78–0.85  HOLD exploded    (239)  — signature moment
  //  0.85–0.95  Reassemble       (239 → 0)  — cinematic payoff
  //  0.95–1.00  Hold assembled   (0)   — CTA lands
  const frameIndex = useTransform(
    smooth,
    [0.00, 0.20, 0.37, 0.43, 0.58, 0.64, 0.78, 0.85, 0.95, 1.00],
    [0,    0,    79,   79,   159,  159,  239,  239,  0,    0  ]
  );

  // ── Background luminance: white → near-black → white on reassembly ───────
  // Uses a careful S-curve so no abrupt jump is visible.
  const bgL = useTransform(smooth,
    [0.00, 0.20, 0.32, 0.64, 0.85, 0.92, 1.00],
    [248,  245,  12,    4,    4,   60,  248]
  );
  const bgColor = useMotionTemplate`hsl(0, 0%, ${bgL}%)`;

  // ── Vignette ─────────────────────────────────────────────────────────────
  // Only active during dark stages. Fades completely for hero + final.
  const focalY     = useTransform(smooth, [0.2, 0.6, 0.85], ['58%', '62%', '56%']);
  const vignetteBg = useMotionTemplate`radial-gradient(ellipse at 50% ${focalY}, transparent 18%, rgba(4,4,4,0.80) 60%, rgba(4,4,4,0.98) 100%)`;
  const vigOp      = useTransform(smooth,
    [0.17, 0.24, 0.80, 0.88, 0.96, 1.00],
    [0,    1,    1,    0.4,  0,    0]
  );

  // ── Subtle contrast boost at key hold moments ─────────────────────────────
  // A very thin dark overlay that deepens colour saturation at each hold.
  const contrastOp = useTransform(smooth,
    [0.37, 0.41, 0.44,  0.58, 0.61, 0.65,  0.78, 0.82, 0.86],
    [0,    0.18, 0,      0,   0.18,  0,      0,   0.22,  0]
  );

  // ── Light sweep — outsole reveal ──────────────────────────────────────────
  const sweepX  = useTransform(smooth, [0.18, 0.30], ['-140%', '140%']);
  const sweepOp = useTransform(smooth, [0.18, 0.22, 0.27, 0.33], [0, 0.55, 0.55, 0]);

  // ── Stage glows (very restrained — max 0.10 opacity so they read as felt,
  //    not seen) ───────────────────────────────────────────────────────────
  const ambGlowOp  = useTransform(smooth, [0.20, 0.29, 0.37, 0.44], [0, 0.10, 0.10, 0]);
  const tealGlowOp = useTransform(smooth, [0.43, 0.52, 0.58, 0.65], [0, 0.10, 0.10, 0]);
  const blueGlowOp = useTransform(smooth, [0.64, 0.72, 0.78, 0.86], [0, 0.10, 0.10, 0]);

  // ── Energy rings ─────────────────────────────────────────────────────────
  // Ring 1: outsole separation  (amber)
  const r1Scale = useTransform(smooth, [0.37, 0.44], [0.3, 5.0]);
  const r1Op    = useTransform(smooth, [0.37, 0.395, 0.44], [0, 0.9, 0]);
  // Ring 2: midsole separation  (teal)
  const r2Scale = useTransform(smooth, [0.58, 0.65], [0.3, 5.0]);
  const r2Op    = useTransform(smooth, [0.58, 0.605, 0.65], [0, 0.9, 0]);
  // Ring 3: insole separation   (blue)
  const r3Scale = useTransform(smooth, [0.78, 0.85], [0.3, 5.0]);
  const r3Op    = useTransform(smooth, [0.78, 0.805, 0.85], [0, 0.9, 0]);

  // ── Image loading ─────────────────────────────────────────────────────────
  useEffect(() => {
    const imgs = [];
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/sequence/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
      imgs.push(img);
    }
    imagesRef.current = imgs;
    const drawFirst = () => drawFrame(0);
    imgs[0].onload = drawFirst;
    if (imgs[0].complete) drawFirst();
  }, []); // eslint-disable-line

  // ── Draw frame ────────────────────────────────────────────────────────────
  const drawFrame = useCallback((index, bgLuminance) => {
    const canvas = canvasRef.current;
    const idx    = Math.max(0, Math.min(totalFrames - 1, Math.round(index)));
    const img    = imagesRef.current[idx];
    if (!canvas || !img?.complete || !img.naturalWidth) return;
    const ctx      = canvas.getContext('2d', { alpha: false });
    const { width: cw, height: ch } = canvas;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    if (!cw || !ch) return;

    // Fill the canvas with the current background luminance before drawing
    // This eliminates the black-bar mismatch on mobile where the shoe
    // image doesn't cover the full canvas
    if (bgLuminance !== undefined) {
      const v = Math.round(Math.max(0, Math.min(255, bgLuminance * 2.55)));
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(0, 0, cw, ch);
    }

    // Use cover scaling on all viewports — shoe fills the entire canvas
    const s = Math.max(cw / iw, ch / ih);
    ctx.drawImage(img, (cw - iw * s) / 2, (ch - ih * s) / 2, iw * s, ih * s);
  }, []);

  useEffect(() => {
    const unsub = frameIndex.on('change', (v) => drawFrame(v, bgL.get()));
    return unsub;
  }, [frameIndex, drawFrame, bgL]);

  useEffect(() => {
    const onResize = () => {
      const c = canvasRef.current;
      if (!c) return;
      const dpr = window.devicePixelRatio || 1;
      c.width  = window.innerWidth  * dpr;
      c.height = window.innerHeight * dpr;
      drawFrame(frameIndex.get(), bgL.get());
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [frameIndex, drawFrame, bgL]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', height: '600vh', width: '100%' }}
    >
      <motion.div
        style={{
          position: 'sticky', top: 0,
          width: '100%', height: '100dvh', // Use dvh to prevent jumpiness on mobile browser toolbars
          minHeight: '100vh',
          overflow: 'hidden',
          backgroundColor: bgColor,
        }}
      >
        {/* ── Canvas ───────────────────────────────────────── */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />

        {/* ── Vignette ─────────────────────────────────────── */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          background: vignetteBg,
          opacity: vigOp,
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* ── Contrast punch at hold moments ───────────────── */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,1)',
          opacity: contrastOp,
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* ── Amber glow (outsole) ──────────────────────────── */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 40% at 50% 72%, rgba(255,175,50,0.22) 0%, transparent 100%)',
          opacity: ambGlowOp,
          pointerEvents: 'none', zIndex: 3,
        }} />

        {/* ── Teal glow (midsole) ───────────────────────────── */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 40% at 50% 62%, rgba(0,255,148,0.18) 0%, transparent 100%)',
          opacity: tealGlowOp,
          pointerEvents: 'none', zIndex: 3,
        }} />

        {/* ── Blue glow (insole) ────────────────────────────── */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 40% at 50% 58%, rgba(80,160,255,0.16) 0%, transparent 100%)',
          opacity: blueGlowOp,
          pointerEvents: 'none', zIndex: 3,
        }} />

        {/* ── Light sweep ───────────────────────────────────── */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.07) 50%, transparent 70%)',
          x: sweepX, opacity: sweepOp,
          pointerEvents: 'none', zIndex: 4,
        }} />

        {/* ── Ring 1: outsole ───────────────────────────────── */}
        <motion.div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '28vh', height: '28vh',
          marginTop: '-14vh', marginLeft: '-14vh',
          borderRadius: '50%',
          border: '1px solid rgba(255,175,50,0.60)',
          scale: r1Scale, opacity: r1Op,
          pointerEvents: 'none', zIndex: 5,
          filter: 'blur(1.5px)',
        }} />

        {/* ── Ring 2: midsole ───────────────────────────────── */}
        <motion.div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '28vh', height: '28vh',
          marginTop: '-14vh', marginLeft: '-14vh',
          borderRadius: '50%',
          border: '1px solid rgba(0,255,148,0.60)',
          scale: r2Scale, opacity: r2Op,
          pointerEvents: 'none', zIndex: 5,
          filter: 'blur(1.5px)',
        }} />

        {/* ── Ring 3: insole ────────────────────────────────── */}
        <motion.div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '28vh', height: '28vh',
          marginTop: '-14vh', marginLeft: '-14vh',
          borderRadius: '50%',
          border: '1px solid rgba(100,200,255,0.60)',
          scale: r3Scale, opacity: r3Op,
          pointerEvents: 'none', zIndex: 5,
          filter: 'blur(1.5px)',
        }} />

        {/* ── Text / UI slot ────────────────────────────────── */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
