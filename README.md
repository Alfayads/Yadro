# ![Yadro Logo](https://via.placeholder.com/150) Yadro E-commerce Platform

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC) [![Node.js](https://img.shields.io/badge/Node.js-v14.17.0-green.svg)](https://nodejs.org/) [![Express](https://img.shields.io/badge/Express-v4.21.0-lightgrey.svg)](https://expressjs.com/)

Welcome to **Yadro**, a modern and comprehensive e-commerce platform designed to provide seamless shopping experiences for users and robust management tools for store owners.

## 🚀 Features

- **🔒 User Authentication**: Secure login and registration with Passport.js.
- **🛍️ Product Management**: Add, update, and remove products with ease.
- **🛒 Shopping Cart**: Intuitive cart management for users.
- **📦 Order Processing**: Efficient order management and tracking.
- **💳 Payment Integration**: Secure payment processing with Razorpay.
- **📱 Responsive Design**: Mobile-first design ensuring a great experience on any device.
- **📝 PDF Generation**: Create invoices and reports using jsPDF and pdfkit.
- **📊 Data Export**: Export data to Excel using xlsx.
- **📧 Email Notifications**: Send emails with Nodemailer.
- **🔐 Two-Factor Authentication**: Enhance security with OTPs using otp-generator.

## 🔮 Upcoming Features Predictions

- **🤖 AI-Powered Recommendations**: Implement machine learning algorithms to provide personalized product recommendations.
- **📈 Advanced Analytics Dashboard**: Develop a comprehensive analytics dashboard for store owners to track sales, user behavior, and more.
- **🌍 Multi-language Support**: Expand the platform to support multiple languages for a global reach.
- **🔗 Social Media Integration**: Enable users to share products and reviews on social media platforms.
- **📅 Subscription Models**: Introduce subscription-based products and services.

## 🔧 Environment Configuration

To configure your environment, create a `.env` file in the root directory of the project. Below are the keys you need to include, along with their descriptions:

- `MONGO_URL`: The connection string for your MongoDB database.
- `SESSION_SECRET`: A secret key used to sign session cookies.
- `KEY_ID`: Your Razorpay API key ID for payment processing.
- `KEY_SECRET`: Your Razorpay API key secret for payment processing.
- `EMAIL_SERVICE`: The email service provider you are using (e.g., Gmail).
- `MAIL_EMAIL`: The email address used to send notifications.
- `MAIL_PASS`: The password for the email account used to send notifications.
- `GOOGLE_CLIENT_ID`: The client ID for Google OAuth authentication.
- `GOOGLE_CLIENT_SECRET`: The client secret for Google OAuth authentication.

Ensure that you replace the placeholder values with your actual credentials and secrets.

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Alfayads/Yadro.git
   ```
2. Navigate into the project directory:
   ```bash
   cd yadro
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file and configure your environment variables.
5. Start the development server:
   ```bash
   npm run dev
   ```

## 🧰 Technologies Used

- **Node.js & Express**: Backend framework.
- **MongoDB & Mongoose**: Database and ODM.
- **EJS**: Templating engine for server-side rendering.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Razorpay**: Payment gateway integration.
- **Nodemailer**: Email sending service.
- **Multer**: File upload management.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📜 License

This project is licensed under the ISC License.

---

Feel free to explore and contribute to the Yadro e-commerce platform. Happy coding!

---
