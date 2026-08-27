const mockDecksData = [
    {
        id: "deck1",
        name: "مجموعة المحادثة الأساسية",
        cards: [
            {
                id: "card-001",
                youtubeUrl: "https://www.youtube.com/watch?v=#",
                enText: "I would like to <span class='text-primary'>order</span> a coffee.",
                arText: "أود أن أطلب قهوة.",
                notes: "ركز على نطق حرف الـ r في كلمة order",
                audioUrl: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
            },
            {
                id: "card-002",
                youtubeUrl: "https://www.youtube.com/watch?v=#",
                enText: "Where is the nearest train station?",
                arText: "أين أقرب محطة قطار؟",
                notes: "جملة مهمة جداً للسفر",
                audioUrl: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
            }
        ]
    },
    {
        id: "deck2",
        name: "مصطلحات العمل (Business)",
        cards: [
            {
                id: "card-003",
                youtubeUrl: "https://www.youtube.com/watch?v=#",
                enText: "Let's <span class='text-primary'>touch base</span> next week.",
                arText: "دعنا نتواصل الأسبوع القادم.",
                notes: "Touch base = مصطلح معناه نتواصل أو نتكلم",
                audioUrl: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
            },
            {
                id: "card-004",
                youtubeUrl: "https://www.youtube.com/watch?v=#",
                enText: "Think <span class='text-primary'>outside the box</span>.",
                arText: "فكر خارج الصندوق.",
                notes: "",
                audioUrl: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
            },
            {
                id: "card-005",
                youtubeUrl: "https://www.youtube.com/watch?v=#",
                enText: "We need to <span class='text-primary'>scale up</span> our operations.",
                arText: "نحتاج إلى توسيع عملياتنا.",
                notes: "Scale up تستخدم للشركات الناشئة بكثرة",
                audioUrl: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
            }
        ]
    },
    {
        id: "deck3",
        name: "أفعال مركبة (Phrasal Verbs)",
        cards: [
            {
                id: "card-006",
                youtubeUrl: "https://www.youtube.com/watch?v=#",
                enText: "Don't <span class='text-primary'>give up</span> easily.",
                arText: "لا تستسلم بسهولة.",
                notes: "",
                audioUrl: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
            }
        ]
    },
    {
        id: "deck4",
        name: "جمل السفر",
        cards: []
    },
    {
        id: "deck5",
        name: "مفردات التكنولوجيا",
        cards: []
    }
];

let currentOnboardingStep = 1;
const totalOnboardingSteps = 5;

let userStats = {
    cardsStudiedToday: 0,
    wordsLearnedToday: 0
};

let studyQueue = [];
let initialQueueSize = 0;
let currentCardIndex = 0;
let videoPlaybackRate = 1;

let youtubePlayer = null;
let youtubeReady = false;
let pendingYoutubeVideo = null;

const views = {
    onboarding: document.getElementById("view-onboarding"),
    dashboard: document.getElementById("view-dashboard"),
    study: document.getElementById("view-study")
};

const profileMenu =
    document.getElementById("profile-menu");

const completeModal =
    document.getElementById("modal-complete");

const subscriptionModal =
    document.getElementById("modal-subscription");

function getYoutubeId(url) {
    if (!url) {
        return null;
    }

    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.hostname.includes("youtu.be")) {
            return parsedUrl.pathname.replace("/", "");
        }

        if (
            parsedUrl.hostname.includes("youtube.com") ||
            parsedUrl.hostname.includes("www.youtube-nocookie.com")
        ) {
            if (parsedUrl.pathname.includes("/embed/")) {
                return parsedUrl.pathname
                    .split("/embed/")[1]
                    .split("/")[0];
            }

            return parsedUrl.searchParams.get("v");
        }

        return null;
    } catch {
        return null;
    }
}

function onYouTubeIframeAPIReady() {
    youtubeReady = true;

    if (pendingYoutubeVideo) {
        createYoutubePlayer(pendingYoutubeVideo);
        pendingYoutubeVideo = null;
    }
}

