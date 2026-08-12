/* 
   Gaurav Jha Fitness Gym - Main Script
   Vanilla JavaScript for Interactions
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. Hero Slider ---
    const heroSlides = document.querySelectorAll('.hero-slides .slide');
    if (heroSlides.length > 0) {
        let currentHeroSlide = 0;
        setInterval(() => {
            heroSlides[currentHeroSlide].classList.remove('active');
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            heroSlides[currentHeroSlide].classList.add('active');
        }, 5000);
    }
    
    // --- 1. Mobile Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- 2. Sticky Navbar & Back to Top Button ---
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            backToTopBtn.style.display = 'block';
        } else {
            navbar.classList.remove('scrolled');
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- 3. Active Navigation Link on Scroll ---
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- 4. Scroll Reveal Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 5. Number Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    const statsSection = document.querySelector('.stats-container');
    
    if(statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                startCounters();
                hasCounted = true;
            }
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // --- 6. Pricing Plan Modal ---
    const modal = document.getElementById('enquiryModal');
    const closeBtns = document.querySelectorAll('.close-modal');
    const choosePlanBtns = document.querySelectorAll('.choose-plan-btn');
    const enqPlanSelect = document.getElementById('enqPlan');

    choosePlanBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const plan = e.target.getAttribute('data-plan');
            enqPlanSelect.value = plan;
            modal.style.display = 'flex';
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // --- 7. Lightbox Gallery ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            showLightboxImage();
            lightbox.style.display = 'flex';
        });
    });

    const showLightboxImage = () => {
        lightboxImg.src = galleryItems[currentImageIndex].src;
    };

    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    lightboxPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        showLightboxImage();
    });

    lightboxNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        showLightboxImage();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

    // --- 8. Testimonials Carousel ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };

    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    };

    const startCarousel = () => {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    };

    const resetCarousel = () => {
        clearInterval(slideInterval);
        startCarousel();
    };

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetCarousel();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetCarousel();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            resetCarousel();
        });
    });

    startCarousel();

    // --- 9. BMI Calculator ---
    const bmiForm = document.getElementById('bmiForm');
    const bmiResult = document.getElementById('bmiResult');
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');

    bmiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const heightCm = parseFloat(document.getElementById('bmiHeight').value);
        const weightKg = parseFloat(document.getElementById('bmiWeight').value);
        
        if (heightCm > 0 && weightKg > 0) {
            const heightM = heightCm / 100;
            const bmi = weightKg / (heightM * heightM);
            const formattedBmi = bmi.toFixed(1);
            
            bmiValue.innerText = formattedBmi;
            
            let category = '';
            let color = '';
            
            if (bmi < 18.5) {
                category = 'Underweight';
                color = '#ffc107'; // Yellow
            } else if (bmi >= 18.5 && bmi < 24.9) {
                category = 'Normal Weight';
                color = '#28a745'; // Green
            } else if (bmi >= 25 && bmi < 29.9) {
                category = 'Overweight';
                color = '#fd7e14'; // Orange
            } else {
                category = 'Obese';
                color = '#dc3545'; // Red
            }
            
            bmiCategory.innerText = category;
            bmiCategory.style.color = color;
            bmiResult.classList.remove('hidden');
        }
    });

    // --- 10. Form Validation & Toast Notifications ---
    const showToast = (message, type = 'success') => {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';
        
        toast.innerHTML = `${icon} <span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        // Remove toast after animation finishes (3s total)
        setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    const enquiryForm = document.getElementById('enquiryForm');
    const contactForm = document.getElementById('contactForm');

    if(enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('enqName').value.trim();
            const phone = document.getElementById('enqPhone').value.trim();
            
            if (name === '' || phone === '') {
                showToast('Please fill all required fields.', 'error');
                return;
            }
            
            // Simulate form submission
            setTimeout(() => {
                showToast(`Thank you ${name}! Your enquiry has been submitted successfully.`);
                enquiryForm.reset();
                modal.style.display = 'none';
            }, 500);
        });
    }

    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            
            if (name === '' || email === '') {
                showToast('Please fill all required fields.', 'error');
                return;
            }
            
            // Simulate form submission
            setTimeout(() => {
                showToast(`Thank you ${name}! We will get back to you shortly.`);
                contactForm.reset();
            }, 500);
        });
    }
});
