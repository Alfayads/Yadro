// Like Button Functionality

document.addEventListener("DOMContentLoaded", function () {
    const likeButtons = document.querySelectorAll(".like-button");

    likeButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const productId = this.closest(".product-card").querySelector("[data-product-id]").getAttribute("data-product-id");
            const liked = this.getAttribute("data-liked") === "true";
            const url = liked ? '/wishlist' : '/wishlist'; // Change for delete or add
            const method = liked ? 'DELETE' : 'POST'; // Toggle between adding/removing

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token') // Or your preferred method of token storage
                    },
                    body: JSON.stringify({
                        productId: productId
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    // Toggle like button appearance and liked status
                    this.setAttribute("data-liked", !liked);
                    this.querySelector("svg").style.fill = liked ? "none" : "red";
                } else {
                    console.error(result.message);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });
    });
});

// Category Card animations 

document.addEventListener('DOMContentLoaded', () => {
    const categoryItems = document.querySelectorAll('.category-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    categoryItems.forEach(item => {
        observer.observe(item);
        item.style.animationPlayState = 'paused';

        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            item.querySelector('div').style.transform = `scale(1.05) rotateY(${deltaX * 10}deg) rotateX(${-deltaY * 10}deg)`;
        });

        item.addEventListener('mouseleave', () => {
            item.querySelector('div').style.transform = 'scale(1) rotateY(0) rotateX(0)';
        });
    });

    // Pulse animation for the section title
    const sectionTitle = document.querySelector('#category');
    sectionTitle.classList.add('animate-pulse');
});



document.addEventListener('DOMContentLoaded', () => {
    // Animate product cards on scroll
    const productCards = document.querySelectorAll('.product-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-in');
            }
        });
    }, {
        threshold: 0.1
    });

    productCards.forEach(card => {
        observer.observe(card);
    });

    // Like button functionality
    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const icon = button.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            icon.classList.toggle('text-red-500');
        });
    });

    // Add to Cart button animation
    const addToCartButtons = document.querySelectorAll('.product-card .add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            button.classList.add('bg-green-500');
            button.innerHTML = '<i class="fas fa-check mr-2"></i>Added to Cart';
            setTimeout(() => {
                button.classList.remove('bg-green-500');
                button.innerHTML = 'Add To Cart';
            }, 2000);
        });
    });
});