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
        const heroTwitterBtn = document.getElementById('heroTwitterBtn');
        const buyTwitterBtn = document.getElementById('buyTwitterBtn');

        if (navCAText) navCAText.textContent = CONFIG.ca;
        if (footerCA) footerCA.textContent = CONFIG.ca;
        if (heroBuyBtn && CONFIG.buy) heroBuyBtn.href = CONFIG.buy;
        if (buyBtn && CONFIG.buy) buyBtn.href = CONFIG.buy;
        if (navCommunity && CONFIG.community) navCommunity.href = CONFIG.community;
        if (heroTwitterBtn && CONFIG.twitter) heroTwitterBtn.href = CONFIG.twitter;
        if (buyTwitterBtn && CONFIG.twitter) buyTwitterBtn.href = CONFIG.twitter;
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

        var offLines = btn.querySelectorAll('.sound-off-line');
        var onWave1 = btn.querySelector('.sound-on-wave1');
        var onWave2 = btn.querySelector('.sound-on-wave2');
        var label = btn.querySelector('.sound-label');

        btn.addEventListener('click', function () {
            if (video.muted) {
                video.muted = false;
                video.volume = 0;
                label.textContent = 'sound on';
                offLines.forEach(function (l) { l.style.display = 'none'; });
                if (onWave1) onWave1.style.display = '';
                if (onWave2) onWave2.style.display = '';

                var target = 0.35;
                var steps = 30;
                var s = target / steps;
                var interval = setInterval(function () {
                    video.volume = Math.min(target, video.volume + s);
                    if (video.volume >= target) clearInterval(interval);
                }, 50);
            } else {
                video.muted = true;
                video.volume = 0;
                label.textContent = 'sound off';
                offLines.forEach(function (l) { l.style.display = ''; });
                if (onWave1) onWave1.style.display = 'none';
                if (onWave2) onWave2.style.display = 'none';
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