function createYoutubePlayer(videoId) {
    if (!videoId) {
        showVideoPlaceholder();
        return;
    }

    hideVideoPlaceholder();

    if (!youtubeReady || typeof YT === "undefined") {
        pendingYoutubeVideo = videoId;
        return;
    }

    if (youtubePlayer) {
        youtubePlayer.loadVideoById(videoId);
        youtubePlayer.setPlaybackRate(videoPlaybackRate);
        return;
    }

    youtubePlayer = new YT.Player("youtube-player", {
        videoId,
        playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1
        },
        events: {
            onReady: event => {
                event.target.setPlaybackRate(videoPlaybackRate);
                event.target.playVideo();
            }
        }
    });
}

function showVideoPlaceholder() {
    document
        .getElementById("video-placeholder")
        .classList.remove("hidden");
}

function hideVideoPlaceholder() {
    document
        .getElementById("video-placeholder")
        .classList.add("hidden");
}

function updateOnboardingUI() {
    document.querySelectorAll(".step-content").forEach(step => {
        const isCurrent =
            Number(step.dataset.step) === currentOnboardingStep;

        step.classList.toggle("hidden", !isCurrent);

        if (isCurrent) {
            step.style.animation = "none";

            requestAnimationFrame(() => {
                step.style.animation = "";
            });
        }
    });

    const backButton =
        document.getElementById("btn-onboarding-back");

    const bottomBackButton =
        document.getElementById(
            "btn-onboarding-prev-bottom"
        );

    const canGoBack =
        currentOnboardingStep > 1;

    backButton.classList.toggle(
        "hidden",
        !canGoBack
    );

    bottomBackButton.style.display =
        canGoBack ? "block" : "none";

    const nextButton =
        document.getElementById(
            "btn-onboarding-next"
        );

    nextButton.textContent =
        currentOnboardingStep === totalOnboardingSteps
            ? "إبدأ التعلم"
            : "التالي";
}

function nextOnboardingStep() {
    if (
        currentOnboardingStep <
        totalOnboardingSteps
    ) {
        currentOnboardingStep++;
        updateOnboardingUI();
        return;
    }

    finishOnboarding();
}

function prevOnboardingStep() {
    if (currentOnboardingStep <= 1) {
        return;
    }

    currentOnboardingStep--;

    updateOnboardingUI();
}

function finishOnboarding() {
    views.onboarding.classList.add("exit");

    setTimeout(() => {
        views.onboarding.classList.add("hidden");

        views.dashboard.classList.remove("hidden");

        renderDecks();
        updateStatsUI();
    }, 550);
}

function switchDashboardTab(tab) {
    const mainTab = document.getElementById("tab-main");
    const statsTab = document.getElementById("tab-stats");

    const mainButton = document.getElementById("tab-main-button");
    const statsButton = document.getElementById("tab-stats-button");

    const indicator = document.getElementById("tab-indicator");

    const nextTab =
        tab === "main"
            ? mainTab
            : statsTab;

    const currentTab =
        tab === "main"
            ? statsTab
            : mainTab;

    if (!currentTab.classList.contains("hidden")) {
        currentTab.classList.add("tab-exit");

        setTimeout(() => {
            currentTab.classList.add("hidden");
            currentTab.classList.remove("tab-exit");

            nextTab.classList.remove("hidden");

            void nextTab.offsetWidth;

            nextTab.classList.add("tab-enter");
        }, 180);
    } else {
        nextTab.classList.remove("hidden");

        void nextTab.offsetWidth;

        nextTab.classList.add("tab-enter");
    }

    mainButton.classList.toggle(
        "active",
        tab === "main"
    );

    statsButton.classList.toggle(
        "active",
        tab === "stats"
    );

    indicator.style.transform =
        tab === "main"
            ? "translateX(0)"
            : "translateX(-100%)";
}

function toggleProfileMenu() {
    profileMenu.classList.toggle("hidden");
}

