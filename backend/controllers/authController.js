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
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Checking SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP Connected");

    console.log("Sending Mail...");

    const info = await transporter.sendMail({
      from: `"Student Feedback System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Student Feedback System OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
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