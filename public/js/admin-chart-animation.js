const darkModeToggle = document.getElementById('darkModeToggle');
const htmlElement = document.documentElement;

darkModeToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
});

// Bar Chart
const barCtx = document.getElementById('barChart').getContext('2d');
barCtx.canvas.height = 400;
new Chart(barCtx, {
    type: 'bar',
    data: {
        labels: ['2019', '2020', '2021', '2022', '2023'],
        datasets: [{
            label: 'Yearly Data',
            data: [12, 19, 3, 5, 2],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: '#666'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#666'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});
// Transaction Chart
const transactionCtx = document.getElementById('transactionChart').getContext('2d');
new Chart(transactionCtx, {
    type: 'doughnut',
    data: {
        labels: ['Paypal', 'Stripe', 'Cash'],
        datasets: [{
            data: [236, 593, 371],
            backgroundColor: ['#4CAF50', '#FFC107', '#2196F3'],
            borderColor: '#fff',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#666'
                }
            }
        }
    }
});


