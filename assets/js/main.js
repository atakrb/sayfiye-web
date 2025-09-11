(() => {
  'use strict';

  // ===== Preloader =====
  const preloader = document.getElementById('preloader');
  const mainContent = document.getElementById('main-content');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) preloader.classList.add('loaded');
      if (mainContent) {
        mainContent.style.visibility = 'visible';
        mainContent.style.opacity = 1;
        mainContent.style.transition = 'opacity 1s ease';
      }
      document.body.classList.remove('loading');
      preloader?.addEventListener('transitionend', () => { preloader.style.display = 'none'; });
    }, 4500);
  });

  // ===== DOM Refs =====
  const nav       = document.getElementById('nav');
  const burger    = document.getElementById('burger');
  const menuPanel = document.getElementById('menuPanel');
  const links     = Array.from(document.querySelectorAll('.links a[href^="#"]'));
  const sections  = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const langButtons = document.querySelectorAll('.lang-btn');
  const resForm   = document.getElementById('resForm');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== Burger & ESC =====
  if (burger && menuPanel) {
    burger.addEventListener('click', () => {
      const isOpen = menuPanel.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuPanel.classList.contains('open')) {
        menuPanel.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===== Scroll Nav =====
  const onScrollNav = () => nav && nav.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  // ===== Scroll Progress =====
  const bar = document.getElementById('scrollProgress');
  const setBar = () => {
    if (!bar) return;
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.width = `${(scrolled * 100).toFixed(2)}%`;
  };
  window.addEventListener('scroll', setBar, { passive: true });
  setBar();

  // ===== Reveal =====
  const revealEls = document.querySelectorAll('.reveal, .reveal-img, .menu-card');
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const parentGroups = new Map();
    revealEls.forEach(el => {
      const p = el.parentElement; if (!p) return;
      if (!parentGroups.has(p)) parentGroups.set(p, []);
      parentGroups.get(p).push(el);
    });
    parentGroups.forEach(group => group.forEach((el, i) => {
      if (!el.dataset.delay) el.dataset.delay = String(i * 100);
    }));

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

  // ===== Section Spy =====
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
    en: {
        preloader_text: "The raki is finding its consistency...",
        nav_home: "HOME",
        nav_menu: "MENU",
        nav_fahri: "FAHRI BABA",
        nav_order: "RESERVATION",
        nav_contact: "CONTACT",
        nav_faq: "FAQ",
        hero_title: "Sayfiye Evi",
        about_title: "A Breath in the Heart of Urla",
        about_p: "Sayfiye Evi is not just a place; it is a way of life that carries the rhythm of the Aegean. On the first evenings of summer, while the warm breeze from the sea gently ripples the linen tablecloth, the coolness of the stone walls whispers tales of centuries. From inside comes the sizzling sound of herbs in copper pans; outside, the waves gently lap the shore, as if keeping tempo with the meal. As soon as you step through the door, the scent that hits your face is olive oil—fresh, bright, and clear. The tables set under the shade of olive trees say, \"slow down\"; here, time adapts to the rhythm of an afternoon when the sun turns orange. The first dish arrives: fish just pulled from the sea, as simple as a lemon peel, as deep as an Aegean herb. Glasses clink lightly; that ringing sound mixes with conversations had here before, preparing to become a new memory. Laughter from a neighboring table drifts over to yours with the wind.",
        reservation_title: "Make a Reservation",
        reservation_p: "The first note of that unique meze table, the first step of a pleasant conversation, begins with that special table we have carefully prepared for you. For us, every guest is our most valued guest, and we deeply appreciate every moment you share. To prevent the magic of these precious moments and the night from being overshadowed by the uncertainty of waiting at the door, we kindly ask you to reserve your place at our table in advance. A reservation is not just a guarantee of finding an empty table, but also an assurance that the evening is dedicated to you, and that our entire team, from our kitchen to our service, is ready for you.",
        reservation_button: "Make a Reservation",
        meze_title: "The Art of Meze",
        meze_p: "For us, meze is the opening serenade of the meal; a magical start where each note carries a different flavor tone, preparing you for the grand symphony that will make the night unforgettable. Fresh herbs gathered from the fertile lands of Urla meet sun-drenched Aegean tomatoes with the golden touch of the purest olive oil. That olive oil is not just an ingredient, but an elixir that carries the soul and generosity of this land. Each is a small plate of flavor whispering its own story. While a spoonful of \"atom\" meze creates a momentary flash of heat on your palate, a forkful of Cretan paste with its nutty and cheesy freshness immediately turns that fire into a sweet breeze. The smoky scent of roasted eggplant takes you back to an old summer evening, while the silky texture of fava is proof of how noble simplicity can be. The iodized taste of sea beans brings the sea itself, and the noble stance of white cheese brings the sober wisdom of this whole feast to the table.",
        main_course_title: "From the Sea to the Table",
        main_course_p: "Our story begins with the sound of fishing boats returning to the harbor as the sun gently warms the Aegean waters. Each fish, with its silver-shining scales pulled from the sea by those calloused hands, is a testament to the day's generosity from the sea. At the end of the day, this most precious treasure arrives at the table. The freshest fish from our fishermen's nets, whatever the season whispers, are transformed into a work of art by master hands. There is no need for many words or complex sauces. Just olive oil, a pinch of salt, and the wisdom of glowing charcoal embers... That sweet sizzle on the fire and the smoky aroma that fills the air are the best harbingers of the approaching delicacy. The aim is not to mask the pure, iodized taste the fish brings from the sea, but on the contrary, to reveal it in all its glory.",
        fahri_baba_title: "Fahri Baba",
        fahri_baba_p: "Fahri Baba is not just a business owner; he is the living, wise old tree of this dining culture. As he walks among his guests in his white apron, his presence adds not just experience but also a soul to the venue. This is a precious heirloom passed down from father to son, its walls imbued with the salt of the sea, the roar of the boats, and the memories of generations. Your table is set against the sweet breeze and iodine scent of Urla. Every meze that comes before you is the product of a recipe kneaded with years of experience. The Cretan paste is fresher, the sea beans more vibrant here. The tenderness of the grilled octopus from master hands or the lingering taste of the famous \"balık kokoreç\" are signatures that make you say, \"This is a Fahri Baba classic.\"",
        caption1: "“Raki shouldn't be rushed, my child.”",
        caption2: "“First the meze, then the talk...”",
        caption3: "“Sayfiye's Special Cocktails”",
        caption4: "“Come hungry for conversation...”",
        caption5: "“The sound of the sea is perfect...”",
        quote2: "“At Sayfiye, tables are filled not just with food, but with memories.”",
        order_title: "Reservation",
        order_p1: "By phone: <strong>+90 (232) 768 41 41</strong><br />For WhatsApp, click the “Contact!” button at the bottom right.",
        order_p2: "Weekdays 17:00–23:30 • Weekends 16:00–01:00",
        ph_name: "Name Surname",
        ph_phone: "Phone",
        ph_date: "Date",
        ph_time: "Time",
        ph_people: "Number of people",
        btn_send: "SEND",
        faq_title: "Frequently Asked Questions",
        q1: "Is there parking available?",
        a1: "-Yes, there is a free parking area in the evenings. A valet will assist if it is full.",
        q2: "Are vegetarian/vegan options available?",
        a2: "-Besides our olive oil dishes and salads, we have daily vegan/vegetarian alternatives.",
        q3: "On which days is there live music?",
        a3: "-Friday and Saturday nights. We announce special occasions on Instagram.",
        contact_title: "CONTACT",
        contact_phone: "Phone",
        contact_email: "E-mail"
    },
    tr: {
        preloader_text: "Rakı kıvamını buluyor...",
        nav_home: "ANA SAYFA",
        nav_menu: "MENÜ",
        nav_fahri: "FAHRI BABA",
        nav_order: "REZERVASYON",
        nav_contact: "ILETISIM",
        nav_faq: "SSS",
        hero_title: "Sayfiye Evi",
        about_title: "Urla'nın Kalbinde Bir Nefes",
        about_p: "Sayfiye Evi, sadece bir mekân değil; Ege’nin ritmini taşıyan bir yaşam biçimidir. Yazın ilk akşamlarında, denizden esen ılık rüzgâr masanın üzerine serili keten örtüyü hafifçe dalgalandırırken, taş duvarların serinliği yüzyılların hikâyesini fısıldar. İçeriden bakır tavalarda otların tıslayan sesi gelir; dışarıda dalgalar kıyıya usul usul vurarak sanki sofraya tempo tutar. Kapıdan içeri adım atar atmaz yüzüne çarpan koku zeytinyağıdır—taze, parlak ve berrak. Zeytin ağaçlarının gölgesinde kurulan masalar, “yavaşla” der; burada zaman, güneşin turuncuya döndüğü bir akşamüstünün ritmine uyar. İlk tabak gelir: denizden yeni çekilmiş balık, yanına limon kabuğu kadar sade, Ege otu kadar derin. Kadehler hafifçe tokuşur; çınlayan o ses, daha önce burada yaşanmış sohbetlere karışır, yeni bir anıya dönmeye hazırlanır. Komşu masadan yükselen kahkaha, rüzgârla birlikte senin masana uğrar.",
        reservation_title: "Rezervasyon Yap",
        reservation_p: "O eşsiz meze sofrasının ilk notası, keyifli bir sohbetin ilk adımı, sizin için özenle hazırladığımız o özel masayla atılır. Bizim için her misafir, en değerli konuğumuzdur ve paylaştığınız her anın kıymetini derinden biliriz. Bu değerli anların ve gecenin büyüsünün, kapıda beklemenin belirsizliğiyle gölgelenmesine izin vermemek adına, soframızdaki yerinizi önceden ayırtmanızı rica ediyoruz. Rezervasyon, sadece boş bir masa bulma garantisi değil, aynı zamanda o akşamın size adandığının, mutfağımızdan servisimize tüm ekibimizin sizin için hazırlandığının bir güvencesidir.",
        reservation_button: "Rezervasyon Yap",
        meze_title: "Meze Sanatı",
        meze_p: "Bizim için meze, sofranın açılış serenadıdır; her notası ayrı bir lezzet tınısı taşıyan ve geceyi unutulmaz kılacak o büyük senfoniye hazırlayan büyülü bir başlangıç. Urla'nın bereketli topraklarından toplanan taptaze otlar, Ege'nin güneşiyle demlenmiş domatesler ve en saf zeytinyağının altın dokunuşuyla buluşur. O zeytinyağı ki, sadece bir malzeme değil, bu toprağın ruhunu ve cömertliğini taşıyan bir iksirdir. Her biri, kendi hikâyesini fısıldayan küçük lezzet tabaklarıdır. Bir kaşık atomun acısı, damağınızda bir anlık bir şimşek çaktırırken, hemen ardından gelen bir çatal Girit ezmesinin cevizli ve peynirli ferahlığı o yangını tatlı bir melteme dönüştürür. Közlenmiş patlıcanın isli kokusu sizi eski bir yaz akşamına götürürken, ipeksi kıvamıyla fava, sadeliğin ne denli asil olabileceğinin kanıtıdır. Deniz börülcesinin iyotlu tadı denizin kendisini, beyaz peynirin asil duruşu ise tüm bu cümbüşün ağırbaşlı bilgesini sofraya taşır.",
        main_course_title: "Denizden Sofraya",
        main_course_p: "Hikayemiz, daha güneş Ege'nin sularını nazlıca ısıtırken limana dönen balıkçı teknelerinin sesiyle başlar. O nasırlı ellerin denizden çektiği, pulları gümüş gibi parıldayan her bir balık, denizin o günkü cömertliğinin bir nişanıdır. Günün sonunda, işte bu en değerli hazine sofraya gelir. Balıkçılarımızın ağından çıkan, mevsim neyi fısıldıyorsa o olan en taze balıklar, usta ellerde, adeta bir sanat eserine dönüşür. Fazla söze, karmaşık soslara gerek yoktur. Sadece zeytinyağı, bir tutam tuz ve kor haline gelmiş kömür ateşinin bilgeliği... Ateşin üzerinde duyulan o tatlı cızırtı ve havaya yayılan o isli koku, yaklaşan lezzetin en güzel habercisidir. Amaç, balığın denizden getirdiği o saf, iyotlu tadı maskelemek değil, tam aksine tüm görkemiyle ortaya çıkarmaktır.",
        fahri_baba_title: "Fahri Baba",
        fahri_baba_p: "Fahri Baba, sadece bir işletme sahibi değil, o sofra kültürünün yaşayan bilge çınarıdır. Beyaz önlüğüyle misafirlerinin arasında dolaşırken, onun varlığı mekana sadece bir tecrbe değil, aynı zamanda bir ruh katar. Burası, duvarlarına denizin tuzu, teknelerin uğultusu ve nesillerin anılarının sindiği, babadan oğula geçen kıymetli bir emanettir. Sofranız, Urla' nın o tatlı esintisine ve iyot kokusuna karşı kurulur. Önünüze gelen her meze, yılların tecrübesiyle yoğrulmuş bir reçetenin eseridir. Girit ezmesi daha bir ferah, deniz börülcesi daha bir canlıdır burada. Usta ellerden çıkan ahtapot ızgaranın yumuşaklığı ya da o meşhur balık kokoreçin damakta bıraktığı iz, \"Fahri Baba klasiği\" dedirten imzalardır.",
        caption1: "“Rakı aceleye gelmez evlat.”",
        caption2: "“Önce meze, sonra laf...”",
        caption3: "“Sayfiye's Special Coctails”",
        caption4: "“Muhabbete aç gel...”",
        caption5: "“Denizin sesi mükemmel...”",
        quote2: "“Sayfiye’de masalar sadece yemeklerle değil, anılarla da doluyor.”",
        order_title: "Rezervasyon",
        order_p1: "Telefonla: <strong>+90 (232) 768 41 41</strong><br />WhatsApp için sağ alttaki “İletişim!” butonuna tıkla.",
        order_p2: "Hafta içi 17:00–23:30 • Hafta sonu 16:00–01:00",
        ph_name: "Ad Soyad",
        ph_phone: "Telefon",
        ph_date: "Tarih",
        ph_time: "Saat",
        ph_people: "Kişi sayısı",
        btn_send: "GÖNDER",
        faq_title: "Sıkça Sorulan Sorular",
        q1: "Otopark var mı?",
        a1: "-Evet, akşam saatlerinde ücretsiz otopark alanı bulunur. Dolulukta vale yardımcı olur.",
        q2: "Vejetaryen/vegan seçenekler mevcut mu?",
        a2: "-Zeytinyağlılar ve salatalar yanında günlük vegan/vejetaryen alternatiflerimiz var.",
        q3: "Canlı müzik hangi günler?",
        a3: "-Cuma ve Cumartesi geceleri. Özel günlerde Instagram’dan duyuruyoruz.",
        contact_title: "ILETISIM",
        contact_phone: "Telefon",
        contact_email: "E-posta"
    }
  };
  const getStoredLang = () => localStorage.getItem('lang') || 'tr';
  let currentLang = getStoredLang();

  function applyLang(lang){
    currentLang = (lang === 'en' ? 'en' : 'tr');
    localStorage.setItem('lang', currentLang);
    document.documentElement.lang = currentLang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if(i18n[currentLang] && i18n[currentLang][key]) el.innerHTML = i18n[currentLang][key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if(i18n[currentLang] && i18n[currentLang][key]) el.placeholder = i18n[currentLang][key];
    });
    langButtons.forEach(b => b.classList.toggle('active', b.dataset.lang === currentLang));
  }
  langButtons.forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
  applyLang(currentLang);

  // ===== Form =====
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

  // ===== Motion Bits =====
  if (!prefersReducedMotion) {
    
    // Otomatik Hero Slider Fonksiyonu
    const heroSlider = () => {
        const slider = document.querySelector('.bg-slider');
        if (!slider) return;
        
        const slides = slider.querySelectorAll('.slide');
        if (slides.length < 2) return; // If only 1 slide, do nothing
        
        let currentIndex = 0;
        
        setInterval(() => {
            slides[currentIndex].classList.remove('is-active');
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add('is-active');
        }, 5000); // 5 saniyede bir değişir
    };
    heroSlider();


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
        raf = requestAnimationFrame(()=> {
          card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
        });
      };
      const reset = () => { card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)'; };
      card.addEventListener('mousemove', onMove, { passive: true });
      card.addEventListener('mouseleave', reset);
    });

    // Polaroid Scroll Stack
    const scrollyStackModule = () => {
      const section = document.getElementById('scrolly-stack');
      if (!section) return;
      const cards = Array.from(section.querySelectorAll('.polaroid'));
      const numCards = cards.length;
      if (numCards === 0) return;
      section.style.height = `${numCards * 100}vh`;

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
              const a = Math.max(0, Math.min(1, (local - 0.2) / 0.6));
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
    
    // UPDATED: Scrolly Menu Module
    const scrollyMenuModule = () => {
        const section = document.getElementById('menu-ring');
        if (!section) return;
        
        const wrap = section.querySelector('.ring-wrap');
        const plates = Array.from(section.querySelectorAll('.dish-plate'));

        if (!wrap || plates.length === 0) return;

        // --- DYNAMICALLY SET STYLES FOR PINNING ---
        section.style.height = `${plates.length * 100}vh`;
        section.style.padding = '0'; 

        wrap.style.height = '100vh';
        wrap.style.position = 'sticky';
        wrap.style.top = '0';
        // --- END OF DYNAMIC STYLES ---

        const onScroll = () => {
            const rect = section.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            
            const scrollInParent = -rect.top;
            const sectionHeight = rect.height;
            const viewHeight = window.innerHeight;
            
            const progress = Math.max(0, Math.min(1, scrollInParent / (sectionHeight - viewHeight)));
            
            const activeIndex = Math.min(plates.length - 1, Math.floor(progress * plates.length));

            plates.forEach((plate, i) => {
                plate.classList.toggle('is-active', i === activeIndex);
            });
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); 
    };
    scrollyMenuModule();


    // Görseli videoya çevir
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
  }
})(); // IIFE END