document.addEventListener('DOMContentLoaded', function () {
  const journalEntriesDiv = document.getElementById('journal-entries');
  const addEntryButton = document.getElementById('add-entry');
  const downloadEntriesButton = document.getElementById('download-entries');

  let entries = JSON.parse(localStorage.getItem('sleepJournalEntries')) || [];

  function renderEntries() {
    journalEntriesDiv.innerHTML = '';
    entries.forEach((entry, index) => {
      const entryDiv = document.createElement('div');
      entryDiv.classList.add('entry');
      entryDiv.innerHTML = `
                <h2>${entry.date || new Date().toLocaleDateString('nb-NO')}</h2>
                <label>Jeg våknet og følte meg:</label>
                <div class="slider-container">
                    <input type="range" 
                           class="mood-slider" 
                           data-entry-id="${index}" 
                           data-field="mood" 
                           min="1" 
                           max="5" 
                           value="${getMoodValue(entry.mood)}"
                           step="1">
                    <div class="mood-display">
                        <span class="mood-emoji">${getMoodEmoji(
                          entry.mood
                        )}</span>
                        <span class="mood-text">${entry.mood || 'Ok'}</span>
                    </div>
                </div>
                <label>Skriv noen ord om hvordan du opplevde nattas søvn:</label>
                  <textarea data-entry-id="${index}" data-field="nightSleep">${
        entry.nightSleep
      }</textarea>
                  <label>Hvordan har du det om dagen?</label>
                  <textarea data-entry-id="${index}" data-field="dayTime">${
        entry.dayTime
      }</textarea>
                   <label>Hva gjorde du i går kveld?</label>
                  <textarea data-entry-id="${index}" data-field="lastNight">${
        entry.lastNight
      }</textarea>
                   <label>Hva kan du gjøre i dag for å få en bedre natt?</label>
                  <textarea data-entry-id="${index}" data-field="betterNight">${
        entry.betterNight
      }</textarea>
            `;
      journalEntriesDiv.appendChild(entryDiv);
    });
  }

  // Load existing entries on page load
  renderEntries();

  journalEntriesDiv.addEventListener('input', function (event) {
    if (event.target.classList.contains('mood-slider')) {
      const entryId = event.target.getAttribute('data-entry-id');
      const value = event.target.value;
      const mood = getMoodFromValue(value);
      entries[entryId].mood = mood;

      // Update both emoji and text in the mood-display
      const moodDisplay = event.target.nextElementSibling;
      moodDisplay.querySelector('.mood-emoji').textContent = getMoodEmoji(mood);
      moodDisplay.querySelector('.mood-text').textContent = mood;

      localStorage.setItem('sleepJournalEntries', JSON.stringify(entries));
    }
  });

  addEntryButton.addEventListener('click', function () {
    const today = new Date().toLocaleDateString('nb-NO');

    // Check if an entry for today already exists
    if (entries.some((entry) => entry.date === today)) {
      alert('Du har allerede lagt inn en registrering for i dag');
      return;
    }

    entries.push({
      date: today,
      mood: '',
      nightSleep: '',
      dayTime: '',
      lastNight: '',
      betterNight: '',
    });
    renderEntries();
    localStorage.setItem('sleepJournalEntries', JSON.stringify(entries));
  });

  downloadEntriesButton.addEventListener('click', function () {
    downloadAsCSV(entries);
  });

  function downloadAsCSV(entries) {
    const csvRows = [];
    const headers = Object.keys(entries[0]);
    csvRows.push(headers.join(','));

    for (const entry of entries) {
      const values = headers.map((header) => {
        const value = entry[header] || '';
        return `"${value.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvData = csvRows.join('\n');
    const csvBlob = new Blob([csvData], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvBlob);

    const link = document.createElement('a');
    link.href = csvUrl;
    link.download = 'sleep_journal_entries.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function getMoodEmoji(mood) {
    switch (mood) {
      case 'Fantastisk':
        return '😁';
      case 'Bra':
        return '🙂';
      case 'Ok':
        return '😐';
      case 'Ikke bra':
        return '🙁';
      case 'Forferdelig':
        return '😢';
      default:
        return '😐';
    }
  }

  function getMoodValue(mood) {
    switch (mood) {
      case 'Fantastisk':
        return 1;
      case 'Bra':
        return 2;
      case 'Ok':
        return 3;
      case 'Ikke bra':
        return 4;
      case 'Forferdelig':
        return 5;
      default:
        return 3;
    }
  }

  function getMoodFromValue(value) {
    switch (Number(value)) {
      case 1:
        return 'Fantastisk';
      case 2:
        return 'Bra';
      case 3:
        return 'Ok';
      case 4:
        return 'Ikke bra';
      case 5:
        return 'Forferdelig';
      default:
        return 'Ok';
    }
  }
});
