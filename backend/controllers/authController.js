const nodemailer = require("nodemailer");

// ================= SEND OTP =================

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
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // SMTP connection check
    await transporter.verify();
    console.log("SMTP Connected Successfully");

    // Send OTP Mail
    await transporter.sendMail({
      from: `"Student Feedback System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Student Feedback System OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    console.log("OTP Sent Successfully");

    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });

  } catch (error) {
    console.error("Mail Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// ================= VERIFY OTP =================

const verifyOTP = (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "OTP is required",
    });
  }

  if (Number(otp) === Number(req.session.otp)) {
    req.session.isAuthenticated = true;

    return res.json({
      success: true,
      message: "OTP Verified Successfully",
    });
  }

  return res.status(400).json({
    success: false,
    message: "Invalid OTP",
  });
};

module.exports = {
  sendOTP,
  verifyOTP,
};