const studentForm = document.getElementById("studentForm");

studentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const studentData = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        registerNumber: document.getElementById("registerNumber").value,
        department: document.getElementById("department").value,
        year: document.getElementById("year").value,
        gender: document.getElementById("gender").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        feedback: document.getElementById("feedback").value
    };

    try {
        fetch("http://localhost:5000/send-otp")

        const response = await fetch("/api/students/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });

        const data = await response.json();

        if (data.success) {

            alert("✅ Feedback Submitted Successfully");

            studentForm.reset();

        } else {

            alert("❌ " + data.message);

        }

    } catch (error) {

        console.error(error);
        alert("❌ Server Error");

    }
});

function logout() {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (confirmLogout) {

        alert("Logged Out Successfully");

        window.location.href = "/login.html";

    }
}
function logout() {
  // session / login data remove pannum
  localStorage.removeItem("token"); 
  localStorage.removeItem("user");

  // alert message
  alert("👋 Logged out successfully!");

  // login page-ku redirect
  window.location.href = "/login.html";
}