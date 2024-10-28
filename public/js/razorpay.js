// Payment handling
async function initiatePayment(productId, amount) {
    try {
        const response = await fetch('/createOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId,
                amount
            })
        });

        const order = await response.json();

        if (!order.id) {
            throw new Error('Failed to create order');
        }

        const options = {
            key: 'rzp_test_t4YUM4TLWyBT2D',
            amount: order.amount,
            currency: order.currency,
            name: 'MyStore',
            description: 'Purchase Payment',
            order_id: order.id,
            handler: async function (response) {
                try {
                    const verificationResponse = await fetch('/verifyPayment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            order_id: response.razorpay_order_id,
                            payment_id: response.razorpay_payment_id,
                            signature: response.razorpay_signature
                        })
                    });

                    const verificationResult = await verificationResponse.json();

                    if (verificationResult.success) {
                        alert('Payment successful!');
                    } else {
                        alert('Payment verification failed');
                    }
                } catch (error) {
                    console.error('Verification failed:', error);
                    alert('Payment verification failed');
                }
            },
            prefill: {
                name: 'Customer Name',
                email: 'customer@example.com',
                contact: '9999999999'
            },
            theme: {
                color: '#2563EB'
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

    } catch (error) {
        console.error('Payment initiation failed:', error);
        alert('Failed to initiate payment');
    }
}