const carouselTrack = document.querySelector('.carousel-track');
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const dots = Array.from(document.querySelectorAll('.dot'));
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

let currentIndex = 0;
const slideWidth = slides[0].offsetWidth;

function updateCarousel(index) {
    const offset = -index * slideWidth;
    carouselTrack.style.transform = `translateX(${offset}px)`;

    // Update dots
    dots.forEach((dot, idx) => {
        dot.classList.remove('bg-gray-300', 'bg-white');
        if (idx === index) {
            dot.classList.add('bg-white');
        } else {
            dot.classList.add('bg-gray-500');
        }
    });
}

// Move to the next slide
function goToNextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel(currentIndex);
}

// Move to the previous slide
function goToPrevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel(currentIndex);
}

// Add event listeners for dots
dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
        currentIndex = idx;
        updateCarousel(currentIndex);
    });
});

// Add event listeners for arrows
nextButton.addEventListener('click', goToNextSlide);
prevButton.addEventListener('click', goToPrevSlide);

// Auto-slide every 6 seconds
setInterval(goToNextSlide, 4000);

// Update slide width on resize
window.addEventListener('resize', () => {
    const newSlideWidth = slides[0].offsetWidth;
    carouselTrack.style.transform = `translateX(${-(currentIndex * newSlideWidth)}px)`;
});

// Intersection Observer options
const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// Callback function for Intersection Observer
const handleIntersect = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
        }
    });
};

// Create an Intersection Observer
const observer = new IntersectionObserver(handleIntersect, options);

// Select all elements with the 'animate-on-scroll' class
const animateElements = document.querySelectorAll('.animate-on-scroll');

// Observe each element
animateElements.forEach(element => {
    observer.observe(element);
});

// Add staggered animation to product cards
const productCards = document.querySelectorAll('.product-card');
productCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 100}ms`;
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// Category item 
document.addEventListener('DOMContentLoaded', () => {
    const categoryItems = document.querySelectorAll('.category-item');
    const colors = ['blue', 'green', 'purple', 'red', 'yellow', 'indigo', 'pink'];

    categoryItems.forEach(item => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const iconWrapper = item.querySelector('.icon-wrapper');
        const textSpan = item.querySelector('span');

        iconWrapper.classList.remove('group-hover:bg-blue-100', 'group-hover:bg-green-100', 'group-hover:bg-purple-100');
        iconWrapper.classList.add(`group-hover:bg-${randomColor}-100`);

        textSpan.classList.remove('group-hover:text-blue-600', 'group-hover:text-green-600', 'group-hover:text-purple-600');
        textSpan.classList.add(`group-hover:text-${randomColor}-600`);
    });
});

// Countdown timer
function startCountdown(targetDate) {
    const countdownTimer = document.querySelector('.countdown-timer');
    const daysSpan = document.getElementById('days');
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        animateValue(daysSpan, days);
        animateValue(hoursSpan, hours);
        animateValue(minutesSpan, minutes);
        animateValue(secondsSpan, seconds);

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownTimer.innerHTML = "EXPIRED";
        }
    }

    function animateValue(element, value) {
        const currentValue = parseInt(element.textContent, 10);
        if (currentValue !== value) {
            element.classList.add('animate-pulse');
            setTimeout(() => {
                element.textContent = value.toString().padStart(2, '0');
                element.classList.remove('animate-pulse');
            }, 500);
        }
    }

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// Set the target date (e.g., 7 days from now)
const targetDate = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
startCountdown(targetDate);


document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });
});