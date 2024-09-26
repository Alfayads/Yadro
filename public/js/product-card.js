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

// Rating star function
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

// Offer price tag
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