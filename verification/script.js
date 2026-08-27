function verify() {
    const code = document.getElementById("code").value.trim();
    if (code.length !== 6) {
        alert("اكتب كود من 6 أرقام");
        return
    }
    localStorage.setItem("verified", "1");
    location.href = "../login/index.html";
}