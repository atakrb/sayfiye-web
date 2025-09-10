  (() => {
    'use strict';

    // ===== Preloader Mantığı =====
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) preloader.classList.add('loaded');
            if(mainContent) {
                mainContent.style.visibility = 'visible';
                mainContent.style.opacity = 1;
                mainContent.style.transition = 'opacity 1s ease';
            }
            document.body.classList.remove('loading');
            preloader?.addEventListener('transitionend', () => { preloader.style.display = 'none'; });
        }, 4500);
    });

    // ===== DOM Referansları =====
    const nav       = document.getElementById('nav');
    const burger    = document.getElementById('burger');
    const menuPanel = document.getElementById('menuPanel');
    const links     = Array.from(document.querySelectorAll('.links a[href^="#"]'));
    const sections  = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const langButtons  = document.querySelectorAll('.lang-btn');
    const resForm      = document.getElementById('resForm');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (burger && menuPanel) {
      burger.addEventListener('click', () => {
        const isOpen = menuPanel.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(isOpen));
      }, { passive: true });
    }

    const onScrollNav = () => nav && nav.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();

    const bar = document.getElementById('scrollProgress');
    const setBar = () => {
      if (!bar) return;
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      bar.style.width = `${(scrolled * 100).toFixed(2)}%`;
    };
    window.addEventListener('scroll', setBar, { passive: true });
    setBar();

    // ===== Scroll Reveal =====
    const revealEls = document.querySelectorAll('.reveal, .reveal-img, .menu-card');
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const parentGroups = new Map();
        revealEls.forEach(el => {
            const p = el.parentElement; if (!p) return;
            if (!parentGroups.has(p)) parentGroups.set(p, []);
            parentGroups.get(p).push(el);
        });
        parentGroups.forEach(group => group.forEach((el, i) => { if (!el.dataset.delay) el.dataset.delay = String(i * 100); }));

        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const el = e.target;
                    const d = parseInt(el.dataset.delay || '0', 10);
                    el.style.transitionDelay = `${d}ms`;
                    el.classList.add('in-view');
                    io.unobserve(el);
                }
            });
        }, { threshold: .1, rootMargin: '0px 0px -10% 0px' });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('in-view'));
    }

    // ===== Section Spy (Aktif Link) =====
    if ('IntersectionObserver' in window && sections.length) {
      const spy = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            const id = `#${target.id}`;
            links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
      sections.forEach(s => spy.observe(s));
    }

    // ===== i18n =====
    const i18n = {
      tr:{
        nav_home:"ANA SAYFA",nav_menu:"MENÜ",nav_fahri:"FAHRİ BABA",nav_raki:"RAKI",nav_order:"REZERVASYON",nav_contact:"İLETİŞİM",nav_faq:"SSS",
        hero_title:"Sayfiye Evi",
        about_title:"Urla'nın Kalbinde Bir Nefes",
        about_p:"Sayfiye Evi, sadece bir mekân değil; Ege’nin ritmini taşıyan bir yaşam biçimidir. Yazın ilk akşamlarında, denizden esen ılık rüzgâr masanın üzerine serili keten örtüyü hafifçe dalgalandırırken, taş duvarların serinliği yüzyılların hikâyesini fısıldar. İçeriden bakır tavalarda otların tıslayan sesi gelir; dışarıda dalgalar kıyıya usul usul vurarak sanki sofraya tempo tutar. Kapıdan içeri adım atar atmaz yüzüne çarpan koku zeytinyağıdır—taze, parlak ve berrak. Zeytin ağaçlarının gölgesinde kurulan masalar, “yavaşla” der; burada zaman, güneşin turuncuya döndüğü bir akşamüstünün ritmine uyar. İlk tabak gelir: denizden yeni çekilmiş balık, yanına limon kabuğu kadar sade, Ege otu kadar derin.",
        quote1:"“Dost meclisinde rakı, deniz sesiyle kıvam bulur.”",
        quote2:"“Sayfiye’de masalar sadece yemeklerle değil, anılarla da doluyor.”",
        raki_title:"Sayfiye'de Rakı İçmek mi?",
        raki_p:"Burada rakı, zamanı yavaşlatan bilge bir dost gibidir. Kadehler, aceleyle değil; her yudumun tadına vararak, anasonun buğusunda sohbetin derinliklerine dalarak doldurulur. Tıpkı hayat gibi... Ne kadar sabredersen, o kadar güzelleşir tadı. Rakı masası, zamanın durduğu, anıların tazelendiği ve hikayelerin yeniden anlatıldığı bir buluşma noktasıdır. Bu masa bir adabı, bir kültürü, bir paylaşma sanatını temsil eder. Sadece bir içki içmek için değil, ruhunuzu dinlendirmek ve kalbinizde iz bırakacak anılar biriktirmek için sizi Sayfiye'ye bekliyoruz.",
        card_menu:"Menü",card_discover:"Keşfet",card_res:"Rezervasyon",
        order_title:"Rezervasyon",
        order_p1:"Telefonla: <strong>0 (232) 000 00 00</strong><br>WhatsApp için sağ alttaki “İletişim!” butonuna tıkla.",
        order_p2:"Hafta içi 17:00–23:30 • Hafta sonu 16:00–01:00",
        ph_name:"Ad Soyad",ph_phone:"Telefon",ph_date:"Tarih",ph_time:"Saat",ph_people:"Kişi sayısı",btn_send:"GÖNDER",
        faq_title:"Sıkça Sorulan Sorular",q1:"Otopark var mı?",a1:"-Evet, akşam saatlerinde ücretsiz otopark alanı bulunur. Dolulukta vale yardımcı olur.",
        q2:"Vejetaryen/vegan seçenekler mevcut mu?",a2:"-Zeytinyağlılar ve salatalar yanında günlük vegan/vejetaryen alternatiflerimiz var.",
        q3:"Canlı müzik hangi günler?",a3:"-Cuma ve Cumartesi geceleri. Özel günlerde Instagram’dan duyuruyoruz.",
        route_google:"Google Rota",route_apple:"Apple Rota",
        contact_addr:"📍 İskele Mah., Urla / İzmir",contact_phone:"☎ 0 (232) 000 00 00",
        call:"Telefon Et",email:"E-posta Gönder",whatsapp:"WhatsApp",chat_btn:"İletişim!"
      },
      en:{
        nav_home:"HOME",nav_menu:"MENU",nav_fahri:"FAHRI BABA",nav_raki:"RAKI",nav_order:"RESERVATION",nav_contact:"CONTACT",nav_faq:"FAQ",
        hero_title:"Sayfiye Evi",
        about_title:"A Breath in the Heart of Urla",
        about_p:"Sayfiye Evi is not just a venue; it's a way of life that reflects the spirit of the Aegean. It is a sanctuary where you can feel the scent of iodine from the warm sea breeze, the coolness of ancient stone walls, and the calm melody of waves lapping the shore. Here, every moment is a painting where nature and tranquility intertwine, and time slows down. For us, Sayfiye is more than a meal; it is shared laughter among friends, a memory clinking in glasses, and a dream set against the crimson glow of the sunset over the sea.",
        quote1:"“Among friends, rakı reaches its best with the sound of the sea.”",
        quote2:"“At Sayfiye, tables fill with memories as much as with food.”",
        raki_title:"Having Rakı at Sayfiye?",
        raki_p:"Here, rakı is like a wise friend that slows time. Glasses are filled not in haste but by savoring each sip and diving deep into conversation amidst the anise-scented haze. The rakı table is a meeting point where time stops, memories are refreshed, and stories are told anew. This table represents a code of conduct, a culture, an art of sharing. We invite you to Sayfiye not just for a drink, but to rest your soul and gather memories that will leave a mark on your heart.",
        card_menu:"Menu",card_discover:"Explore",card_res:"Reservation",
        order_title:"Reservation",
        order_p1:"By phone: <strong>+90 (232) 000 00 00</strong><br>For WhatsApp, tap the ",
        order_p2:"Weekdays 17:00–23:30 • Weekends 16:00–01:00",
        ph_name:"Full name",ph_phone:"Phone",ph_date:"Date",ph_time:"Time",ph_people:"Guests",btn_send:"SEND",
        faq_title:"Frequently Asked Questions",q1:"Is there parking?",a1:"-Yes. Free evening parking; valet helps when full.",
        q2:"Vegetarian/vegan options?",a2:"-Alongside olive-oil dishes and salads, we have daily vegan/vegetarian alternatives.",
        q3:"Live music days?",a3:"-Friday & Saturday nights. We announce special days on Instagram.",
        route_google:"Google Directions",route_apple:"Apple Maps",
        contact_addr:"📍 İskele Mah., Urla / İzmir",contact_phone:"☎ +90 (232) 000 00 00",
        call:"Call",email:"Send E-mail",whatsapp:"WhatsApp",chat_btn:"Contact!"
      }
    };
    const getStoredLang = () => localStorage.getItem('lang') || 'tr';
    let currentLang = getStoredLang();
    function applyLang(lang){
      currentLang = lang;
      localStorage.setItem('lang', lang);
      document.documentElement.lang = (lang === 'tr' ? 'tr' : 'en');
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if(i18n[lang] && i18n[lang][key]) el.innerHTML = i18n[lang][key];
      });
      document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if(i18n[lang] && i18n[lang][key]) el.placeholder = i18n[lang][key];
      });
      langButtons.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    }
    langButtons.forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
    applyLang(currentLang);

    // ===== Form Yönetimi =====
    if (resForm) {
      resForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert(currentLang === 'tr'
          ? 'Rezervasyon isteğiniz başarıyla alındı. Sizinle teyit için iletişime geçeceğiz.'
          : 'Your reservation request has been received. We will contact you for confirmation.'
        );
        resForm.reset();
      });
    }

    // ===== Harekete Duyarlı Animasyonlar =====
    if (!prefersReducedMotion) {
      // Hero Parallax
      const heroMedia = document.querySelector('.hero .bg-media');
      const parallax = () => {
        if (!heroMedia) return;
        const y = window.scrollY || 0;
        const blurAmount = Math.min(y * 0.01, 5);
        heroMedia.style.transform = `translateY(${y * 0.15}px) scale(1.06)`;
        heroMedia.style.filter = `brightness(.8) contrast(1.05) blur(${blurAmount}px)`;
      };
      window.addEventListener('scroll', parallax, { passive: true });
      parallax();

      // 3D Kartlar
      document.querySelectorAll('.menu-card').forEach(card=>{
        const r = 12; let raf;
        const onMove = e => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          const ry = (x - 0.5) * (r * 2);
          const rx = (0.5 - y) * (r * 1.5);
          card.style.setProperty('--mx', `${x * 100}%`);
          card.style.setProperty('--my', `${y * 100}%`);
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(()=> { card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`; });
        };
        const reset = () => { card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)'; };
        card.addEventListener('mousemove', onMove, { passive: true });
        card.addEventListener('mouseleave', reset);
      });
    
      // Polaroid Galeri
      const scrollyStackModule = () => {
        const section = document.getElementById('scrolly-stack');
        if (!section) return;
        const cards = Array.from(section.querySelectorAll('.polaroid'));
        const numCards = cards.length;
        if (numCards === 0) return;
        const scrollPerCard = 100; 
        const totalStackHeight = numCards * scrollPerCard;
        section.style.height = `${totalStackHeight}vh`;

        const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

        const onScroll = () => {
          const sectionRect = section.getBoundingClientRect();
          const scrollInParent = -sectionRect.top;
          const sectionHeight = sectionRect.height;
          const viewHeight = window.innerHeight;
          const progress = Math.max(0, Math.min(1, scrollInParent / (sectionHeight - viewHeight)));
  
          cards.forEach((card, i) => {
            const start = i / numCards;
            const end = (i + 1) / numCards;
            const finalRotation = (i - (numCards - 1) / 2) * 4;
            const initialXDirection = (i % 2 === 0) ? -100 : 100;

            let transform = '', zIndex = i;
            const cap = card.querySelector('figcaption');

            if (progress < start) {
              transform = `translateX(${initialXDirection}vw) scale(0.8) rotate(0deg)`;
              zIndex = i;
              if (cap) { cap.style.opacity = 0; cap.style.transform = 'translateY(12px)'; }
            } else if (progress > end) {
              transform = `translateY(0) scale(1) rotate(${finalRotation}deg)`;
              zIndex = i;
              if (cap) { cap.style.opacity = 1; cap.style.transform = 'translateY(0px)'; }
            } else {
              const local = (progress - start) / (end - start);
              const currentX = (1 - local) * initialXDirection;
              const currentScale = 0.8 + local * 0.2;
              const currentRotation = local * finalRotation;
              transform = `translateX(${currentX}vw) scale(${currentScale}) rotate(${currentRotation}deg)`;
              zIndex = numCards;
              if (cap) {
                const a = clamp((local - 0.2) / 0.6, 0, 1);
                cap.style.opacity = a.toFixed(3);
                cap.style.transform = `translateY(${(1 - a) * 12}px)`;
              }
            }
            card.style.transform = transform;
            card.style.zIndex = zIndex;
          });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      };
      scrollyStackModule();

      // Görsel bölümleri videoya çevir (varsa). Fallback otomatik resim.
      const videoify = () => {
        document.querySelectorAll('.reveal-img[data-video-src]').forEach(wrap => {
          const src = wrap.getAttribute('data-video-src');
          if (!src || wrap.querySelector('video.video-cover')) return;
          const v = document.createElement('video');
          v.className = 'video-cover';
          v.src = src; v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'metadata';
          const img = wrap.querySelector('img');
          const cleanup = () => { v.remove(); if (img) img.style.visibility = ''; };
          v.addEventListener('canplay', () => { if (img) img.style.visibility = 'hidden'; v.play().catch(()=>{}); }, { once:true });
          v.addEventListener('error', cleanup, { once:true });
          wrap.style.position = 'relative';
          wrap.prepend(v);
        });
      };
      videoify();

      // Kart videolarını görünürlükte oynat/durdur
      const autoVideos = document.querySelectorAll('video[data-autoplay]');
      if ('IntersectionObserver' in window && autoVideos.length) {
        const vio = new IntersectionObserver(entries => {
          entries.forEach(async ({ target, isIntersecting }) => {
            const v = target;
            try {
              if (isIntersecting) {
                if (v.paused) { v.currentTime = 0; await v.play().catch(()=>{}); }
                v.closest('.menu-card')?.classList.add('in-view');
              } else {
                v.pause();
                v.closest('.menu-card')?.classList.remove('in-view');
              }
            } catch (e) {}
          });
        }, { threshold: 0.35 });
        autoVideos.forEach(v => vio.observe(v));
      }

      // Sekme gizlenince videoları durdur, geri gelince uygun olanları oynat
      document.addEventListener('visibilitychange', () => {
        const vids = document.querySelectorAll('video');
        vids.forEach(v => {
          if (document.hidden) v.pause();
          else if (v.hasAttribute('data-autoplay') || v.classList.contains('bg-media')) { v.play().catch(()=>{}); }
        });
      });
    }
// Newsletter mini-form
document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Bülten kaydın alındı. Teşekkürler!');
  e.target.reset();
});

  })();
