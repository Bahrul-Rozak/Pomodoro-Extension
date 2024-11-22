let timer;
let isRunning = false;
let timeRemaining = 25 * 60; // 25 minutes in seconds
let workDuration = 25;
let breakDuration = 5;
let savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
let savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
let soundEnabled = true;

const timeDisplay = document.getElementById("time-display");
const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");
const saveNoteButton = document.getElementById("save-note-btn");
const saveTodoButton = document.getElementById("save-todo-btn");
const notesInput = document.getElementById("notes");
const todoInput = document.getElementById("todo");
const notesList = document.getElementById("notes-list");
const todoList = document.getElementById("todo-list");
const soundToggle = document.getElementById("sound-toggle");

const ticTocSound = new Audio('tic-toc.mp3'); // Suara tic-toc

// Load saved notes and tasks
function loadNotes() {
    notesList.innerHTML = '';
    savedNotes.forEach(note => {
        const li = document.createElement('li');
        li.textContent = note;
        notesList.appendChild(li);
    });
}

function loadTodos() {
    todoList.innerHTML = '';
    savedTodos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo;
        todoList.appendChild(li);
    });
}

// Update the timer display
function updateTimeDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Update the browser tab title with the remaining time
    document.title = `Pomodoro Timer - ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Start the timer
function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timer = setInterval(() => {
        timeRemaining--;
        updateTimeDisplay();
        if (soundEnabled) {
            ticTocSound.play(); // Putar suara tic-toc setiap detik
        }
        if (timeRemaining <= 0) {
            clearInterval(timer);
            isRunning = false;
            if (soundEnabled) {
                playSound();
            }
            timeRemaining = workDuration * 60; // Reset to work duration
            alert("Sesi selesai!");
        }
    }, 1000);
}

// Reset the timer
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeRemaining = workDuration * 60;
    updateTimeDisplay();
}

// Save note to localStorage
function saveNote() {
    const note = notesInput.value.trim();
    if (note) {
        savedNotes.push(note);
        localStorage.setItem('notes', JSON.stringify(savedNotes));
        notesInput.value = '';
        loadNotes();
    }
}

// Save todo to localStorage
function saveTodo() {
    const todo = todoInput.value.trim();
    if (todo) {
        savedTodos.push(todo);
        localStorage.setItem('todos', JSON.stringify(savedTodos));
        todoInput.value = '';
        loadTodos();
    }
}

// Toggle sound preference
soundToggle.addEventListener("change", () => {
    soundEnabled = soundToggle.checked;
});

// Play sound when session is finished
function playSound() {
    const audio = new Audio('https://www.soundjay.com/button/beep-07.wav');
    audio.play();
}

// Event listeners
startButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetTimer);
saveNoteButton.addEventListener("click", saveNote);
saveTodoButton.addEventListener("click", saveTodo);

// Initialize
updateTimeDisplay();
loadNotes();
loadTodos();
