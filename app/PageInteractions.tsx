'use client';

import { useEffect, useRef } from 'react';

/* ──────────────────────────────────────────────────────────────
   All interactive DE GLAMPING behaviours:
   • Sidebar scroll-spy
   • Gallery friction/momentum drag
   • 3D tilt on Location card
   • Ethereal Suitability cards
   • Scroll reveal
   • Contact form
   • Hero parallax
──────────────────────────────────────────────────────────────── */

const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function PageInteractions() {
    const mounted = useRef(false);

    useEffect(() => {
        if (mounted.current) return;
        mounted.current = true;

        /* ── SCROLL SPY ─────────────────────────────────────────── */
        const navLinks = document.querySelectorAll<HTMLElement>('.nav-link');
        const sections = [...navLinks].map((link) => ({
            link,
            section: document.getElementById(link.dataset.section ?? ''),
        })).filter((e) => !!e.section);

        const setActive = (link: HTMLElement) => {
            navLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
        };

        const onScroll = () => {
            const scrollY = window.scrollY + window.innerHeight * 0.35;
            let current = sections[0];
            for (const entry of sections) {
                if (entry.section!.offsetTop <= scrollY) current = entry;
            }
            if (current) setActive(current.link);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        navLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(link.dataset.section ?? '');
                target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        /* ── GALLERY DRAG + FRICTION ────────────────────────────── */
        const wrapper = document.getElementById('gallery-track-wrapper');
        const track = document.getElementById('gallery-track');
        if (wrapper && track) {
            let isDragging = false;
            let startX = 0;
            let currentX = 0;
            let targetX = 0;
            let dragStartX = 0;
            let velocity = 0;
            let lastX = 0;
            let lastTime = 0;
            let rafId: number | null = null;

            const getMaxScroll = () =>
                Math.max(0, track.scrollWidth - wrapper.clientWidth);

            const applyTransform = (x: number) => {
                track.style.transform = `translateX(${x}px)`;
            };

            const tick = () => {
                if (!isDragging) {
                    velocity *= 0.88;
                    if (Math.abs(velocity) > 0.3) targetX += velocity;
                    else velocity = 0;
                    targetX = clamp(targetX, -getMaxScroll(), 0);
                    currentX = lerp(currentX, targetX, 0.1);
                    applyTransform(currentX);
                    if (Math.abs(currentX - targetX) > 0.05 || Math.abs(velocity) > 0.1) {
                        rafId = requestAnimationFrame(tick);
                    } else {
                        currentX = targetX;
                        applyTransform(currentX);
                        rafId = null;
                    }
                } else {
                    rafId = requestAnimationFrame(tick);
                }
            };
            const startTick = () => { if (!rafId) rafId = requestAnimationFrame(tick); };

            const onDown = (e: MouseEvent | TouchEvent) => {
                isDragging = true;
                startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
                dragStartX = currentX; lastX = startX; lastTime = Date.now(); velocity = 0;
                (wrapper as HTMLElement).style.cursor = 'grabbing';
                if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            };
            const onMove = (e: MouseEvent | TouchEvent) => {
                if (!isDragging) return;
                const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
                const now = Date.now(); const dt = now - lastTime;
                if (dt > 0) velocity = (cx - lastX) / dt * 14;
                lastX = cx; lastTime = now;
                currentX = clamp(dragStartX + (cx - startX), -getMaxScroll(), 0);
                targetX = currentX;
                applyTransform(currentX);
            };
            const onUp = () => {
                if (!isDragging) return;
                isDragging = false;
                (wrapper as HTMLElement).style.cursor = 'grab';
                targetX = clamp(currentX + velocity * 12, -getMaxScroll(), 0);
                startTick();
            };

            wrapper.addEventListener('wheel', (e) => {
                e.preventDefault();
                velocity = 0;
                targetX = clamp(targetX - e.deltaY * 1.2 - e.deltaX * 1.2, -getMaxScroll(), 0);
                startTick();
            }, { passive: false });

            wrapper.addEventListener('mousedown', onDown as EventListener);
            wrapper.addEventListener('touchstart', onDown as EventListener, { passive: true });
            window.addEventListener('mousemove', onMove as EventListener);
            window.addEventListener('touchmove', onMove as EventListener, { passive: true });
            window.addEventListener('mouseup', onUp);
            window.addEventListener('touchend', onUp);
            track.querySelectorAll('img').forEach((img) =>
                img.addEventListener('dragstart', (e) => e.preventDefault())
            );
        }

        /* ── 3D TILT ────────────────────────────────────────────── */
        const tiltContainer = document.getElementById('tilt-container');
        const tiltCard = document.getElementById('tilt-card');
        const tiltShine = document.getElementById('tilt-shine');
        if (tiltContainer && tiltCard) {
            let tRX = 0, tRY = 0, cRX = 0, cRY = 0;
            let tiltRaf: number | null = null;
            const MAX = 12;

            const tiltTick = () => {
                cRX = lerp(cRX, tRX, 0.1); cRY = lerp(cRY, tRY, 0.1);
                tiltCard.style.transform = `rotateX(${cRX}deg) rotateY(${cRY}deg) scale(1.02)`;
                if (tiltShine) {
                    tiltShine.style.background = `radial-gradient(circle at ${50 + cRY * 3}% ${50 - cRX * 3}%, rgba(255,255,255,0.18) 0%, transparent 65%)`;
                }
                if (Math.abs(cRX - tRX) > 0.01 || Math.abs(cRY - tRY) > 0.01)
                    tiltRaf = requestAnimationFrame(tiltTick);
                else tiltRaf = null;
            };

            tiltContainer.addEventListener('mousemove', (e) => {
                const r = tiltContainer.getBoundingClientRect();
                tRY = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2) * MAX, -MAX, MAX);
                tRX = -clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2) * MAX, -MAX, MAX);
                if (!tiltRaf) tiltRaf = requestAnimationFrame(tiltTick);
            });
            tiltContainer.addEventListener('mouseleave', () => {
                tRX = 0; tRY = 0;
                tiltCard.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
                tiltCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
                setTimeout(() => { tiltCard.style.transition = ''; }, 650);
                if (tiltRaf) { cancelAnimationFrame(tiltRaf); tiltRaf = null; }
            });
        }

        /* ── ETHEREAL CARDS ─────────────────────────────────────── */
        const suitGrid = document.getElementById('suitability-grid');
        const suitSection = document.getElementById('suitability');
        if (suitGrid) {
            const cards = suitGrid.querySelectorAll<HTMLElement>('.suit-card');
            cards.forEach((card, i) => {
                card.style.transitionDelay = `${i * 100}ms`;
            });
            const cardObs = new IntersectionObserver((entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add('in-view');
                        cardObs.unobserve(e.target);
                    }
                });
            }, { threshold: 0.15 });
            cards.forEach((c) => cardObs.observe(c));

            if (suitSection) {
                suitSection.addEventListener('mousemove', (e) => {
                    const r = suitSection.getBoundingClientRect();
                    const dx = (e.clientX - r.width / 2) / r.width;
                    const dy = (e.clientY - r.height / 2) / r.height;
                    cards.forEach((card, i) => {
                        if (!card.classList.contains('in-view')) return;
                        const depth = 0.5 + (i % 3) * 0.3;
                        card.style.transform =
                            `translateY(0px) translate(${dx * depth * 6}px, ${dy * depth * 4}px)`;
                    });
                });
                suitSection.addEventListener('mouseleave', () => {
                    cards.forEach((card) => { card.style.transform = ''; });
                });
            }
        }

        /* ── GENERIC REVEAL ─────────────────────────────────────── */
        const revealEls = document.querySelectorAll(
            '.facility-card, .section-header, .location-detail, .contact-right'
        );
        revealEls.forEach((el, i) => {
            el.classList.add('reveal');
            (el as HTMLElement).style.transitionDelay = `${(i % 6) * 60}ms`;
        });
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) { e.target.classList.add('in-view'); revealObs.unobserve(e.target); }
            });
        }, { threshold: 0.1 });
        revealEls.forEach((el) => revealObs.observe(el));

        /* ── HERO PARALLAX ──────────────────────────────────────── */
        const heroImg = document.querySelector<HTMLElement>('.hero-img');
        if (heroImg) {
            window.addEventListener('scroll', () => {
                heroImg.style.transform = `scale(1.06) translateY(${window.scrollY * 0.25}px)`;
            }, { passive: true });
        }

        /* ── CONTACT FORM ───────────────────────────────────────── */
        const form = document.getElementById('contact-form') as HTMLFormElement | null;
        const btn = document.getElementById('form-submit') as HTMLButtonElement | null;
        const success = document.getElementById('form-success');
        if (form && btn && success) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                btn.disabled = true; btn.textContent = 'Sending…';
                setTimeout(() => {
                    btn.textContent = 'Message Sent ✓';
                    success.textContent = 'We\'ll be in touch within 24 hours. Thank you!';
                    form.reset();
                    setTimeout(() => {
                        btn.disabled = false; btn.textContent = 'Send Message'; success.textContent = '';
                    }, 5000);
                }, 1400);
            });
        }

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return null; // purely behavioural — no DOM output
}
