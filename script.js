const questions = [
  { question: "What does HTML stand for?", answers: [ { text: "HyperText Markup Language", correct: true }, { text: "Hyper Transfer Markup Language", correct: false }, { text: "HighText Machine Language", correct: false }, { text: "None of the above", correct: false } ] },
  { question: "Which CSS property changes text color?", answers: [ { text: "font-color", correct: false }, { text: "text-style", correct: false }, { text: "color", correct: true }, { text: "text-color", correct: false } ] },
  { question: "Which keyword declares a variable in JS?", answers: [ { text: "var", correct: false }, { text: "let", correct: false }, { text: "const", correct: false }, { text: "All of the above", correct: true } ] },
  { question: "Which tag includes JavaScript in HTML?", answers: [ { text: "<script>", correct: true }, { text: "<js>", correct: false }, { text: "<javascript>", correct: false }, { text: "<code>", correct: false } ] },
  { question: "What does CSS stand for?", answers: [ { text: "Cascading Style Sheets", correct: true }, { text: "Colorful Style Sheets", correct: false }, { text: "Computer Style Sheets", correct: false }, { text: "Creative Style Sheets", correct: false } ] },
  { question: "Which HTML tag creates a line break?", answers: [ { text: "<br>", correct: true }, { text: "<lb>", correct: false }, { text: "<line>", correct: false }, { text: "<break>", correct: false } ] },
  { question: "What symbol ends a JS statement?", answers: [ { text: ";", correct: true }, { text: ".", correct: false }, { text: ":", correct: false }, { text: ",", correct: false } ] },
  { question: "How do you write 'Hello' in an alert?", answers: [ { text: "alert('Hello');", correct: true }, { text: "msg('Hello');", correct: false }, { text: "alertBox('Hello');", correct: false }, { text: "print('Hello');", correct: false } ] },
  { question: "How do you link a CSS file?", answers: [ { text: "<link rel='stylesheet'>", correct: true }, { text: "<style href='style.css'>", correct: false }, { text: "<script>", correct: false }, { text: "<css src='style.css'>", correct: false } ] },
  { question: "Which attribute is used for tooltips?", answers: [ { text: "title", correct: true }, { text: "tooltip", correct: false }, { text: "alt", correct: false }, { text: "info", correct: false } ] },
  { question: "Which input type is used for email?", answers: [ { text: "type='email'", correct: true }, { text: "type='text'", correct: false }, { text: "type='mail'", correct: false }, { text: "type='e-mail'", correct: false } ] },
  { question: "Which method adds an element to an array?", answers: [ { text: "push()", correct: true }, { text: "append()", correct: false }, { text: "add()", correct: false }, { text: "insert()", correct: false } ] },
  { question: "Which method converts JSON to object?", answers: [ { text: "JSON.parse()", correct: true }, { text: "JSON.stringify()", correct: false }, { text: "JSON.toObj()", correct: false }, { text: "parse.JSON()", correct: false } ] },
  { question: "What is the correct CSS syntax to center text?", answers: [ { text: "text-align: center;", correct: true }, { text: "align: center;", correct: false }, { text: "text: center;", correct: false }, { text: "align-text: center;", correct: false } ] },
  { question: "Which HTML element defines the document title?", answers: [ { text: "<title>", correct: true }, { text: "<head>", correct: false }, { text: "<meta>", correct: false }, { text: "<h1>", correct: false } ] }
];

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const scoreText = document.getElementById("scoreText");
const wrongText = document.getElementById("wrongText");
const lastScoreText = document.getElementById("lastScore");
const timerEl = document.getElementById("timeLeft");
const darkModeToggle = document.getElementById("darkModeToggle");

const nameInputContainer = document.getElementById("nameInputContainer");
const startBtn = document.getElementById("startBtn");
const quizContainer = document.getElementById("quiz");
const usernameInput = document.getElementById("username");

let username = "";
let currentQuestionIndex = 0;
let score = 0;
let wrongAnswers = 0;
let shuffledQuestions = [];
let timer;
let timePerQuestion = 30;
let timeLeft = timePerQuestion;
let answered = false;

startBtn.addEventListener("click", () => {
  const nameVal = usernameInput.value.trim();
  if (nameVal === "") {
    alert("Please enter your name to start.");
    return;
  }
  username = nameVal;
  nameInputContainer.style.display = "none";
  quizContainer.style.display = "block";
  init();
});

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkModeToggle.innerText = document.body.classList.contains("dark-mode")
    ? "Toggle Light Mode"
    : "Toggle Dark Mode";
});

function init() {
  const lastScore = localStorage.getItem('quizLastScore');
  if (lastScore !== null) {
    lastScoreText.innerText = `Your last score was: ${lastScore}`;
  }

  shuffledQuestions = questions
    .map(q => ({ ...q }))
    .sort(() => Math.random() - 0.5);

  nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      currentQuestionIndex++;
      loadQuestion();
    } else {
      showScore();
    }
  });

  loadQuestion();
}

function loadQuestion() {
  resetState();
  answered = false;
  timeLeft = timePerQuestion;
  timerEl.parentElement.style.display = "block";
  timerEl.innerText = timeLeft;
  startTimer();

  const current = shuffledQuestions[currentQuestionIndex];
  questionEl.innerText = current.question;

  current.answers.forEach((ans) => {
    const btn = document.createElement("button");
    btn.innerText = ans.text;
    btn.classList.add("answer-btn");
    btn.addEventListener("click", () => selectAnswer(btn, ans.correct));
    answersEl.appendChild(btn);
  });

  nextBtn.disabled = true;
  nextBtn.innerText = "Next Question";
}

function resetState() {
  clearInterval(timer);
  answersEl.innerHTML = "";
  scoreText.innerText = "";
  wrongText.innerText = "";
}

function selectAnswer(button, isCorrect) {
  if (answered) return;

  answered = true;
  clearInterval(timer);

  const allButtons = answersEl.querySelectorAll("button");
  allButtons.forEach((btn) => {
    btn.disabled = true;
    const correct = shuffledQuestions[currentQuestionIndex].answers.find(a => a.text === btn.innerText).correct;
    if (correct) btn.classList.add("correct");
    else btn.classList.add("wrong");
  });

  if (isCorrect) {
    score++;
  } else {
    wrongAnswers++;
  }

  nextBtn.disabled = false;
}

function showScore() {
  questionEl.innerText = `${username}, you got ${score} out of ${shuffledQuestions.length}`;
  answersEl.innerHTML = "";
  wrongText.innerText = `Wrong Answers: ${wrongAnswers}`;
  timerEl.parentElement.style.display = "none";

  localStorage.setItem('quizLastScore', score);

  nextBtn.innerText = "Restart";
  nextBtn.disabled = false;
  nextBtn.onclick = () => location.reload();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      if (!answered) {
        answered = true;
        disableAnswers();
        wrongAnswers++;
        nextBtn.disabled = false;
      }
    }
  }, 1000);
}

function disableAnswers() {
  const allButtons = answersEl.querySelectorAll("button");
  allButtons.forEach(btn => {
    btn.disabled = true;
    const correct = shuffledQuestions[currentQuestionIndex].answers.find(a => a.text === btn.innerText).correct;
    if (correct) btn.classList.add("correct");
    else btn.classList.add("wrong");
  });
}
