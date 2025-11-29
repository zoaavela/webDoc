(function(){
    // Variables diaporama
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const currentSlideSpan = document.querySelector('.current-slide');
    const totalSlidesSpan = document.querySelector('.total-slides');
    const totalSlides = slides.length;

    // Variables lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    if (totalSlidesSpan) {
        totalSlidesSpan.textContent = totalSlides;
    }

    function showSlide(n) {
        let newIndex = n;
        
        if (newIndex >= totalSlides) {
            newIndex = 0; 
        }
        if (newIndex < 0) {
            newIndex = totalSlides - 1; 
        }

        currentSlide = newIndex;

        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));

        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
        currentSlideSpan.textContent = currentSlide + 1;
    }

    // Ouvrir le lightbox
    function openLightbox(index) {
        const slide = slides[index];
        const img = slide.querySelector('img');
        const caption = slide.querySelector('.slide-caption');
        const title = caption.querySelector('h3').textContent;
        const description = caption.querySelector('p').textContent;

        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Fermer le lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Navigation lightbox
    function navigateLightbox(direction) {
        let newIndex = currentSlide + direction;
        if (newIndex >= totalSlides) newIndex = 0;
        if (newIndex < 0) newIndex = totalSlides - 1;
        
        showSlide(newIndex);
        openLightbox(newIndex);
    }

    // Initialisation
    showSlide(currentSlide);

    // Navigation diaporama
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));

    // Indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });

    // Clic sur image pour ouvrir lightbox
    slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        img.addEventListener('click', () => openLightbox(index));
    });

    // Fermer lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Navigation lightbox
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Navigation clavier
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        } else {
            if (e.key === 'ArrowLeft') showSlide(currentSlide - 1);
            if (e.key === 'ArrowRight') showSlide(currentSlide + 1);
        }
    });
})();