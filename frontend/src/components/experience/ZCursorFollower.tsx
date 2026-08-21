import { useEffect, useState, useRef } from "react";

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
}

export default function ZCursorFollower() {
  const [particles, setParticles] = useState<TrailParticle[]>([]);
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const idCounterRef = useRef<number>(0);
  const maxParticles = 4;

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const distance = Math.hypot(dx, dy);

      // Only spawn a new particle if mouse has moved a reasonable distance
      if (distance > 38) {
        lastPosRef.current = { x: e.clientX, y: e.clientY };

        const newParticle: TrailParticle = {
          id: idCounterRef.current++,
          x: e.clientX,
          y: e.clientY,
          size: Math.floor(Math.random() * 12) + 32, // 32px to 44px (1.5x larger)
          rotation: (Math.random() - 0.5) * 35,
          opacity: 0.9,
        };

        setParticles((prev) => {
          const updated = [...prev, newParticle];
          // Keep at most 4 particles
          return updated.slice(-maxParticles);
        });
      }
    };

    // Fade out and float upward
    const tick = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            y: p.y - 0.8, // drift gently upward
            opacity: p.opacity - 0.018, // smooth fade
          }))
          .filter((p) => p.opacity > 0.05)
      );

      animationFrameId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99998] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute transition-transform duration-75 ease-out"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
            opacity: p.opacity,
          }}
        >
          <img
            src="/assets/z-loader-cursor.png"
            alt="Z Sleep Particle"
            className="w-full h-full object-contain filter drop-shadow-sm select-none"
          />
        </div>
      ))}
    </div>
  );
}
