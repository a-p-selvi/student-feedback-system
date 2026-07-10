const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");

// ================= SEND OTP =================

sendOtpBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Please enter your email");
    return;
  }

  try {
    console.log("Sending Email:", email);

    const response = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const text = await response.text();
    console.log("Server Response:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      alert("❌ Server returned HTML instead of JSON.\nCheck Render Backend Logs.");
      return;
    }

    if (response.ok && data.success) {
      alert("✅ OTP Sent Successfully");
    } else {
      alert("❌ " + (data.message || "Failed to send OTP"));
    }
  } catch (error) {
    console.error(error);
    alert("❌ Failed to connect to server");
  }
});

// ================= VERIFY OTP =================

verifyOtpBtn.addEventListener("click", async () => {
  const otp = document.getElementById("otp").value.trim();

  if (!otp) {
    alert("Please enter OTP");
    return;
  }

  try {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp }),
    });

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      alert("❌ Server returned HTML instead of JSON.");
      return;
    }

    if (response.ok && data.success) {
      alert("✅ OTP Verified Successfully");
      window.location.href = "/dashboard.html";
    } else {
      alert("❌ " + (data.message || "Invalid OTP"));
    }
  } catch (error) {
    console.error(error);
    alert("❌ Verification Failed");
  }
});