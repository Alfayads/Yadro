document.addEventListener('DOMContentLoaded', function () {
    // Handle like button click
    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // SweetAlert to show the product is added to the wishlist
            Swal.fire({
                title: 'Added to Wishlist!',
                text: 'This product has been added to your wishlist.',
                icon: 'success',
                showConfirmButton: false, // Hide confirm button
                timer: 1000 // 5-second timer
            });

            // Refresh the page after 5 seconds
            setTimeout(() => {
                location.reload();
            }, 1000);

            // Optionally, send a request to update the wishlist on the server
            const productId = this.getAttribute('data-product-id');
            updateWishlist(productId);
        });
    });
});

// Function to send wishlist update to server (optional, if needed)
function updateWishlist(product_id) {
    fetch('/wishlist/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId: product_id,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                console.error('Failed to add product to wishlist.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}