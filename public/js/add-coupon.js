document.addEventListener('DOMContentLoaded', function () {
    // Initialize Flatpickr with custom config
    flatpickr("#expiredOn", {
        minDate: "today",
        dateFormat: "Y-m-d",
        disableMobile: true,
        animate: true,
        theme: "custom",
        onChange: function (selectedDates, dateStr) {
            validateField('expiredOn', dateStr);
        }
    });

    // Form validation
    const form = document.getElementById('couponForm');
    const fields = {
        couponName: {
            validate: value => value.length >= 3,
            message: 'Coupon name must be at least 3 characters'
        },
        couponCode: {
            validate: value => /^[A-Z0-9]{4,}$/.test(value),
            message: 'Code must be at least 4 uppercase letters/numbers'
        },
        offerValue: {
            validate: (value, type) => {
                const num = parseFloat(value);
                return type === 'percentage' ? (num > 0 && num <= 100) : num > 0;
            },
            message: 'Invalid offer value'
        },
        minimumPrice: {
            validate: value => parseFloat(value) >= 0,
            message: 'Minimum price cannot be negative'
        },
        expiredOn: {
            validate: value => !!value,
            message: 'Please select an expiry date'
        }
    };

    // Add animation classes to form groups
    document.querySelectorAll('.form-group').forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';

        setTimeout(() => {
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Validate field and show/hide error
    function validateField(fieldName, value) {
        const field = document.getElementById(fieldName);
        const errorDiv = field.nextElementSibling;
        const validation = fields[fieldName];

        if (!validation) return true;

        const isValid = validation.validate(value, field.getAttribute('data-type'));

        if (!isValid) {
            field.classList.add('error');
            errorDiv.textContent = validation.message;
            errorDiv.classList.add('show');
            return false;
        }

        field.classList.remove('error');
        errorDiv.classList.remove('show');
        return true;
    }

    // Handle offer type change
    const offerTypeSelect = document.getElementById('offerType');
    const offerValueInput = document.getElementById('offerValue');

    offerTypeSelect.addEventListener('change', function () {
        offerValueInput.setAttribute('data-type', this.value);
        offerValueInput.placeholder = this.value === 'percentage' ?
            'Enter percentage (1-100)' : 'Enter amount';
        validateField('offerValue', offerValueInput.value);
    });

    // Form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let isValid = true;

        // Validate all fields
        Object.keys(fields).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!validateField(fieldName, field.value)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Add loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';

            // Simulate form submission (replace with actual submission)
            setTimeout(() => {
                form.submit();
            }, 1000);
        }
    });

    // Real-time validation
    Object.keys(fields).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        field.addEventListener('input', () => validateField(fieldName, field.value));
        field.addEventListener('blur', () => validateField(fieldName, field.value));
    });

    // Toggle switch animation
    const toggleSwitch = document.getElementById('isActive');
    const toggleLabel = document.getElementById('toggleLabel');

    toggleSwitch.addEventListener('change', function () {
        toggleLabel.textContent = this.checked ? 'Active' : 'Inactive';
        toggleLabel.style.color = this.checked ? '#10B981' : '#EF4444';
    });
});