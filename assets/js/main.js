/* assets/js/main.js */
/* Türkçe açıklamalar, İngilizce değişken/işlev adları */
"use strict";

(function () {
  // ==== Helpers ====
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const $ = (sel, root = document) => root.querySelector(sel);
  const isReducedMotion = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = () =>
    matchMedia("(hover: none), (pointer: coarse)").matches ||
    "ontouchstart" in window;

  // Güvenli playback (autoplay hatalarını yut)
  const safePlay = (media) => {
    const p = media && typeof media.play === "function" ? media.play() : null;
    if (p && typeof p.catch === "function") p.catch(() => {});
  };

  // ==== 1) Otomatik data-animate atama + görünürlük gözlemi ====
  function setupAutoAnimate() {
    const addIfNone = (el, val) => {
      if (!el.hasAttribute("data-animate"))
        el.setAttribute("data-animate", val);
    };

    // Yapıyı bozmadan animasyon etiketi ver
    $$("h1,h2,h3,h4,h5,h6").forEach((el, i) =>
      addIfNone(el, i % 2 ? "right" : "left")
    );
    $$(".heroheadingtext").forEach((el) => addIfNone(el, "fade"));
    $$("p,.bodylarge,.textinline").forEach((el) => addIfNone(el, "up"));
    $$(".imagecontentparralax").forEach((el) => addIfNone(el, "rotate"));
    // Parallax içinde olmayan düz img'ler
    $$("img").forEach((img) => {
      if (!img.closest(".imagecontentparralax")) addIfNone(img, "zoom");
    });
    $$(".sectionhero,.section,.footer").forEach((el) => addIfNone(el, "fade"));

    // Reduced motion ise anında görünür yap
    const items = $$("[data-animate]");
    if (isReducedMotion()) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }

    // IntersectionObserver ile görünce 'visible' ekle
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, root: null, rootMargin: "0px 0px -10% 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  // ==== 2) 3'lü Video Vitrin: görünürlükte oynat, aksi halde durdur ====
  function setupVideoShowcase() {
    const videos = $$(".sayfiye-vids .vvideo");
    if (videos.length === 0) return;

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            const v = e.target;
            if (e.isIntersecting) safePlay(v);
            else if (typeof v.pause === "function") v.pause();
          });
        },
        { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
      );
      videos.forEach((v) => io.observe(v));
    } else {
      videos.forEach((v) => safePlay(v));
    }

    // Dokunmatik cihazlarda ilk dokunuş hover gibi davransın
    const items = $$(".sayfiye-vids .vitem");
    if (isTouchDevice()) {
      items.forEach((el) => {
        el.addEventListener(
          "click",
          function (ev) {
            if (!el.classList.contains("is-hover")) {
              ev.preventDefault();
              items.forEach((i) => i.classList.remove("is-hover"));
              el.classList.add("is-hover");
              clearTimeout(el._hovTimer);
              el._hovTimer = setTimeout(
                () => el.classList.remove("is-hover"),
                1500
              );
            }
          },
          { passive: false }
        );
      });
    }
  }

  // ==== 3) Kolaj kartları: dokunmatikte “hover” simülasyonu ====
  function setupCollageTouchHover() {
    const items = $$(".sayfiye-collage .citem");
    if (items.length === 0 || !isTouchDevice()) return;

    items.forEach((el) => {
      el.addEventListener(
        "click",
        function (ev) {
          if (!el.classList.contains("is-hover")) {
            ev.preventDefault();
            items.forEach((i) => i.classList.remove("is-hover"));
            el.classList.add("is-hover");
            clearTimeout(el._timer);
            el._timer = setTimeout(() => el.classList.remove("is-hover"), 1200);
          }
        },
        { passive: false }
      );
    });
  }

  // ==== 4) Kolaj kartları: tilt/parallax/wiggle (mouse & touch) ====
  function setupCollageParallax() {
    const cards = $$(".sayfiye-collage .citem");
    if (cards.length === 0) return;

    // Sınırlar
    const MAX_TILT = 9; // deg
    const MAX_LIFT = -16; // px
    const MAX_PUSH = 14; // px
    const SCALE_MIN = 1.08,
      SCALE_MAX = 1.16;

    const dimOthers = (active) => {
      cards.forEach((c) =>
        c === active ? c.classList.add("is-active") : c.classList.add("dim")
      );
    };
    const clearDim = () => {
      cards.forEach((c) => {
        c.classList.remove("dim", "is-active", "is-wiggle");
      });
    };

    const rand = (min, max) => Math.random() * (max - min) + min;
    const randsign = (v) => (Math.random() < 0.5 ? -v : v);

    cards.forEach((card) => {
      let raf = null;
      const state = { x: 0, y: 0, hover: false };

      function apply() {
        raf = null;
        const nx = state.x,
          ny = state.y; // -1..1
        // tilt
        card.style.setProperty("--tiltX", `${ny * MAX_TILT}deg`);
        card.style.setProperty("--tiltY", `${-nx * MAX_TILT}deg`);
        // lift
        card.style.setProperty(
          "--lift",
          `${(state.hover ? 1 : 0) * MAX_LIFT}px`
        );
        // glare
        card.style.setProperty("--glx", `${(nx * 50 + 50).toFixed(2)}%`);
        card.style.setProperty("--gly", `${(ny * 50 + 50).toFixed(2)}%`);
      }

      function onMovePoint(clientX, clientY) {
        const rect = card.getBoundingClientRect();
        const px = (clientX - rect.left) / rect.width; // 0..1
        const py = (clientY - rect.top) / rect.height; // 0..1
        state.x = (px - 0.5) * 2; // -1..1
        state.y = (py - 0.5) * 2; // -1..1
        if (!raf) raf = requestAnimationFrame(apply);
      }

      function onEnterPoint(clientX, clientY) {
        // Rastgele push + scale
        const dx = randsign(rand(4, MAX_PUSH));
        const dy = randsign(rand(2, MAX_PUSH));
        const sc = rand(SCALE_MIN, SCALE_MAX);

        card.style.setProperty("--dx", dx.toFixed(2) + "px");
        card.style.setProperty("--dy", dy.toFixed(2) + "px");
        card.style.setProperty("--scale", sc.toFixed(3));
        card.style.setProperty("--z", "20");

        // Rastgele wiggle süresi
        card.style.setProperty("--wigT", Math.round(rand(700, 1100)) + "ms");

        state.hover = true;
        card.classList.add("is-wiggle");
        dimOthers(card);
        if (clientX != null && clientY != null) onMovePoint(clientX, clientY);
        if (!raf) raf = requestAnimationFrame(apply);
      }

      function onLeave() {
        state.hover = false;
        card.style.setProperty("--dx", "0px");
        card.style.setProperty("--dy", "0px");
        card.style.setProperty("--scale", "1");
        card.style.setProperty("--z", "0");
        clearDim();
        if (!raf) raf = requestAnimationFrame(apply);
      }

      if (!isTouchDevice()) {
        card.addEventListener("pointerenter", (e) =>
          onEnterPoint(e.clientX, e.clientY)
        );
        card.addEventListener("pointermove", (e) =>
          onMovePoint(e.clientX, e.clientY)
        );
        card.addEventListener("pointerleave", onLeave);
      } else {
        // Dokunmatik: ilk dokunuşta büyüt/öne çıkar, parmağı takip et
        let touching = false;
        card.addEventListener(
          "touchstart",
          (e) => {
            touching = true;
            const t = e.touches[0];
            onEnterPoint(t.clientX, t.clientY);
          },
          { passive: true }
        );
        card.addEventListener(
          "touchmove",
          (e) => {
            if (!touching) return;
            const t = e.touches[0];
            onMovePoint(t.clientX, t.clientY);
          },
          { passive: true }
        );
        card.addEventListener(
          "touchend",
          () => {
            touching = false;
            onLeave();
          },
          { passive: true }
        );
      }
    });
  }

  // ==== Init ====
  document.addEventListener("DOMContentLoaded", () => {
    setupAutoAnimate();
    setupVideoShowcase();
    setupCollageTouchHover();
    setupCollageParallax();
  });
})();
(function(){
  // Hangi path hangi PDF'i açsın?
  const PDF_MAP = {
    '/':            'assets/pdfs/anasayfa.pdf',
    '/menu':        'assets/pdfs/menu.pdf',
    '/reservation': 'assets/pdfs/rezervasyon.pdf',
    '/restaurant':  'assets/pdfs/restaurant.pdf',
    '/about':       'assets/pdfs/hakkimizda.pdf'
  };

  const modal   = document.getElementById('pdfModal');
  const frame   = document.getElementById('pdfFrame');
  const titleEl = document.getElementById('pdfTitle');

  // Mevcut linkleri otomatik işaretle (mailto/tel hariç)
  document.querySelectorAll('a[href]').forEach(a => {
    try {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      const url = new URL(href, location.origin);
      const match = PDF_MAP[url.pathname];
      if (match && !a.dataset.pdf) a.dataset.pdf = match;
    } catch(e){}
  });

  function openPdf(url, label){
    // iOS/Safari gömülü PDF'te sorun çıkarırsa yeni sekme
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) { window.open(url, '_blank'); return; }

    titleEl.textContent = label || '';
    frame.src = url + (url.includes('#') ? '' : '#view=FitH'); // toolbar istersen #toolbar=1 ekleyebilirsin
    modal.hidden = false;
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function closePdf(){
    modal.hidden = true;
    modal.setAttribute('aria-hidden','true');
    frame.src = '';
    document.body.style.overflow = '';
  }

  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closePdf));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePdf(); });

  // Sadece data-pdf olan linklere müdahale et
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-pdf]');
    if (!a) return;

    // Orta tık / Ctrl-Click gibi yeni sekme isteklerini bozma
    if (e.button === 1 || e.metaKey || e.ctrlKey || a.target === '_blank') return;

    e.preventDefault();
    openPdf(a.dataset.pdf, a.textContent.trim());
  });
})();
