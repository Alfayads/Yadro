const successStyles = `
.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
  backdrop-filter: blur(5px);
}

.success-container {
  width: 90%;
  max-width: 400px;
  background: white;
  border-radius: 24px;
  padding: 32px;
  position: relative;
  transform: translateY(30px) scale(0.95);
  opacity: 0;
  animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.success-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #059669, #34D399);
  transform: translateX(-100%);
  animation: slideRight 1s ease-out forwards;
}

.success-icon-wrapper {
  width: 72px;
  height: 72px;
  margin: 0 auto 24px;
  position: relative;
}

.success-icon-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(45deg, #059669, #34D399);
  transform: scale(0);
  animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
}

.success-icon-checkmark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 32px;
  height: 32px;
  transform: translate(-50%, -50%) scale(0);
  animation: checkmarkIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
}

.success-icon-checkmark svg {
  width: 100%;
  height: 100%;
  color: white;
  stroke-dasharray: 80;
  stroke-dashoffset: 80;
  animation: drawCheck 0.6s ease-out 0.8s forwards;
}

.success-confetti {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 1px;
  opacity: 0;
}

.success-title {
  font-family: system-ui, -apple-system, sans-serif;
  color: #059669;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
  opacity: 0;
  transform: translateY(10px);
  animation: slideUpFade 0.6s ease 0.4s forwards;
}

.success-message {
  font-family: system-ui, -apple-system, sans-serif;
  color: #4B5563;
  font-size: 16px;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 24px;
  opacity: 0;
  transform: translateY(10px);
  animation: slideUpFade 0.6s ease 0.6s forwards;
}

.success-button {
  display: block;
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #059669, #34D399);
  color: white;
  border: none;
  border-radius: 12px;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  transform: translateY(10px);
  animation: slideUpFade 0.6s ease 0.8s forwards;
}

.success-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}

.success-details {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #E5E7EB;
  opacity: 0;
  animation: fadeIn 0.6s ease 1s forwards;
}

.success-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-family: system-ui, -apple-system, sans-serif;
}

.success-detail-label {
  color: #6B7280;
  font-size: 14px;
}

.success-detail-value {
  color: #1F2937;
  font-weight: 600;
  font-size: 14px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

@keyframes checkmarkIn {
  from { transform: translate(-50%, -50%) scale(0); }
  to { transform: translate(-50%, -50%) scale(1); }
}

@keyframes drawCheck {
  from { stroke-dashoffset: 80; }
  to { stroke-dashoffset: 0; }
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideRight {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.confetti {
  position: absolute;
  animation: confetti 1s ease-out forwards;
}

@keyframes confetti {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100px) rotate(720deg);
    opacity: 0;
  }
}
`;

function createConfetti(container, count = 30) {
    const colors = ['#059669', '#34D399', '#6EE7B7', '#A7F3D0', '#ECFDF5'];

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = (Math.random() * 50 - 50) + 'px';
        confetti.style.width = (Math.random() * 8 + 4) + 'px';
        confetti.style.height = (Math.random() * 8 + 4) + 'px';
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        confetti.style.animationDuration = (Math.random() * 1 + 1) + 's';
        container.appendChild(confetti);
    }
}

function showSuccessMessage({
    title = 'Success!',
    message = 'Operation completed successfully',
    buttonText = 'Continue',
    onButtonClick = () => { },
    details = null,
    autoClose = 5000
} = {}) {
    // Add styles
    if (!document.getElementById('success-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'success-styles';
        styleSheet.textContent = successStyles;
        document.head.appendChild(styleSheet);
    }

    // Create elements
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay';
    overlay.id = 'successOverlay';

    const container = document.createElement('div');
    container.className = 'success-container';

    // Create icon
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'success-icon-wrapper';

    const iconCircle = document.createElement('div');
    iconCircle.className = 'success-icon-circle';

    const iconCheckmark = document.createElement('div');
    iconCheckmark.className = 'success-icon-checkmark';
    iconCheckmark.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
      <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

    iconWrapper.appendChild(iconCircle);
    iconWrapper.appendChild(iconCheckmark);

    // Create content
    const titleElement = document.createElement('div');
    titleElement.className = 'success-title';
    titleElement.textContent = title;

    const messageElement = document.createElement('div');
    messageElement.className = 'success-message';
    messageElement.textContent = message;

    const button = document.createElement('button');
    button.className = 'success-button';
    button.textContent = buttonText;
    button.onclick = () => {
        hideSuccessMessage();
        onButtonClick();
    };

    // Assemble the message
    container.appendChild(iconWrapper);
    container.appendChild(titleElement);
    container.appendChild(messageElement);

    // Add details if provided
    if (details) {
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'success-details';

        Object.entries(details).forEach(([label, value]) => {
            const detailItem = document.createElement('div');
            detailItem.className = 'success-detail-item';

            const detailLabel = document.createElement('div');
            detailLabel.className = 'success-detail-label';
            detailLabel.textContent = label;

            const detailValue = document.createElement('div');
            detailValue.className = 'success-detail-value';
            detailValue.textContent = value;

            detailItem.appendChild(detailLabel);
            detailItem.appendChild(detailValue);
            detailsContainer.appendChild(detailItem);
        });

        container.appendChild(detailsContainer);
    }

    container.appendChild(button);
    overlay.appendChild(container);

    // Add confetti
    createConfetti(container);

    // Add to document
    document.body.appendChild(overlay);

    // Auto-close if enabled
    let autoCloseTimeout;
    if (autoClose) {
        autoCloseTimeout = setTimeout(hideSuccessMessage, autoClose);
    }

    // Return close function
    return () => {
        if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
        hideSuccessMessage();
    };
}

function hideSuccessMessage() {
    const overlay = document.getElementById('successOverlay');
    if (overlay) {
        overlay.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => overlay.remove(), 300);
    }
}

// Usage examples:
/*
// Basic usage
showSuccessMessage({
  title: 'Order Confirmed!',
  message: 'Your order has been successfully placed.',
  buttonText: 'View Order'
});

// With details
showSuccessMessage({
  title: 'Payment Successful!',
  message: 'Your payment has been processed successfully.',
  buttonText: 'View Receipt',
  details: {
    'Order ID': '#12345',
    'Amount': '$99.99',
    'Payment Method': 'Credit Card',
    'Date': '2024-10-25'
  },
  onButtonClick: () => {
    console.log('Button clicked');
  },
  autoClose: 7000 // Close after 7 seconds
});

// Without auto-close
showSuccessMessage({
  title: 'Welcome Aboard!',
  message: 'Your account has been created successfully.',
  buttonText: 'Get Started',
  autoClose: false
});
*/

