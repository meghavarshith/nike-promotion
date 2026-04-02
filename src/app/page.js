import React from 'react';
import Navbar from '../components/Navbar';
import SequenceCanvas from '../components/SequenceCanvas';
import StorytellingOverlay from '../components/StorytellingOverlay';
import ProgressIndicator from '../components/ProgressIndicator';

export const metadata = {
  title: 'NIKE PRECISION 7 | Control The Game',
  description: 'Experience the Nike Precision 7 — Built for speed, precision, and all-game dominance. Cinematic product storytelling.',
};

export default function Home() {
  return (
    <main>
      <Navbar />
      <SequenceCanvas>
        <StorytellingOverlay />
      </SequenceCanvas>
      <ProgressIndicator />
    </main>
  );
}
