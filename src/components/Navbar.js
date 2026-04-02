"use client";
import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (pct) => {
    const max = document.body.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * pct, behavior: 'smooth' });
  };

  return (
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
        className="btn btn-navbar-buy"
        onClick={() => scrollTo(1.0)}
      >
        Buy Now
      </button>
    </nav>
  );
}
