//Timer Variables
const timerDisplay = document.querySelector('#timer-display');
const startTimerBtn = document.querySelector('#timer-start-btn');
const resetTimerBtn = document.querySelector('#timer-reset-btn');
const stopTimerBtn = document.querySelector('#timer-stop-btn');

//Toggle Variables
const creatingToggle = document.querySelector('#creating-toggle');
const consumingToggle = document.querySelector('#consuming-toggle');

//Modal
const modal = document.querySelector('#edit-entry-modal');
const closeModalBtn = document.querySelector('#close-modal-btn');
const modalModeSelector = document.querySelector('#select-mode');
const modalHoursInput = document.querySelector('#hours-input');
const modalMinutesInput = document.querySelector('#minutes-input');
const modalSecondsInput = document.querySelector('#seconds-input');
const modalSaveEntry = document.querySelector('#modal-save-entry');

//RatioBar
const creatingBar = document.querySelector('#creating-bar');
const consumingBar = document.querySelector('#consuming-bar');
const ratioInfo = document.querySelector('#ratio-info');

//Entry List Variable
const entryList = document.querySelector('#entries-list');

let elapsedSeconds = 0;
let isRunning = false;
let timerInterval;
let modeStatus = 'Creating';

let currentEdit;

let entries = load('entries') || [];

//Timer
const updateTimerDisplay = () => timerDisplay.textContent = formatTime(elapsedSeconds);

function formatTime(elapsedSeconds) {
  const h = Math.floor(elapsedSeconds / 3600);
  const m = Math.floor((elapsedSeconds % 3600) / 60);
  const s = Math.floor(elapsedSeconds % 60);

  const formatHours = h.toString().padStart(2, '0');
  const formatMinutes = m.toString().padStart(2, '0');
  const formatSeconds = s.toString().padStart(2, '0');

  return `${formatHours}:${formatMinutes}:${formatSeconds}`;
}

