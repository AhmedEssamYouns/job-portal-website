const nodemailer = require('nodemailer');

// Create a transporter object
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send the password reset email
const sendResetEmail = (email, resetToken) => {
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`; // Replace with your frontend URL

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <h2>Password Reset Request</h2>
            <p>Hi,</p>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request this, please ignore this email.</p>
        `,
    };

    // Send the email
    return transporter.sendMail(mailOptions);
};
