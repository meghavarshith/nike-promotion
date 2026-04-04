"use client";
import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (pct) => {
    const max = document.body.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * pct, behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-brand" onClick={() => scrollTo(0)} style={{ cursor: 'pointer' }}>
          Nike Precision 7
        </div>

        <ul className="nav-links">
          <li onClick={() => scrollTo(0.00)}>Overview</li>
          <li onClick={() => scrollTo(0.22)}>Performance</li>
          <li onClick={() => scrollTo(0.44)}>Cushioning</li>
          <li onClick={() => scrollTo(0.64)}>Design</li>
          <li onClick={() => scrollTo(0.84)}>Specs</li>
          <li onClick={() => scrollTo(1.00)}>Buy</li>
        </ul>

        <button
          className="btn btn-navbar-buy nav-buy-desktop"
          onClick={() => scrollTo(1.0)}
        >
          Buy Now
        </button>

        {/* Hamburger — mobile only */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu-open' : ''}`}>
        <ul className="mobile-menu-links">
          <li onClick={() => scrollTo(0.00)}>Overview</li>
          <li onClick={() => scrollTo(0.22)}>Performance</li>
          <li onClick={() => scrollTo(0.44)}>Cushioning</li>
          <li onClick={() => scrollTo(0.64)}>Design</li>
          <li onClick={() => scrollTo(0.84)}>Specs</li>
          <li onClick={() => scrollTo(1.00)}>Buy</li>
        </ul>
        <button
          className="btn btn-accent"
          style={{ marginTop: '2rem' }}
          onClick={() => scrollTo(1.0)}
        >
          Buy Now — $120
        </button>
      </div>
    </>
  );
}
