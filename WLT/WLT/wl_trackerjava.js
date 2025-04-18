document.addEventListener("DOMContentLoaded", () => {
  let playerNames = [];
  let matchHistory = [];

  fetch('player_names.json')
    .then(response => response.json())
    .then(data => {
      playerNames = data;
      setupAutocomplete();
    });

  document.getElementById('matchForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const opponent = document.getElementById('opponent').value;
    const score = document.getElementById('score').value;
    const result = document.getElementById('result').value;

    const players = [];
    document.querySelectorAll('.player-row').forEach(row => {
      const name = row.querySelector('.player-select').value;
      const goals = parseInt(row.querySelector('.goal-input').value) || 0;
      if (name) players.push({ name, goals });
    });

    const match = { opponent, score, result, players };
    matchHistory.unshift(match);
    if (matchHistory.length > 15) matchHistory.pop();

    updateMatchList();
    document.getElementById('matchForm').reset();
    document.querySelector('#playersSection').innerHTML = `
      <h2>⚽ Gólszerzők</h2>
      <div class="player-row">
        <div class="player-select-container">
          <input type="text" class="player-select" placeholder="Játékos neve">
          <span class="clear-btn" style="display: none;">❌</span>
          <div class="autocomplete-list"></div>
        </div>
      </div>`;
    setupAutocomplete();
  });

  function updateMatchList() {
    const container = document.getElementById('matchList');
    container.innerHTML = '';
    matchHistory.forEach((match, index) => {
      const btn = document.createElement('button');
      btn.textContent = `${match.opponent} (${match.score}) - ${match.result === 'win' ? 'Győzelem' : 'Vereség'}`;
      btn.className = 'match-card';
      btn.onclick = () => loadMatchToForm(index);
      container.appendChild(btn);
    });
  }

  function loadMatchToForm(index) {
  const match = matchHistory[index];
  document.getElementById('score').value = match.score;
  document.getElementById('result').value = match.result;

  const playersSection = document.getElementById('playersSection');
  playersSection.innerHTML = `
    <h2>⚽ Gólszerzők</h2>
  `;

  match.players.forEach(player => {
    const row = document.createElement('div');
    row.className = 'player-row';
    row.innerHTML = `
      <div class="player-select-container">
        <input type="text" class="player-select" value="${player.name}" placeholder="Játékos neve">
        <span class="clear-btn" style="display: inline;">❌</span>
        <div class="autocomplete-list"></div>
      </div>`;
    playersSection.appendChild(row);
  });
  setupAutocomplete();
}


window.addPlayer = function () {
  const section = document.getElementById('playersSection');
  const row = document.createElement('div');
  row.className = 'player-row';
  row.innerHTML = `
    <div class="player-select-container">
      <input type="text" class="player-select" placeholder="Játékos neve">
      <span class="clear-btn" style="display: none;">❌</span>
      <div class="autocomplete-list"></div>
    </div>`;
  section.appendChild(row);
  setupAutocomplete();
};

  let score = {
  team1: 0,
  team2: 0
};

function changeScore(team, value) {
  score[team] += value;
  if (score[team] < 0) score[team] = 0; // Ne legyen negatív az érték
  document.getElementById(`score-${team}`).textContent = score[team];
}

function goToScorers() {
  const formattedScore = `${score.team1}-${score.team2}`;
  document.getElementById('score').value = formattedScore;

  document.getElementById('scoreInput').classList.add('hidden');
  document.getElementById('matchFormContainer').classList.remove('hidden');
}

function backToMatchList() {
    document.getElementById('scoreInput').classList.add('hidden');
    document.getElementById('matchFormContainer').classList.remove('hidden');
}


function setupAutocomplete() {
    document.querySelectorAll('.player-select').forEach(input => {
      const wrapper = input.parentElement;
      const row = wrapper.parentElement;
      const list = row.querySelector('.autocomplete-list');
      const clearBtn = wrapper.querySelector('.clear-btn');

      input.addEventListener('input', () => {
        const val = input.value.toLowerCase();
        list.innerHTML = '';
        if (val) {
          clearBtn.style.display = 'inline';
          const matches = playerNames.filter(name => name.toLowerCase().includes(val));
          matches.slice(0, 10).forEach(name => {
            const div = document.createElement('div');
            div.textContent = name;
            div.onclick = () => {
              input.value = name;
              list.innerHTML = '';
              clearBtn.style.display = 'inline';
            };
            list.appendChild(div);
          });
        } else {
          clearBtn.style.display = 'none';
        }
      });

      clearBtn.onclick = () => {
        input.value = '';
        list.innerHTML = '';
        clearBtn.style.display = 'none';
        input.focus();
      };

      input.addEventListener('blur', () => {
        setTimeout(() => list.innerHTML = '', 150);
      });
    });
  }
});
