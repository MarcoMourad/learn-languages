function verify() {
  const code = document.getElementById("code").value.trim();
  if (!/^\d{6}$/.test(code)) {
    alert("اكتب كود من 6 أرقام");
    return;
  }
  const user = LLStorage.get("pendingUser", {});
  LLStorage.set("user", user);
  LLStorage.remove("pendingUser");
  localStorage.setItem("verified", "1");
  window.location.href = "../login/index.html";
}
