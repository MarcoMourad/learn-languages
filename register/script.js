function submitRegister() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const first = document.getElementById("first").value.trim();
    if (!email || !password || !first) {
        alert("كمل البيانات المطلوبة");
        return
    }
    localStorage.setItem("pendingEmail", email);
    localStorage.setItem("pendingUser", JSON.stringify({
        email,
        first
    }));
    location.href = "../verification/index.html";
}