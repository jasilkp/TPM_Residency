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
  '.conference-card',
  '.conf-feat-item',
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
  // --- Reception (pictures/Reception) ---
  {
    src: 'pictures/Reception/photo_2026-10-21_13-28-22.webp',
    thumb: 'pictures/Reception/photo_2026-10-21_13-28-22_thumb.webp',
    title: 'Illuminated Reception & Front Desk',
    caption: 'Warm backlit honeycomb branding panel, marble counter and 24-hour guest assistance.',
    category: 'Reception'
  },
  {
    src: 'pictures/Reception/photo_2026-10-21_13-28-37.webp',
    thumb: 'pictures/Reception/photo_2026-10-21_13-28-37_thumb.webp',
    title: 'Reception Waiting Lounge',
    caption: 'Comfortable leather sectional sofa and welcoming reception seating area for guests.',
    category: 'Reception'
  },
  {
    src: 'pictures/Reception/photo_2026-10-21_13-29-55.webp',
    thumb: 'pictures/Reception/photo_2026-10-21_13-29-55_thumb.webp',
    title: 'Elevator Foyer & Reception Entrance',
    caption: 'Decorative wooden lattice pillars, glass entrance doors and modern guest elevator.',
    category: 'Reception'
  },

  // --- Others (pictures/Others) ---
  {
    src: 'pictures/Others/photo_2026-10-21_13-28-59.webp',
    thumb: 'pictures/Others/photo_2026-10-21_13-28-59_thumb.webp',
    title: 'Architectural Facade & Gold TPM Signage',
    caption: 'Distinguished exterior architecture with metallic gold TPM emblem overlooking the entrance.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-21_13-29-22.webp',
    thumb: 'pictures/Others/photo_2026-10-21_13-29-22_thumb.webp',
    title: 'Frosted Glass Branding & Foliage',
    caption: 'Custom etched TPM branding on glass partitions framed by lush indoor plants.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-21_13-29-26.webp',
    thumb: 'pictures/Others/photo_2026-10-21_13-29-26_thumb.webp',
    title: 'Main Glass Entrance & TPM Emblem',
    caption: 'Polished glass entrance doors welcoming guests into the bright, modern lobby.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-21_13-29-37.webp',
    thumb: 'pictures/Others/photo_2026-10-21_13-29-37_thumb.webp',
    title: 'TPM Residency Entrance & Pillars',
    caption: 'Grand two-story exterior entrance with structural pillars, signage, and paved portico.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-21_13-30-12.webp',
    thumb: 'pictures/Others/photo_2026-10-21_13-30-12_thumb.webp',
    title: 'Executive Lounge & Carved Ceiling',
    caption: 'Intricate geometric wooden ceiling, designer chandelier, and plush leather seating.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-21_13-30-20.webp',
    thumb: 'pictures/Others/photo_2026-10-21_13-30-20_thumb.webp',
    title: 'Guest Lounge & Chandelier',
    caption: 'Ambient lighting and tranquil sitting space for hotel guests and visitors.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-21_13-30-31.webp',
    thumb: 'pictures/Others/photo_2026-10-21_13-30-31_thumb.webp',
    title: 'Relaxed Sitting Area',
    caption: 'Refined interior design with coffee tables, custom curtains, and acoustic ceiling detail.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-21_13-33-11.webp',
    thumb: 'pictures/Others/photo_2026-10-21_13-33-11_thumb.webp',
    title: 'Guest Room Corridor',
    caption: 'Bright, polished hallway with warm cove lighting and quiet access to guest rooms.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-21_13-33-23.webp',
    thumb: 'pictures/Others/photo_2026-10-21_13-33-23_thumb.webp',
    title: 'Staircase & Upper Foyer',
    caption: 'Stainless steel balustrades and open view overlooking the lobby lounge below.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-21_13-35-55.webp',
    thumb: 'pictures/Others/photo_2026-10-21_13-35-55_thumb.webp',
    title: 'Dusk Exterior & Illuminated Facade',
    caption: 'Warm architectural night lighting and glowing TPM signage in the evening ambiance.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-21_13-36-02.webp',
    thumb: 'pictures/Others/photo_2026-10-21_13-36-02_thumb.webp',
    title: 'Ground Floor Arcade & Parking',
    caption: 'Well-lit ground level commercial arcade, bake house, and guest parking facilities.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-21_13-36-10.webp',
    thumb: 'pictures/Others/photo_2026-10-21_13-36-10_thumb.webp',
    title: 'Daytime Hotel Facade & Portico',
    caption: 'Clean daytime view of TPM Residency entrance surrounded by landscaped greenery.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-21_13-36-41.webp',
    thumb: 'pictures/Others/photo_2026-10-21_13-36-41_thumb.webp',
    title: 'Night View & Rooftop Neon Signage',
    caption: 'Vibrant illuminated TPM Residency rooftop sign and ground floor commercial hub.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-21_13-38-02.webp',
    thumb: 'pictures/Others/photo_2026-10-21_13-38-02_thumb.webp',
    title: 'Suite Corridor & Warm Illumination',
    caption: 'Quiet, spotless corridors with recessed ceiling lights leading to private suites.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-21_13-38-10.webp',
    thumb: 'pictures/Others/photo_2026-10-21_13-38-10_thumb.webp',
    title: 'TPM Tower Glass Facade',
    caption: 'Modern multi-story blue glass exterior of TPM Tower under the evening sky.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-22_19-13-11.webp',
    thumb: 'pictures/Others/photo_2026-10-22_19-13-11_thumb.webp',
    title: 'Guest Elevator Lobby & Conference Entrance',
    caption: 'Modern guest elevator lobby, staircase, and glass entry leading into the conference hall.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-22_19-13-25.webp',
    thumb: 'pictures/Others/photo_2026-10-22_19-13-25_thumb.webp',
    title: 'Digital Elevator Call Panel',
    caption: 'Touch-sensitive digital elevator controls installed on polished marble wall finish.',
    category: 'Others'
  },
  {
    src: 'pictures/Others/photo_2026-10-21_12-30-24.webp',
    thumb: 'pictures/Others/photo_2026-10-21_12-30-24_thumb.webp',
    title: 'Illuminated Highway Pylon Signage',
    caption: 'Prominent nighttime highway pylon totem displaying TPM Residency room and conference facilities.',
    category: 'Others'
  }
];

