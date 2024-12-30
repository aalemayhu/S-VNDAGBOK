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
                <h2>Entry #${index + 1}</h2>
              <label>Jeg våknet og følte meg:</label>
                    <div class="rating-container">
                        <label>
                            <input type="radio" name="mood-${index}" value="Fantastisk" ${entry.mood === 'Fantastisk' ? 'checked' : ''}>
                            Fantastisk
                        </label>
                        <label>
                            <input type="radio" name="mood-${index}" value="Bra" ${entry.mood === 'Bra' ? 'checked' : ''}>
                            Bra
                        </label>
                        <label>
                            <input type="radio" name="mood-${index}" value="Ok" ${entry.mood === 'Ok' ? 'checked' : ''}>
                            Ok
                        </label>
                        <label>
                            <input type="radio" name="mood-${index}" value="Ikke bra" ${entry.mood === 'Ikke bra' ? 'checked' : ''}>
                            Ikke bra
                        </label>
                         <label>
                            <input type="radio" name="mood-${index}" value="Forferdelig" ${entry.mood === 'Forferdelig' ? 'checked' : ''}>
                            Forferdelig
                        </label>
                    </div>
                  <label>Skriv noen ord om hvordan du opplevde nattas søvn:</label>
                  <textarea data-entry-id="${index}" data-field="nightSleep">${entry.nightSleep}</textarea>
                  <label>Hvordan har du det om dagen?</label>
                  <textarea data-entry-id="${index}" data-field="dayTime">${entry.dayTime}</textarea>
                   <label>Hva gjorde du i går kveld?</label>
                  <textarea data-entry-id="${index}" data-field="lastNight">${entry.lastNight}</textarea>
                   <label>Hva kan du gjøre i dag for å få en bedre natt?</label>
                  <textarea data-entry-id="${index}" data-field="betterNight">${entry.betterNight}</textarea>
            `;
            journalEntriesDiv.appendChild(entryDiv);
      });
    }

      // Load existing entries on page load
      renderEntries();

    journalEntriesDiv.addEventListener('change', function(event){
         if(event.target.tagName === 'TEXTAREA' || event.target.tagName === 'INPUT'){
           const entryId = event.target.getAttribute('data-entry-id');
           const field = event.target.getAttribute('data-field');
           const value = event.target.tagName === 'INPUT' ? event.target.value : event.target.value;
           entries[entryId][field] = value;

           localStorage.setItem('sleepJournalEntries', JSON.stringify(entries));
         }
    });

  addEntryButton.addEventListener('click', function () {
        entries.push({
            mood: '',
            nightSleep: '',
            dayTime: '',
            lastNight: '',
            betterNight: ''
        });
        renderEntries();
        localStorage.setItem('sleepJournalEntries', JSON.stringify(entries));
  });

  downloadEntriesButton.addEventListener('click', function(){
     downloadAsCSV(entries);
  });

   function downloadAsCSV(entries) {
        const csvRows = [];
        const headers = Object.keys(entries[0]);
        csvRows.push(headers.join(','));
    
        for (const entry of entries) {
          const values = headers.map(header => {
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
    };

});