function renderDecks() {
    const container =
        document.getElementById(
            "decks-container"
        );

    container.innerHTML = "";

    mockDecksData.forEach(deck => {
        const cardCount =
            deck.cards?.length || 0;

        const card =
            document.createElement("div");

        card.className = "deck-card";

        card.addEventListener(
            "click",
            () => {
                startStudySession(
                    deck.id,
                    card
                );
            }
        );

        card.innerHTML = `
            <div>
                <h3 class="deck-title">
                    ${deck.name}
                </h3>

                <span class="deck-count">
                    ${
                        cardCount
                            ? `${cardCount} كروت جديدة`
                            : "لا يوجد كروت حالياً"
                    }
                </span>
            </div>

            <div class="deck-play">
                <i class="fa-solid fa-play"></i>
            </div>
        `;

        container.appendChild(card);
    });
}

function startStudySession(
    deckId,
    deckElement
) {
    const deck =
        mockDecksData.find(
            item => item.id === deckId
        );

    if (!deck || !deck.cards?.length) {
        const playButton =
            deckElement.querySelector(
                ".deck-play"
            );

        playButton.innerHTML =
            '<i class="fa-solid fa-xmark"></i>';

        playButton.style.color =
            "#ff3b30";

        setTimeout(() => {
            playButton.innerHTML =
                '<i class="fa-solid fa-play"></i>';

            playButton.style.color = "";
        }, 1000);

        return;
    }

    studyQueue = [...deck.cards];

    initialQueueSize =
        studyQueue.length;

    currentCardIndex = 0;

    const dashboard =
        views.dashboard;

    const study =
        views.study;

    dashboard.classList.add(
        "study-exit"
    );

    setTimeout(() => {
        dashboard.classList.add("hidden");
        dashboard.classList.remove(
            "study-exit"
        );

        study.classList.remove("hidden");

        requestAnimationFrame(() => {
            study.classList.add(
                "study-enter"
            );
        });

        renderCurrentCard();

        const cardPanel =
            study.querySelector(
                ".card-panel"
            );

        const mediaPanel =
            study.querySelector(
                ".media-panel"
            );

        cardPanel.classList.remove(
            "animate-card"
        );

        mediaPanel.classList.remove(
            "animate-media"
        );

        void cardPanel.offsetWidth;

        cardPanel.classList.add(
            "animate-card"
        );

        mediaPanel.classList.add(
            "animate-media"
        );
    }, 280);
}

function renderCurrentCard() {
    if (!studyQueue.length) {
        showCompleteSession();
        return;
    }

    const card = studyQueue[0];

    const completedCards =
        initialQueueSize -
        studyQueue.length;

    const progress =
        initialQueueSize > 0
            ? (
                completedCards /
                initialQueueSize
            ) * 100
            : 0;

    const progressBar =
        document.getElementById(
            "study-progress-bar"
        );

    const progressText =
        document.getElementById(
            "study-progress-text"
        );

    progressBar.style.width =
        `${progress}%`;

    progressText.textContent =
        `${completedCards + 1} / ${initialQueueSize}`;

    const englishText =
        document.getElementById(
            "card-en-text"
        );

    const arabicText =
        document.getElementById(
            "card-ar-text"
        );

    const notes =
        document.getElementById(
            "card-notes"
        );

    englishText.classList.remove(
        "card-change"
    );

    arabicText.classList.remove(
        "card-change"
    );

    notes.classList.remove(
        "card-change"
    );

    void englishText.offsetWidth;

    englishText.innerHTML =
        card.enText;

    arabicText.textContent =
        card.arText;

    englishText.classList.add(
        "card-change"
    );

    arabicText.classList.add(
        "card-change"
    );

    if (
        card.notes &&
        card.notes.trim()
    ) {
        notes.innerHTML = `
            <i class="fa-solid fa-lightbulb"></i>
            ${card.notes}
        `;

        notes.classList.remove(
            "hidden"
        );

        notes.classList.add(
            "card-change"
        );
    } else {
        notes.classList.add(
            "hidden"
        );
    }

    loadCardVideo(card);
}

