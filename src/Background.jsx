import React, { useEffect, useRef } from 'react';

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let W, H, pts = [];

    function rsz() {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
      init();
    }

    function init() {
      pts = Array.from({ length: 35 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - .5) * .28,
        vy: (Math.random() - .5) * .28,
        r: Math.random() * 1.4 + .5
      }));
    }

    let animId;
    function drw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(184,232,48,.34)';
        ctx.fill();
      });

      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 115) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(184,232,48,${.055 * (1 - d / 115)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }));
      animId = requestAnimationFrame(drw);
    }

    window.addEventListener('resize', rsz);
    rsz();
    drw();

    return () => {
      window.removeEventListener('resize', rsz);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div className="global-bg"></div>
      <canvas ref={canvasRef} className="bg-cv"></canvas>
    </>
  );
}
