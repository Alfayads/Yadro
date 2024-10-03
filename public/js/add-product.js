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

    // File input preview
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const files = e.target.files;
            const previewContainer = input.parentElement.parentElement;

            // Clear existing previews
            const existingPreviews = previewContainer.querySelectorAll('.image-preview');
            existingPreviews.forEach(preview => preview.remove());

            // Create previews for each selected file
            Array.from(files).forEach(file => {
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const previewWrapper = document.createElement('div');
                        previewWrapper.classList.add('image-preview', 'relative', 'mt-2');

                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.classList.add('w-full', 'h-32', 'object-cover', 'rounded-md');

                        previewWrapper.appendChild(img);
                        previewContainer.appendChild(previewWrapper);
                    }
                    reader.readAsDataURL(file);
                }
            });
        });
    });
});