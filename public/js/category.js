document.addEventListener("DOMContentLoaded", function () {
    // Fade-in animation
    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach((el, index) => {
        el.style.opacity = "0";
        setTimeout(() => {
            el.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`;
        }, 100);
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    });

    // Check for saved theme preference or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        html.classList.add('dark');
    }

    // Toggle switch functionality
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach((switchElement) => {
        switchElement.addEventListener('change', function () {
            const status = this.checked ? 'Listed' : 'Unlisted';
            // Here you can add AJAX call to update the status in the backend
            console.log(`Category status changed to: ${status}`);
        });
    });

    // Add offer button functionality
    const addOfferButtons = document.querySelectorAll('button:contains("Add Offer")');
    addOfferButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Here you can add logic to show a modal or navigate to an "Add Offer" page
            console.log('Add offer clicked');
        });
    });

    // Edit button functionality
    const editButtons = document.querySelectorAll('button i.fa-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Here you can add logic to navigate to an edit page or show an edit modal
            console.log('Edit category clicked');
        });
    });
});



// document.addEventListener("DOMContentLoaded", () => {
//     const statusToggles = document.querySelectorAll(".toggle-switch input");
//     const modal = document.getElementById("statusConfirmModal");
//     const confirmBtn = document.getElementById("confirmBtn");
//     const cancelBtn = document.getElementById("cancelBtn");

//     let selectedCategoryId = null;
//     let currentToggle = null;

//     // Handle status toggle click
//     statusToggles.forEach((toggle) => {
//         toggle.addEventListener("click", (e) => {
//             e.preventDefault(); // Prevent default toggle behavior
//             currentToggle = e.target; // Store the clicked toggle
//             selectedCategoryId = e.target.closest("tr").dataset.categoryId;

//             // Show the modal with smooth animation
//             modal.classList.remove("hidden");
//             modal.querySelector(".modal-content").classList.add("scale-100", "opacity-100");
//         });
//     });

//     // Handle "OK" button click
//     confirmBtn.addEventListener("click", () => {
//         // Perform the action (e.g., update category status in the backend)
//         // Assuming a backend call is made to update the category status, here you can toggle the checkbox status:
//         currentToggle.checked = !currentToggle.checked;

//         // Close modal
//         closeModal();
//     });

//     // Handle "Cancel" button click
//     cancelBtn.addEventListener("click", () => {
//         closeModal(); // Close modal without making changes
//     });

//     // Function to close modal
//     function closeModal() {
//         modal.querySelector(".modal-content").classList.remove("scale-100", "opacity-100");
//         setTimeout(() => {
//             modal.classList.add("hidden");
//         }, 300); // Match the duration of the CSS transition
//     }
// });



// document.addEventListener('DOMContentLoaded', function () {
//     const toggles = document.querySelectorAll('.status-toggle');
//     const statusModal = document.getElementById('statusModal');
//     const statusMessage = document.getElementById('statusMessage');
//     const confirmBtn = document.getElementById('confirmBtn');
//     const cancelBtn = document.getElementById('cancelBtn');

//     let currentToggle = null; // Store the current toggle switch being changed

//     toggles.forEach(toggle => {
//         toggle.addEventListener('change', function (e) {
//             currentToggle = this;
//             const categoryId = this.getAttribute('data-category-id');
//             const isChecked = this.checked;

//             // Show confirmation modal
//             statusMessage.textContent = `Do you want to ${isChecked ? 'activate' : 'inactivate'} this category?`;
//             statusModal.classList.remove('hidden');
//         });
//     });

//     // Handle cancel button
//     cancelBtn.addEventListener('click', function () {
//         if (currentToggle) {
//             // Revert the toggle switch to its previous state
//             currentToggle.checked = !currentToggle.checked;
//         }
//         statusModal.classList.add('hidden');
//     });

//     // Handle confirm button
//     confirmBtn.addEventListener('click', function () {
//         const categoryId = currentToggle.getAttribute('data-category-id');
//         const newStatus = currentToggle.checked ? true : false;

//         // Send AJAX request to the backend
//         fetch('/admin/update-category-status', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'text/html',
//             },
//             body: JSON.stringify({ categoryId, newStatus }),
//         })
//             .then(response => response.json())
//             .then(data => {
//                 if (data) {
//                     console.log('Status updated successfully.');
//                 } else {
//                     console.error('Failed to update status.');
//                 }
//                 statusModal.classList.add('hidden');
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//                 // Revert the toggle switch in case of error
//                 currentToggle.checked = !currentToggle.checked;
//                 statusModal.classList.add('hidden');
//             });
//     });
// });
