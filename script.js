let timer;
let isRunning = false;
let minutes = 25;
let seconds = 0;
let isWorkSession = true;
let workDuration = 25;
let breakDuration = 5;

const timeDisplay = document.getElementById("time-display");
const status = document.getElementById("status");
const notes = document.getElementById("notes");
const notesList = document.getElementById("notes-list");
const historyList = document.getElementById("history-list");
const todo = document.getElementById("todo");
const todoList = document.getElementById("todo-list");

document.getElementById("start-button").addEventListener("click", startStopTimer);
document.getElementById("reset-button").addEventListener("click", resetTimer);
document.getElementById("save-note-button").addEventListener("click", saveNote);
document.getElementById("save-todo-button").addEventListener("click", saveTodo);

let history = JSON.parse(localStorage.getItem('history')) || [];
let savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
let savedTodos = JSON.parse(localStorage.getItem('todos')) || [];

function loadNotes() {
  notesList.innerHTML = '';
  savedNotes.forEach((note, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${note} <button onclick="deleteNote(${index})">Hapus</button>`;
    notesList.appendChild(li);
  });
}

function loadTodos() {
  todoList.innerHTML = '';
  savedTodos.forEach((todoItem, index) => {
    const li = document.createElement('li');
    li.innerText = todoItem;
    todoList.appendChild(li);
  });
}

function loadHistory() {
  historyList.innerHTML = '';
  history.forEach((session, index) => {
    const li = document.createElement('li');
    li.innerText = session;
    historyList.appendChild(li);
  });
}

function startStopTimer() {
  if (isRunning) {
    clearInterval(timer);
    document.getElementById("start-button").innerText = "Mulai";
    addHistory("Sesi selesai!");
    playNotificationSound();
  } else {
    workDuration = document.getElementById("work-duration").value;
    breakDuration = document.getElementById("break-duration").value;
    timer = setInterval(updateTime, 1000);
    document.getElementById("start-button").innerText = "Jeda";
    playTickSound();  
  }
  isRunning = !isRunning;
}

function updateTime() {
  if (seconds === 0) {
    if (minutes === 0) {
      if (isWorkSession) {
        minutes = breakDuration;
        status.innerText = "Istirahat! Waktunya santai.";
        isWorkSession = false;
        playNotificationSound();
      } else {
        minutes = workDuration;
        status.innerText = "Waktu untuk bekerja!";
        isWorkSession = true;
        playNotificationSound();
      }
    } else {
      minutes--;
      seconds = 59;
    }
  } else {
    seconds--;
  }

  timeDisplay.innerText = `${formatTime(minutes)}:${formatTime(seconds)}`;
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

function resetTimer() {
  clearInterval(timer);
  minutes = workDuration;
  seconds = 0;
  isRunning = false;
  timeDisplay.innerText = `${formatTime(minutes)}:00`;
  status.innerText = "Siap untuk bekerja?";
  document.getElementById("start-button").innerText = "Mulai";
  stopTickSound();  
}

function addHistory(session) {
  history.push(session);
  localStorage.setItem('history', JSON.stringify(history));
  loadHistory();
}

function saveNote() {
  const noteText = notes.value.trim();
  if (noteText) {
    savedNotes.push(noteText);
    localStorage.setItem('notes', JSON.stringify(savedNotes));
    notes.value = ''; 
    loadNotes();
  }
}

function deleteNote(index) {
  savedNotes.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(savedNotes));
  loadNotes();
}

function saveTodo() {
  const todoText = todo.value.trim();
  if (todoText) {
    savedTodos.push(todoText);
    localStorage.setItem('todos', JSON.stringify(savedTodos));
    todo.value = ''; 
    loadTodos();
  }
}

function playNotificationSound() {
  let audio = new Audio('https://www.soundjay.com/button/beep-07.wav');
  audio.play();
}

function playTickSound() {
  if (!window.tickSound) {
    window.tickSound = new Audio('tic-toc.mp3'); 
    window.tickSound.loop = true; 
  }
  window.tickSound.play();
}

function stopTickSound() {
  if (window.tickSound) {
    window.tickSound.pause(); 
    window.tickSound.currentTime = 0; 
  }
}

loadNotes();
loadTodos();
loadHistory();
