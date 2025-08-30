"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Banner() {
  const images = ["/banner1.png", "/banner2.png"];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === 0 ? 1 : 0));
    }, 3000); // change every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] mb-4 overflow-hidden bg-black max-w-7xl mx-auto">
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            current === index ? "opacity-100 pixel-fade-in" : "opacity-0 pixel-fade-out"
          }`}
        >
          <Image
            src={src}
            alt={`Banner ${index + 1}`}
            fill
            priority
            className="object-cover"
          />
        </div>
      ))}

      <style jsx>{`
        /* Pixelated fade animation */
        .pixel-fade-in {
          animation: pixelIn 1s steps(20) forwards;
        }
        .pixel-fade-out {
          animation: pixelOut 1s steps(20) forwards;
        }

        @keyframes pixelIn {
          from {
            filter: blur(20px) contrast(200%) brightness(50%);
            opacity: 0;
          }
          to {
            filter: blur(0) contrast(100%) brightness(100%);
            opacity: 1;
          }
        }

        @keyframes pixelOut {
          from {
            filter: blur(0) contrast(100%) brightness(100%);
            opacity: 1;
          }
          to {
            filter: blur(20px) contrast(200%) brightness(50%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
