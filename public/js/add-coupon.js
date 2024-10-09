// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    if (html.classList.contains('dark')) {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

// Initialize flatpickr for date input
flatpickr("#validityTill", {
    dateFormat: "Y-m-d",
    minDate: "today",
    theme: "airbnb"
});

const toggleSwitch = document.getElementById('isActive');
const toggleLabel = document.getElementById('toggleLabel');

toggleSwitch.addEventListener('change', function () {
    if (this.checked) {
        toggleLabel.textContent = 'Active';
        toggleLabel.classList.add('text-blue-500');
        toggleLabel.classList.remove('text-gray-700', 'dark:text-gray-200');
    } else {
        toggleLabel.textContent = 'Inactive';
        toggleLabel.classList.remove('text-blue-500');
        toggleLabel.classList.add('text-gray-700', 'dark:text-gray-200');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const couponCodeInput = document.getElementById('couponCode');

    couponCodeInput.addEventListener('input', function () {
        this.value = this.value.toUpperCase();
    });

    couponCodeInput.addEventListener('paste', function (e) {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        this.value = pastedText.toUpperCase();
    });
});

// Form animation
document.addEventListener('DOMContentLoaded', () => {
    gsap.from("#couponForm", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out"
    });
});

// Initialize flatpickr for date input with custom options
flatpickr("#validityTill", {
    dateFormat: "Y-m-d",
    minDate: "today",
    disableMobile: true,
    animate: true,
    onChange: function (selectedDates, dateStr, instance) {
        // Add a class to the input when a date is selected
        if (selectedDates.length > 0) {
            instance.input.classList.add("date-selected");
        } else {
            instance.input.classList.remove("date-selected");
        }
    },
});

// Function to update Flatpickr theme based on dark mode
function updateFlatpickrTheme() {
    const calendar = document.querySelector('.flatpickr-calendar');
    if (calendar) {
        if (document.documentElement.classList.contains('dark')) {
            calendar.classList.add('dark');
        } else {
            calendar.classList.remove('dark');
        }
    }
}

// Call the function initially and whenever the theme changes
updateFlatpickrTheme();
document.getElementById('themeToggle').addEventListener('click', updateFlatpickrTheme);

// Input field animations
const inputFields = document.querySelectorAll('input[type="text"], input[type="date"]');
inputFields.forEach(field => {
    field.addEventListener('focus', () => {
        gsap.to(field, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    field.addEventListener('blur', () => {
        gsap.to(field, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

const isActiveCheckbox = document.getElementById('isActive');

isActiveCheckbox.addEventListener('change', () => {
    if (isActiveCheckbox.checked) {
        gsap.to(toggleSwitch, {
            x: 20,
            backgroundColor: '#4299e1',
            duration: 0.3,
            ease: "power2.inOut"
        });
    } else {
        gsap.to(toggleSwitch, {
            x: 0,
            backgroundColor: '#fff',
            duration: 0.3,
            ease: "power2.inOut"
        });
    }
});

// Submit button animation
const submitButton = document.querySelector('button[type="submit"]');
submitButton.addEventListener('mouseenter', () => {
    gsap.to(submitButton, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
    });
});

submitButton.addEventListener('mouseleave', () => {
    gsap.to(submitButton, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
    });
});

// Function to update the icon
function updateIcon() {
    if (document.documentElement.classList.contains('dark')) {
        themeToggleIcon.classList.remove('fa-sun');
        themeToggleIcon.classList.add('fa-moon');
    } else {
        themeToggleIcon.classList.remove('fa-moon');
        themeToggleIcon.classList.add('fa-sun');
    }
}

// Set initial icon state
updateIcon();

themeToggleBtn.addEventListener('click', function () {
    document.documentElement.classList.toggle('dark');

    // Update localStorage
    if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('color-theme', 'dark');
    } else {
        localStorage.setItem('color-theme', 'light');
    }

    updateIcon();
});