const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");

sendOtpBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value;

    if (!email) {
        alert("Please enter your email");
        return;
    }

    try {

        console.log("Sending Email:", email);

        const response = await fetch("/api/auth/send-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        console.log(data);

        if (data.success) {
            alert("✅ OTP Sent Successfully");
        } else {
            alert("❌ " + data.message);
        }

    } catch (error) {

        console.error(error);
        alert("❌ Failed to connect to server");

    }
});

verifyOtpBtn.addEventListener("click", async () => {

    const otp = document.getElementById("otp").value;

    if (!otp) {
        alert("Please enter OTP");
        return;
    }

    try {

        const response = await fetch("/api/auth/verify-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ otp })
        });

        const data = await response.json();

        if (data.success) {

            alert("✅ OTP Verified Successfully");
            window.location.href = "/dashboard.html";

        } else {

            alert("❌ Invalid OTP");

        }

    } catch (error) {

        console.error(error);
        alert("❌ Verification Failed");

    }
});