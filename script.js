document.addEventListener("DOMContentLoaded", () => {
    const statuses = [
        "currently yapping...",
        "probably still talking",
        "thinking about dih",
        "online unfortunately",
        "brain loading...",
        "she has another story",
        "5 minute story (37 minutes)",
        "typing...",
        "nobody asked but she's explaining anyway"
    ];

    const randomStatus = document.getElementById("randomStatus");
    randomStatus.textContent = statuses[Math.floor(Math.random() * statuses.length)];

    const menuToggle = document.getElementById("menuToggle");
    const nav = document.getElementById("nav");

    menuToggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        menuToggle.classList.toggle("open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            menuToggle.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

    const sections = [...document.querySelectorAll("main section[id]")];
    const navLinks = [...nav.querySelectorAll("a")];

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(link => {
                const matches = link.getAttribute("href") === `#${entry.target.id}`;
                link.classList.toggle("active", matches);
            });
        });
    }, { threshold: 0.35 });

    sections.forEach(section => sectionObserver.observe(section));

    // Kriti name easter egg
    const kritiName = document.getElementById("kritiName");
    let nameClicks = 0;
    let nameReset;

    function bounceName() {
        kritiName.classList.remove("name-bounce");
        void kritiName.offsetWidth;
        kritiName.classList.add("name-bounce");
    }

    kritiName.addEventListener("click", () => {
        nameClicks++;
        bounceName();
        clearTimeout(nameReset);
        nameReset = setTimeout(() => nameClicks = 0, 4500);

        if (nameClicks >= 5) {
            showToast("bro why are you touching my name 😭");
            spawnBurst(window.innerWidth / 2, Math.min(window.innerHeight * .42, 430), ["♡", "😭", "✦"], 13, 170);
            nameClicks = 0;
        }
    });

    // Chat simulator
    const chatWindow = document.getElementById("chatWindow");
    const chatStart = document.getElementById("chatStart");
    const chatOnline = document.getElementById("chatOnline");

    const chatMessages = [
        "WAIT",
        "okay so basically",
        "actually wait i need to explain something first",
        "so yesterday—",
        "WAIT THAT REMINDS ME",
        "okay completely unrelated but...",
        "you know what no this is important",
        "ANYWAY",
        "where was i",
        "oh yeah",
        "wait no before that",
        "i swear this is relevant",
        "okay so basically basically",
        "WHAT WAS I TALKING ABOUT",
        "anyway dih",
        "wait listen"
    ];

    let chatRunning = false;
    let chatTimers = [];

    function clearChatTimers() {
        chatTimers.forEach(clearTimeout);
        chatTimers = [];
    }

    function addTyping() {
        const bubble = document.createElement("div");
        bubble.className = "message kriti-message typing-bubble";
        bubble.innerHTML = "<i></i><i></i><i></i>";
        bubble.dataset.typing = "true";
        chatWindow.appendChild(bubble);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return bubble;
    }

    function addMessage(text) {
        const msg = document.createElement("div");
        msg.className = "message kriti-message";
        msg.textContent = text;
        chatWindow.appendChild(msg);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function runChat() {
        if (chatRunning) return;
        chatRunning = true;
        clearChatTimers();
        chatStart.textContent = "conversation started. good luck.";
        chatStart.disabled = true;
        chatOnline.textContent = "online • typing aggressively";

        chatWindow.querySelectorAll(".generated").forEach(el => el.remove());

        let totalDelay = 400;

        chatMessages.forEach((text, index) => {
            const typingDelay = Math.max(260, 700 - index * 24);
            const pause = Math.max(140, 460 - index * 18);

            chatTimers.push(setTimeout(() => {
                const typing = addTyping();
                typing.classList.add("generated");

                chatTimers.push(setTimeout(() => {
                    typing.remove();
                    const msg = document.createElement("div");
                    msg.className = "message kriti-message generated";
                    msg.textContent = text;
                    chatWindow.appendChild(msg);
                    chatWindow.scrollTop = chatWindow.scrollHeight;

                    if (index > 8 && index % 2 === 0) {
                        const extra = document.createElement("div");
                        extra.className = "message kriti-message generated";
                        extra.textContent = ["WAIT", "NO LISTEN", "😭", "ANYWAYYY"][Math.floor(Math.random() * 4)];
                        chatWindow.appendChild(extra);
                        chatWindow.scrollTop = chatWindow.scrollHeight;
                    }
                }, typingDelay));
            }, totalDelay));

            totalDelay += typingDelay + pause;
        });

        chatTimers.push(setTimeout(() => {
            chatOnline.textContent = "online • has more to say";
            chatStart.disabled = false;
            chatStart.textContent = "do it again for some reason";
            chatRunning = false;
        }, totalDelay + 600));
    }

    chatStart.addEventListener("click", runChat);

    // Translator
    const translations = [
        ["“wait lemme tell you something quickly”", "“Cancel your plans for the next 45 minutes.”"],
        ["“I'll keep it short.”", "She will not."],
        ["“Basically...”", "Lore incoming."],
        ["“Wait.”", "The previous conversation has been abandoned."],
        ["“ANYWAY.”", "She has remembered the original topic."],
        ["“This is so random but...”", "You are about to enter a completely different cinematic universe."],
        ["“Okay last thing.”", "There are at least six more things."],
        ["“I forgot to tell you...”", "A fresh 20-minute DLC has been unlocked."]
    ];

    let translationIndex = 0;
    const kritiSays = document.getElementById("kritiSays");
    const kritiMeans = document.getElementById("kritiMeans");

    document.getElementById("translateNext").addEventListener("click", () => {
        translationIndex = (translationIndex + 1) % translations.length;
        [kritiSays, kritiMeans].forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(5px)";
        });

        setTimeout(() => {
            kritiSays.textContent = translations[translationIndex][0];
            kritiMeans.textContent = translations[translationIndex][1];
            [kritiSays, kritiMeans].forEach(el => {
                el.style.transition = ".25s";
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            });
        }, 150);
    });

    // Dih button: increasing chaos
    const dangerButton = document.getElementById("dangerButton");
    const approval = document.getElementById("approval");
    let dangerClicks = 0;

    dangerButton.addEventListener("click", (event) => {
        dangerClicks++;
        const rect = dangerButton.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        approval.classList.add("show");
        setTimeout(() => approval.classList.remove("show"), 1500);

        const amount = Math.min(10 + dangerClicks * 6, 52);
        const spread = Math.min(130 + dangerClicks * 28, 420);
        spawnBurst(x, y, ["♡", "♥", "🌼", "✦", "DIH"], amount, spread);

        document.body.classList.remove("page-shake");
        void document.body.offsetWidth;
        document.body.classList.add("page-shake");

        if (dangerClicks >= 3) {
            visualBoom(x, y);
        }

        if (dangerClicks >= 5) {
            showToast("okay you're making it worse 😭");
        }

        if (dangerClicks >= 7) {
            spawnBurst(window.innerWidth / 2, window.innerHeight / 2, ["DIH", "♡", "YAP"], 34, 520);
        }
    });

    // Mystery button
    const mysteryButton = document.getElementById("mysteryButton");
    const effects = [
        () => spawnSingle("♡"),
        () => spawnSingle("🌼"),
        () => temporaryRotate(),
        () => spawnSingle("DIH", true),
        () => spawnSingle("YAP YAP YAP", true),
        () => bounceName(),
        () => flowerCursor(),
        () => confettiBurst(),
        () => visualBoom(Math.random() * innerWidth, Math.random() * innerHeight),
        () => wiggleRandom()
    ];

    mysteryButton.addEventListener("click", () => {
        const effect = effects[Math.floor(Math.random() * effects.length)];
        effect();
        mysteryButton.animate([
            { transform: "rotate(0) scale(1)" },
            { transform: "rotate(-15deg) scale(.86)" },
            { transform: "rotate(12deg) scale(1.12)" },
            { transform: "rotate(0) scale(1)" }
        ], { duration: 420, easing: "ease-out" });
    });

    function spawnSingle(content, big = false) {
        const x = 70 + Math.random() * (innerWidth - 140);
        const y = 100 + Math.random() * (innerHeight - 200);
        const el = document.createElement("div");
        el.className = "spawned";
        el.textContent = content;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.fontSize = big ? "clamp(28px, 6vw, 64px)" : "28px";
        el.style.fontFamily = big ? "var(--hand)" : "inherit";
        el.style.color = ["#6b2135", "#a83f45", "#d9993d", "#eaa6b1"][Math.floor(Math.random() * 4)];
        el.style.setProperty("--x", `${(Math.random() - .5) * 120}px`);
        el.style.setProperty("--y", `${-100 - Math.random() * 180}px`);
        el.style.setProperty("--r", `${(Math.random() - .5) * 100}deg`);
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1450);
    }

    function spawnBurst(x, y, symbols, count = 18, spread = 220) {
        for (let i = 0; i < count; i++) {
            const el = document.createElement("div");
            el.className = "spawned";
            el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.fontSize = `${15 + Math.random() * 18}px`;
            el.style.color = ["#6b2135", "#a83f45", "#d9993d", "#eaa6b1", "#fff2d9"][Math.floor(Math.random() * 5)];
            el.style.setProperty("--x", `${(Math.random() - .5) * spread * 2}px`);
            el.style.setProperty("--y", `${(Math.random() - .72) * spread * 1.6}px`);
            el.style.setProperty("--r", `${(Math.random() - .5) * 300}deg`);
            el.style.animationDelay = `${Math.random() * .12}s`;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 1650);
        }
    }

    function confettiBurst() {
        spawnBurst(innerWidth / 2, innerHeight / 2, ["✦", "♡", "●", "❋", "✿"], 38, 430);
    }

    function visualBoom(x, y) {
        const boom = document.createElement("div");
        boom.className = "visual-boom";
        boom.style.left = `${x}px`;
        boom.style.top = `${y}px`;
        document.body.appendChild(boom);
        setTimeout(() => boom.remove(), 900);
    }

    function temporaryRotate() {
        document.documentElement.animate([
            { transform: "rotate(0deg)" },
            { transform: `rotate(${Math.random() > .5 ? 1.2 : -1.2}deg)` },
            { transform: "rotate(0deg)" }
        ], { duration: 650, easing: "ease-in-out" });
    }

    function wiggleRandom() {
        const candidates = [...document.querySelectorAll(".lore-card, .brain-card, .stat, .phone, .translator-card")];
        const el = candidates[Math.floor(Math.random() * candidates.length)];
        el.classList.remove("wiggle-now");
        void el.offsetWidth;
        el.classList.add("wiggle-now");
        setTimeout(() => el.classList.remove("wiggle-now"), 1600);
    }

    // Temporary flower cursor
    const cursorFlower = document.getElementById("cursorFlower");
    let flowerTimer;

    document.addEventListener("pointermove", (e) => {
        cursorFlower.style.left = `${e.clientX}px`;
        cursorFlower.style.top = `${e.clientY}px`;
    });

    function flowerCursor() {
        document.body.classList.add("flower-cursor");
        clearTimeout(flowerTimer);
        flowerTimer = setTimeout(() => document.body.classList.remove("flower-cursor"), 5000);
        showToast("flower cursor unlocked 🌼");
    }

    // Brainrot cards drift
    document.querySelectorAll(".brain-card").forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.style.setProperty("--drift-x", `${(Math.random() - .5) * 18}px`);
            card.style.setProperty("--drift-y", `${-5 - Math.random() * 10}px`);
            card.style.setProperty("--drift-r", `${(Math.random() - .5) * 6}deg`);
        });
    });

    // Yap zone linger easter egg
    const yapZone = document.getElementById("yap-zone");
    const yapWarning = document.getElementById("yapWarning");
    let yapTimer = null;
    let yapWarned = false;

    const yapObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > .45 && !yapWarned) {
                clearTimeout(yapTimer);
                yapTimer = setTimeout(() => {
                    yapWarning.classList.add("show");
                    yapWarned = true;
                    setTimeout(() => yapWarning.classList.remove("show"), 3000);
                }, 8500);
            } else if (!entry.isIntersecting) {
                clearTimeout(yapTimer);
            }
        });
    }, { threshold: [0, .45] });

    yapObserver.observe(yapZone);

    // Bottom achievement
    const achievement = document.getElementById("achievement");
    let bottomUnlocked = false;

    window.addEventListener("scroll", () => {
        if (!bottomUnlocked && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
            bottomUnlocked = true;
            achievement.classList.add("show");
            spawnBurst(110, innerHeight - 70, ["🏆", "✦", "♡"], 12, 150);
            setTimeout(() => achievement.classList.remove("show"), 4200);
        }

        // small parallax
        const y = window.scrollY;
        document.querySelectorAll(".floating-decor").forEach((el, i) => {
            el.style.marginTop = `${y * (0.015 + i * .004)}px`;
        });
    }, { passive: true });

    // Konami code = maximum chaos
    const konami = [
        "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
        "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
        "b", "a"
    ];
    let konamiIndex = 0;

    document.addEventListener("keydown", (event) => {
        const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
        if (key === konami[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konami.length) {
                maximumChaos();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = key === konami[0] ? 1 : 0;
        }
    });

    function maximumChaos() {
        document.body.classList.add("chaos-mode");
        showToast("MAXIMUM KRITI MODE ACTIVATED");
        spawnBurst(innerWidth / 2, innerHeight / 2, ["YAP", "♡", "🌼", "✦", "DIH", "😭", "❋"], 110, Math.max(innerWidth, innerHeight) * .58);
        for (let i = 0; i < 7; i++) {
            setTimeout(() => {
                visualBoom(
                    80 + Math.random() * (innerWidth - 160),
                    100 + Math.random() * (innerHeight - 200)
                );
            }, i * 120);
        }
        document.querySelectorAll(".lore-card, .brain-card, .stat").forEach((el, i) => {
            setTimeout(() => {
                el.classList.add("wiggle-now");
                setTimeout(() => el.classList.remove("wiggle-now"), 1700);
            }, i * 55);
        });
        setTimeout(() => document.body.classList.remove("chaos-mode"), 2600);
    }

    // Toast helper
    const toast = document.getElementById("toast");
    let toastTimer;

    function showToast(text) {
        toast.textContent = text;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
    }

    // Count-up on first view
    const counters = document.querySelectorAll(".count-up");
    const countObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const end = Number(el.dataset.value);
            let current = 0;
            const increment = Math.max(1, Math.ceil(end / 15));
            const timer = setInterval(() => {
                current += increment;
                if (current >= end) {
                    current = end;
                    clearInterval(timer);
                }
                el.textContent = current;
            }, 45);
            countObserver.unobserve(el);
        });
    }, { threshold: .6 });
    counters.forEach(counter => countObserver.observe(counter));
});
