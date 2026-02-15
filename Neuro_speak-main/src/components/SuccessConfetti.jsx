import React from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const SuccessConfetti = ({ trigger }) => {
  const { width, height } = useWindowSize();

  // If the trigger (showConfetti state) is false, render nothing
  if (!trigger) return null;

  return (
    <Confetti 
      width={width} 
      height={height} 
      numberOfPieces={200} 
      recycle={false} // Run once, then stop (don't loop forever)
      gravity={0.2}
    />
  );
};

export default SuccessConfetti;