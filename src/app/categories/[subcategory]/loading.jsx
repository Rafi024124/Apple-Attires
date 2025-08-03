"use client";

import React from "react";
import { FiSmartphone } from "react-icons/fi";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-40 space-y-4">
      <FiSmartphone
        className="text-black"
        size={64}
        style={{
          animation: "spinPulse 1.2s linear infinite",
          
        }}
      />
      <p className="text-black font-semibold text-lg tracking-wide">
        Loading Phone Covers...
      </p>

      <style>{`
        @keyframes spinPulse {
          0% {
            transform: rotate(0deg) scale(1) skew(0deg, 0deg);
            opacity: 1;
          }
          25% {
            transform: rotate(90deg) scale(1.1) skew(5deg, 5deg);
            opacity: 0.8;
          }
          50% {
            transform: rotate(180deg) scale(1) skew(0deg, 0deg);
            opacity: 1;
          }
          75% {
            transform: rotate(270deg) scale(1.1) skew(-5deg, -5deg);
            opacity: 0.8;
          }
          100% {
            transform: rotate(360deg) scale(1) skew(0deg, 0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
