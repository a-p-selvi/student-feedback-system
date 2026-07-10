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

  console.log("OTP Request Received");
  console.log("Email:", email);
  console.log("Generated OTP:", otp);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Student Feedback System OTP",
      text: `Your OTP is ${otp}`,
    });

    console.log("Mail Sent Successfully");
    console.log(info.response);

    res.json({
      success: true,
      message: "OTP Sent Successfully",
    });

  } catch (error) {
    console.log("MAIL ERROR:");
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to Send OTP",
    });
  }
};

const verifyOTP = (req, res) => {
  const { otp } = req.body;

  console.log("Entered OTP:", otp);
  console.log("Stored OTP:", req.session.otp);

  if (Number(otp) === req.session.otp) {
    req.session.isAuthenticated = true;

    return res.json({
      success: true,
      message: "OTP Verified",
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
