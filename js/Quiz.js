/* Navgurukul Campus Quiz Arena
   Frontend demo quiz engine. Questions are sample data for now;
   connect the Gemini backend later without putting an API key here. */

(() => {
  "use strict";

  const STORAGE_KEY = "navgurukulQuizSetup";
  const RESULT_KEY = "navgurukulLastQuizResult";
  const DEFAULT_TIME_SECONDS = 15 * 60;

  // Starter question banks. Replace/extend these with backend-generated questions.
  const questionBanks = {
    SOP: [
      {
        question: "Which HTML element is used for the largest main heading?",
        options: ["<h1>", "<heading>", "<h6>", "<head>"],
        answer: 0,
        explanation: "The h1 element represents the highest-level heading."
      },
      {
        question: "Which HTML attribute provides alternative text for an image?",
        options: ["title", "src", "alt", "href"],
        answer: 2,
        explanation: "The alt attribute describes an image for screen readers and when the image cannot load."
      },
      {
        question: "Which CSS property changes the text color?",
        options: ["font-style", "color", "background-color", "text-decoration"],
        answer: 1,
        explanation: "The color property sets the foreground color of text."
      },
      {
        question: "Which CSS layout system is designed for arranging items in one dimension?",
        options: ["Float", "Grid only", "Flexbox", "Positioning"],
        answer: 2,
        explanation: "Flexbox is designed primarily for one-dimensional row or column layouts."
      },
      {
        question: "Which JavaScript keyword declares a block-scoped variable that can be reassigned?",
        options: ["const", "let", "static", "define"],
        answer: 1,
        explanation: "let declares a block-scoped variable that can be reassigned."
      },
      {
        question: "Which method selects an element by its CSS selector?",
        options: ["document.querySelector()", "document.getStyle()", "window.findCSS()", "document.selectAll()"],
        answer: 0,
        explanation: "document.querySelector() returns the first element matching a CSS selector."
      },
      {
        question: "What does CSS stand for?",
        options: ["Computer Style Sheets", "Creative Styling System", "Cascading Style Sheets", "Colorful Style Syntax"],
        answer: 2,
        explanation: "CSS stands for Cascading Style Sheets."
      },
      {
        question: "Which HTTP method is commonly used to retrieve data?",
        options: ["POST", "GET", "PATCH", "DELETE"],
        answer: 1,
        explanation: "GET requests are commonly used to retrieve a resource."
      },
      {
        question: "Which JavaScript array method creates a new array by transforming each item?",
        options: ["map()", "push()", "pop()", "findIndex()"],
        answer: 0,
        explanation: "map() calls a function for each array item and returns a new array of results."
      },
      {
        question: "Which HTML element is used to connect an external JavaScript file?",
        options: ["<style>", "<javascript>", "<script>", "<linkscript>"],
        answer: 2,
        explanation: "The script element loads or contains JavaScript."
      }
    ],
    SOB: [
      {
        question: "In a spreadsheet, what is the intersection of a row and a column called?",
        options: ["Cell", "Sheet", "Workbook", "Range name"],
        answer: 0,
        explanation: "A cell is the box formed where a row and a column meet."
      },
      {
        question: "Which spreadsheet formula adds the values in cells A1 through A5?",
        options: ["=ADD(A1-A5)", "=SUM(A1:A5)", "=TOTAL(A1;A5)", "=PLUS(A1:A5)"],
        answer: 1,
        explanation: "SUM with the range A1:A5 adds all values in that range."
      },
      {
        question: "What is the main purpose of a CRM system?",
        options: ["Edit images", "Manage customer relationships and interactions", "Compile source code", "Design presentation themes"],
        answer: 1,
        explanation: "CRM tools organize customer information, interactions, and related business processes."
      },
      {
        question: "In Google Sheets, which symbol usually begins a formula?",
        options: ["#", "=", "@", "&"],
        answer: 1,
        explanation: "Spreadsheet formulas begin with an equals sign."
      },
      {
        question: "What does CRM stand for?",
        options: ["Customer Relationship Management", "Central Record Method", "Customer Revenue Measure", "Client Response Mode"],
        answer: 0,
        explanation: "CRM stands for Customer Relationship Management."
      },
      {
        question: "Which chart is usually best for comparing values across categories?",
        options: ["Bar chart", "Scatter plot", "Map chart", "Gauge only"],
        answer: 0,
        explanation: "Bar charts make comparisons between category values easy to see."
      },
      {
        question: "What is a spreadsheet row generally identified by?",
        options: ["A letter", "A number", "A color", "A formula"],
        answer: 1,
        explanation: "Rows are identified by numbers; columns are identified by letters in common spreadsheet layouts."
      },
      {
        question: "What is a lead in a sales CRM context?",
        options: ["A potential customer", "A completed invoice", "A deleted account", "A spreadsheet column"],
        answer: 0,
        explanation: "A lead is a person or organization that may become a customer."
      },
      {
        question: "Which feature helps display only spreadsheet records matching chosen conditions?",
        options: ["Filter", "Merge cells", "Word wrap", "Freeze formatting"],
        answer: 0,
        explanation: "Filters show rows that meet selected criteria."
      },
      {
        question: "Why should customer data access be limited to authorized users?",
        options: ["To make files larger", "To protect privacy and security", "To remove all records", "To slow down updates"],
        answer: 1,
        explanation: "Access controls help protect confidential customer information from unauthorized use."
      }
    ],
    SOF: [
      {
        question: "Which financial statement reports assets, liabilities, and capital on a particular date?",
        options: ["Trading Account", "Balance Sheet", "Cash Book", "Sales Day Book"],
        answer: 1,
        explanation: "A balance sheet reports the financial position of a business on a specific date."
      },
      {
        question: "What is the basic accounting equation?",
        options: ["Assets = Liabilities + Capital", "Assets = Revenue - Expenses", "Capital = Assets + Liabilities", "Liabilities = Assets + Capital"],
        answer: 0,
        explanation: "The accounting equation is Assets = Liabilities + Owner's Equity (Capital)."
      },
      {
        question: "Which account is debited when a business purchases furniture for cash?",
        options: ["Cash Account", "Furniture Account", "Sales Account", "Capital Account"],
        answer: 1,
        explanation: "Furniture is an asset, and an increase in an asset is debited."
      },
      {
        question: "Goods returned by a customer to the business are recorded in which account?",
        options: ["Purchase Returns", "Sales Returns", "Carriage Inwards", "Drawings"],
        answer: 1,
        explanation: "Sales Returns records goods returned by customers."
      },
      {
        question: "Which book is used to record transactions in chronological order before posting to ledger accounts?",
        options: ["Journal", "Balance Sheet", "Trial Balance", "Bank Statement"],
        answer: 0,
        explanation: "Transactions are first recorded chronologically in the journal."
      },
      {
        question: "A trial balance is mainly prepared to check what?",
        options: ["Profitability only", "Arithmetical agreement of ledger balances", "Cash in hand only", "Market value of assets"],
        answer: 1,
        explanation: "A trial balance checks whether total debit balances equal total credit balances."
      },
      {
        question: "Which of these is a current asset?",
        options: ["Building", "Machinery", "Inventory", "Long-term loan"],
        answer: 2,
        explanation: "Inventory is normally expected to be sold or used in the operating cycle."
      },
      {
        question: "When the owner introduces cash into the business, which account is credited?",
        options: ["Cash Account", "Capital Account", "Purchases Account", "Rent Account"],
        answer: 1,
        explanation: "The owner's capital increases, so the Capital Account is credited."
      },
      {
        question: "Which concept assumes that a business will continue operating for the foreseeable future?",
        options: ["Going concern concept", "Matching concept", "Dual aspect concept", "Money measurement concept"],
        answer: 0,
        explanation: "The going concern concept assumes the business will continue its operations."
      },
      {
        question: "If total assets are ₹80,000 and total liabilities are ₹30,000, what is the owner's capital?",
        options: ["₹1,10,000", "₹50,000", "₹30,000", "₹80,000"],
        answer: 1,
        explanation: "Capital = Assets − Liabilities = ₹80,000 − ₹30,000 = ₹50,000."
      }
    ]
  };

  const byId = (id) => document.getElementById(id);

  const elements = {
    timer: byId("quiz-timer"),
    school: byId("quiz-school"),
    subject: byId("quiz-subject"),
    difficulty: byId("quiz-difficulty"),
    questionCounter: byId("question-counter"),
    answeredCounter: byId("answered-counter"),
    progress: byId("quiz-progress"),
    progressFill: byId("quiz-progress-fill"),
    questionText: byId("question-text"),
    options: byId("answer-options"),
    placeholder: byId("question-placeholder"),
    feedback: byId("quiz-feedback"),
    previous: byId("previous-button"),
    next: byId("next-button"),
    submit: byId("submit-button"),
    answerForm: byId("answer-form")
  };

  let settings = {};
  let questions = [];
  let answers = [];
  let currentIndex = 0;
  let secondsLeft = DEFAULT_TIME_SECONDS;
  let timerId = null;
  let finished = false;

  function readSettings() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
    } catch (error) {
      console.warn("Could not read quiz setup:", error);
      return {};
    }
  }

  function normalizeSchool(code) {
    return String(code || "").toUpperCase();
  }

  function getQuestionBank(school) {
    return questionBanks[normalizeSchool(school)] || questionBanks.SOP;
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function loadQuestions() {
    const bank = getQuestionBank(settings.school);
    const requested = Number(settings.questionCount) || 10;
    const count = Math.min(Math.max(requested, 1), bank.length);
    questions = shuffle(bank).slice(0, count);
    answers = new Array(questions.length).fill(null);
  }

  function setFeedback(message = "", type = "") {
    elements.feedback.textContent = message;
    elements.feedback.className = `quiz-feedback${type ? ` ${type}` : ""}`;
  }

  function updateProgress() {
    const total = questions.length;
    const answered = answers.filter((answer) => answer !== null).length;
    const percent = total ? (answered / total) * 100 : 0;

    elements.questionCounter.textContent = `Question ${currentIndex + 1} of ${total}`;
    elements.answeredCounter.textContent = `${answered} answered`;
    elements.progressFill.style.width = `${percent}%`;
    elements.progress.setAttribute("aria-valuenow", String(Math.round(percent)));
  }

  function renderQuestion() {
    if (finished || !questions.length) return;

    const question = questions[currentIndex];
    elements.questionText.textContent = question.question;
    elements.placeholder?.remove();
    elements.options.replaceChildren();

    question.options.forEach((option, optionIndex) => {
      const label = document.createElement("label");
      label.className = "answer-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "quiz-answer";
      input.value = String(optionIndex);
      input.checked = answers[currentIndex] === optionIndex;
      input.setAttribute("aria-label", option);

      const text = document.createElement("span");
      text.textContent = option;

      input.addEventListener("change", () => {
        answers[currentIndex] = optionIndex;
        label.classList.add("selected");
        setFeedback("Answer saved. You can change it before submitting.");
        updateProgress();
      });

      label.append(input, text);
      elements.options.appendChild(label);
      if (input.checked) label.classList.add("selected");
    });

    elements.previous.disabled = currentIndex === 0;
    elements.next.disabled = currentIndex === questions.length - 1;
    elements.submit.hidden = currentIndex !== questions.length - 1;
    elements.next.hidden = currentIndex === questions.length - 1;
    setFeedback();
    updateProgress();
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function updateTimer() {
    elements.timer.textContent = formatTime(secondsLeft);
    elements.timer.classList.toggle("timer-warning", secondsLeft <= 60 && secondsLeft > 0);
    elements.timer.classList.toggle("timer-ended", secondsLeft <= 0);

    if (secondsLeft <= 0) {
      clearInterval(timerId);
      finishQuiz(true);
    }
  }

  function startTimer() {
    const perQuestion = 90;
    secondsLeft = Math.max(DEFAULT_TIME_SECONDS, questions.length * perQuestion);
    updateTimer();
    timerId = window.setInterval(() => {
      secondsLeft -= 1;
      updateTimer();
    }, 1000);
  }

  function finishQuiz(timeUp = false) {
    if (finished) return;

    const unanswered = answers.filter((answer) => answer === null).length;
    if (!timeUp && unanswered > 0) {
      const proceed = window.confirm(
        `You have ${unanswered} unanswered question(s). Submit anyway?`
      );
      if (!proceed) return;
    }

    finished = true;
    clearInterval(timerId);

    const correct = questions.reduce(
      (score, question, index) => score + (answers[index] === question.answer ? 1 : 0),
      0
    );
    const result = {
      school: settings.school || "SOP",
      subject: settings.subject || "General Practice",
      difficulty: settings.difficulty || "Medium",
      total: questions.length,
      answered: answers.filter((answer) => answer !== null).length,
      correct,
      scorePercent: Math.round((correct / questions.length) * 100),
      completedAt: new Date().toISOString()
    };

    try {
      sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
    } catch (error) {
      console.warn("Could not save quiz result:", error);
    }

    showResults(result, timeUp);
  }

  function showResults(result, timeUp) {
    elements.questionText.textContent = timeUp ? "Time is up!" : "Quiz completed!";
    elements.options.replaceChildren();

    const summary = document.createElement("div");
    summary.className = "result-summary";

    const score = document.createElement("p");
    score.className = "result-score";
    score.textContent = `${result.correct} / ${result.total}`;

    const detail = document.createElement("p");
    detail.textContent = `You answered ${result.answered} of ${result.total} questions. Your score is ${result.scorePercent}%.`;

    const heading = document.createElement("h3");
    heading.textContent = "Answer review";

    const review = document.createElement("ol");
    review.className = "answer-review";

    questions.forEach((question, index) => {
      const item = document.createElement("li");
      const yourAnswer = answers[index] === null
        ? "Not answered"
        : question.options[answers[index]];
      const correctAnswer = question.options[question.answer];

      const questionLine = document.createElement("strong");
      questionLine.textContent = question.question;

      const answerLine = document.createElement("p");
      answerLine.textContent = `Your answer: ${yourAnswer}`;

      const correctLine = document.createElement("p");
      correctLine.textContent = `Correct answer: ${correctAnswer}`;

      const explanation = document.createElement("p");
      explanation.textContent = question.explanation;

      item.append(questionLine, answerLine, correctLine, explanation);
      item.className = answers[index] === question.answer ? "review-correct" : "review-incorrect";
      review.appendChild(item);
    });

    summary.append(score, detail, heading, review);
    elements.options.appendChild(summary);

    elements.questionCounter.textContent = "Quiz finished";
    elements.answeredCounter.textContent = `${result.correct} correct`;
    elements.progressFill.style.width = "100%";
    elements.progress.setAttribute("aria-valuenow", "100");

    elements.previous.hidden = true;
    elements.next.hidden = true;
    elements.submit.hidden = true;
    elements.answerForm.hidden = true;
    elements.feedback.textContent = "Your result has been saved for this browser session.";
    elements.feedback.className = "quiz-feedback success";

    const note = document.querySelector(".quiz-note");
    if (note) note.textContent = "You can return to the dashboard and start another practice quiz.";

    const restart = document.createElement("a");
    restart.className = "primary-button";
    restart.href = "index.html";
    restart.textContent = "Back to dashboard";
    restart.style.marginTop = "20px";
    elements.options.appendChild(restart);
  }

  function init() {
    settings = readSettings();

    const school = normalizeSchool(settings.school || "SOP");
    const schoolNames = { SOP: "SOP", SOB: "SOB", SOF: "SOF" };

    elements.school.textContent = schoolNames[school] || school;
    elements.subject.textContent = settings.subject || "General Practice";
    elements.difficulty.textContent = settings.difficulty || "Medium";

    loadQuestions();

    // The supplied starter bank has 10 questions per school.
    if (Number(settings.questionCount) > questions.length) {
      setFeedback(`This demo currently has ${questions.length} sample questions for this school.`, "error");
    }

    renderQuestion();
    startTimer();

    elements.previous.addEventListener("click", () => {
      if (currentIndex > 0 && !finished) {
        currentIndex -= 1;
        renderQuestion();
      }
    });

    elements.next.addEventListener("click", () => {
      if (currentIndex < questions.length - 1 && !finished) {
        currentIndex += 1;
        renderQuestion();
      }
    });

    elements.submit.addEventListener("click", () => finishQuiz(false));

    elements.answerForm.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();