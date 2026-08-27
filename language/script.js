let selected = localStorage.getItem("language") || "";

function choose(v) {
    selected = v;
    localStorage.setItem("language", v);
    document.querySelectorAll(".choice").forEach(b => b.classList.toggle("selected", b.textContent.trim() === v));
}

function next() {
    location.href = "../register/index.html";
}