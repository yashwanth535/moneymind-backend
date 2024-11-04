const nodemailer = require('nodemailer');

// Create a transporter object
const transporter = nodemailer.createTransport({
    service: 'gmail', // Using Gmail as the email service
    auth: {
        user: 'verify.moneymind@gmail.com', // Your email address
        pass: 'bxje idtg heav kkdk', // Your app password
    },
});
function generateOTP() {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString(); // Convert to string if needed
}

const otp = generateOTP();


// Email options
const mailOptions = {
    from: '"moneymind" verify.moneymind@gmail.com', // Sender's email address
    to: 'yashwanth.lumia535@gmail.com', // Recipient's email address
    subject: 'OTP verification!', // Subject of the email
    text: otp+' this is you one time password to register into moneymind ', // Plain text body
    // html: '<h1>This is a test email</h1>' // HTML body (if needed)
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error occurred: ' + error.message);
    }
    console.log('Email sent: ' + info.response);
});
