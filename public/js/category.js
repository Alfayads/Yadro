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