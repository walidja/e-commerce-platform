require("dotenv").config();

const nodemailer = require("nodemailer");
const pug = require("pug"); // For HTML templating
const { htmlToText } = require("html-to-text"); // For plain text fallback

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName.split(" ")[0]; // Assuming user.name is "First Last"
    this.url = url;
    this.from = `Your App Name <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // For development, use a service like Mailtrap.io or Ethereal.email (for testing)
    if (process.env.NODE_ENV === "development") {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST_DEV, // e.g., 'smtp.mailtrap.io' or 'smtp.ethereal.email'
        port: process.env.EMAIL_PORT_DEV,
        auth: {
          user: process.env.EMAIL_USER_DEV,
          pass: process.env.EMAIL_PASS_DEV,
        },
      });
    }

    // For production, use your actual ESP's SMTP details
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465, // Use 'true' if port is 465, 'false' for 587/2525
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Important for deliverability with some providers:
      // tls: {
      //   rejectUnauthorized: false // Only if you have self-signed certs or are testing
      // }
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html), // Always include a plain-text version for accessibility and spam filters
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  // Specific email methods
  async sendWelcome() {
    await this.send("welcome", "Welcome to Yalla Market!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your Password Reset Token (valid for 10 min)"
    );
  }
}

module.exports = Email;
