document.addEventListener('DOMContentLoaded', () => {
    // Game variables
    const originalWords = [
        "vaccinate",
        "calcium",
        "solstice",
        "specific",
        "decision",
        "tolerance",
        "pacific",
        "council",
        "merciful",
        "except"
    ];
    
    let words = [];
    let currentWordIndex = -1;
    let currentWord = '';
    let score = 0;
    let attempts = 0;
    let gameStarted = false;
    
    // DOM elements
    const playButton = document.getElementById('play-button');
    const spellingInput = document.getElementById('spelling-input');
    const submitButton = document.getElementById('submit-button');
    const hintButton = document.getElementById('hint-button');
    const feedbackArea = document.getElementById('feedback');
    const scoreDisplay = document.getElementById('score');
    const progressFill = document.getElementById('progress-fill');
    const currentWordDisplay = document.getElementById('current-word');
    const totalWordsDisplay = document.getElementById('total-words');
    
    // Initialize the game
    function initGame() {
        // Randomize the words
        words = [...originalWords].sort(() => Math.random() - 0.5);
        totalWordsDisplay.textContent = words.length;
        spellingInput.disabled = true;
        submitButton.disabled = true;
        hintButton.disabled = true;
    }
    
    // Get next word
    function getNextWord() {
        if (currentWordIndex < words.length - 1) {
            currentWordIndex++;
            currentWord = words[currentWordIndex].toLowerCase();
            currentWordDisplay.textContent = currentWordIndex + 1;
            updateProgressBar();
            return true;
        }
        return false;
    }
    
    // Update progress bar
    function updateProgressBar() {
        const progressPercentage = ((currentWordIndex + 1) / words.length) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }
    
    // Play word audio using Web Speech API
    function playWordAudio() {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(currentWord);
            utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
            
            // Play the word twice with a pause in between
            setTimeout(() => {
                const secondUtterance = new SpeechSynthesisUtterance(currentWord);
                secondUtterance.rate = 0.9;
                speechSynthesis.speak(secondUtterance);
            }, 1500);
        } else {
            feedbackArea.textContent = "Sorry, your browser doesn't support speech synthesis.";
        }
    }
    
    // Show hint
    function showHint() {
        feedbackArea.textContent = `Hint: The word starts with '${currentWord[0].toUpperCase()}'`;
    }
    
    // Check the spelling
    function checkSpelling() {
        const userInput = spellingInput.value.trim().toLowerCase();
        
        if (userInput === '') {
            feedbackArea.textContent = "Please type a word.";
            return;
        }
        
        if (userInput === currentWord) {
            // Correct answer
            let pointsAwarded = 10;
            if (attempts === 0) {
                pointsAwarded += 5; // Bonus for first attempt
            }
            
            score += pointsAwarded;
            scoreDisplay.textContent = score;
            
            feedbackArea.textContent = `Well done! "${currentWord}" is correct. +${pointsAwarded} points!`;
            feedbackArea.className = "feedback-area correct";
            
            // Reset for next word
            spellingInput.value = '';
            spellingInput.disabled = true;
            submitButton.disabled = true;
            hintButton.disabled = true;
            attempts = 0;
            
            // Check if there are more words
            if (!getNextWord()) {
                endGame();
            } else {
                // Enable play button for next word
                playButton.disabled = false;
                playButton.focus();
            }
        } else {
            // Incorrect answer
            attempts++;
            feedbackArea.textContent = `Not quite right. Try again or click "Play Word" to hear it once more.`;
            feedbackArea.className = "feedback-area incorrect";
            spellingInput.value = '';
            spellingInput.focus();
        }
    }
    
    // End the game
    function endGame() {
        feedbackArea.className = "feedback-area";
        feedbackArea.textContent = `Game over! Your final score is ${score} out of a possible ${words.length * 15} points.`;
        
        playButton.disabled = true;
        spellingInput.disabled = true;
        submitButton.disabled = true;
        hintButton.disabled = true;
        
        // Add replay button
        const replayButton = document.createElement('button');
        replayButton.textContent = 'Play Again';
        replayButton.classList.add('primary-button');
        replayButton.style.marginTop = '20px';
        feedbackArea.appendChild(replayButton);
        
        replayButton.addEventListener('click', () => {
            // Reset game
            words = [...originalWords].sort(() => Math.random() - 0.5); // Randomize again on replay
            currentWordIndex = -1;
            score = 0;
            scoreDisplay.textContent = score;
            gameStarted = false;
            feedbackArea.innerHTML = '<p>Press "Play Word" to begin!</p>';
            feedbackArea.className = "feedback-area";
            playButton.disabled = false;
            currentWordDisplay.textContent = 0;
            progressFill.style.width = '0%';
            initGame();
        });
    }
    
    // Event Listeners
    playButton.addEventListener('click', () => {
        if (!gameStarted) {
            gameStarted = true;
            getNextWord();
        }
        
        playWordAudio();
        feedbackArea.className = "feedback-area";
        feedbackArea.textContent = `Listen carefully and type what you hear.`;
        
        // Enable input, submit, and hint after playing audio
        spellingInput.disabled = false;
        submitButton.disabled = false;
        hintButton.disabled = false;
        spellingInput.focus();
        
        // Disable play button to prevent spamming
        playButton.disabled = true;
        setTimeout(() => {
            playButton.disabled = false;
        }, 3000);
    });
    
    submitButton.addEventListener('click', checkSpelling);
    
    spellingInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkSpelling();
        }
    });
    
    // Block non-letter characters
    spellingInput.addEventListener('input', (e) => {
        const input = e.target;
        input.value = input.value.replace(/[^a-zA-Z]/g, '');
    });
    
    hintButton.addEventListener('click', showHint);
    
    // Initialize the game
    initGame();
});
