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
// Sales Chart (Bar)
const salesCtx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(salesCtx, {
    type: 'bar',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            label: 'Sales (₹)',
            data: [12000, 15000, 8000, 22000, 18000, 25000],
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Order Chart (Pie)
const orderCtx = document.getElementById('orderChart').getContext('2d');
const orderChart = new Chart(orderCtx, {
    type: 'pie',
    data: {
        labels: ['Completed', 'Pending', 'Cancelled'],
        datasets: [{
            data: [1185, 15, 0],
            backgroundColor: [
                'rgba(34, 197, 94, 0.6)',
                'rgba(239, 68, 68, 0.6)',
                'rgba(107, 114, 128, 0.6)'
            ],
            borderColor: [
                'rgba(34, 197, 94, 1)',
                'rgba(239, 68, 68, 1)',
                'rgba(107, 114, 128, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true
    }
});