function loadCardVideo(card) {
    const videoId =
        getYoutubeId(
            card.youtubeUrl
        );

    if (!videoId) {
        showVideoPlaceholder();
        return;
    }

    createYoutubePlayer(videoId);
}

function handleSRS(rating) {
    if (!studyQueue.length) {
        return;
    }

    const currentCard =
        studyQueue.shift();

    if (rating === "again") {
        studyQueue.push(
            currentCard
        );
    } else {
        userStats.cardsStudiedToday++;

        const temporaryElement =
            document.createElement("div");

        temporaryElement.innerHTML =
            currentCard.enText;

        const text =
            temporaryElement.textContent
                ?.trim() || "";

        const words =
            text
                .split(/\s+/)
                .filter(Boolean);

        userStats.wordsLearnedToday +=
            words.length;
    }

    updateStatsUI();

    currentCardIndex++;

    renderCurrentCard();
}

function endStudySession() {
    if (youtubePlayer) {
        youtubePlayer.stopVideo();
    }

    const study =
        views.study;

    study.classList.remove(
        "study-enter"
    );

    study.classList.add(
        "study-exit"
    );

    setTimeout(() => {
        study.classList.add(
            "hidden"
        );

        study.classList.remove(
            "study-exit"
        );

        views.dashboard.classList.remove(
            "hidden"
        );

        updateStatsUI();
    }, 350);
}

function showCompleteSession() {
    if (youtubePlayer) {
        youtubePlayer.stopVideo();
    }

    document.getElementById(
        "complete-cards-count"
    ).textContent =
        userStats.cardsStudiedToday;

    completeModal.classList.remove(
        "hidden"
    );
}

function closeCompleteModal() {
    completeModal.classList.add(
        "hidden"
    );

    endStudySession();
}

function updateStatsUI() {
    document.getElementById(
        "stat-cards"
    ).textContent =
        userStats.cardsStudiedToday;

    document.getElementById(
        "stat-words"
    ).textContent =
        userStats.wordsLearnedToday;
}

function toggleVideoSpeed() {
    const button =
        document.getElementById(
            "video-speed-btn"
        );

    if (videoPlaybackRate === 1) {
        videoPlaybackRate = 0.5;
    } else if (videoPlaybackRate === 0.5) {
        videoPlaybackRate = 0.25;
    } else {
        videoPlaybackRate = 1;
    }

    button.textContent =
        `${videoPlaybackRate}x`;

    if (youtubePlayer) {
        youtubePlayer.setPlaybackRate(
            videoPlaybackRate
        );
    }
}

function playCardAudio() {
    if (!studyQueue.length) {
        return;
    }

    const audioUrl =
        studyQueue[0].audioUrl;

    if (!audioUrl) {
        return;
    }

    const audio =
        new Audio(audioUrl);

    audio.play().catch(() => {});
}

function toggleStudyOption(element) {
    element.classList.toggle(
        "selected"
    );
}

function showSubscriptionModal() {
    subscriptionModal.classList.remove(
        "hidden"
    );

    profileMenu.classList.add(
        "hidden"
    );
}

function closeSubscriptionModal() {
    subscriptionModal.classList.add(
        "hidden"
    );
}

document.addEventListener(
    "click",
    event => {
        const profileWrapper =
            document.querySelector(
                ".profile-wrapper"
            );

        if (
            !profileWrapper.contains(
                event.target
            )
        ) {
            profileMenu.classList.add(
                "hidden"
            );
        }
    }
);

document.addEventListener(
    "keydown",
    event => {
        if (event.key === "Escape") {
            profileMenu.classList.add(
                "hidden"
            );

            subscriptionModal.classList.add(
                "hidden"
            );
        }
    }
);

window.addEventListener(
    "load",
    () => {
        updateOnboardingUI();
    }
);
