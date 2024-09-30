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

    // Banner preview functionality
    const bannerTitle = document.getElementById('bannerTitle');
    const bannerSubtitle = document.getElementById('bannerSubtitle');
    const discountPercentage = document.getElementById('discountPercentage');
    const buttonText = document.getElementById('buttonText');
    const gradientStart = document.getElementById('gradientStart');
    const gradientEnd = document.getElementById('gradientEnd');
    const textColor = document.getElementById('textColor');
    const fileInput = document.querySelector('input[type="file"]');

    const previewTitle = document.getElementById('previewTitle');
    const previewSubtitle = document.getElementById('previewSubtitle');
    const previewButton = document.getElementById('previewButton');
    const bannerPreview = document.getElementById('bannerPreview');
    const previewImage = document.getElementById('previewImage');

    function updatePreview() {
        previewTitle.textContent = bannerTitle.value || 'Up to 20% off Accessories';
        previewSubtitle.textContent = bannerSubtitle.value || 'Exclusive deals on latest accessories.';
        previewButton.textContent = buttonText.value || 'Explore';
        bannerPreview.style.background = `linear-gradient(to right, ${gradientStart.value}, ${gradientEnd.value})`;
        previewTitle.style.color = textColor.value;
        previewSubtitle.style.color = textColor.value;
        previewButton.style.color = gradientStart.value;
        previewButton.style.backgroundColor = textColor.value;
    }

    [bannerTitle, bannerSubtitle, discountPercentage, buttonText, gradientStart, gradientEnd, textColor].forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.style.backgroundImage = `url(${e.target.result})`;
            }
            reader.readAsDataURL(file);
        }
    });

    // Initialize preview
    updatePreview();
});