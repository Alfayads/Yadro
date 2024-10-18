document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.delete-from-wishlist');
    let isDeleting = false;

    deleteButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            if (isDeleting) return; // Prevent double-clicks
            const productId = this.getAttribute('data-product-id');

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteFromWishlist(productId);
                }
            });
        });
    });

    function deleteFromWishlist(productId) {
        if (isDeleting) return; // Prevent concurrent deletion requests
        isDeleting = true;

        const timestamp = new Date().getTime();
        console.log(`Sending DELETE request for product: ${productId} at ${timestamp}`);

        fetch('/wishlist/remove', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: productId, timestamp: timestamp }),
        })
            .then(response => {
                console.log(`Received response for ${timestamp}:`, response.status, response.statusText);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(`Response data for ${timestamp}:`, data);
                if (data.success) {
                    Swal.fire(
                        'Deleted!',
                        'Your product has been removed from the wishlist.',
                        'success'
                    ).then(() => {
                        window.location.reload(); // Refresh the page
                    });
                } else {
                    throw new Error(data.message || 'Unknown error occurred');
                }
            })
            .catch(error => {
                console.error(`Error for ${timestamp}:`, error);
                Swal.fire(
                    'Error!',
                    `An error occurred while removing the product: ${error.message}`,
                    'error'
                );
            })
            .finally(() => {
                isDeleting = false; // Reset the flag
            });
    }
});