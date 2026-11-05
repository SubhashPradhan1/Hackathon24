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
        .quiz-modal-backdrop[data-school="SOP"] {
    --course-color: #1a78c4;
    --course-hover: #1565ad;
    --course-soft: #eaf5ff;
    --course-text: #ffffff;
}

.quiz-modal-backdrop[data-school="SOB"] {
    --course-color: #178050;
    --course-hover: #11683f;
    --course-soft: #e8f7f0;
    --course-text: #ffffff;
}

.quiz-modal-backdrop[data-school="SOF"] {
    --course-color: #f6c026;
    --course-hover: #e0a719;
    --course-soft: #fff7dc;
    --course-text: #14232e;
}

.quiz-subject-button:hover,
.quiz-subject-button:focus-visible {
    border-color: var(--course-color);
    background: var(--course-soft);
    outline: none;
    .quiz-primary-button {
    width: 100%;
    border: 0;
    border-radius: 10px;
    padding: 13px 18px;

    background: var(--course-color, #1a78c4);
    color: var(--course-text, #ffffff);

    font: inherit;
    font-weight: 700;
    cursor: pointer;

    transition: all 0.25s ease;
}

.quiz-primary-button:hover {
    background: var(--course-hover, #1565ad);
    transform: translateY(-2px);
}

.quiz-primary-button:focus-visible {
    outline: 3px solid var(--course-soft);
    outline-offset: 3px;
}
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

// Login Modal
// ================= LOGIN MODAL =================

// Get Login elements

// LOGIN MODAL

const loginTab = document.getElementById("loginTab");
const loginModal = document.getElementById("loginModal");

if (loginTab && loginModal) {

    loginTab.addEventListener("click", function(event) {
        event.preventDefault();

        loginModal.style.display = "flex";
        document.body.style.overflow = "hidden";
    });

    window.addEventListener("message", function(event) {
        if (event.data === "closeLoginModal") {
            loginModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

} else {
    console.error("Login button or modal not found!");
}
