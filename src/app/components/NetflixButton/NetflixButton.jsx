import React, { useEffect, useRef } from 'react';
import './NetflixButton.css'


export default function NetflixButton({text}) {
  const btnRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const spans = [];

    for (let i = 0; i < 120; i++) {
      const span = document.createElement('span');
      span.style.left = `${i * 2}px`;

      const delay = `${(Math.random() * 1).toFixed(2)}s`;
      span.style.transitionDelay = delay;

      span.className =
        'absolute top-0 w-[2px] h-full bg-red-600 opacity-50 transition-all duration-1000';

      btn.appendChild(span);
      spans.push(span);
    }

    // Optional: cleanup on unmount
    return () => {
      spans.forEach((span) => btn.removeChild(span));
    };
  }, []);

  return (
    <div className="relative  overflow-hidden group">
      <button
        ref={btnRef}
        className="btn1 relative z-10 w-full h-full flex justify-center items-center text-white text-lg font-semibold bg-red-700 hover:bg-red-800 rounded-md transition-colors duration-300"
      >
       {text}
      </button>
    </div>
  );
}
