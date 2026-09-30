const choices = {};

document.querySelectorAll(".goal-grid").forEach(group => {
  group.addEventListener("click", event => {
    const button = event.target.closest(".small-choice");
    if (!button) return;
    const key = group.dataset.group;
    if (key === "topics") button.classList.toggle("selected");
    else {
      group.querySelectorAll(".small-choice").forEach(item => item.classList.remove("selected"));
      button.classList.add("selected");
    }
    choices[key] = [...group.querySelectorAll(".selected")].map(item => item.textContent.trim());
  });
});

function finish() {
  LLStorage.set("learningPreferences", choices);
  localStorage.setItem("onboarded", "1");
  window.location.href = "../dashboard/index.html";
}