if (galleryModal && openGalleryBtn) {
  let currentGalleryIndex = 0;
  let activeCategory = 'all';

  const getFilteredIndices = () => {
    if (activeCategory === 'all') {
      return galleryItems.map((_, i) => i);
    }
    return galleryItems
      .map((item, i) => (item.category === activeCategory ? i : -1))
      .filter(i => i !== -1);
  };

  const updateCategoryChips = () => {
    const chips = document.querySelectorAll('.gallery-chip');
    chips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.filter === activeCategory);
    });
  };

  const populateThumbnails = () => {
    if (!galleryThumbnails) return;
    const indices = getFilteredIndices();
    galleryThumbnails.innerHTML = indices.map(idx => {
      const item = galleryItems[idx];
      const isActive = idx === currentGalleryIndex;
      return `
        <button class="gallery-thumb ${isActive ? 'active' : ''}" type="button" data-index="${idx}" aria-label="View ${item.title}">
          <img src="${item.thumb || item.src}" alt="${item.title}" loading="lazy" width="80" height="60" decoding="async">
        </button>
      `;
    }).join('');
  };

  if (galleryThumbnails) {
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
    const filteredIndices = getFilteredIndices();

    // If current item is not in active category, revert category to 'all'
    if (!filteredIndices.includes(currentGalleryIndex)) {
      activeCategory = 'all';
      updateCategoryChips();
      populateThumbnails();
    }

    if (galleryStageImg) {
      galleryStageImg.classList.add('is-loading');
      galleryStageImg.src = item.src;
      galleryStageImg.alt = item.title;
      galleryStageImg.onload = () => galleryStageImg.classList.remove('is-loading');
    }

    const currentFiltered = getFilteredIndices();
    const currentPos = currentFiltered.indexOf(currentGalleryIndex);

    if (galleryPhotoTitle) galleryPhotoTitle.textContent = item.title;
    if (galleryStageCaption) galleryStageCaption.textContent = item.caption;
    if (galleryCurrentIdx) galleryCurrentIdx.textContent = String(currentPos >= 0 ? currentPos + 1 : currentGalleryIndex + 1);
    if (galleryTotalCount) galleryTotalCount.textContent = String(currentFiltered.length);

    // Update active thumbnail
    galleryThumbnails?.querySelectorAll('.gallery-thumb').forEach(thumb => {
      const thumbIdx = parseInt(thumb.dataset.index, 10);
      const isActive = thumbIdx === currentGalleryIndex;
      thumb.classList.toggle('active', isActive);
      if (isActive) {
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  };

  const navigateGallery = (direction) => {
    const indices = getFilteredIndices();
    if (!indices.length) return;
    let currentPos = indices.indexOf(currentGalleryIndex);
    if (currentPos === -1) currentPos = 0;
    const nextPos = (currentPos + direction + indices.length) % indices.length;
    showGalleryItem(indices[nextPos]);
  };

  // Category filter chips click handlers
  const categoryChips = document.querySelectorAll('.gallery-chip');
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      activeCategory = chip.dataset.filter || 'all';
      updateCategoryChips();
      populateThumbnails();
      const indices = getFilteredIndices();
      if (indices.length > 0) {
        if (!indices.includes(currentGalleryIndex)) {
          showGalleryItem(indices[0]);
        } else {
          showGalleryItem(currentGalleryIndex);
        }
      }
    });
  });

  const openGallery = (startIndex = 0) => {
    activeCategory = 'all';
    updateCategoryChips();
    populateThumbnails();
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
    const handleStoryClick = () => {
      const targetSrc = i === 0 ? 'pictures/Reception/photo_2026-10-21_13-28-22.jpg' : 'pictures/Others/photo_2026-10-21_13-28-59.jpg';
      const targetIndex = galleryItems.findIndex(it => it.src === targetSrc);
      openGallery(targetIndex >= 0 ? targetIndex : 0);
    };
    photo.addEventListener('click', handleStoryClick);
    photo.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleStoryClick();
      }
    });
  });

  // Toggle more rooms grid
  const toggleMoreRoomsBtn = document.getElementById('toggleMoreRoomsBtn');
  const moreRoomsGrid = document.getElementById('moreRoomsGrid');

  if (toggleMoreRoomsBtn && moreRoomsGrid) {
    toggleMoreRoomsBtn.addEventListener('click', () => {
      const isHidden = moreRoomsGrid.hasAttribute('hidden');
      if (isHidden) {
        moreRoomsGrid.removeAttribute('hidden');
        toggleMoreRoomsBtn.setAttribute('aria-expanded', 'true');
        const textSpan = toggleMoreRoomsBtn.querySelector('span');
        if (textSpan) textSpan.textContent = 'Show Fewer Photos';
        moreRoomsGrid.querySelectorAll('.room').forEach(el => el.classList.add('is-visible'));
      } else {
        moreRoomsGrid.setAttribute('hidden', '');
        toggleMoreRoomsBtn.setAttribute('aria-expanded', 'false');
        const textSpan = toggleMoreRoomsBtn.querySelector('span');
        if (textSpan) textSpan.textContent = 'Show More Photos';
        toggleMoreRoomsBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  closeGalleryBtn?.addEventListener('click', closeGallery);
  galleryBackdrop?.addEventListener('click', closeGallery);

  galleryPrevBtn?.addEventListener('click', () => navigateGallery(-1));
  galleryNextBtn?.addEventListener('click', () => navigateGallery(1));

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (galleryModal.hasAttribute('hidden')) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') navigateGallery(-1);
    if (e.key === 'ArrowRight') navigateGallery(1);
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
        navigateGallery(1);
      } else {
        navigateGallery(-1);
      }
    }
  }, { passive: true });
}

/* --- Automatically Suppress & Remove Netlify Injected Badges/Drawers --- */
(() => {
  const purgeNetlify = () => {
    const selectors = [
      '#nl-badge-frame',
      'iframe#nl-badge-frame',
      'iframe[src*="netlify"]',
      'iframe[id*="netlify"]',
      'iframe[id*="nl-badge"]',
      'netlify-drawer',
      'netlify-feedback',
      'netlify-badge',
      '#netlify-drawer',
      '.netlify-drawer',
      '#netlify-drawer-container',
      '[data-netlify-drawer]',
      '.netlify-badge',
      '.netlify-feedback-badge'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        try {
          el.remove();
        } catch (_) {
          el.style.display = 'none';
        }
      });
    });
  };

  purgeNetlify();
  if (document.readyState !== 'complete') {
    window.addEventListener('load', purgeNetlify, { once: true });
  }

  if (window.MutationObserver) {
    const observer = new MutationObserver(purgeNetlify);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 15000);
  }
})();
