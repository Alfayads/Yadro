document.querySelectorAll('.action-icon').forEach((button) => {
    const tooltip = button.querySelector('.tooltip');

    button.addEventListener('mouseover', () => {
        tooltip.classList.remove('opacity-0', 'hidden');
        tooltip.classList.add('opacity-100');
    });

    button.addEventListener('mouseleave', () => {
        tooltip.classList.remove('opacity-100');
        tooltip.classList.add('opacity-0', 'hidden');
    });
});


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
});
document.addEventListener("DOMContentLoaded", function () {
    // ... (previous script content) ...

    // Auto-hide messages after 5 seconds
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
        setTimeout(() => {
            message.style.display = 'none';
        }, 5000);
    });

    // Animate search bar on focus
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.querySelector('.search-input');

    searchInput.addEventListener('focus', () => {
        searchContainer.style.transform = 'scale(1.02)';
    });

    searchInput.addEventListener('blur', () => {
        searchContainer.style.transform = 'scale(1)';
    });
});