document.addEventListener('DOMContentLoaded', function () {
    // Find all product cards and their quantity buttons
    document.querySelectorAll('.product-card').forEach(function (card) {
        const productId = card.querySelector('input[type="number"]').id.split('-')[1];
        const quantityInput = document.getElementById(`quantity-${productId}`);
        const plusButton = card.querySelector('.plus');
        const minusButton = card.querySelector('.minus');

        // Max and min values for the quantity
        const maxQuantity = parseInt(quantityInput.getAttribute('max'), 10);
        const minQuantity = parseInt(quantityInput.getAttribute('min'), 10);

        // Event listener for the plus button
        plusButton.addEventListener('click', function () {
            let currentQuantity = parseInt(quantityInput.value, 10);
            if (currentQuantity < maxQuantity) {
                quantityInput.value = currentQuantity + 1;
            }
        });

        // Event listener for the minus button
        minusButton.addEventListener('click', function () {
            let currentQuantity = parseInt(quantityInput.value, 10);
            if (currentQuantity > minQuantity) {
                quantityInput.value = currentQuantity - 1;
            }
        });
    });

})