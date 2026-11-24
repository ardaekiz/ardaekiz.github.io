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

  const tapCue = document.getElementById('tapCue');
  const bouquetWrapper = document.getElementById('bouquetWrapper');
  const heroMessage = document.getElementById('heroMessage');
  const petalCanvas = document.getElementById('petalCanvas');
  const hero = document.getElementById('hero');
  let bloomed = false;

  function bloomDaisy() {
    if (bloomed) return;
    bloomed = true;

    // Dokun ipucunu kaldır
    if (tapCue) {
      tapCue.classList.add('hidden');
    }

    // Buketi zarifçe aç
    setTimeout(() => {
      bouquetWrapper.classList.add('bloomed');
    }, 200);

    // Mesajı göster
    setTimeout(() => {
      heroMessage.classList.add('visible');
    }, 700);

    // Yağmuru başlat (papatya & mavi unutma beni yaprakları)
    setTimeout(() => {
      startPetalRain();
    }, 400);
  }

  if (tapCue) {
    tapCue.addEventListener('click', bloomDaisy);
    tapCue.addEventListener('touchend', (e) => { e.preventDefault(); bloomDaisy(); });
  }

  // İlk tıklamada ekranın herhangi bir yerine tıklansa da açılsın
  hero.addEventListener('click', (e) => {
    if (!bloomed) {
      bloomDaisy();
    }
  });


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
        this.y = initial ? Math.random() * -canvas.height : Math.random() * -80 - 10;
        this.size = Math.random() * 13 + 9;
        this.speedY = Math.random() * 1.2 + 0.6;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.03;
        this.opacity = Math.random() * 0.45 + 0.55;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.025 + 0.01;
        // Papatya ve Unutma Beni Çiçeği karışımı
        this.isBlueFlower = Math.random() < 0.35; // %35 mavi unutma beni çiçeği
        this.petalCount = this.isBlueFlower ? 5 : (Math.floor(Math.random() * 4) + 6);
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

        const r = this.size * 0.5;

        if (this.isBlueFlower) {
          // 5 yapraklı mavi unutma beni çiçeği (Forget-me-not)
          const pLen = r * 1.2;
          for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i;
            ctx.save();
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.arc(0, -pLen * 0.55, pLen * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = '#6EA8FE';
            ctx.fill();
            ctx.restore();
          }
          // Sarı ve beyaz merkez
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2);
          ctx.fillStyle = '#FFE066';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.12, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        } else {
          // Beyaz papatya çiçeği
          const petalLen = r * 1.5;
          const petalW = r * 0.42;

          for (let i = 0; i < this.petalCount; i++) {
            const angle = (Math.PI * 2 / this.petalCount) * i;
            ctx.save();
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.ellipse(0, -petalLen * 0.7, petalW, petalLen * 0.5, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFDF8';
            ctx.fill();
            ctx.strokeStyle = 'rgba(232, 153, 141, 0.35)';
            ctx.lineWidth = 0.6;
            ctx.stroke();
            ctx.restore();
          }

          // Sarı merkez
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = '#F4C95D';
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Yoğun papatya yağmuru
    const petalCount = Math.min(70, Math.floor(window.innerWidth / 6));
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

    // 25 saniye sonra yavaşça durdur
    setTimeout(() => {
      canvas.style.transition = 'opacity 4s ease';
      canvas.style.opacity = '0';
      setTimeout(() => {
        running = false;
        cancelAnimationFrame(animId);
      }, 4000);
    }, 25000);
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
     BÖLÜM 3: Mesafe & Karakter Buluşma Animasyonu
     ═══════════════════════════════════════════════ */

  const journeyPath = document.getElementById('journeyPath');
  const pathRunnerHeart = document.getElementById('pathRunnerHeart');
  const boyChar = document.getElementById('boyChar');
  const girlChar = document.getElementById('girlChar');
  const stationLeft = document.getElementById('stationLeft');
  const stationRight = document.getElementById('stationRight');
  const comeToYouBtn = document.getElementById('comeToYouBtn');
  const hugMessageBox = document.getElementById('hugMessageBox');
  const distanceStage = document.getElementById('distanceStage');
  const roadTrack = document.getElementById('roadTrack');

  let journeyCompleted = false;
  let journeyStarted = false;

  // Normal durumda yolda süzülen minik kalp döngüsü
  if (journeyPath && pathRunnerHeart) {
    const pLength = journeyPath.getTotalLength();
    let heartProg = 0;
    function loopHeart() {
      if (journeyStarted) return;
      heartProg = (heartProg + 0.004) % 1;
      const pt = journeyPath.getPointAtLength(heartProg * pLength);
      const trackRect = roadTrack.getBoundingClientRect();
      const sX = trackRect.width / 320;
      const sY = trackRect.height / 70;
      pathRunnerHeart.style.left = (pt.x * sX) + 'px';
      pathRunnerHeart.style.top = (pt.y * sY) + 'px';
      requestAnimationFrame(loopHeart);
    }
    requestAnimationFrame(loopHeart);
  }

  // Erkek karakter kapsayıcısının kavisli yol boyunca kız karakter kapsayıcısının yanına gitmesi
  function startJourneyToHer() {
    if (journeyStarted || journeyCompleted) return;
    journeyStarted = true;

    if (comeToYouBtn) {
      comeToYouBtn.classList.add('completed');
    }
    if (pathRunnerHeart) {
      pathRunnerHeart.style.display = 'none';
    }

    // Başlangıç ve bitiş koordinatları (Tek position: relative kapsayıcı bütün olarak hareket eder)
    const stageRect = distanceStage.getBoundingClientRect();
    const boyRect = boyChar.getBoundingClientRect();
    const girlRect = girlChar.getBoundingClientRect();

    boyChar.style.position = 'absolute';
    boyChar.style.zIndex = '25';
    boyChar.style.transition = 'none';

    const startX = boyRect.left - stageRect.left;
    // Dikey ekseni doğrudan kız karakterin seviyesine sabitle (alt satıra düşmeyi kesin engeller)
    const exactY = girlRect.top - stageRect.top;
    const startY = exactY;
    const targetY = exactY;

    // Kızın hemen sol yanında omuz omuza durma mesafesi (kesinlikle alta kaymaz)
    const targetX = (girlRect.left - stageRect.left) - 40;

    const duration = 2800; // ms
    let startTime = null;

    function stepJourney(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Yumuşak hızlanma-yavaşlama
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // X ekseni boyunca doğrusal ilerleme
      const currentX = startX + (targetX - startX) * eased;

      // Kavisli yol boyunca hafif yay hareketi + adımlama (bitişte tam 0'a iner, kızın seviyesine kilitlenir)
      const archY = Math.sin(progress * Math.PI) * -14;
      const walkStep = Math.sin(progress * Math.PI * 14) * 2.5 * (1 - progress * 0.5);
      const currentY = exactY + archY + walkStep;

      boyChar.style.left = currentX + 'px';
      boyChar.style.top = currentY + 'px';

      // Yürürken tüm kapsayıcı hafifçe tatlı salınır
      const walkTilt = Math.sin(progress * Math.PI * 14) * 2.5 * (1 - progress);
      boyChar.style.transform = `rotate(${walkTilt}deg)`;

      if (progress < 1) {
        requestAnimationFrame(stepJourney);
      } else {
        // Hedefe ulaşıldı: Tam kızın yatay seviyesine ve omuz omuza kilitlen
        boyChar.style.top = exactY + 'px';
        completeHug();
      }
    }

    requestAnimationFrame(stepJourney);
  }

  function completeHug() {
    journeyCompleted = true;

    // Kapsayıcıları birbirine tatlı bir açıyla sarılma eğimine geçir
    boyChar.classList.add('hugged-boy');
    girlChar.classList.add('hugged-girl');

    if (roadTrack) {
      roadTrack.style.opacity = '0.2';
      roadTrack.style.transition = 'opacity 0.8s';
    }

    // Mesaj ve uçuşan kalpleri göster
    setTimeout(() => {
      hugMessageBox.classList.add('show');
    }, 250);
  }

  // Butona tıklama
  if (comeToYouBtn) {
    comeToYouBtn.addEventListener('click', startJourneyToHer);
  }

  // Bölüme kaydırıldığında da otomatik başlat
  const distSec = document.getElementById('distance-section');
  if (distSec) {
    const distObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !journeyStarted) {
          setTimeout(() => {
            if (!journeyStarted) {
              startJourneyToHer();
            }
          }, 800);
          distObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.45 });

    distObs.observe(distSec);
  }

});
