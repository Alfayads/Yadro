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
    const fileInput = document.querySelector('input[type="file"]');
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('w-full', 'h-full', 'object-cover', 'rounded-md');
                fileInput.parentElement.parentElement.innerHTML = '';
                fileInput.parentElement.parentElement.appendChild(img);
            }
            reader.readAsDataURL(file);
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const uploadPrompt = document.getElementById('uploadPrompt');
    const previewImage = document.getElementById('previewImage');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);

    // Handle selected files
    fileInput.addEventListener('change', handleFiles, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropArea.classList.add('bg-blue-100');
    }

    function unhighlight() {
        dropArea.classList.remove('bg-blue-100');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files instanceof FileList) {
            files = files;
        } else if (files.target) {
            files = files.target.files;
        }

        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewImage.src = e.target.result;
                    previewImage.classList.remove('hidden');
                    uploadPrompt.classList.add('hidden');
                }
                reader.readAsDataURL(file);
            } else {
                alert('Please select an image file.');
            }
        }
    }
});
