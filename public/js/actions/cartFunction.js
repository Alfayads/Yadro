document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function (e) {

        if (this.disabled) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        this.classList.add('animate-pulse');
        setTimeout(() => this.classList.remove('animate-pulse'), 500);

        const productId = this.getAttribute('data-product-id');
        addToCart(productId);
    });
});


function addToCart(product_id) {
    const quantity = document.getElementById(`quantity-${product_id}`).value;
    console.log(`Product ID: ${product_id}, Quantity: ${quantity}`);

    // Proceed with adding the product and quantity to the cart
    fetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId: product_id,
            quantity: Number(quantity), // Make sure it's a number
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Product added to cart',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to add product to cart',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An unexpected error occurred',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
}
