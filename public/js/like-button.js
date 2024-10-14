document.addEventListener('DOMContentLoaded', function () {
    // Like Button Functionality
    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', async function (e) {
            e.preventDefault();
            const productId = this.dataset.productId;
            const liked = this.dataset.liked === 'true';
            const url = liked ? '/wishlist/remove' : '/wishlist/add';
            const method = liked ? 'DELETE' : 'POST';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        productId
                    })
                });

                if (response.ok) {
                    this.dataset.liked = (!liked).toString();
                    const svg = this.querySelector('svg');
                    svg.style.fill = liked ? 'none' : 'red';
                    svg.style.stroke = liked ? 'currentColor' : 'red';

                    // Add animation
                    svg.animate([{
                        transform: 'scale(1)',
                        opacity: 0.5
                    },
                    {
                        transform: 'scale(1.5)',
                        opacity: 1
                    },
                    {
                        transform: 'scale(1)',
                        opacity: 1
                    }
                    ], {
                        duration: 300,
                        easing: 'ease-in-out'
                    });
                } else {
                    console.error('Failed to update wishlist');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
})


document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.delete-from-wishlist').forEach(button => {
        button.addEventListener('click', async function (e) {
            e.preventDefault();
            const productId = this.dataset.productId;
            const url = '/wishlist/remove';

            try {
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId })
                });

                if (response.ok) {
                    // Remove the product card from the UI
                    const productCard = this.closest('.product-card');
                    if (productCard) {
                        productCard.remove();
                    }

                    // Show a success notification
                    showNotification('Product removed from wishlist');

                    // If the wishlist is now empty, you might want to refresh the page or show an empty state
                    if (document.querySelectorAll('.product-card').length === 0) {
                        location.reload();
                    }
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to remove from wishlist');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification(error.message, 'error');
            }
        });
    });
});
