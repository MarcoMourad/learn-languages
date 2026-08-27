function toggle(e) {
    e.classList.toggle("selected")
}

function finish() {
    localStorage.setItem("onboarded", "1");
    location.href = "../dashboard/index.html";
}