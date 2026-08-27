function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!email || !password) {
        alert("اكتب البريد وكلمة المرور");
        return
    }
    localStorage.setItem("loggedIn", "1");
    location.href = "../goals/index.html";
}