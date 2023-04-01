const wordElement = document.getElementById('word');
const option1Element = document.getElementById('option1');
const option2Element = document.getElementById('option2');
const option3Element = document.getElementById('option3');
const option4Element = document.getElementById('option4');
const progressElement = document.getElementById('progress');

let questions = [];
let currentIndex = 0;
let totalQuestions = 0;
let correctAnswers = 0;
let failedAnswers = 0;

async function fetchQuestions() {
  const response = await fetch('data.json');
  const data = await response.json();
  questions = shuffleArray(data);
  totalQuestions = questions.length;
  showQuestion(questions[currentIndex]);
}

function toggleExample() {
  const exampleToggle = document.getElementById("example-toggle");
  const exampleContent = document.getElementById("example-content");

  if (exampleContent.style.display === "none") {
    exampleContent.style.display = "block";
    exampleContent.textContent = questions[currentIndex].example;
    exampleToggle.textContent = "Hide Example";
  } else {
    exampleContent.style.display = "none";
    exampleToggle.textContent = "Show Example";
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showQuestion(question) {
  const exampleContent = document.getElementById("example-content");
  exampleContent.style.display = "none";

  wordElement.innerText = question.word;
  const options = [...question.options];
  option1Element.innerText = options.splice(Math.floor(Math.random() * options.length), 1)[0];
  option2Element.innerText = options.splice(Math.floor(Math.random() * options.length), 1)[0];
  option3Element.innerText = options.splice(Math.floor(Math.random() * options.length), 1)[0];
  option4Element.innerText = options.splice(Math.floor(Math.random() * options.length), 1)[0];
}

function checkAnswer(optionId) {
  const option = document.getElementById(optionId);
  const userAnswer = option.innerText;
  const currentQuestion = questions[currentIndex];

  if (currentQuestion.correct.includes(userAnswer)) {
    option.classList.add('correct');
    correctAnswers++;
  } else {
    option.classList.add('incorrect');
    questions.push(currentQuestion); // Move the current question to the end of the questions array
    failedAnswers++;
  }

  disableOptions();
  updateProgress();

  setTimeout(() => {
    const exampleToggle = document.getElementById("example-toggle");
    exampleToggle.textContent = "Show Example";

    option.classList.remove('correct', 'incorrect');
    enableOptions();
    currentIndex++;
    if (currentIndex < questions.length) {
      showQuestion(questions[currentIndex]);
    } else {
      alert('Task completed!');
    }
  }, 1000);
}

function disableOptions() {
  option1Element.disabled = true;
  option2Element.disabled = true;
  option3Element.disabled = true;
  option4Element.disabled = true;
}

function enableOptions() {
  option1Element.disabled = false;
  option2Element.disabled = false;
  option3Element.disabled = false;
  option4Element.disabled = false;
}

function updateProgress() {
  progressElement.innerText = `Progress: ${correctAnswers}/${totalQuestions} | Correct: ${correctAnswers} | Wrong: ${failedAnswers}`;
}

fetchQuestions();