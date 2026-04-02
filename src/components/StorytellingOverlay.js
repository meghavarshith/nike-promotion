"use client";
import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import TextMolecules from './TextMolecules';

/* ── constants ──────────────────────────────────────────────────────────────── */
const ABS = { position: 'absolute', inset: 0, pointerEvents: 'none' };

const SPLIT = {
  display: 'grid',
  gridTemplateColumns: '26vw 48vw 26vw',
  width: '100%',
  height: '100%',
  alignItems: 'center',
};

/* ─────────────────────────────────────────────────────────────────────────────
   GLASSMORPHIC SPEC CARD
   Restrained: no emoji, no excess decoration. Just data.
──────────────────────────────────────────────────────────────────────────────*/
function SpecCard({ accentColor, tag, title, specs, align = 'left' }) {
  return (
    <div style={{
      background: 'rgba(8,8,8,0.55)',
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderTop: `1px solid ${accentColor}`,
      borderRadius: '2px',            // squared, military-precise
      padding: '1.8rem 2rem',
      maxWidth: '240px',
      boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.04)`,
    }}>
      {/* Tag */}
      <p style={{
        fontSize: '9px', fontWeight: 700,
        letterSpacing: '0.35em', textTransform: 'uppercase',
        color: accentColor, marginBottom: '0.6rem',
        opacity: 0.9,
      }}>{tag}</p>

      {/* Divider */}
      <div style={{ width: '20px', height: '1px', background: `${accentColor}80`, marginBottom: '0.9rem' }} />

      {/* Title */}
      <p style={{
        fontSize: '13px', fontWeight: 700,
        color: 'rgba(255,255,255,0.92)',
        letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: '1.2rem', lineHeight: 1.3,
      }}>{title}</p>

      {/* Specs */}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
        {specs.map((s, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
            <span style={{
              width: '3px', height: '3px', borderRadius: '50%',
              background: accentColor, flexShrink: 0, marginTop: '5px', opacity: 0.8,
            }} />
            <span style={{
              fontSize: '11px', color: 'rgba(255,255,255,0.50)',
              letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.5,
            }}>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STAGE LABEL  e.g. "02 —— OUTSOLE"
──────────────────────────────────────────────────────────────────────────────*/
function StageLabel({ num, label, color, align = 'left' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.7rem',
      marginBottom: '1.2rem',
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
    }}>
      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.3em', color: `${color}CC`, textTransform: 'uppercase' }}>{num}</span>
      <span style={{ width: '20px', height: '1px', background: `${color}50` }} />
      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.3em', color: `${color}80`, textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION HEADLINE — simple motion.p with class-driven animation
   (Not TextMolecules — too chaotic for Awwwards restraint in mid sections)
──────────────────────────────────────────────────────────────────────────────*/
function Headline({ children, align = 'left', color = '#fff' }) {
  return (
    <p style={{
      fontSize: 'clamp(22px, 2.8vw, 46px)',
      fontWeight: 900,
      color,
      letterSpacing: '-0.025em',
      textTransform: 'uppercase',
      lineHeight: 1.0,
      textAlign: align,
      textShadow: '0 2px 20px rgba(0,0,0,0.5)',
    }}>
      {children}
    </p>
  );
}

function SubText({ children, align = 'left' }) {
  return (
    <p style={{
      marginTop: '0.9rem',
      fontSize: 'clamp(10px, 0.88vw, 13px)',
      color: 'rgba(255,255,255,0.35)',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      lineHeight: 1.7,
      textAlign: align,
    }}>
      {children}
    </p>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   MAIN OVERLAY
═════════════════════════════════════════════════════════════════════════════*/
export default function StorytellingOverlay() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 45, damping: 22, restDelta: 0.0002 });

  // ── Section timings (mirror SequenceCanvas exactly) ──────────────────────
  //  Hero    0.00–0.20
  //  Outsole 0.20–0.43
  //  Midsole 0.43–0.64
  //  Insole  0.64–0.85
  //  Final   0.85–1.00

  // Opacity envelopes: rise over 6% → hold → fall over 5%
  const opH  = useTransform(smooth, [0.00, 0.10, 0.16, 0.22], [1, 1, 0.5, 0]);
  const yH   = useTransform(smooth, [0.00, 0.22], [0, -48]);
  const blH  = useTransform(smooth, [0.13, 0.22], ['blur(0px)', 'blur(8px)']);

  const opO  = useTransform(smooth, [0.20, 0.27, 0.37, 0.43], [0, 1, 1, 0]);
  const yO   = useTransform(smooth, [0.20, 0.43], [32, -32]);
  const blO  = useTransform(smooth, [0.22, 0.28, 0.37, 0.43], ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(8px)']);

  const opM  = useTransform(smooth, [0.43, 0.50, 0.58, 0.64], [0, 1, 1, 0]);
  const yM   = useTransform(smooth, [0.43, 0.64], [32, -32]);
  const blM  = useTransform(smooth, [0.45, 0.51, 0.58, 0.64], ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(8px)']);

  const opI  = useTransform(smooth, [0.64, 0.71, 0.78, 0.85], [0, 1, 1, 0]);
  const yI   = useTransform(smooth, [0.64, 0.85], [32, -32]);
  const blI  = useTransform(smooth, [0.66, 0.72, 0.78, 0.85], ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(8px)']);

  const opF  = useTransform(smooth, [0.88, 0.95, 1.00], [0, 1, 1]);
  const yF   = useTransform(smooth, [0.88, 1.00], [36, 0]);
  const blF  = useTransform(smooth, [0.89, 0.96], ['blur(8px)', 'blur(0px)']);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}>

      {/* ══════════════════════════════════════════════════════════════
          HERO   0 – 20%   White bg · centered · assembly shot
      ══════════════════════════════════════════════════════════════ */}
      <motion.div style={{ ...ABS, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: opH, y: yH, filter: blH, zIndex: 10 }}>
        <div style={{ textAlign: 'center', padding: '0 6vw', maxWidth: '900px' }}>

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.35em', color: 'rgba(0,0,0,0.60)', textTransform: 'uppercase', marginBottom: '1.4rem' }}
          >
            01 — Nike Precision Series
          </motion.p>

          {/* Headline — molecule entrance */}
          <TextMolecules
            text="NIKE PRECISION 7"
            isHero
            scrollProgress={smooth}
            exitRange={[0.13, 0.22]}
            style={{ fontSize: 'clamp(40px, 5.8vw, 92px)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.035em', color: '#0D0D0D', textTransform: 'uppercase' }}
          />
          <TextMolecules
            text="CONTROL THE GAME."
            isHero
            scrollProgress={smooth}
            exitRange={[0.14, 0.22]}
            style={{ fontSize: 'clamp(40px, 5.8vw, 92px)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.035em', color: '#E8291C', textTransform: 'uppercase' }}
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginTop: '2rem', fontSize: 'clamp(12px, 0.95vw, 15px)', color: 'rgba(0,0,0,0.65)', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500 }}
          >
            Built for speed. Engineered for precision. Made for champions.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.8rem', pointerEvents: 'auto' }}
          >
            <button className="btn btn-primary" onClick={() => window.alert('Added to cart!')}>Buy Now</button>
            <button className="btn btn-ghost-dark">Explore Specs</button>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 1.2 }}
            style={{ marginTop: '3.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}
          >
            <span style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(0,0,0,0.55)', textTransform: 'uppercase', fontWeight: 600 }}>Scroll to explore</span>
            <div style={{ width: '1px', height: '28px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)', animation: 'scrollPulse 2s ease-in-out infinite' }} />
          </motion.div>

        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════
          OUTSOLE   20 – 43%    LEFT headline · RIGHT card
          Accent: amber #F5A623
      ══════════════════════════════════════════════════════════════ */}
      <motion.div style={{ ...ABS, opacity: opO, y: yO, filter: blO, zIndex: 10 }}>
        <div style={SPLIT}>

          {/* LEFT */}
          <div style={{ paddingLeft: '4.5vw', paddingRight: '1vw' }}>
            <StageLabel num="02" label="Outsole" color="#F5A623" />
            <Headline>Precision<br />Grip.</Headline>
            <SubText>Court-engineered traction<br />for explosive lateral cuts.</SubText>
          </div>

          <div /> {/* shoe zone */}

          {/* RIGHT */}
          <div style={{ paddingRight: '4.5vw', paddingLeft: '1vw', display: 'flex', justifyContent: 'flex-end' }}>
            <SpecCard
              accentColor="#F5A623"
              tag="Outsole Technology"
              title="Multi-Zone Traction"
              specs={['Multi-directional grip zones', '30% more surface contact', 'Court-specific rubber compound', 'Optimized pivot points']}
            />
          </div>

        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════
          MIDSOLE   43 – 64%    LEFT card · RIGHT headline
          Accent: teal #00E887
      ══════════════════════════════════════════════════════════════ */}
      <motion.div style={{ ...ABS, opacity: opM, y: yM, filter: blM, zIndex: 10 }}>
        <div style={SPLIT}>

          {/* LEFT */}
          <div style={{ paddingLeft: '4.5vw', paddingRight: '1vw' }}>
            <SpecCard
              accentColor="#00E887"
              tag="Midsole Technology"
              title="Air Cushion System"
              specs={['Zonal impact absorption', 'High-energy return foam', 'Lateral stability structure', 'Progressive stiffness zones']}
            />
          </div>

          <div />

          {/* RIGHT */}
          <div style={{ paddingRight: '4.5vw', paddingLeft: '1vw', textAlign: 'right' }}>
            <StageLabel num="03" label="Midsole" color="#00E887" align="right" />
            <Headline align="right">Responsive<br />Cushioning.</Headline>
            <SubText align="right">Energy return engineered<br />for peak performance.</SubText>
          </div>

        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════
          INSOLE   64 – 85%    LEFT headline · RIGHT card
          Accent: soft blue #4AABF0
      ══════════════════════════════════════════════════════════════ */}
      <motion.div style={{ ...ABS, opacity: opI, y: yI, filter: blI, zIndex: 10 }}>
        <div style={SPLIT}>

          {/* LEFT */}
          <div style={{ paddingLeft: '4.5vw', paddingRight: '1vw' }}>
            <StageLabel num="04" label="Insole" color="#4AABF0" />
            <Headline>All-Day<br />Comfort.</Headline>
            <SubText>Anatomical support<br />for the full forty minutes.</SubText>
          </div>

          <div />

          {/* RIGHT */}
          <div style={{ paddingRight: '4.5vw', paddingLeft: '1vw', display: 'flex', justifyContent: 'flex-end' }}>
            <SpecCard
              accentColor="#4AABF0"
              tag="Insole Technology"
              title="Adaptive Fit System"
              specs={['Custom arch support geometry', 'Moisture-wicking lining', 'Anatomical pressure mapping', 'Zero-slip footbed design']}
            />
          </div>

        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════
          FINAL   85 – 100%    Bottom-right · White bg · Reassembled
      ══════════════════════════════════════════════════════════════ */}
      <motion.div style={{ ...ABS, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', opacity: opF, y: yF, filter: blF, zIndex: 10 }}>
        <div style={{ padding: '0 4.5vw 5vh 0', textAlign: 'right', maxWidth: '38vw' }}>

          {/* Eyebrow */}
          <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.35em', color: 'rgba(0,0,0,0.28)', textTransform: 'uppercase', marginBottom: '1.4rem' }}>
            05 — Built for control
          </p>

          {/* Main headline — molecule entrance for payoff */}
          <TextMolecules
            text="NIKE PRECISION 7"
            scrollProgress={smooth}
            exitRange={[2.0, 3.0]}
            style={{ fontSize: 'clamp(26px, 3.2vw, 52px)', fontWeight: 900, color: '#0D0D0D', letterSpacing: '-0.035em', lineHeight: 0.92, textTransform: 'uppercase', textAlign: 'right' }}
          />
          <TextMolecules
            text="CONTROL THE GAME."
            scrollProgress={smooth}
            exitRange={[2.0, 3.0]}
            style={{ fontSize: 'clamp(26px, 3.2vw, 52px)', fontWeight: 900, color: '#E8291C', letterSpacing: '-0.035em', lineHeight: 0.92, textTransform: 'uppercase', textAlign: 'right' }}
          />

          {/* Divider */}
          <div style={{ width: '100%', height: '1px', background: 'rgba(0,0,0,0.10)', marginTop: '1.4rem', marginBottom: '1.4rem' }} />

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
            <button className="btn btn-primary btn-sm" onClick={() => window.alert('Added to cart!')}>Buy Now</button>
            <button className="btn btn-ghost-dark btn-sm">Explore Specs</button>
          </div>

        </div>
      </motion.div>

    </div>
  );
}
