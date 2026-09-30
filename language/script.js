let selected = localStorage.getItem("language") || "";

function choose(value) {
  selected = value;
  localStorage.setItem("language", value);
  document.querySelectorAll(".choice").forEach(button => button.classList.toggle("selected", button.textContent.trim() === value));
}

function next() {
  if (!selected) {
    alert("اختار اللغة الأول");
    return;
  }
  window.location.href = "../register/index.html";
}

if (selected) choose(selected);
