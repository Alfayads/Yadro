// For the like button to add the product on the wishlist 

document.addEventListener("DOMContentLoaded", function () {
    const likeButtons = document.querySelectorAll(".like-button");

    likeButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const productId = this.closest(".product-card").querySelector("[data-product-id]").getAttribute("data-product-id");
            const liked = this.getAttribute("data-liked") === "true";
            const url = liked ? '/wishlist' : '/wishlist';  // Change for delete or add
            const method = liked ? 'DELETE' : 'POST'; // Toggle between adding/removing

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token') // Or your preferred method of token storage
                    },
                    body: JSON.stringify({ productId: productId })
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