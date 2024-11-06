document.addEventListener('DOMContentLoaded', function () {
    const couponInput = document.getElementById('coupon');
    const applyButton = document.getElementById('applyCouponBtn');
    const successMessage = document.getElementById('couponSuccessMessage');
    const errorMessage = document.getElementById('couponErrorMessage');
    const loadingSpinner = applyButton.querySelector('.loading-spinner');
    const buttonText = applyButton.querySelector('.button-text');
    const savedAmountSpan = document.getElementById('savedAmount');
    const couponDiscountElement = document.getElementById('couponDiscount');
    const cartTotalElement = document.getElementById('cartTotal');

    // Add input animation
    couponInput.addEventListener('focus', () => {
        gsap.to(couponInput, {
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    couponInput.addEventListener('blur', () => {
        gsap.to(couponInput, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    applyButton.addEventListener('click', async function () {
        const couponCode = couponInput.value.trim();

        if (!couponCode) {
            showError('Please enter a coupon code');
            return;
        }

        // Show loading state
        startLoading();

        try {
            const response = await fetch('/apply-coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    couponCode
                })
            });

            const result = await response.json();

            if (response.ok) {
                // Hide any existing messages first
                hideMessages();

                // Update the discount amount
                savedAmountSpan.textContent = result.discount;
                couponDiscountElement.textContent = `₹ -${result.discount}`;

                // Update cart total with animation
                updateCartTotalWithAnimation(result.discountedTotal);

                // Show success message with animation
                showSuccess(result.message || 'Coupon applied successfully!');

                // Disable input and button
                couponInput.disabled = true;
                applyButton.disabled = true;

                // Add success styles to input
                couponInput.classList.add('bg-green-50', 'border-green-500');
            } else {
                showError(result.message || 'Invalid coupon code');
                couponInput.value = '';
            }
        } catch (error) {
            showError('Error applying coupon. Please try again.');
            couponInput.value = '';
        } finally {
            stopLoading();
        }
    });

    function startLoading() {
        applyButton.disabled = true;
        buttonText.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
    }

    function stopLoading() {
        applyButton.disabled = false;
        buttonText.classList.remove('hidden');
        loadingSpinner.classList.add('hidden');
    }

    function hideMessages() {
        gsap.to([successMessage, errorMessage], {
            opacity: 0,
            y: -10,
            duration: 0.3,
            onComplete: () => {
                successMessage.classList.add('hidden');
                errorMessage.classList.add('hidden');
            }
        });
    }

    function showSuccess(message) {
        // First ensure the element is in initial state
        successMessage.classList.remove('hidden');

        // Create and apply the animation
        gsap.timeline()
            .fromTo(successMessage, {
                opacity: 0,
                y: -20,
                scale: 0.95
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.7)"
            })
            // Add a subtle bounce to the checkmark icon
            .fromTo(successMessage.querySelector('.w-8'), {
                scale: 0,
                rotate: -45
            }, {
                scale: 1,
                rotate: 0,
                duration: 0.4,
                ease: "elastic.out(1, 0.5)"
            },
                "-=0.3"
            )
            // Animate the text elements
            .fromTo([successMessage.querySelector('h3'), successMessage.querySelector('.mt-1')], {
                opacity: 0,
                x: -20
            }, {
                opacity: 1,
                x: 0,
                stagger: 0.1,
                duration: 0.3
            },
                "-=0.2"
            );

        // Optional: Add auto-hide after 5 seconds
        gsap.delayedCall(20, () => {
            gsap.to(successMessage, {
                opacity: 0,
                y: -10,
                duration: 0.3,
                onComplete: () => successMessage.classList.add('hidden')
            });
        });
    }

    function hideMessages() {
        gsap.to([successMessage, errorMessage], {
            opacity: 0,
            y: -10,
            duration: 0.3,
            onComplete: () => {
                successMessage.classList.add('hidden');
                errorMessage.classList.add('hidden');
            }
        });
    }

    function showError(message) {
        document.getElementById('couponErrorText').textContent = message;
        errorMessage.classList.remove('hidden');
        couponInput.innerText = ""
        gsap.fromTo(errorMessage, {
            opacity: 0,
            y: -10
        }, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        });

        // Shake animation for input
        gsap.to(couponInput, {
            x: [-10, 10, -10, 10, 0],
            duration: 0.5,
            ease: "power2.out"
        });
    }

    function updateCartTotalWithAnimation(newTotal) {
        const cartTotalElement = document.getElementById('cartTotal');
        // Animate the number changing
        gsap.to(cartTotalElement, {
            textContent: newTotal,
            duration: 1,
            ease: "power2.out",
            snap: {
                textContent: 1
            },
            onUpdate: function () {
                cartTotalElement.textContent = '₹ ' + Math.round(this.targets()[0].textContent);
            }
        });
    }
});