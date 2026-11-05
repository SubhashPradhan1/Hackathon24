/* Navgurukul Campus Quiz Arena
   Frontend interactions for the supplied index.html.
   No API key or backend logic belongs in this file.
*/

(() => {
    "use strict";

    const schools = {
        SOP: {
            name: "School of Programming",
            description: "Choose a programming topic to practise.",
            subjects: ["HTML", "CSS", "JavaScript"]
        },
        SOB: {
            name: "School of Business",
            description: "Choose a business tool or concept to practise.",
            subjects: ["Google Sheets", "Salesforce", "CRM"]
        },
        SOF: {
            name: "School of Finance",
            description: "Choose an accountancy topic to practise.",
            subjects: [
                "Class 11 NCERT Accountancy",
                "Class 12 NCERT Accountancy",
                "Accounting Fundamentals"
            ]
        }
    };

    let selectedSchool = "";
    let selectedSubject = "";

    // Create a small message area for feedback.
    const toast = document.createElement("div");
    toast.className = "quiz-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);

    let toastTimer;
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => {
            toast.classList.remove("show");
        }, 2800);
    }

    // Add the modal and interaction styles without changing Style.css.
    const interactionStyles = document.createElement("style");
    interactionStyles.textContent = `
        .quiz-modal-backdrop {
            position: fixed; inset: 0; z-index: 9999;
            display: grid; place-items: center; padding: 20px;
            background: rgba(0, 0, 0, .55);
        }
        .quiz-modal {
            width: min(560px, 100%); max-height: 90vh; overflow-y: auto;
            background: #fff; color: #171717; border-radius: 18px;
            padding: 28px; box-shadow: 0 18px 60px rgba(0,0,0,.22);
            font-family: Inter, Arial, sans-serif;
        }
        .quiz-modal-header {
            display: flex; justify-content: space-between; gap: 16px;
            align-items: flex-start; margin-bottom: 18px;
        }
        .quiz-modal h2 { margin: 0 0 7px; font-size: 24px; }
        .quiz-modal p { color: #666; line-height: 1.5; margin: 0 0 18px; }
        .quiz-modal-close {
            border: 0; background: #f3f3f3; border-radius: 50%;
            width: 36px; height: 36px; cursor: pointer; font-size: 21px;
        }
        .quiz-subject-list { display: grid; gap: 10px; }
        .quiz-subject-button {
            width: 100%; padding: 15px 16px; border: 1px solid #e8e8e8;
            border-radius: 11px; background: #fff; color: #171717;
            display: flex; justify-content: space-between; align-items: center;
            text-align: left; cursor: pointer; font: inherit; font-weight: 600;
        }
        .quiz-subject-button:hover, .quiz-subject-button:focus-visible {
            border-color: #ec4899; background: #fff5fa; outline: none;
        }
        .quiz-form { display: grid; gap: 15px; }
        .quiz-form label { display: grid; gap: 7px; font-weight: 600; }
        .quiz-form select {
            width: 100%; padding: 12px; border: 1px solid #ddd;
            border-radius: 9px; background: #fff; color: #171717; font: inherit;
        }
        .quiz-primary-button {
            border: 0; border-radius: 10px; padding: 13px 18px;
            background: #ec4899; color: #fff; font: inherit;
            font-weight: 700; cursor: pointer;
        }
        .quiz-primary-button:hover { background: #db2777; }
        .quiz-toast {
            position: fixed; z-index: 10000; left: 50%; bottom: 24px;
            transform: translate(-50%, 15px); opacity: 0; pointer-events: none;
            background: #171717; color: #fff; padding: 12px 18px;
            border-radius: 10px; font: 14px/1.4 Inter, Arial, sans-serif;
            transition: opacity .2s ease, transform .2s ease;
            max-width: calc(100vw - 32px); text-align: center;
        }
        .quiz-toast.show { opacity: 1; transform: translate(-50%, 0); }
        body.quiz-modal-open { overflow: hidden; }
        @media (max-width: 480px) {
            .quiz-modal { padding: 21px; }
            .quiz-modal h2 { font-size: 21px; }
        }
    `;
    document.head.appendChild(interactionStyles);

    function closeModal() {
        const backdrop = document.querySelector(".quiz-modal-backdrop");
        if (backdrop) backdrop.remove();
        document.body.classList.remove("quiz-modal-open");
    }

    function openModal(title, description, content) {
        closeModal();

        const backdrop = document.createElement("div");
        backdrop.className = "quiz-modal-backdrop";
        backdrop.innerHTML = `
            <section class="quiz-modal" role="dialog" aria-modal="true"
                     aria-labelledby="quiz-modal-title">
                <div class="quiz-modal-header">
                    <div>
                        <h2 id="quiz-modal-title"></h2>
                        <p class="quiz-modal-description"></p>
                    </div>
                    <button class="quiz-modal-close" type="button"
                            aria-label="Close dialog">&times;</button>
                </div>
                <div class="quiz-modal-content"></div>
            </section>
        `;

        backdrop.querySelector("#quiz-modal-title").textContent = title;
        backdrop.querySelector(".quiz-modal-description").textContent = description;
        backdrop.querySelector(".quiz-modal-content").appendChild(content);

        backdrop.addEventListener("click", (event) => {
            if (event.target === backdrop) closeModal();
        });
        backdrop.querySelector(".quiz-modal-close").addEventListener("click", closeModal);

        document.body.appendChild(backdrop);
        document.body.classList.add("quiz-modal-open");
        backdrop.querySelector(".quiz-modal-close").focus();
    }

    function showSubjects(schoolCode) {
        const school = schools[schoolCode];
        if (!school) {
            showToast("School not found. Please try again.");
            return;
        }

        selectedSchool = schoolCode;
        selectedSubject = "";

        const list = document.createElement("div");
        list.className = "quiz-subject-list";

        school.subjects.forEach((subject) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "quiz-subject-button";

            const name = document.createElement("span");
            name.textContent = subject;
            const arrow = document.createElement("span");
            arrow.textContent = "→";
            button.append(name, arrow);

            button.addEventListener("click", () => {
                selectedSubject = subject;
                showQuizSetup();
            });
            list.appendChild(button);
        });

        openModal(school.name, school.description, list);
    }

    function showQuizSetup() {
        const form = document.createElement("form");
        form.className = "quiz-form";
        form.innerHTML = `
            <label>
                Difficulty
                <select name="difficulty" required>
                    <option value="Easy">Easy</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </label>
            <label>
                Number of questions
                <select name="questionCount" required>
                    <option value="5">5 questions</option>
                    <option value="10" selected>10 questions</option>
                    <option value="15">15 questions</option>
                    <option value="20">20 questions</option>
                </select>
            </label>
            <button class="quiz-primary-button" type="submit">
                Continue to Quiz
            </button>
        `;

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const settings = {
                school: selectedSchool,
                subject: selectedSubject,
                difficulty: formData.get("difficulty"),
                questionCount: Number(formData.get("questionCount"))
            };

            // Save the chosen settings for the next frontend/backend step.
            try {
                sessionStorage.setItem("navgurukulQuizSetup", JSON.stringify(settings));
            } catch (error) {
                console.warn("Could not save quiz settings in sessionStorage.", error);
            }

            closeModal();
            showToast(
                `${settings.subject}: ${settings.questionCount} ${settings.difficulty.toLowerCase()} questions selected.`
            );

            // Gemini/API quiz generation will be connected in a later step.
            document.dispatchEvent(new CustomEvent("quizSetupComplete", {
                detail: settings
            }));
            console.log("Quiz setup selected:", settings);
            window.location.href = "Quiz.html";
        });

        openModal(
            selectedSubject,
            `Set up your ${schools[selectedSchool].name} practice quiz.`,
            form
        );
    }

    // This function is called by the existing inline onclick attributes.
    window.selectCourse = showSubjects;

    // Make in-page navigation links work and update the active sidebar item.
    const navLinks = document.querySelectorAll(".sidebar nav .nav-item");
    navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#") && href.length > 1) {
            link.addEventListener("click", () => {
                navLinks.forEach((item) => item.classList.remove("active"));
                link.classList.add("active");
            });
        }
    });

    // Smooth-scroll for the hero's Explore Courses link and other page anchors.
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    // Keep the active sidebar item in sync while scrolling through sections.
    const sections = ["courses", "activity", "progress"]
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (!visible) return;
            navLinks.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${visible.target.id}`
                );
            });
        }, { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.2, 0.5] });

        sections.forEach((section) => observer.observe(section));
    }

    // Dashboard notification button.
    const notificationButton = document.querySelector(".notification");
    if (notificationButton) {
        notificationButton.addEventListener("click", () => {
            showToast("You're all caught up. New quiz notifications will appear here.");
        });
    }

    // Logout is currently a frontend placeholder; authentication is not connected.
    const logoutLink = Array.from(document.querySelectorAll(".sidebar a"))
        .find((link) => link.textContent.toLowerCase().includes("logout"));

    if (logoutLink) {
        logoutLink.addEventListener("click", (event) => {
            event.preventDefault();
            showToast("Logout will be available after student login is connected.");
        });
    }

    console.log("Navgurukul Campus Quiz Arena JavaScript loaded.");
})();