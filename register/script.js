function submitRegister() {
  const firstName = document.getElementById("first").value.trim();
  const lastName = document.getElementById("last").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!firstName || !email || !password) {
    alert("اكتب الاسم الأول والبريد وكلمة المرور");
    return;
  }
  const user = {
    firstName, lastName, email,
    birthDate: [document.getElementById("year").value, document.getElementById("month").value, document.getElementById("day").value].filter(Boolean).join("-"),
    city: document.getElementById("city").value.trim(),
    country: document.getElementById("country").value,
    gender: document.getElementById("gender").value,
    language: localStorage.getItem("language") || "عربي (مصري)",
    level: 1
  };
  LLStorage.set("pendingUser", user);
  localStorage.setItem("pendingEmail", email);
  window.location.href = "../verification/index.html";
}
