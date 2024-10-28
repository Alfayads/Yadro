document.addEventListener('DOMContentLoaded', function () {
    const progressBar = document.getElementById('progressBar');
    const addressCards = document.querySelectorAll('.saved-address-card');
    const form = document.getElementById('checkoutForm');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const productImages = document.querySelectorAll('#orderItems img');
    const selectedAddressDetails = document.getElementById('selectedAddressDetails');
    const noAddressSelected = document.getElementById('noAddressSelected');
    const addressType = document.getElementById('addressType');
    const addressName = document.getElementById('addressName');
    const addressStreet = document.getElementById('addressStreet');
    const addressCityState = document.getElementById('addressCityState');
    const addressPhone = document.getElementById('addressPhone');
    const requiredFields = ['firstName', 'streetAddress', 'townCity', 'phoneNumber', 'emailAddress'];

    // Initialize progress bar
    updateProgress();

    // Function to update progress bar
    function updateProgress() {
        const totalFields = requiredFields.length;
        let filledFields = 0;

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && field.value.trim() !== '') {
                filledFields++;
            }
        });

        const progress = (filledFields / totalFields) * 100;
        progressBar.style.width = `${progress}%`;

        // Add color transitions based on progress
        if (progress < 33) {
            progressBar.classList.remove('bg-yellow-500', 'bg-green-500');
            progressBar.classList.add('bg-red-500');
        } else if (progress < 66) {
            progressBar.classList.remove('bg-red-500', 'bg-green-500');
            progressBar.classList.add('bg-yellow-500');
        } else {
            progressBar.classList.remove('bg-yellow-500', 'bg-red-500');
            progressBar.classList.add('bg-green-500');
        }

        // Animate progress bar
        gsap.to(progressBar, {
            width: `${progress}%`,
            duration: 0.5,
            ease: "power2.out"
        });
    }

    // Animate progress bar to 100%
    function animateProgressToFull() {
        progressBar.classList.remove('bg-red-500', 'bg-yellow-500');
        progressBar.classList.add('bg-green-500');

        const tl = gsap.timeline();
        tl.to(progressBar, {
            width: '100%',
            duration: 0.8,
            ease: "power2.out"
        })
            .to(progressBar, {
                scale: 1.02,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            })
            .fromTo(progressBar, {
                opacity: 0.7
            }, {
                opacity: 1,
                duration: 0.2,
                ease: "power1.out"
            });
    }

    // Enhanced address card selection and form autofill
    addressCards.forEach(card => {
        card.addEventListener('click', () => {
            addressCards.forEach(c => {
                c.classList.remove('selected');
                gsap.to(c, {
                    scale: 1,
                    duration: 0.3
                });
            });

            card.classList.add('selected');
            gsap.to(card, {
                scale: 1.03,
                duration: 0.3,
                ease: "back.out(1.7)"
            });

            const addressData = JSON.parse(card.dataset.address);
            fillFormWithAnimation(addressData);
            animateProgressToFull();

            gsap.to(noAddressSelected, {
                opacity: 0,
                height: 0,
                duration: 0.3,
                onComplete: () => {
                    noAddressSelected.style.display = 'none';
                }
            });

            selectedAddressDetails.style.display = 'block';
            gsap.to(selectedAddressDetails, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "back.out(1.7)"
            });

            const updateSequence = gsap.timeline();
            updateSequence
                .to([addressType, addressName, addressStreet, addressCityState, addressPhone], {
                    opacity: 0,
                    y: -10,
                    duration: 0.2,
                    stagger: 0.05
                })
                .call(() => {
                    addressType.textContent = addressData.addressType;
                    addressName.textContent = addressData.name;
                    addressStreet.textContent = `${addressData.streetAddress}${addressData.apartment ? ', ' + addressData.apartment : ''}`;
                    addressCityState.textContent = `${addressData.city}, ${addressData.state} ${addressData.postalCode}`;
                    addressPhone.textContent = `📞 ${addressData.phone}`;
                })
                .to([addressType, addressName, addressStreet, addressCityState, addressPhone], {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    stagger: 0.05
                });
        });

        // Hover effects for cards
        card.addEventListener('mouseenter', () => {
            if (card && card.classList.contains('selected')) {
                gsap.to(card, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            if (card && card.classList.contains('selected')) {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });

    // Animate form filling
    function fillFormWithAnimation(addressData) {
        const fields = {
            'streetAddress': addressData.streetAddress,
            'apartment': addressData.apartment || '',
            'townCity': addressData.city,
            'phoneNumber': addressData.phone
        };

        Object.entries(fields).forEach(([fieldId, value], index) => {
            const field = document.getElementById(fieldId);
            if (field) {
                gsap.to(field, {
                    scale: 1.05,
                    duration: 0.2,
                    delay: index * 0.1,
                    onComplete: () => {
                        field.value = value;
                        gsap.to(field, {
                            scale: 1,
                            duration: 0.2,
                            onComplete: updateProgress
                        });
                    }
                });
            }
        });
    }

    // Add input listeners to form fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', updateProgress);
            field.addEventListener('focus', () => {
                field.classList.add('scale-105');
                gsap.to(field, {
                    scale: 1.02,
                    duration: 0.2
                });
            });
            field.addEventListener('blur', () => {
                gsap.to(field, {
                    scale: 1,
                    duration: 0.2
                });
            });
        }
    });

    // Place Order Button Animation
    placeOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 820);

            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && !field.value) {
                    gsap.to(field, {
                        borderColor: '#EF4444',
                        duration: 0.3,
                        yoyo: true,
                        repeat: 3
                    });
                }
            });
        } else {
            gsap.to(placeOrderBtn, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    placeOrderBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Order Placed!';
                    placeOrderBtn.classList.remove('bg-red-500');
                    placeOrderBtn.classList.add('bg-green-500');
                }
            });
        }
    });

    // Initialize floating animation for product images
    productImages.forEach(img => {
        gsap.to(img, {
            y: -10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    });
});
