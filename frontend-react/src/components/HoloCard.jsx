import React, { useState, useRef } from 'react';

/**
 * Tarjeta interactiva con inclinación 3D táctil y barrido holográfico al pasar el mouse.
 */
export default function HoloCard({ children, className = '', style = {}, disabled = false, maxTilt = 7 }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  const handleMouseMove = (e) => {
    if (disabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const ry = (x - 0.5) * (maxTilt * 2);
    const rx = (0.5 - y) * (maxTilt * 2);
    setTilt({ rx, ry, gx: Math.round(x * 100), gy: Math.round(y * 100), active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        ...style,
        transform: tilt.active
          ? `perspective(900px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg)`
          : 'perspective(900px) rotateX(0deg) rotateY(0deg)',
      }}
    >
      {children}
      {/* Brillo holográfico interactivo */}
      {!disabled && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-30"
          style={{
            opacity: tilt.active ? 0.35 : 0,
            background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.65) 0%, rgba(255,212,59,0.18) 32%, transparent 65%)`,
          }}
        />
      )}
    </div>
  );
}
