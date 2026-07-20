const nodemailer = require("nodemailer");

const sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  req.session.otp = otp;
  req.session.email = email;

  console.log("Generated OTP:", otp);

  try {
    console.log("Creating transporter...");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });

    console.log("Checking SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP Connected");

    console.log("Sending Mail...");

    const info = await transporter.sendMail({
      from: `"Student Feedback System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Student Feedback System OTP",
      html: `
        <h2>Student Feedback System</h2>
        <p>Your OTP is:</p>
        <h1 style="color:blue;">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log("✅ Mail Sent:", info.messageId);

    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });

  } catch (error) {
    console.error("❌ MAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};