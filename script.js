const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
const backToTop = document.querySelector('.back-to-top');
const heroSlides = [...document.querySelectorAll('.hero-slide')];

const syncHeader = () => {
  header.classList.toggle('scrolled', scrollY > 80);
  backToTop?.classList.toggle('visible', scrollY > 420);
};

syncHeader();
addEventListener('scroll', syncHeader, { passive: true });

toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  header.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
});

links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  links.classList.remove('open');
  header.classList.remove('menu-open');
  toggle.setAttribute('aria-expanded', 'false');
}));

backToTop?.addEventListener('click', event => {
  event.preventDefault();
  scrollTo({ top: 0, behavior: 'smooth' });
});

const revealGroups = [
  '.booking-card',
  '.about-copy, .about-visual',
  '.about-highlights > div',
  '.section-top > *',
  '.room',
  '.amenity-wrap > :first-child',
  '.amenity-list > div',
  '.story-images, .story-copy',
  '.location-copy, .location-map-wrapper',
  '.dining-content',
  '.footer-main > *',
  '.footer-bottom'
];

const revealItems = [];
revealGroups.forEach(selector => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((item, index) => {
    item.classList.add('reveal');
    item.style.setProperty('--reveal-delay', `${(index % 4) * 110}ms`);
    revealItems.push(item);
  });
});

const revealVisible = item => item.classList.add('is-visible');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (heroSlides.length > 1 && !reducedMotion) {
  let currentHeroSlide = 0;
  let autoPlayTimer;

  const goToSlide = (direction) => {
    const outgoing = heroSlides[currentHeroSlide];

    if (direction === 'next') {
      currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
    } else {
      currentHeroSlide = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
    }

    const incoming = heroSlides[currentHeroSlide];

    outgoing.classList.remove('active');
    outgoing.classList.add('exit-left');
    incoming.classList.add('active');

    setTimeout(() => {
      outgoing.classList.remove('exit-left');
    }, 900);
  };

  const startAutoPlay = () => {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => goToSlide('next'), 5600);
  };

  const prevBtn = document.querySelector('.hero-arrow-prev');
  const nextBtn = document.querySelector('.hero-arrow-next');

  prevBtn?.addEventListener('click', () => {
    goToSlide('prev');
    startAutoPlay();
  });

  nextBtn?.addEventListener('click', () => {
    goToSlide('next');
    startAutoPlay();
  });

  const heroSection = document.querySelector('.hero');
  let touchStartX = 0;
  let touchEndX = 0;

  heroSection?.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  heroSection?.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeDist = touchEndX - touchStartX;
    if (Math.abs(swipeDist) > 40) {
      if (swipeDist < 0) {
        goToSlide('next');
      } else {
        goToSlide('prev');
      }
      startAutoPlay();
    }
  }, { passive: true });

  startAutoPlay();
}

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach(revealVisible);
} else {
  const isMobile = window.innerWidth <= 767;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      revealVisible(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: isMobile ? 0.08 : 0.12,
    rootMargin: isMobile ? '0px 0px -20px' : '0px 0px -30px'
  });

  revealItems.forEach(item => observer.observe(item));
}

// --- Photo Gallery Modal Lightbox ---
const galleryModal = document.getElementById('galleryModal');
const openGalleryBtn = document.getElementById('openGalleryBtn');
const closeGalleryBtn = document.getElementById('closeGalleryBtn');
const galleryBackdrop = document.getElementById('galleryBackdrop');
const galleryPrevBtn = document.getElementById('galleryPrevBtn');
const galleryNextBtn = document.getElementById('galleryNextBtn');
const galleryStageImg = document.getElementById('galleryStageImg');
const galleryStageCaption = document.getElementById('galleryStageCaption');
const galleryPhotoTitle = document.getElementById('galleryPhotoTitle');
const galleryCurrentIdx = document.getElementById('galleryCurrentIdx');
const galleryTotalCount = document.getElementById('galleryTotalCount');
const galleryThumbnails = document.getElementById('galleryThumbnails');
const storyPhotos = document.querySelectorAll('.story-photo');

