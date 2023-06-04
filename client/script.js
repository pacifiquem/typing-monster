// Array of sentences for the user to type
var sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Sphinx of black quartz, judge my vow.",
    "Pack my box with five dozen liquor jugs."
];

var currentIndex = 0;
var score = 0;
var startTime, endTime;

var sentenceElement = document.getElementById("sentence-to-type");
var userInput = document.getElementById("user-input");
var scoreElement = document.getElementById("score");
var startButton = document.getElementById("start-btn");
var timerElement = document.getElementById("timer");

// Start button click event listener
startButton.addEventListener("click", startGame);

function startGame() {
    // Reset game state
    currentIndex = 0;
    score = 0;
    startButton.disabled = true;
    userInput.value = "";
    scoreElement.textContent = "Score: 0";
    startTime = new Date();

    // Show the first sentence
    sentenceElement.textContent = sentences[currentIndex];

    // Enable input field and listen for keyup events
    userInput.disabled = false;
    userInput.focus();
    userInput.addEventListener("keyup", checkInput);
}

function checkInput() {
    var typedText = userInput.value.trim();
    var currentSentence = sentences[currentIndex];

    if (typedText === currentSentence) {
        // User typed the sentence correctly
        score++;
        scoreElement.textContent = "Score: " + score;

        // Move to the next sentence
        currentIndex++;

        if (currentIndex >= sentences.length) {
            // Game is over, calculate time
            endTime = new Date();
            var elapsedTime = Math.floor((endTime - startTime) / 1000);
            var minutes = Math.floor(elapsedTime / 60);
            var seconds = elapsedTime % 60;
            timerElement.textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

            // Disable input field and remove event listener
            userInput.disabled = true;
            userInput.removeEventListener("keyup", checkInput);

            // Enable start button
            startButton.disabled = false;
        } else {
            // Display the next sentence
            sentenceElement.textContent = sentences[currentIndex];
            userInput.value = "";
        }
    } else {
        // Highlight incorrect characters
        var sentenceChars = currentSentence.split("");
        var typedChars = typedText.split("");
        var isMatch = true;

        var sentenceHTML = "";

        for (var i = 0; i < sentenceChars.length; i++) {
            if (typedChars[i] && typedChars[i] === sentenceChars[i]) {
                sentenceHTML += '<span class="correct">' + sentenceChars[i] + '</span>';
            } else {
                sentenceHTML += '<span class="incorrect">' + sentenceChars[i] + '</span>';
                isMatch = false;
            }
        }

        sentenceElement.innerHTML = sentenceHTML;

        if (isMatch) {
            sentenceElement.innerHTML += '<span class="correct">' + currentSentence.substring(sentenceChars.length) + '</span>';
        }
    }
}
