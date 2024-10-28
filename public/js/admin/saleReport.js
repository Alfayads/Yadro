// Initialize charts with simpler configurations
let salesChart;
let paymentMethodChart;

function initializeCharts() {
    // Simplified Sales Chart Configuration
    const salesOptions = {
        series: [{
            name: 'Sales',
            data: []
        }],
        chart: {
            type: 'line', // Changed from area for simplicity
            height: 350,
            fontFamily: 'Inter, sans-serif',
            background: 'transparent',
            toolbar: {
                show: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        grid: {
            borderColor: '#374151',
            strokeDashArray: 5,
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        xaxis: {
            type: 'category',
            categories: [],
            labels: {
                style: {
                    colors: '#9ca3af',
                    fontSize: '12px'
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#9ca3af',
                    fontSize: '12px'
                },
                formatter: (value) => '₹' + value.toLocaleString()
            }
        },
        tooltip: {
            theme: 'dark',
            x: {
                show: true
            },
            y: {
                formatter: (value) => '₹' + value.toLocaleString()
            }
        },
        markers: {
            size: 5,
            colors: ['#3b82f6'],
            strokeColors: '#fff',
            strokeWidth: 2,
            hover: {
                size: 7
            }
        },
        colors: ['#3b82f6']
    };

    // Simplified Payment Methods Chart Configuration
    const paymentOptions = {
        series: [],
        chart: {
            type: 'bar', // Changed from donut for better data visualization
            height: 250,
            background: 'transparent',
            toolbar: {
                show: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                dataLabels: {
                    position: 'top'
                }
            }
        },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        dataLabels: {
            enabled: true,
            formatter: (val) => val,
            style: {
                fontSize: '12px',
                colors: ['#fff']
            }
        },
        xaxis: {
            categories: [],
            labels: {
                style: {
                    colors: '#9ca3af',
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#9ca3af',
                    fontSize: '12px'
                }
            }
        },
        grid: {
            borderColor: '#374151',
            strokeDashArray: 5
        }
    };

    // Initialize and render charts
    salesChart = new ApexCharts(document.querySelector("#salesChart"), salesOptions);
    paymentMethodChart = new ApexCharts(document.querySelector("#paymentMethodChart"), paymentOptions);

    salesChart.render();
    paymentMethodChart.render();
}

// Enhanced data fetching with loading states
async function fetchSalesReport() {
    try {
        // Show loading state
        document.querySelectorAll('.metric-card').forEach(card => {
            card.classList.add('opacity-50');
        });

        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const timeFrame = document.getElementById('timeFilter').value;

        const response = await fetch(`/admin/sales-report?startDate=${startDate}&endDate=${endDate}&timeFrame=${timeFrame}`);
        const result = await response.json();

        if (result.success) {
            updateDashboard(result.data);
        } else {
            showError('Error fetching sales report: ' + result.message);
        }
    } catch (error) {
        showError('Error: ' + error.message);
    } finally {
        // Remove loading state
        document.querySelectorAll('.metric-card').forEach(card => {
            card.classList.remove('opacity-50');
        });
    }
}

// Enhanced dashboard update with animations
function updateDashboard(data) {
    const { salesData, summary, paymentMethodStats } = data;

    // Animate number updates
    animateValue('totalSales', summary.totalSales, '₹');
    animateValue('totalOrders', summary.totalOrders);
    animateValue('avgOrderValue', summary.avgOrderValue, '₹');
    animateValue('totalItems', summary.totalItems);

    // Update sales chart with animation
    salesChart.updateOptions({
        xaxis: {
            categories: salesData.map(item => item.date)
        }
    });

    salesChart.updateSeries([{
        name: 'Sales',
        data: salesData.map(item => item.sales)
    }]);

    // Update payment methods chart with animation
    paymentMethodChart.updateOptions({
        xaxis: {
            categories: paymentMethodStats.map(item => item._id)
        }
    });

    paymentMethodChart.updateSeries([{
        name: 'Orders',
        data: paymentMethodStats.map(item => item.count)
    }]);

    updateSalesTable(salesData);
}

// Animate number updates
function animateValue(elementId, value, prefix = '') {
    const element = document.getElementById(elementId);
    const start = parseInt(element.innerText.replace(/[^0-9.-]+/g, '')) || 0;
    const duration = 1000;
    const steps = 20;
    const increment = (value - start) / steps;

    let current = start;
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= value) || (increment < 0 && current <= value)) {
            clearInterval(timer);
            current = value;
        }
        element.textContent = `${prefix}${Math.round(current).toLocaleString()}`;
    }, duration / steps);
}

// Enhanced table update with row animation
function updateSalesTable(data) {
    const tableBody = document.getElementById('salesTableBody');
    tableBody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = 'table-row opacity-0 transform translate-y-4';

        row.innerHTML = `
            <td class="py-4 px-4">${item.date}</td>
            <td class="py-4 px-4">${item.orders.toLocaleString()}</td>
            <td class="py-4 px-4">₹${item.sales.toLocaleString()}</td>
            <td class="py-4 px-4">₹${item.avgOrderValue.toLocaleString()}</td>
            <td class="py-4 px-4">${item.totalItems.toLocaleString()}</td>
        `;

        tableBody.appendChild(row);

        // Animate row entrance
        setTimeout(() => {
            row.classList.remove('opacity-0', 'translate-y-4');
            row.classList.add('opacity-100', 'translate-y-0', 'transition-all', 'duration-300');
        }, index * 100);
    });
}

// Show error messages
function showError(message) {
    // You can implement a toast or alert system here
    console.error(message);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeCharts();
    initializeDateInputs();
    fetchSalesReport();

    // Add filter button click handler
    document.getElementById('applyFilter').addEventListener('click', fetchSalesReport);

    // Add responsive handlers
    window.addEventListener('resize', () => {
        salesChart.resize();
        paymentMethodChart.resize();
    });
});