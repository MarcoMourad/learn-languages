let studyQueue = [...activeDeck.cards];
let initialQueueSize = studyQueue.length;
let currentCardIndex = 0;
let videoPlaybackRate = 1;
let currentAudio = null;

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const englishText = document.getElementById("englishText");
const arabicText = document.getElementById("arabicText");
const notesBlock = document.getElementById("notesBlock");
const notesText = document.getElementById("notesText");
const youtubeFrame = document.getElementById("youtubeFrame");
const videoPlaceholder = document.getElementById("videoPlaceholder");
const audioButton = document.getElementById("audioButton");
const speedButton = document.getElementById("speedButton");
const completeModal = document.getElementById("completeModal");
const completedCount = document.getElementById("completedCount");

function getYoutubeId(url) {
    if (!url) return null;

    try {
        const parsed = new URL(url);

        if (parsed.hostname.includes("youtu.be")) {
            return parsed.pathname.replace("/", "");
        }

        if (parsed.hostname.includes("youtube.com")) {
            if (parsed.pathname.includes("/embed/")) {
                return parsed.pathname.split("/embed/")[1].split("/")[0];
            }

            return parsed.searchParams.get("v");
        }
    } catch {
        return null;
    }

    return null;
}

function loadVideo(card) {
    const videoId = getYoutubeId(card.youtubeUrl);

    if (!videoId || videoId === "#") {
        youtubeFrame.classList.add("hidden");
        videoPlaceholder.classList.remove("hidden");
        return;
    }

    youtubeFrame.src =
        `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;

    youtubeFrame.classList.remove("hidden");
    videoPlaceholder.classList.add("hidden");
}

function renderCard() {
    if (!studyQueue.length) {
        showCompleteSession();
        return;
    }

    const card = studyQueue[0];

    const completed =
        initialQueueSize - studyQueue.length;

    const progress =
        initialQueueSize
            ? (completed / initialQueueSize) * 100
            : 0;

    progressBar.style.width = `${progress}%`;
    progressText.textContent =
        `${Math.min(completed + 1, initialQueueSize)} / ${initialQueueSize}`;

    englishText.classList.remove("card-change");
    arabicText.classList.remove("card-change");

    void englishText.offsetWidth;

    englishText.innerHTML = card.enText;
    arabicText.textContent = card.arText;

    englishText.classList.add("card-change");
    arabicText.classList.add("card-change");

    if (card.notes && card.notes.trim()) {
        notesText.textContent = card.notes;
        notesBlock.classList.remove("hidden");
    } else {
        notesBlock.classList.add("hidden");
    }

    loadVideo(card);
}

function handleSRS(rating) {
    if (!studyQueue.length) return;

    const currentCard = studyQueue.shift();

    if (rating === "again") {
        studyQueue.push(currentCard);
    }

    currentCardIndex += 1;
    renderCard();
}

function showCompleteSession() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    youtubeFrame.src = "";

    completedCount.textContent =
        `${initialQueueSize} كارت`;

    completeModal.classList.remove("hidden");
}

function toggleSpeed() {
    if (videoPlaybackRate === 1) {
        videoPlaybackRate = 0.5;
    } else if (videoPlaybackRate === 0.5) {
        videoPlaybackRate = 0.25;
    } else {
        videoPlaybackRate = 1;
    }

    speedButton.textContent = `${videoPlaybackRate}x`;

    const iframeWindow = youtubeFrame.contentWindow;

    if (iframeWindow) {
        iframeWindow.postMessage(
            JSON.stringify({
                event: "command",
                func: "setPlaybackRate",
                args: [videoPlaybackRate]
            }),
            "*"
        );
    }
}

function playCardAudio() {
    if (!studyQueue.length) return;

    const audioUrl = studyQueue[0].audioUrl;

    if (!audioUrl) return;

    if (currentAudio) {
        currentAudio.pause();
    }

    currentAudio = new Audio(audioUrl);
    currentAudio.play().catch(() => {});
}

document.querySelectorAll(".srs-button").forEach(button => {
    button.addEventListener("click", () => {
        handleSRS(button.dataset.rating);
    });
});

audioButton.addEventListener("click", playCardAudio);
speedButton.addEventListener("click", toggleSpeed);

document.getElementById("backButton").addEventListener("click", () => {
    window.location.href = "../dashboard/index.html";
});

document.getElementById("homeButton").addEventListener("click", () => {
    window.location.href = "../dashboard/index.html";
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        completeModal.classList.add("hidden");
    }
});

renderCard();
