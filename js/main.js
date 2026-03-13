// main.js
// handles mood selection, saving to localStorage, and rendering history

const moods = {
  happy:   { emoji: '😊', color: '#FFD166' },
  sad:     { emoji: '😢', color: '#6B9FD4' },
  angry:   { emoji: '😡', color: '#EF6351' },
  anxious: { emoji: '😰', color: '#C77DFF' },
  calm:    { emoji: '😌', color: '#06D6A0' },
  tired:   { emoji: '😴', color: '#F4A261' },
};

let selected = null;

// show current date in header
document.getElementById('date').textContent = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

// handle mood card selection
document.querySelectorAll('.mood-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.mood-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selected = card.dataset.mood;
  });
});

// save mood entry to localStorage
document.getElementById('saveBtn').addEventListener('click', () => {
  if (!selected) { showToast('pick a mood first!'); return; }

  const note = document.getElementById('noteInput').value.trim();
  const entry = {
    mood: selected,
    note,
    timestamp: Date.now(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };

  const logs = JSON.parse(localStorage.getItem('moodlogs') || '[]');
  logs.unshift(entry);
  localStorage.setItem('moodlogs', JSON.stringify(logs));

  // reset UI after saving
  document.querySelectorAll('.mood-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('noteInput').value = '';
  selected = null;

  showToast('mood logged ✓');
  renderHistory();
});

// render last 7 entries from localStorage
function renderHistory() {
  const logs = JSON.parse(localStorage.getItem('moodlogs') || '[]');
  const list = document.getElementById('historyList');

  if (logs.length === 0) {
    list.innerHTML = '<p class="empty-history">no logs yet — start tracking!</p>';
    return;
  }

  list.innerHTML = logs.slice(0, 7).map(log => `
    <div class="history-item">
      <span class="history-emoji">${moods[log.mood].emoji}</span>
      <div class="history-info">
        <p class="history-mood" style="color:${moods[log.mood].color}">${log.mood}</p>
        ${log.note ? `<p class="history-note">${log.note}</p>` : ''}
      </div>
      <span class="history-date">${log.date} · ${log.time}</span>
      <div class="history-dot" style="background:${moods[log.mood].color}"></div>
    </div>
  `).join('');
}

// show toast notification
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// load history on page start
renderHistory();