const galleryItems = [
  {
    src: 'pictures/reception_clean.webp',
    title: 'Grand Reception & Lobby',
    caption: 'Polished front desk and welcoming arrival reception prepared for swift, calm check-ins.'
  },
  {
    src: 'pictures/building_clean.webp',
    title: 'TPM Residency Facade',
    caption: 'Prime architectural hotel address located in Pazhayangadi, Kondotty.'
  },
  {
    src: 'assets/tpm-hero-room.jpg',
    title: 'Executive Suite Bedroom',
    caption: 'Thoughtfully composed rooms designed for restful nights and modern convenience.'
  },
  {
    src: 'assets/tpm-room-suite.png',
    title: 'Deluxe Suite Living Space',
    caption: 'Spacious, contemporary interiors tailored for leisure and business stays.'
  },
  {
    src: 'assets/tpm-dining-lounge.png',
    title: 'Rooftop Dining & Lounge',
    caption: 'Warm, welcoming atmosphere prepared for morning coffee, breakfasts and evening dinners.'
  },
  {
    src: 'assets/tpm-hero-arrival.png',
    title: 'Arrival & Evening Ambiance',
    caption: 'Warm exterior lighting and smooth arrival driveway for incoming guests.'
  }
];

if (galleryModal && openGalleryBtn) {
  let currentGalleryIndex = 0;

  if (galleryTotalCount) {
    galleryTotalCount.textContent = String(galleryItems.length);
  }

  // Populate thumbnails
  if (galleryThumbnails) {
    galleryThumbnails.innerHTML = galleryItems.map((item, idx) => `
      <button class="gallery-thumb ${idx === 0 ? 'active' : ''}" type="button" data-index="${idx}" aria-label="View ${item.title}">
        <img src="${item.src}" alt="${item.title}" loading="lazy">
      </button>
    `).join('');

    galleryThumbnails.addEventListener('click', e => {
      const thumbBtn = e.target.closest('.gallery-thumb');
      if (!thumbBtn) return;
      const idx = parseInt(thumbBtn.dataset.index, 10);
      if (!isNaN(idx)) showGalleryItem(idx);
    });
  }

  const showGalleryItem = (idx) => {
    currentGalleryIndex = (idx + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentGalleryIndex];

    if (galleryStageImg) {
      galleryStageImg.classList.add('is-loading');
      galleryStageImg.src = item.src;
      galleryStageImg.alt = item.title;
      galleryStageImg.onload = () => galleryStageImg.classList.remove('is-loading');
    }

    if (galleryPhotoTitle) galleryPhotoTitle.textContent = item.title;
    if (galleryStageCaption) galleryStageCaption.textContent = item.caption;
    if (galleryCurrentIdx) galleryCurrentIdx.textContent = String(currentGalleryIndex + 1);

    // Update active thumbnail
    galleryThumbnails?.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
      const isActive = i === currentGalleryIndex;
      thumb.classList.toggle('active', isActive);
      if (isActive) {
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  };

  const openGallery = (startIndex = 0) => {
    showGalleryItem(startIndex);
    galleryModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    galleryModal.focus();
  };

  const closeGallery = () => {
    galleryModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  };

  openGalleryBtn.addEventListener('click', () => openGallery(0));
  storyPhotos.forEach((photo, i) => {
    photo.addEventListener('click', () => openGallery(i % galleryItems.length));
    photo.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGallery(i % galleryItems.length);
      }
    });
  });

  closeGalleryBtn?.addEventListener('click', closeGallery);
  galleryBackdrop?.addEventListener('click', closeGallery);

  galleryPrevBtn?.addEventListener('click', () => showGalleryItem(currentGalleryIndex - 1));
  galleryNextBtn?.addEventListener('click', () => showGalleryItem(currentGalleryIndex + 1));

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (galleryModal.hasAttribute('hidden')) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') showGalleryItem(currentGalleryIndex - 1);
    if (e.key === 'ArrowRight') showGalleryItem(currentGalleryIndex + 1);
  });

  // Touch swipe support for gallery modal
  let galleryTouchStartX = 0;
  let galleryTouchEndX = 0;
  galleryModal.addEventListener('touchstart', e => {
    galleryTouchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  galleryModal.addEventListener('touchend', e => {
    galleryTouchEndX = e.changedTouches[0].screenX;
    const swipeDist = galleryTouchEndX - galleryTouchStartX;
    if (Math.abs(swipeDist) > 40) {
      if (swipeDist < 0) {
        showGalleryItem(currentGalleryIndex + 1);
      } else {
        showGalleryItem(currentGalleryIndex - 1);
      }
    }
  }, { passive: true });
}
