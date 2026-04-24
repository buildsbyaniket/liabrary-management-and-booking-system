import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  try {
    console.log("📧 Sending email to:", email);
    console.log("📧 Using:", process.env.SMTP_MAIL);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to: email,
      subject,
      html: message,
    });

    console.log("✅ EMAIL SENT SUCCESS");
    return true;

  } catch (err) {
    console.log("❌ EMAIL ERROR:", err.message);
    return false;
  }
};