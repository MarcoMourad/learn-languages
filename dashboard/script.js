const decks = [
  { id: "deck1", name: "مجموعة المحادثة الأساسية", cards: 2 },
  { id: "deck2", name: "مصطلحات العمل (Business)", cards: 3 },
  { id: "deck3", name: "أفعال مركبة (Phrasal Verbs)", cards: 1 },
  { id: "deck4", name: "جمل السفر", cards: 0 },
  { id: "deck5", name: "مفردات التكنولوجيا", cards: 0 }
];

let stats = JSON.parse(localStorage.getItem("stats") || '{"cards":0,"words":0}');

function updateProfileIdentity() {
  const profileName = document.getElementById("profile-name");
  const profileLevel = document.getElementById("profile-level");

  if (!profileName || !profileLevel) return;

  let user = {};
  try {
    user = JSON.parse(
      localStorage.getItem("user") ||
      localStorage.getItem("pendingUser") ||
      "{}"
    );
  } catch {
    user = {};
  }

  const firstName =
    user.firstName ||
    user.first ||
    user.first_name ||
    "";

  const lastName =
    user.lastName ||
    user.last ||
    user.last_name ||
    "";

  const username =
    user.username ||
    user.userName ||
    user.name ||
    "";

  const fullName = `${firstName} ${lastName}`.trim();
  profileName.textContent = fullName || username || "اسم المستخدم";

  const level =
    Number(
      user.level ||
      localStorage.getItem("userLevel") ||
      1
    ) || 1;

  profileLevel.textContent = `Level ${level} 🔥`;
}

function render() {
  const el = document.getElementById("decks");
  el.innerHTML = decks.map(d => `
    <article class="deck" onclick="openDeck('${d.id}',this)">
      <div>
        <h3>${d.name}</h3>
        <span class="count">${d.cards ? d.cards + " كروت جديدة" : "لا يوجد كروت حالياً"}</span>
      </div>
      <div class="play">
        <i class="fa-solid fa-play"></i>
      </div>
    </article>
  `).join("");

  document.getElementById("cards").innerHTML = stats.cards + ' <small>كارت</small>';
  document.getElementById("words").innerHTML = stats.words + ' <small>كلمة</small>';
  document.getElementById("achievementCards").textContent = stats.cards;
  document.getElementById("achievementWords").textContent = stats.words;
  updateProfileIdentity();
}

function openDeck(id, el) {
  const d = decks.find(x => x.id === id);
  
  if (!d.cards) {
    const p = el.querySelector(".play");
    p.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    setTimeout(() => p.innerHTML = '<i class="fa-solid fa-play"></i>', 900);
    return;
  }
  
  localStorage.setItem("activeDeck", id);
  el.style.transform = "scale(.97)";
  setTimeout(() => location.href = "../study/index.html", 180);
}

function switchTab(tab) {
  const a = document.getElementById("homePanel");
  const b = document.getElementById("statsPanel");
  const hb = document.getElementById("homeBtn");
  const sb = document.getElementById("statsBtn");
  const ind = document.getElementById("indicator");
  
  const show = tab === "home" ? a : b;
  const hide = tab === "home" ? b : a;
  
  hide.classList.add("exit");
  
  setTimeout(() => {
    hide.classList.add("hidden");
    hide.classList.remove("exit");
    show.classList.remove("hidden");
    show.classList.add("enter");
    setTimeout(() => show.classList.remove("enter"), 400);
  }, 180);
  
  hb.classList.toggle("active", tab === "home");
  sb.classList.toggle("active", tab === "stats");
  ind.style.transform = tab === "home" ? "translateX(0)" : "translateX(-100%)";
}

function toggleProfile() {
  const menu = document.getElementById("profileMenu");
  menu.classList.toggle("hidden");
}

function shareProgress() {
  const cards = stats.cards || 0;
  const words = stats.words || 0;
  
  document.getElementById("achievementCards").textContent = cards;
  document.getElementById("achievementWords").textContent = words;
  
  const text = `إنجازاتي في Learn Languages 🔥\nذاكرت ${cards} كارت وحفظت ${words} كلمة.`;
  
  if (navigator.share) {
    navigator.share({ title: "إنجازاتي", text }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(text).then(() => alert("تم نسخ الإنجازات للمشاركة"));
  }
}

function openSubscription() {
  document.getElementById("profileMenu").classList.add("hidden");
  document.getElementById("subscription").classList.remove("hidden");
}

function closeSubscription(e) {
  if (!e || e.target.id === "subscription") {
    document.getElementById("subscription").classList.add("hidden");
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  location.href = "../landing/index.html";
}

document.addEventListener("click", e => {
  if (!e.target.closest(".profile")) {
    document.getElementById("profileMenu").classList.add("hidden");
  }
});

updateProfileIdentity();
render();