document.addEventListener('DOMContentLoaded', () => {
  // =========================
  // MENÚ HAMBURGUESA Y NAVEGACIÓN
  // =========================
  const mobileBtn = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const section = document.querySelector(targetId);
      if (section) {
        window.scrollTo({ top: section.offsetTop - 80, behavior: 'smooth' });
      }
      document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active-nav'));
      link.classList.add('active-nav');
    });
  });

  function highlightSection() {
    const sections = document.querySelectorAll('section');
    let current = '';
    sections.forEach(sec => {
      if (pageYOffset >= sec.offsetTop - 100) {
        current = sec.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active-nav');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active-nav');
    });
  }
  window.addEventListener('scroll', highlightSection);
  highlightSection();

  // =========================
  // SVG CARITA ANIMADA
  // =========================
  const profileSvg = document.getElementById('profileSvg');
  if (profileSvg) {
    const leftEye = document.getElementById('leftEye');
    const rightEye = document.getElementById('rightEye');
    const faceOutline = document.getElementById('faceOutline');

    profileSvg.addEventListener('mousemove', e => {
      const rect = profileSvg.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * 200;
      const y = (e.clientY - rect.top) / rect.height * 200;
      leftEye.setAttribute('cx', 80 + (x - 80) * 0.05);
      leftEye.setAttribute('cy', 80 + (y - 80) * 0.05);
      rightEye.setAttribute('cx', 120 + (x - 120) * 0.05);
      rightEye.setAttribute('cy', 80 + (y - 80) * 0.05);
      faceOutline.setAttribute('d', `M60,100 Q100,${130 + (y - 100) * 0.2} 140,100`);
    });

    profileSvg.addEventListener('mouseleave', () => {
      leftEye.setAttribute('cx', '80');
      leftEye.setAttribute('cy', '80');
      rightEye.setAttribute('cx', '120');
      rightEye.setAttribute('cy', '80');
      faceOutline.setAttribute('d', 'M60,100 Q100,150 140,100');
    });
  }

  // =========================
  // CANVAS DIBUJO
  // =========================
  const canvas = document.getElementById('drawingCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    canvas.addEventListener('mousedown', e => { isDrawing = true; draw(e); });
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    function draw(e) {
      if (!isDrawing) return;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#E50914';
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (ctx.lastX && ctx.lastY) {
        ctx.beginPath();
        ctx.moveTo(ctx.lastX, ctx.lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      ctx.lastX = x;
      ctx.lastY = y;
    }

    document.getElementById('clearCanvas')?.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  // =========================
  // TOGGLE HABILIDADES
  // =========================
  const viewToggle = document.getElementById('viewToggle');
  const circularView = document.getElementById('circularView');
  const barView = document.getElementById('barView');

  viewToggle?.addEventListener('click', () => {
    if (!circularView || !barView) return;
    const isCircularHidden = circularView.classList.contains('hidden');
    circularView.classList.toggle('hidden', !isCircularHidden);
    barView.classList.toggle('hidden', isCircularHidden);
    viewToggle.textContent = isCircularHidden ? 'Cambiar a vista de barras' : 'Cambiar a vista circular';

    if (!isCircularHidden) {
      barView.innerHTML = '';
      document.querySelectorAll('.skill-item').forEach(item => {
        const title = item.querySelector('h3')?.textContent || '';
        const desc = item.querySelector('p')?.textContent || '';
        const val = parseInt(item.querySelector('text')?.textContent || '0');
        barView.innerHTML += `
          <div class="skill-bar-item p-6 rounded-lg hover:bg-gray-900 transition cursor-pointer">
            <h3 class="text-xl font-semibold mb-2">${title}</h3>
            <p class="text-gray-400 mb-4">${desc}</p>
            <div class="w-full bg-gray-800 rounded-full h-4">
              <div class="bg-red-accent h-4 rounded-full" style="width: ${val}%"></div>
            </div>
            <p class="text-right mt-2 text-gray-400">${val}%</p>
          </div>`;
      });
    } else {
      document.querySelectorAll('.skill-circle').forEach(circle => {
        const val = parseInt(circle.getAttribute('data-value'));
        const dash = 314 - (314 * val / 100);
        circle.style.setProperty('--dash-offset', dash);
      });
    }
  });

  // =========================
  // VER MÁS: DESPLIEGUE ANIMADO
  // =========================
  function toggleDetails(button) {
    const container = button.nextElementSibling;
    const isOpen = container.classList.contains('open');

    document.querySelectorAll('.details-container').forEach(el => {
      el.classList.remove('open');
      el.style.maxHeight = null;
    });

    if (!isOpen) {
      container.classList.add('open');
      container.style.maxHeight = container.scrollHeight + 'px';
    }
  }

  // Activar botones "Ver más"
  document.querySelectorAll('button[onclick="toggleDetails(this)"]').forEach(btn => {
    btn.addEventListener('click', function () {
      toggleDetails(this);
    });
  });
});
