const decks = window.LL_DECKS || [];
let stats = LLStorage.get("stats", { cards: 0, words: 0 });

function updateProfileIdentity() {
  const user = LLStorage.get("user", LLStorage.get("pendingUser", {}));
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  document.getElementById("profile-name").textContent = fullName || user.username || "اسم المستخدم";
  document.getElementById("profile-level").textContent = `Level ${Number(user.level || 1)} 🔥`;
}

function render() {
  document.getElementById("decks").innerHTML = decks.map(deck => {
    const count = deck.cards.length;
    return `<article class="deck" data-deck-id="${deck.id}" role="button" tabindex="0"><div><h3>${deck.name}</h3><span class="count">${count ? `${count} كروت جديدة` : "لا يوجد كروت حاليًا"}</span></div><div class="play"><i class="fa-solid fa-${count ? "play" : "clock"}"></i></div></article>`;
  }).join("");
  document.getElementById("cards").innerHTML = `${stats.cards} <small>كارت</small>`;
  document.getElementById("words").innerHTML = `${stats.words} <small>كلمة</small>`;
  document.getElementById("achievementCards").textContent = stats.cards;
  document.getElementById("achievementWords").textContent = stats.words;
  updateProfileIdentity();
}

function openDeck(id, element) {
  const deck = decks.find(item => item.id === id);
  if (!deck?.cards.length) return;
  element.style.transform = "scale(.97)";
  window.setTimeout(() => { window.location.href = `../study/index.html?deck=${encodeURIComponent(id)}`; }, 140);
}

function switchTab(tab) {
  document.getElementById("homePanel").classList.toggle("hidden", tab !== "home");
  document.getElementById("statsPanel").classList.toggle("hidden", tab === "home");
  document.getElementById("homeBtn").classList.toggle("active", tab === "home");
  document.getElementById("statsBtn").classList.toggle("active", tab === "stats");
  document.getElementById("indicator").style.transform = tab === "home" ? "translateX(0)" : "translateX(-100%)";
}

function toggleProfile() { document.getElementById("profileMenu").classList.toggle("hidden"); }
function openSubscription() { document.getElementById("profileMenu").classList.add("hidden"); document.getElementById("subscription").classList.remove("hidden"); }
function closeSubscription(event) { if (!event || event.target.id === "subscription") document.getElementById("subscription").classList.add("hidden"); }
function logout() { localStorage.removeItem("loggedIn"); window.location.href = "../landing/index.html"; }
function shareProgress() {
  const text = `إنجازاتي في Learn Languages: ذاكرت ${stats.cards} كارت وحفظت ${stats.words} كلمة.`;
  if (navigator.share) navigator.share({ title: "إنجازاتي", text }).catch(() => {});
  else navigator.clipboard?.writeText(text).then(() => alert("تم نسخ الإنجازات للمشاركة"));
}

document.getElementById("decks").addEventListener("click", event => {
  const deck = event.target.closest("[data-deck-id]");
  if (deck) openDeck(deck.dataset.deckId, deck);
});
document.getElementById("decks").addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    const deck = event.target.closest("[data-deck-id]");
    if (deck) openDeck(deck.dataset.deckId, deck);
  }
});
document.addEventListener("click", event => { if (!event.target.closest(".profile")) document.getElementById("profileMenu").classList.add("hidden"); });
render();
