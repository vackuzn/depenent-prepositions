const wordElement = document.getElementById('word');
const optionElements = [
  document.getElementById('option1'),
  document.getElementById('option2'),
  document.getElementById('option3'),
  document.getElementById('option4')
  ]
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
  populateExampleContent(question)

  wordElement.innerText = question.word;
  const options = [...question.options];
  optionElements.forEach(optionElement =>
    optionElement.innerText = options.splice(Math.floor(Math.random() * options.length), 1)[0]
  );
}

function populateExampleContent(question) {
  const exampleContent = document.getElementById("example-content");
  exampleContent.style.display = "none";

  let examplesHTML = "";
  for (let i = 0; i < question.examples.length; i++) {
    examplesHTML += "<div>" + question.examples[i] + "</div>";
  }
  exampleContent.innerHTML = examplesHTML;
}

function checkAnswer(optionId) {
  const option = document.getElementById(optionId);
  const userAnswer = option.innerText;
  const currentQuestion = questions[currentIndex];

  if (!currentQuestion.correct.includes(userAnswer)) {
    option.classList.add('incorrect');
    option.disabled = true;
    onQuestionFailed(currentQuestion);

    return;
  }

  markAllCorrectAnswers(currentQuestion.correct)
  correctAnswers++;

  disableOptions();
  updateProgress();

  setTimeout(() => {
    const exampleToggle = document.getElementById("example-toggle");
    exampleToggle.textContent = "Show Example";

    resetOptionsStyle();
    enableOptions();
    currentIndex++;
    if (currentIndex < questions.length) {
      showQuestion(questions[currentIndex]);
    } else {
      alert('Task completed!');
    }
  }, 1000);
}

function onQuestionFailed(question) {
  const lastQuestion = questions[questions.length - 1];
  if (question != lastQuestion) {
    questions.push(question); // Move the current question to the end of the questions array
    failedAnswers++;
    updateProgress();
  }
}

function disableOptions() {
  optionElements.forEach(optionElement =>
    optionElement.disabled = true
  );
}

function enableOptions() {
  optionElements.forEach(optionElement =>
    optionElement.disabled = false
  );
}

function markAllCorrectAnswers(correctOptions) {
  optionElements.forEach(optionElement => {
    if (correctOptions.includes(optionElement.innerText)) {
      optionElement.classList.add('correct')
    }
  });
}

function resetOptionsStyle() {
  optionElements.forEach(optionElement =>
    optionElement.classList.remove('correct', 'incorrect')
  );
}

function updateProgress() {
  progressElement.innerText = `Progress: ${correctAnswers}/${totalQuestions} | Correct: ${correctAnswers} | Wrong: ${failedAnswers}`;
}

fetchQuestions();