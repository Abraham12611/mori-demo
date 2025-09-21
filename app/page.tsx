'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] });

 

 

 

 

// Mori-branded hero-only landing
function MoriLanding() {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const reduceMotion = React.useRef<boolean>(false);

    React.useEffect(() => {
        document.body.classList.add('page--mori');
        return () => {
            document.body.classList.remove('page--mori');
        };
    }, []);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        reduceMotion.current = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number | null = null;
        let rafStart = performance.now();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            const { innerWidth: w, innerHeight: h } = window;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            (ctx as CanvasRenderingContext2D).setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        type Tri = { x: number; y: number; vx: number; vy: number; r: number; rot: number; rotSpd: number; life: number; maxLife: number; color: string; };
        const palette = [
            'rgba(15,61,46,0.08)',
            'rgba(20,92,68,0.08)',
            'rgba(10,36,26,0.06)',
            'rgba(215,222,215,0.35)'
        ];

        const spawnCountBase = 220;
        const tris: Tri[] = [];

        const spawnTri = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const size = 4 + Math.random() * 14;
            const vx = -0.15 + Math.random() * 0.4;
            const vy = 0.1 + Math.random() * 0.35;
            const rotSpd = (-40 + Math.random() * 80) * (Math.PI / 180);
            const life = 8 + Math.random() * 10;
            const tri: Tri = {
                x: Math.random() * w,
                y: Math.random() * h,
                vx, vy,
                r: size,
                rot: Math.random() * Math.PI * 2,
                rotSpd,
                life,
                maxLife: life,
                color: palette[Math.floor(Math.random() * palette.length)],
            };
            tris.push(tri);
        };

        const targetCount = Math.min(spawnCountBase, Math.floor(window.innerWidth * window.innerHeight / 9000));
        for (let i = 0; i < targetCount; i++) spawnTri();

        const step = (t: number) => {
            const dt = Math.min((t - rafStart) / 1000, 0.033);
            rafStart = t;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            tris.forEach((tri) => {
                if (!reduceMotion.current) {
                    tri.x += tri.vx;
                    tri.y += tri.vy;
                    tri.rot += tri.rotSpd * dt;
                    tri.life -= dt;
                    if (tri.y > window.innerHeight + 20) tri.y = -20;
                    if (tri.x < -20) tri.x = window.innerWidth + 20;
                    if (tri.x > window.innerWidth + 20) tri.x = -20;
                }
                const alphaScale = reduceMotion.current ? 0.15 : 1;
                ctx.save();
                ctx.translate(tri.x, tri.y);
                ctx.rotate(tri.rot);
                ctx.beginPath();
                ctx.moveTo(0, -tri.r);
                ctx.lineTo(tri.r * 0.86, tri.r);
                ctx.lineTo(-tri.r * 0.86, tri.r);
                ctx.closePath();
                ctx.fillStyle = tri.color.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/, (m, r, g, b, a) => `rgba(${r},${g},${b},${parseFloat(a) * alphaScale})`);
                ctx.fill();
                ctx.restore();
            });

            if (!reduceMotion.current) animationId = requestAnimationFrame(step);
        };
        animationId = requestAnimationFrame(step);

        return () => {
            if (animationId) cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div className={`${inter.className}`}>
            {/* Background scene */}
            <div id="mori-origami-forest" aria-hidden="true" className="fixed inset-0 -z-10 bg-[length:cover] bg-center" style={{ backgroundImage: "url('/mori-origami-forest.png')" }} />
            <canvas id="mori-particles" ref={canvasRef} className="fixed inset-0 -z-[5] pointer-events-none" />
            <div className="hero__overlay fixed inset-0 -z-[4] pointer-events-none" />

            {/* Header */}
            <header className="site-header sticky top-0 z-30">
                <div className="site-header__inner container mx-auto flex items-center justify-between gap-6 px-6 md:px-8 h-[72px] md:h-20 backdrop-blur-md" style={{ background: 'rgba(249,249,244,0.65)', borderBottom: '1px solid var(--mori-border)' }}>
                    <a className="brand flex items-center gap-2" href="/" aria-label="Mori home">
                        <Image src="/mori-logo.png" alt="Mori" width={28} height={28} />
                        <span className="sr-only">Mori</span>
                    </a>
                    {/* Minimal header per hero-only spec; remove anchors to non-existent sections */}
                </div>
            </header>

            {/* Hero */}
            <section className="hero grid place-items-center pt-8 pb-12" style={{ minHeight: 'calc(100vh - 80px)' }}>
                <div className="hero__content container mx-auto max-w-[980px] text-center px-6">
                    <h1 className="hero__title" style={{
                        color: 'var(--mori-primary)',
                        fontSize: 'clamp(44px, 7vw, 96px)',
                        lineHeight: 1.08,
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        textShadow: '0 18px 48px rgba(0,0,0,0.08)'
                    }}>
                        森 Mori Protocol
                    </h1>
                    <p className="hero__subtitle mx-auto mt-4" style={{
                        color: 'var(--mori-text-muted)',
                        fontSize: 'clamp(18px, 2.5vw, 22px)',
                        lineHeight: 1.5,
                        fontWeight: 400
                    }}>
                        Humanized Artificial Intelligence Through Natural Emergence
                    </p>

                    <div className="hero__cta mt-7 flex justify-center gap-4">
                        <Link href="/chat" className="btn btn--primary" aria-label="Begin Journey">Begin Journey</Link>
                    </div>

                    <div className="hero__stats grid grid-cols-3 gap-7 mt-20 items-center">
                        <div className="stat">
                            <div className="stat__number" style={{ fontSize: 44, fontWeight: 600, color: 'var(--mori-primary)', lineHeight: 1.1 }}>1</div>
                            <div className="stat__label mt-2" style={{ fontSize: 16, fontWeight: 400, color: 'var(--mori-text-muted)' }}>Active Agents</div>
                        </div>
                        <div className="stat-divider mx-auto" style={{ height: 2, width: 56, background: 'var(--mori-primary)', opacity: 0.35, borderRadius: 9999 }} aria-hidden="true" />
                        <div className="stat">
                            <div className="stat__number" style={{ fontSize: 44, fontWeight: 600, color: 'var(--mori-primary)', lineHeight: 1.1 }}>—</div>
                            <div className="stat__label mt-2" style={{ fontSize: 16, fontWeight: 400, color: 'var(--mori-text-muted)' }}>Tasks Completed</div>
                        </div>
                        <div className="stat-divider mx-auto col-start-2" style={{ display: 'none' }} />
                        <div className="stat">
                            <div className="stat__number" style={{ fontSize: 44, fontWeight: 600, color: 'var(--mori-primary)', lineHeight: 1.1 }}>—</div>
                            <div className="stat__label mt-2" style={{ fontSize: 16, fontWeight: 400, color: 'var(--mori-text-muted)' }}>Partner Networks</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="site-footer border-t" style={{ borderTop: '1px solid var(--mori-border)' }}>
                <div className="site-footer__inner container mx-auto grid sm:grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-10">
                    <div className="footer__brand text-left">
                        <div style={{ color: 'var(--mori-text-muted)', fontSize: 14 }}>© 2025 Mori Protocol</div>
                        <div className="sub" style={{ color: '#98A2B3', fontSize: 12, marginTop: 6 }}>Building the Future of Harmonious AI</div>
                    </div>
                    <div className="footer__social text-center">
                        <a href="https://x.com" aria-label="X" className="inline-flex h-6 w-6 items-center justify-center text-[var(--mori-primary)] hover:text-[var(--mori-btn-primary-hover)]">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                    </div>
                    <div className="footer__links justify-self-end flex gap-7">
                        <a href="/privacy" className="opacity-90 hover:opacity-100" style={{ color: 'var(--mori-primary)' }}>Privacy</a>
                        <a href="/contact" className="opacity-90 hover:opacity-100" style={{ color: 'var(--mori-primary)' }}>Contact</a>
                    </div>
                </div>
            </footer>

            <style jsx global>{`
                body.page--mori { 
                    background: var(--mori-background); 
                    color: var(--mori-text); 
                    min-height: 100vh; 
                    display: grid; 
                    grid-template-rows: auto 1fr auto; 
                }
                .hero__overlay { 
                    background: var(--mori-hero-overlay-gradient);
                }
                /* Override global font rules to use Inter for Mori landing */
                .page--mori h1, .page--mori h2, .page--mori h3, .page--mori h4, .page--mori h5, .page--mori h6 {
                    font-family: inherit !important;
                }
                .page--mori, .page--mori p, .page--mori a, .page--mori button {
                    font-family: inherit;
                }
                .btn { 
                    display: inline-flex; align-items: center; justify-content: center; 
                    font-weight: 600; font-size: 16px; border-radius: 9999px; 
                    padding: 14px 28px; transition: all .15s ease-in-out; 
                }
                .btn--primary { background: var(--mori-btn-primary-bg); color: var(--mori-text-inverse); box-shadow: 0 6px 18px rgba(15,61,46,0.20); }
                .btn--primary:hover { background: var(--mori-btn-primary-hover); transform: translateY(-1px); }
                .btn--primary:active { background: var(--mori-btn-primary-active); transform: translateY(0); }
                .btn--primary:focus-visible { outline: 2px solid var(--mori-btn-focus-outline); outline-offset: 2px; }
                .btn--secondary { background: var(--mori-btn-secondary-bg); color: var(--mori-primary); border: 1px solid var(--mori-btn-secondary-border); padding: 14px 26px; }
                .btn--secondary:hover { background: var(--mori-btn-secondary-hover-bg); }
                .btn--secondary:active { background: var(--mori-btn-secondary-active-bg); }
                .btn--secondary:focus-visible { outline: 2px solid var(--mori-primary); outline-offset: 2px; }
                @media (prefers-reduced-motion: reduce) {
                    .btn--primary:hover { transform: none; }
                }
            `}</style>
        </div>
    );
}

export default function LandingPage() {
    return <MoriLanding />;
}