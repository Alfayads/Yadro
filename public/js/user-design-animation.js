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


// Like button functionality
document.addEventListener('DOMContentLoaded', () => {
    const likeButtons = document.querySelectorAll('.like-button');

    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const liked = button.dataset.liked === 'true';
            button.dataset.liked = !liked;

            const svg = button.querySelector('svg');
            if (!liked) {
                svg.classList.add('text-red-500');
                svg.setAttribute('fill', 'currentColor');
            } else {
                svg.classList.remove('text-red-500');
                svg.setAttribute('fill', 'none');
            }

            // Add a small "pop" animation
            button.classList.add('scale-110');
            setTimeout(() => {
                button.classList.remove('scale-110');
            }, 200);
        });
    });
});




// Add to Cart button functionality
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const addToCartText = button.querySelector('.add-to-cart-text');
            const addingToCartText = button.querySelector('.adding-to-cart-text');
            const addedToCartText = button.querySelector('.added-to-cart-text');

            // Step 1: Slide out "Add to Cart" text
            addToCartText.classList.add('slide-out');
            addToCartText.classList.add('hidden');

            // Step 2: Show truck icon
            setTimeout(() => {
                addingToCartText.classList.remove('hidden');
                addingToCartText.classList.add('slide-in');

                // Step 3: Show "Go to Cart" text with check icon
                setTimeout(() => {
                    addingToCartText.classList.remove('slide-in');
                    addingToCartText.classList.add('hidden');
                    addedToCartText.classList.remove('hidden');
                    addedToCartText.classList.add('slide-in');

                    // Optional: Reset button state after a few seconds
                    setTimeout(() => {
                        addedToCartText.classList.remove('slide-in');
                        addedToCartText.classList.add('hidden');
                        addToCartText.classList.remove('slide-out', 'hidden');
                    }, 3000);
                }, 1500);
            }, 300);
        });
    });
});



// Quantity selector functionality
document.addEventListener('DOMContentLoaded', () => {
    const quantitySelectors = document.querySelectorAll('.quantity-selector');

    quantitySelectors.forEach(selector => {
        const minusBtn = selector.querySelector('.minus');
        const plusBtn = selector.querySelector('.plus');
        const input = selector.querySelector('.quantity-input');

        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateQuantity(selector, input.value);
            }
        });

        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue < 99) {
                input.value = currentValue + 1;
                updateQuantity(selector, input.value);
            }
        });

        input.addEventListener('change', () => {
            let newValue = parseInt(input.value);
            if (isNaN(newValue) || newValue < 1) {
                newValue = 1;
            } else if (newValue > 99) {
                newValue = 99;
            }
            input.value = newValue;
            updateQuantity(selector, newValue);
        });
    });

    function updateQuantity(selector, newValue) {
        // You can add additional logic here, such as updating the price or sending an update to the server
        console.log(`Quantity updated to ${newValue}`);

        // Example: Update the "Add to Cart" button text
        const addToCartBtn = selector.closest('.product-card').querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            const addToCartText = addToCartBtn.querySelector('.add-to-cart-text');
            addToCartText.textContent = `Add to Cart (${newValue})`;
        }
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const ratingContainers = document.querySelectorAll('.rating-stars');

    ratingContainers.forEach(container => {
        const stars = container.querySelectorAll('.star-btn');
        const ratingValue = container.querySelector('.rating-value');
        let currentRating = 0;

        function updateStars(rating) {
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.remove('text-gray-300');
                    star.classList.add('text-yellow-400', 'scale-110');
                } else {
                    star.classList.remove('text-yellow-400', 'scale-110');
                    star.classList.add('text-gray-300');
                }
            });
        }

        function resetStars() {
            updateStars(currentRating);
        }

        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const rating = parseInt(star.dataset.rating);
                updateStars(rating);
            });

            star.addEventListener('mouseleave', resetStars);

            star.addEventListener('click', () => {
                currentRating = parseInt(star.dataset.rating);
                updateStars(currentRating);
                ratingValue.textContent = `${currentRating}/5`;

                // Add animation to the rating value
                ratingValue.classList.add('animate-bounce');
                setTimeout(() => {
                    ratingValue.classList.remove('animate-bounce');
                }, 500);

                // Trigger confetti animation for 5-star ratings
                if (currentRating === 5) {
                    triggerConfetti();
                }
            });
        });

        container.addEventListener('mouseleave', resetStars);
    });

    function triggerConfetti() {
        const confettiCount = 100;
        const colors = ['#FFD700', '#FFA500', '#FF6347', '#FF69B4', '#00CED1'];

        for (let i = 0; i < confettiCount; i++) {
            createConfettiParticle();
        }

        function createConfettiParticle() {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.opacity = Math.random();
            confetti.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const originalPrice = parseFloat(card.querySelector('.text-gray-500').textContent.replace('₹', ''));
        const discountedPrice = parseFloat(card.querySelector('.text-red-500').textContent.replace('₹', ''));

        if (originalPrice && discountedPrice) {
            const offPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
            const badgeElement = card.querySelector('.off-percentage');

            if (badgeElement && offPercentage > 0) {
                badgeElement.textContent = `${offPercentage}% OFF`;
            } else if (badgeElement) {
                badgeElement.parentElement.style.display = 'none';
            }
        }
    });
});

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