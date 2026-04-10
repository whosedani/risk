(function () {
    'use strict';

    const CONFIG = { ca: '', twitter: '', community: '', buy: '' };

    // ── Config ──

    async function loadConfig() {
        try {
            const res = await fetch('/api/config');
            if (!res.ok) return;
            const data = await res.json();
            Object.assign(CONFIG, data);
            applyConfig();
        } catch (e) { /* silent */ }
    }

    function applyConfig() {
        const navCAText = document.getElementById('navCAText');
        const navCommunity = document.getElementById('navCommunity');
        const heroBuyBtn = document.getElementById('heroBuyBtn');
        const buyBtn = document.getElementById('buyBtn');
        const footerCA = document.getElementById('footerCA');

        if (navCAText) navCAText.textContent = CONFIG.ca;
        if (footerCA) footerCA.textContent = CONFIG.ca;
        if (heroBuyBtn && CONFIG.buy) heroBuyBtn.href = CONFIG.buy;
        if (buyBtn && CONFIG.buy) buyBtn.href = CONFIG.buy;
        if (navCommunity && CONFIG.community) navCommunity.href = CONFIG.community;
    }

    // ── Nav scroll visibility ──

    function initNavScroll() {
        const nav = document.getElementById('nav');
        if (!nav) return;
        const threshold = window.innerHeight * 0.8;

        function check() {
            nav.classList.toggle('nav--visible', window.scrollY > threshold);
        }

        window.addEventListener('scroll', check, { passive: true });
        check();
    }

    // ── Scroll reveal ──

    function initScrollReveal() {
        const reveals = document.querySelectorAll('[data-reveal]');
        if (!reveals.length) return;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        reveals.forEach(function (el) { observer.observe(el); });
    }

    // ── Sound toggle ──

    function initSoundToggle() {
        const btn = document.getElementById('soundToggle');
        const video = document.getElementById('heroVideo');
        if (!btn || !video) return;

        btn.addEventListener('click', function () {
            if (video.muted) {
                video.muted = false;
                video.volume = 0;
                btn.textContent = 'sound on';

                const target = 0.35;
                const steps = 30;
                const step = target / steps;
                const interval = setInterval(function () {
                    video.volume = Math.min(target, video.volume + step);
                    if (video.volume >= target) clearInterval(interval);
                }, 50);
            } else {
                video.muted = true;
                video.volume = 0;
                btn.textContent = 'sound off';
            }
        });
    }

    // ── Copy CA ──

    function initCopy() {
        const navCA = document.getElementById('navCA');
        const footerCA = document.getElementById('footerCA');
        const toast = document.getElementById('toast');

        function doCopy() {
            if (!CONFIG.ca) return;
            navigator.clipboard.writeText(CONFIG.ca).then(function () {
                toast.classList.add('show');
                setTimeout(function () { toast.classList.remove('show'); }, 2000);
            });
        }

        if (navCA) navCA.addEventListener('click', doCopy);
        if (footerCA) footerCA.addEventListener('click', doCopy);
    }

    // ── Init ──

    document.addEventListener('DOMContentLoaded', function () {
        loadConfig();
        initNavScroll();
        initScrollReveal();
        initSoundToggle();
        initCopy();
    });
})();
