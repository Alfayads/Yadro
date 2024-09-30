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

// Form submission animation
const form = document.getElementById('addBrandForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your form submission logic here

    // Animation example (replace with your actual submission logic)
    form.classList.add('opacity-50', 'pointer-events-none');
    setTimeout(() => {
        form.classList.remove('opacity-50', 'pointer-events-none');
        alert('Brand added successfully!');
    }, 1000);
});