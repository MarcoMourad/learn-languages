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

const activeDeckId = new URLSearchParams(window.location.search).get("deck") || "deck1";

const activeDeck =
    mockDecksData.find(deck => deck.id === activeDeckId) ||
    mockDecksData[0];
