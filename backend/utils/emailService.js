import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
       user: process.env.EMAIL_USER, // .env
        pass: process.env.EMAIL_PASS  // .env
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    console.log(` Email sent to ${to}`);
  } catch (error) {
    console.error(" Email sending failed:", error.message);
  }
};

export default sendEmail;