const hamburger = document.getElementById("hamburger");
    const menubar = document.querySelector(".menubar");

    hamburger.addEventListener("click", () => {
      const isActive = menubar.classList.toggle("active");
      hamburger.classList.toggle("active");

      // Update ARIA attribute
      hamburger.setAttribute("aria-expanded", isActive);

      // Prevent scrolling when menu is open
      if (isActive) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });

    // Close menu when clicking on overlay
    menubar.addEventListener("click", (e) => {
      if (e.target === menubar || e.target.closest("a")) {
        menubar.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });

    // Close menu when pressing Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menubar.classList.contains("active")) {
        menubar.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });


const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxCounter = document.getElementById('lightbox-counter');
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        
        let currentIndex = 0;
        const images = [];

        // Gather all images data
        galleryItems.forEach((item, idx) => {
            const img = item.querySelector('img');
            const title = item.querySelector('h3')?.textContent || '';
            const desc = item.querySelector('p')?.textContent || '';
            
            images.push({
                src: img.src,
                alt: img.alt,
                title: title,
                description: desc
            });

            item.addEventListener('click', () => {
                openLightbox(idx);
            });
        });

        function openLightbox(index) {
            currentIndex = index;
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function updateLightbox() {
            const img = images[currentIndex];
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.innerHTML = `<strong>${img.title}</strong><br>${img.description}`;
            lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightbox();
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightbox();
        }

        // Event listeners
        closeBtn.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);

        // Click outside to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        });