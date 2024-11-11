const PDFDocument = require('pdfkit');
const Order = require('../models/Order');



function createInvoice(doc, invoice) {
    // Set document metadata
    doc.info['Title'] = 'Yadro Invoice';
    doc.info['Author'] = 'Yadro';

    // Enhanced color palette with better contrast
    const colors = {
        primary: '#D32F2F',
        secondary: '#B71C1C',
        accent: '#FFCDD2',
        text: '#2C3E50',
        lightGray: '#F5F5F5',
        success: '#C62828',
        warning: '#FF8A80',
        background: '#FFFFFF'
    };

    // Add refined background
    drawBackground(doc, colors.background);

    // Enhanced header with better spacing
    createHeader(doc, colors);

    // Improved company info layout
    createCompanyInfo(doc, colors);

    // Better positioned invoice details
    createInvoiceDetails(doc, invoice, colors);

    // Enhanced billing section
    createBillToSection(doc, invoice, colors);

    // Beautiful table design
    createItemsList(doc, invoice, colors);

    // Refined total section
    createTotalSection(doc, invoice, colors);

    // Modern footer
    createFooter(doc, invoice, colors);
}

function drawBackground(doc, color) {
    // Clean, minimal background with subtle accent
    doc.rect(0, 0, doc.page.width, doc.page.height)
        .fillColor(color)
        .fill();

    // Add subtle side accent
    doc.rect(0, 0, 15, doc.page.height)
        .fillColor('#D32F2F')
        .fill();
}

function createHeader(doc, colors) {
    // Modern header with better spacing
    doc.rect(0, 0, doc.page.width, 140)
        .fillColor(colors.primary)
        .fill();

    // Refined logo area
    doc.rect(40, 25, 200, 70)
        .lineWidth(2)
        .strokeColor('#ffffff')
        .stroke();

    // Enhanced typography for company name
    doc.fontSize(42)
        .font('Helvetica-Bold')
        .fillColor('#ffffff')
        .text('YADRO', 55, 40)
        .fontSize(14)
        .font('Helvetica')
}

function createCompanyInfo(doc, colors) {
    // Better aligned company details with consistent spacing
    const infoStart = 110;
    const lineHeight = 15;

    doc.fontSize(10)
        .fillColor('#ffffff')
        .font('Helvetica');

    [
        { text: '36/5 Hustle Hub Tech Park' },
        { text: 'Somasundarapalya Main Road Sector 2, 560102' },
    ].forEach((item, index) => {
        doc.text(
            `${item.text}`,
            40,
            infoStart + (index * lineHeight)
        );
    });
}

function createInvoiceDetails(doc, invoice, colors) {
    // Enhanced invoice details box with better alignment
    const boxWidth = 220;
    const boxHeight = 120;
    const boxX = doc.page.width - boxWidth - 40;
    const boxY = 25;

    // Stylish details box
    doc.rect(boxX, boxY, boxWidth, boxHeight)
        .fillColor('#ffffff')
        .fill()
        .strokeColor(colors.primary)
        .lineWidth(1)
        .stroke();

    // Better positioned INVOICE text
    doc.fontSize(28)
        .fillColor(colors.primary)
        .font('Helvetica-Bold')
        .text('INVOICE', boxX + 20, boxY + 20);

    // Well-aligned invoice information
    const details = [
        { label: 'Invoice Number:', value: invoice.invoiceNumber },
        { label: 'Date:', value: invoice.date },
    ];

    let yPos = boxY + 60;
    details.forEach(detail => {
        doc.fontSize(10)
            .font('Helvetica-Bold')
            .fillColor(colors.text)
            .text(detail.label, boxX + 20, yPos)
            .font('Helvetica')
            .text(detail.value, boxX + 120, yPos);
        yPos += 18;
    });
}

function createBillToSection(doc, invoice, colors) {
    // Enhanced billing section with better spacing
    const sectionY = 180;

    doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor(colors.primary)
        .text('BILL TO', 40, sectionY);

    // Better customer info layout
    const customerInfo = [
        invoice.customer.name,
        invoice.customer.address,
        invoice.customer.email
    ];

    doc.fontSize(11)
        .font('Helvetica')
        .fillColor(colors.text);

    customerInfo.forEach((info, index) => {
        doc.text(info, 40, sectionY + 25 + (index * 20));
    });
}

function createItemsList(doc, invoice, colors) {
    const listTop = 300;
    const itemSpacing = 85; // Adjust vertical spacing between items

    doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor(colors.primary)
        .text('Items Purchased', 40, listTop);

    let yPos = listTop + 60;

    invoice.items.forEach((item, index) => {
        // Draw a subtle separator between items
        if (index > 0) {
            doc.moveTo(40, yPos - 10)
                .lineTo(doc.page.width - 40, yPos - 10)
                .strokeColor(colors.lightGray)
                .lineWidth(0.5)
                .stroke();
        }

        // Display item details in a list format
        doc.fontSize(12)
            .font('Helvetica-Bold')
            .fillColor(colors.text)
            .text(`Item: ${item.name}`, 40, yPos);

        doc.fontSize(10)
            .font('Helvetica')
            .fillColor(colors.text)
            .text(`Payment Method: ${item.paymentMethod}`, 40, yPos + 15)
            .text(`Quantity: ${item.quantity}`, 40, yPos + 30)
            .text(`Unit Price: ₹${item.unitPrice}`, 40, yPos + 45)
            .text(`Delivery Charge : ₹${item.deliveryCharge}`, 40, yPos + 60)
            .text(`Coupon : ${item.coupon}`, 40, yPos + 75)
            .text(`Discount: ₹${item.discount.toFixed(2)}`, 40, yPos + 95)
            .text(`Total: ₹${(item.quantity * item.unitPrice - item.discount + item.deliveryCharge).toFixed(2)}`, 40, yPos + 115);

        yPos += itemSpacing + 60; // Adjust spacing for the next item
    });

    return yPos;
}


