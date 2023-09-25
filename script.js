function generateQuestions() {
    var textInput = document.getElementById("textInput");
    var questionsContainer = document.getElementById("questionsContainer");

    var text = textInput.value;
    var sentences = text.split('. ');

    var questions = [];

    for (var i = 0; i < sentences.length; i++) {
        var sentence = sentences[i].trim();
        if (sentence) {
            var question = sentence + '?';
            var choices = generateRandomChoices(sentence);
            var answer = choices[0];
            var maskedQuestion = maskAnswer(sentence, answer);  // Mask the answer in the question
            shuffleArray(choices);
            questions.push({ question: maskedQuestion, choices: choices, answer: answer });
        }
    }

    var questionsHTML = "";
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];
        var questionHTML = `
            <p>${question.question}</p>
            <ul>
                ${question.choices.map(function (choice, index) {
                    return `<li><input type="radio" name="question${i}" value="${choice}"> ${choice}</li>`;
                }).join("")}
            </ul>
            <button onclick="checkAnswer(${i})">Submit</button>
            <p id="feedback${i}"></p>
            <p id="correctAnswer${i}" style="display:none">Correct answer: ${question.answer}</p>
            <hr>
        `;
        questionsHTML += questionHTML;
    }

    questionsContainer.innerHTML = questionsHTML;
}

function generateRandomChoices(sentence, numChoices = 3) {
    var words = sentence.split(" ");
    shuffleArray(words);
    return words.slice(0, numChoices);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function maskAnswer(sentence, answer) {
    var maskedSentence = sentence.replace(new RegExp(answer, 'gi'), '_'.repeat(answer.length));
    return maskedSentence;
}

function checkAnswer(questionIndex) {
    var question = document.getElementsByName(`question${questionIndex}`);
    var selectedChoice;
    for (var i = 0; i < question.length; i++) {
        if (question[i].checked) {
            selectedChoice = question[i].value;
            break;
        }
    }

    var feedback = document.getElementById(`feedback${questionIndex}`);
    var correctAnswer = document.getElementById(`correctAnswer${questionIndex}`);

    if (!selectedChoice) {
        feedback.textContent = "Please select an answer.";
        return;
    }

    if (selectedChoice === questions[questionIndex].answer) {
        feedback.textContent = "Correct!";
    } else {
        feedback.textContent = "Wrong! ";
        correctAnswer.style.display = "block";
    }
}