import { generateVerificationOtpEmailTemplate } from "./emailTemplate.js";
import { sendEmail } from "./sendEmail.js";

export async function sendVerificationCode(email, otp) {
  try {
    const message = generateVerificationOtpEmailTemplate(otp);

    console.log("OTP:", otp);

    const sent = await sendEmail({
      email,
      subject: "Verification Code (Library System)",
      message,
    });

    return sent;

  } catch (err) {
    console.log("OTP SEND ERROR:", err.message);
    return false;
  }
}