function createTotalSection(doc, invoice, colors) {
    const totalSectionY = 500;
    const boxWidth = 250;
    const boxX = doc.page.width - boxWidth - 40;

    // Enhanced totals box
    doc.rect(boxX, totalSectionY, boxWidth, 100)
        .fillColor('#ffffff')
        .fill()
        .strokeColor(colors.primary)
        .lineWidth(1)
        .stroke();

    const discount = invoice.items[0].discount;

    const totals = [
        { label: 'Subtotal:', amount: (invoice.subtotal - discount).toFixed(2), align: 'center' },
    ];

    console.log("Creating Total Seciton :  ", invoice);


    let yPos = totalSectionY + 15;
    totals.forEach((total, i) => {
        const isTotal = i === totals.length - 1;

        if (isTotal) {
            doc.rect(boxX, yPos - 5, boxWidth, 35)
                .fillColor(colors.primary)
                .fill();
        }

        doc.fontSize(isTotal ? 14 : 11)
            .font(isTotal ? 'Helvetica-Bold' : 'Helvetica')
            .fillColor(isTotal ? '#ffffff' : colors.text)
            .text(total.label, boxX + 20, yPos)
            .text(
                `${total.amount}`,
                boxX + 20,
                yPos,
                { width: boxWidth - 40, align: 'right' }
            );

        yPos += isTotal ? 35 : 25;
    });
}

function createFooter(doc, invoice, colors) {
    const footerTop = doc.page.height - 100;

    // Modern footer with gradient
    doc.rect(0, footerTop, doc.page.width, 100)
        .fillColor(colors.primary)
        .fill();

    // Enhanced payment information layout
    doc.fontSize(12)
        .fillColor('#ffffff')
        .font('Helvetica-Bold')
        .text(`Thank you for your Order! ${invoice.customer.name}`, 40, footerTop + 20)
        .fontSize(10)
        .font('Helvetica')
        .text('Terms & Conditions Apply', 40, footerTop + 40);

    // Better positioned company info
    doc.fontSize(10)
        .text(
            'yadro.site',
            40,
            footerTop + 60,
            { width: doc.page.width - 80, align: 'right' }
        );
}


function generateInvoiceId() {
    const timestamp = Date.now().toString(36);
    const randomComponent = Math.floor(Math.random() * 1e6).toString(36);
    return `INV-${timestamp}-${randomComponent}`;
}
const downloadInvoice = async (req, res, next) => {
    const orderId = req.params.id;

    try {
        // Fetch the order and populate necessary fields
        const order = await Order.findById(orderId)
            .populate('userId') // Populate user details
            .populate({
                path: 'items.productId',
                select: 'name description salePrice' // Specify required fields
            })
            .populate({
                path: 'couponApplied',
                select: 'code name offerValue'
            });

        if (!order) {
            return res.status(404).send("Order not found");
        }

        // Create a new PDF document
        const doc = new PDFDocument({
            size: 'A4',
            margin: 0,
            bufferPages: true
        });

        // Stream PDF to response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=yadro${order._id}.pdf`);
        doc.pipe(res);

        console.log(order.items.map((item) => item));

        // Calculate delivery charge and discount
        const deliveryCharge = order.totalAmount > 5000 ? 0 : 400;
        const discount = order.offerApplied; // Amount discounted by the offer
        const couponCode = order.couponApplied ? order.couponApplied.code : '';

        // Construct the invoice data
        const invoice = {
            invoiceNumber: generateInvoiceId(),
            date: new Date().toLocaleDateString(),
            customer: {
                name: `${order.userId.fname} ${order.userId.lname}`,
                address: `${order.deliveryAddress.streetAddress} - ${order.deliveryAddress.postalCode} - ${order.deliveryAddress.phone}`,
                email: `${order.userId.email}`
            },
            items: order.items.map(item => ({
                name: item.productId.name,
                paymentMethod: order.paymentMethod,
                deliveryCharge,
                discount,
                coupon: couponCode,
                quantity: item.quantity,
                unitPrice: item.productId.salePrice
            })),
            subtotal: order.totalAmount
        };

        // Generate the PDF content
        createInvoice(doc, invoice);
        doc.end();

    } catch (error) {
        console.error('Error generating invoice:', error);
        next(error);
        res.status(500).send('Could not generate invoice');
    }
};



module.exports = {
    downloadInvoice
}