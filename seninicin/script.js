/* ══════════════════════════════════════════
   SENİN İÇİN — Script
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── IntersectionObserver: Reveal Animations ─── */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 120);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));


  /* ═══════════════════════════════════════════════
     BÖLÜM 1: Papatya Açılış Animasyonu
     ═══════════════════════════════════════════════ */

  const daisyBud = document.getElementById('daisyBud');
  const bouquetWrapper = document.getElementById('bouquetWrapper');
  const heroCta = document.getElementById('heroCta');
  const heroMessage = document.getElementById('heroMessage');
  const petalCanvas = document.getElementById('petalCanvas');
  let bloomed = false;

  function bloomDaisy() {
    if (bloomed) return;
    bloomed = true;

    // Tomurcuğu gizle
    daisyBud.classList.add('hidden');

    // Buketi göster
    setTimeout(() => {
      bouquetWrapper.classList.add('bloomed');
    }, 300);

    // Butonu gizle
    heroCta.classList.add('hidden');

    // Mesajı göster
    setTimeout(() => {
      heroMessage.classList.add('visible');
    }, 800);

    // Yaprak yağmuru başlat
    setTimeout(() => {
      startPetalRain();
    }, 600);
  }

  daisyBud.addEventListener('click', bloomDaisy);
  daisyBud.addEventListener('touchend', (e) => { e.preventDefault(); bloomDaisy(); });
  heroCta.addEventListener('click', bloomDaisy);


  /* ─── Yaprak Yağmuru (Canvas) ─── */

  function startPetalRain() {
    const canvas = petalCanvas;
    const ctx = canvas.getContext('2d');
    canvas.classList.add('active');

    let petals = [];
    let animId;
    let running = true;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * -canvas.height : -20;
        this.size = Math.random() * 8 + 5;
        this.speedY = Math.random() * 0.8 + 0.3;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.y += this.speedY;
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * 0.3;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas.height + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        // Yaprak şekli
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.35, this.size * 0.75, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF8F0';
        ctx.fill();

        ctx.restore();
      }
    }

    // İlk yapraklar
    const petalCount = Math.min(25, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < petalCount; i++) {
      petals.push(new Petal());
    }

    function animate() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach(p => {
        p.update();
        p.draw();
      });
      animId = requestAnimationFrame(animate);
    }
    animate();

    // 15 saniye sonra yavaşça durdur
    setTimeout(() => {
      canvas.style.transition = 'opacity 3s ease';
      canvas.style.opacity = '0';
      setTimeout(() => {
        running = false;
        cancelAnimationFrame(animId);
      }, 3000);
    }, 15000);
  }


  /* ═══════════════════════════════════════════════
     BÖLÜM 2: Zarf Açma Animasyonu
     ═══════════════════════════════════════════════ */

  const envelope = document.getElementById('envelope');
  let envelopeOpened = false;

  envelope.addEventListener('click', () => {
    if (envelopeOpened) return;
    envelopeOpened = true;
    envelope.classList.add('opened');
  });

  envelope.addEventListener('touchend', (e) => {
    if (envelopeOpened) return;
    e.preventDefault();
    envelopeOpened = true;
    envelope.classList.add('opened');
  });


  /* ═══════════════════════════════════════════════
     BÖLÜM 3: Etkileşimli Kartlar
     ═══════════════════════════════════════════════ */

  const cards = document.querySelectorAll('.care-card');
  const cardResponse = document.getElementById('cardResponse');
  const responseText = document.getElementById('responseText');
  let activeCard = null;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Aktif kartı kaldır
      if (activeCard) {
        activeCard.classList.remove('active');
      }

      // Aynı karta tekrar tıklandıysa kapat
      if (activeCard === card) {
        activeCard = null;
        cardResponse.classList.remove('show');
        return;
      }

      // Yeni kartı aktif et
      card.classList.add('active');
      activeCard = card;

      const message = card.getAttribute('data-message');
      responseText.textContent = message;
      cardResponse.classList.add('show');
    });
  });


  /* ═══════════════════════════════════════════════
     BÖLÜM 4: Kalp Animasyonu (SVG Path Üzerinde)
     ═══════════════════════════════════════════════ */

  const travelingHeart = document.getElementById('travelingHeart');
  const roadPath = document.getElementById('roadPath');

  if (roadPath && travelingHeart) {
    function animateHeart() {
      const pathLength = roadPath.getTotalLength();
      let progress = 0;
      const duration = 4000; // ms
      let startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        progress = (elapsed % duration) / duration;

        // Ease-in-out
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const point = roadPath.getPointAtLength(eased * pathLength);

        // SVG container'ın boyutuna göre ölçekle
        const svgRect = roadPath.closest('svg').getBoundingClientRect();
        const scaleX = svgRect.width / 300;
        const scaleY = svgRect.height / 60;

        travelingHeart.style.left = (point.x * scaleX - 10) + 'px';
        travelingHeart.style.top = (point.y * scaleY - 10) + 'px';
        travelingHeart.style.opacity = 0.6 + Math.sin(progress * Math.PI) * 0.4;

        requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }

    // Sadece bölüm görünürken başlat
    const distanceSection = document.getElementById('distance-section');
    const heartObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateHeart();
          heartObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    heartObserver.observe(distanceSection);
  }

});
