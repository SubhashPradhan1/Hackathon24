(() => {
    "use strict";

    const schools = {
        SOP: {
            name: "School of Programming",
            subjects: ["HTML", "CSS", "JavaScript"]
        },
        SOB: {
            name: "School of Business",
            subjects: ["Google Sheets", "Salesforce", "CRM"]
        },
        SOF: {
            name: "School of Finance",
            subjects: [
                "Class 11 NCERT Accountancy",
                "Class 12 NCERT Accountancy",
                "Accounting Fundamentals"
            ]
        }
    };

    let lastFocusedElement = null;

    const styles = document.createElement("style");
    styles.textContent = `
        .quiz-modal-backdrop {
            --course-accent: #2183cf;
            --course-soft: #eaf5ff;
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: grid;
            place-items: center;
            overflow-y: auto;
            padding: 20px;
            background: rgb(16 30 48 / 58%);
            backdrop-filter: blur(7px);
            animation: quizFadeIn 180ms ease-out;
        }

        .quiz-modal-backdrop.quiz-modal-sob {
            --course-accent: #168653;
            --course-soft: #e9f8f0;
        }

        .quiz-modal-backdrop.quiz-modal-sof {
            --course-accent: #dfa900;
            --course-soft: #fff7db;
        }

        .quiz-modal {
            position: relative;
            isolation: isolate;
            overflow: hidden;
            width: min(100%, 520px);
            max-height: 90vh;
            overflow-y: auto;
            padding: 38px;
            border: 1px solid rgb(255 255 255 / 75%);
            border-radius: 26px;
            background:
                radial-gradient(ellipse at top right, var(--course-soft), transparent 55%),
                #fff;
            color: #172635;
            box-shadow: 0 28px 80px rgb(15 35 55 / 28%);
            font: 500 16px/1.5 Inter, sans-serif;
            animation: quizModalIn 220ms ease-out;
        }

        .quiz-modal::before {
            position: absolute;
            z-index: -1;
            top: 0;
            right: 0;
            left: 0;
            height: 7px;
            background: var(--course-accent);
            content: "";
        }

        .quiz-modal h2 {
            margin: 0 52px 8px 0;
            font-size: clamp(24px, 5vw, 32px);
            font-weight: 800;
            letter-spacing: -0.04em;
            line-height: 1.15;
        }

        .quiz-modal p {
            margin: 0 0 26px;
            color: #64778a;
        }

        .quiz-modal label {
            display: grid;
            gap: 8px;
            margin: 17px 0;
            color: #253747;
            font-size: 14px;
            font-weight: 700;
        }

        .quiz-modal select {
            width: 100%;
            min-height: 54px;
            padding: 0 15px;
            border: 1px solid #d5e0e9;
            border-radius: 12px;
            outline: none;
            background: #fff;
            color: #172635;
            font: 600 16px Inter, sans-serif;
        }

        .quiz-modal select:focus-visible {
            border-color: var(--course-accent);
            box-shadow: 0 0 0 4px rgb(33 131 207 / 16%);
        }

        .quiz-modal button {
            border: 0;
            border-radius: 12px;
            cursor: pointer;
            font: inherit;
            transition: transform 150ms ease, filter 150ms ease;
        }

        .quiz-modal button:hover {
            filter: brightness(1.05);
            transform: translateY(-1px);
        }

        .quiz-modal .quiz-close {
            position: absolute;
            top: 22px;
            right: 22px;
            width: 44px;
            height: 44px;
            background: var(--course-soft);
            color: #263746;
            font-size: 20px;
        }

        .quiz-modal .quiz-start {
            width: 100%;
            min-height: 58px;
            margin-top: 12px;
            background: var(--course-accent);
            color: #fff;
            font-size: 17px;
            font-weight: 800;
            box-shadow: 0 8px 18px rgb(15 35 55 / 14%);
        }

        @keyframes quizFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes quizModalIn {
            from { opacity: 0; transform: translateY(12px) scale(.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 560px) {
            .quiz-modal {
                padding: 30px 22px 24px;
                border-radius: 20px;
            }

            .quiz-modal .quiz-close {
                top: 16px;
                right: 16px;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .quiz-modal-backdrop,
            .quiz-modal {
                animation: none;
            }
        }
    `;
    document.head.appendChild(styles);

    function closeModal() {
        const backdrop = document.querySelector(".quiz-modal-backdrop");
        if (!backdrop) return;

        backdrop.remove();

        if (lastFocusedElement?.isConnected) {
            lastFocusedElement.focus();
        }
    }

    function showModal(schoolCode) {
        const code = String(schoolCode || "").toUpperCase();
        const school = schools[code];

        if (!school) {
            console.error(`Unknown school code: ${schoolCode}`);
            return;
        }

        lastFocusedElement = document.activeElement;
        closeModal();

        const backdrop = document.createElement("div");
        backdrop.className = `quiz-modal-backdrop quiz-modal-${code.toLowerCase()}`;

        backdrop.innerHTML = `
            <section class="quiz-modal"
                     role="dialog"
                     aria-modal="true"
                     aria-labelledby="quiz-modal-title">
                <button class="quiz-close" type="button" aria-label="Close">✕</button>
                <h2 id="quiz-modal-title"></h2>
                <p>Choose a subject, difficulty, and number of questions.</p>

                <form>
                    <label>
                        Subject
                        <select name="subject" required></select>
                    </label>

                    <label>
                        Difficulty
                        <select name="difficulty">
                            <option>Easy</option>
                            <option selected>Medium</option>
                            <option>Hard</option>
                        </select>
                    </label>

                    <label>
                        Number of questions
                        <select name="questionCount">
                            <option value="5">5</option>
                            <option value="10" selected>10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </label>

                    <button class="quiz-start" type="submit">Start quiz</button>
                </form>
            </section>
        `;

        backdrop.querySelector("#quiz-modal-title").textContent = school.name;

        const subjectSelect = backdrop.querySelector('[name="subject"]');

        school.subjects.forEach((subject) => {
            const option = document.createElement("option");
            option.value = subject;
            option.textContent = subject;
            subjectSelect.appendChild(option);
        });

        backdrop.querySelector(".quiz-close").addEventListener("click", closeModal);

        backdrop.addEventListener("click", (event) => {
            if (event.target === backdrop) closeModal();
        });

        backdrop.querySelector("form").addEventListener("submit", (event) => {
            event.preventDefault();

            const form = event.currentTarget;
            const settings = {
                school: code,
                subject: form.elements.subject.value,
                difficulty: form.elements.difficulty.value,
                questionCount: Number(form.elements.questionCount.value)
            };

            try {
                sessionStorage.setItem(
                    "navgurukulQuizSetup",
                    JSON.stringify(settings)
                );
            } catch (error) {
                console.error("Could not save quiz settings:", error);
                window.alert("Could not save your quiz settings. Please try again.");
                return;
            }

            window.location.href = new URL("Quiz.html", window.location.href).href;
        });

        document.body.appendChild(backdrop);
        backdrop.querySelector(".quiz-close").focus();
    }

    // Supports buttons using onclick="selectCourse('SOP')".
    window.selectCourse = showModal;

    // Also supports buttons using data-school="SOP".
    document.addEventListener("click", (event) => {
        const target = event.target;
        const button = target instanceof Element
            ? target.closest("[data-school]")
            : null;

        // Avoid opening the modal twice if a button uses both methods.
        if (button && !button.hasAttribute("onclick")) {
            showModal(button.dataset.school);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeModal();
    });
})();