function startTimer() {
  isRunning = true;
  showPauseIcon();

  timerInterval = setInterval(() => {
    elapsedSeconds++
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  
  showPlayIcon();
  clearInterval(timerInterval);
}

function resetTimer() {
  isRunning = false;
  showPlayIcon();

  clearInterval(timerInterval);
  elapsedSeconds = 0;
  updateTimerDisplay();
}

// Entries
function addEntry() {
  if (elapsedSeconds === 0) return;

  const entry = {
    id: Date.now(),
    mode: modeStatus,
    duration: elapsedSeconds,
    date: new Date().toLocaleString()
  }

  entries.unshift(entry)
  save('entries', entries);

  const newEntry = createEntryElement(entry)
  newEntry.classList.add('entry-enter');
  entryList.prepend(newEntry);

  resetTimer();
  updateRatioBar();
}

function createEntryElement(entry) {
  const wrapper = document.createElement('div');
  const cardData = document.createElement('div');
  const modeContainer = document.createElement('div');
  const modeType = document.createElement('div');
  const modeTitle = document.createElement('span');
  const timeContainer = document.createElement('div');
  const timeTitle = document.createElement('span');
  const timeValue = document.createElement('span');
  const cardControls = document.createElement('div');
  const editBtn = document.createElement('button');
  const deleteBtn = document.createElement('button');

  wrapper.classList.add('flex', 'justify-between', 'bg-slate-200', 'px-6', 'py-4', 'rounded-md');
  cardData.classList.add('flex', 'flex-col');
  modeContainer.classList.add('flex', 'items-center', 'gap-2');
  modeType.classList.add('w-2', 'h-2', 'rounded-full');
  modeTitle.classList.add('text-sm', 'font-bold', 'text-slate-500');
  timeContainer.classList.add('flex', 'gap-1', 'items-center');
  timeTitle.classList.add('font-bold', 'text-xs', 'text-slate-500');
  timeValue.classList.add('text-xs', 'text-slate-500');
  cardControls.classList.add('flex', 'items-center', 'gap-4');
  editBtn.classList.add('flex', 'items-center', 'justify-center', 'bg-slate-200', 'text-slate-500', 'rounded-md', 'cursor-pointer', 'hover:scale-110', 'hover:text-slate-800', 'transition-all', 'ease-in-out');
  deleteBtn.classList.add('flex', 'items-center', 'justify-center', 'bg-slate-200', 'text-slate-500', 'rounded-md', 'cursor-pointer', 'hover:scale-110', 'hover:text-red-600', 'transition-all', 'ease-in-out');

  entry.mode === 'Creating' ? modeType.classList.add('bg-green-500') : modeType.classList.add('bg-red-500');

  wrapper.dataset.dataId = entry.id
  modeTitle.textContent = entry.mode;
  timeTitle.textContent = 'Time:';
  timeValue.textContent = formatTime(entry.duration);

  editBtn.innerHTML = `<span class="iconify h-5 w-5" data-icon="mdi:edit-outline"></span>`;
  deleteBtn.innerHTML = `<span class="iconify h-5 w-5" data-icon="mdi:delete-outline"></span>`;

  wrapper.append(cardData, cardControls);
  cardData.append(modeContainer, timeContainer);
  modeContainer.append(modeType, modeTitle);
  timeContainer.append(timeTitle, timeValue);
  cardControls.append(editBtn, deleteBtn);

  deleteBtn.addEventListener('click', () => removeEntry(entry.id));
  editBtn.addEventListener('click', () => editEntry(entry));
  
  return wrapper
}

function removeEntry(id) {
  const entryEl = document.querySelector(`[data-data-id="${id}"]`);

  if (!entryEl) return;

  entryEl.classList.add('entry-exit');

  setTimeout(() => {
    entries = entries.filter(entry => entry.id !== id);
    save('entries', entries);
    renderEntries();
    updateRatioBar();
  }, 300)
}

function editEntry(entry) {
  modal.classList.remove('hidden');
  modal.classList.add('backdrop-blur-sm', 'bg-black/10');
  
  modalModeSelector.value = entry.mode;
  modalHoursInput.value = Math.floor(entry.duration / 3600);
  modalMinutesInput.value = Math.floor((entry.duration % 3600) / 60);
  modalSecondsInput.value = Math.floor(entry.duration % 60);

  currentEdit = entry
}

function updateEntry() {
  const newMode = modalModeSelector.value;
  const newHours = modalHoursInput.value * 3600;
  const newMinutes = modalMinutesInput.value * 60;
  const newSeconds = modalSecondsInput.value * 1;

  const newDuration = newHours + newMinutes + newSeconds;

  currentEdit.mode = newMode;
  currentEdit.duration = newDuration;

  save('entries', entries);
  modal.classList.add('hidden');
  renderEntries();
  updateRatioBar();
}

function renderEntries() {
  entryList.innerHTML = '';

  entries.forEach(entry => {
    entryList.append(createEntryElement(entry))
  });
}

//Ratio bar
function updateRatioBar() {
  if (!entries.length) {
    creatingBar.style.width = '100%';
    consumingBar.style.width = '0%';
    creatingBar.classList.add('bg-slate-200');
    ratioInfo.textContent = 'No data yet. Start Tracking.';
    return;
  };

  const creatingTotal = entries
  .filter(item => item.mode === 'Creating')
  .reduce((acc, curr) => acc + curr.duration, 0);

  const consumingTotal = entries
  .filter(item => item.mode === 'Consuming')
  .reduce((acc, curr) => acc + curr.duration, 0);
  
  const creatingPercent = creatingTotal / (creatingTotal + consumingTotal) * 100;
  const consumingPercent = consumingTotal / (consumingTotal + creatingTotal) * 100;
  
  creatingBar.style.width = `${creatingPercent}%`;
  consumingBar.style.width = `${consumingPercent}%`;

  creatingBar.classList.remove('bg-slate-200');

  if (consumingTotal === 0) {
    ratioInfo.textContent = 'All creating so far. No consuming logged.';
    return;
  };

  if (creatingTotal === 0) {
    ratioInfo.textContent = 'All consuming so far. No creating logged.';
    return;
  };

  const creatingMultiplier = creatingTotal / consumingTotal;
  const consumingMultiplier = consumingTotal / creatingTotal;
  
  if (creatingTotal == consumingTotal) {
    ratioInfo.textContent = "You're perfectly balanced.";
  } else if (creatingTotal > consumingTotal) {
    ratioInfo.innerHTML = `You created <strong class="text-green-600">${creatingMultiplier.toFixed(1)}×</strong> more than you consumed`;
  } else if (consumingTotal > creatingTotal) {
    ratioInfo.innerHTML = `You consumed <strong class="text-red-600">${consumingMultiplier.toFixed(1)}×</strong> more than you created`;
  };
}


//Toggle
function setMode(mode) {
  modeStatus = mode;

  if (mode === 'Creating') {
  consumingToggle.classList.remove('bg-slate-500', 'text-slate-200');
  consumingToggle.classList.add('text-slate-500');

  creatingToggle.classList.remove('text-slate-500');
  creatingToggle.classList.add('bg-slate-500', 'text-slate-200');
  }

  if (mode === 'Consuming') {
  creatingToggle.classList.remove('bg-slate-500', 'text-slate-200');
  creatingToggle.classList.add('text-slate-500');

  consumingToggle.classList.remove('text-slate-500');
  consumingToggle.classList.add('bg-slate-500', 'text-slate-200');
  }
}

// Helpers
const showPauseIcon = () => startTimerBtn.innerHTML = `<span class="iconify h-5 w-5" data-icon="mdi:pause"></span> Pause`;
const showPlayIcon = () => startTimerBtn.innerHTML = `<span class="iconify h-5 w-5" data-icon="mdi:play"></span> Start`;

const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
function load(key) {
  const values = localStorage.getItem(key);
  return values ? JSON.parse(values) : null
} 

function clampInputValue(input, min, max) {
  let value = Number(input.value);

  if (isNaN(value)) return;
  if (value > max) input.value = max;
  if (value < min) input.value = min;
}

function init() {
  renderEntries();
  updateRatioBar();
}

//Events
startTimerBtn.addEventListener('click', () => isRunning ? pauseTimer() : startTimer());
resetTimerBtn.addEventListener('click', resetTimer);
stopTimerBtn.addEventListener('click', addEntry);
creatingToggle.addEventListener('click', () => setMode('Creating'));
consumingToggle.addEventListener('click', () => setMode('Consuming'));
closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
modalSaveEntry.addEventListener('click', updateEntry);
modalSecondsInput.addEventListener('input', () => clampInputValue(modalSecondsInput, 0, 59));
  modalMinutesInput.addEventListener('input', () => clampInputValue(modalMinutesInput, 0, 59));
  modalHoursInput.addEventListener('input', () => {
  if (Number(modalHoursInput.value) < 0) modalHoursInput.value = 0;
  });

init();