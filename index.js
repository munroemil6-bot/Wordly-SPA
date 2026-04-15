const searchBtn = document.getElementById('searchBtn');
const wordInput = document.getElementById('wordInput');
const displayArea = document.getElementById('displayArea');
const favoritesList = document.getElementById('favoritesList');

// 1. Fetch Data from API
async function getWordData(word) {
    displayArea.innerHTML = `<div class="loader">Searching for "${word}"...</div>`;
    
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (!response.ok) throw new Error('Word not found');
        
        const data = await response.json();
        renderDefinition(data[0]);
    } catch (error) {
        displayArea.innerHTML = `
            <div class="error-card">
                <p>Oops! We couldn't find that word. Please try another.</p>
            </div>`;
    }
}

// 2. Render Definition to DOM
function renderDefinition(data) {
    const { word, phonetics, meanings } = data;
    const pronunciation = phonetics[0]?.text || '';
    
    let meaningsHTML = meanings.map(m => `
        <div class="meaning-block">
            <span class="part-of-speech">${m.partOfSpeech}</span>
            <p>${m.definitions[0].definition}</p>
            ${m.definitions[0].example ? `<i class="example">"${m.definitions[0].example}"</i>` : ''}
        </div>
    `).join('');

    displayArea.innerHTML = `
        <div class="word-card">
            <div class="card-header">
                <h2>${word}</h2>
                <button onclick="saveWord('${word}')" class="save-btn">★ Save</button>
            </div>
            <p class="phonetic">${pronunciation}</p>
            <div class="meanings-container">${meaningsHTML}</div>
        </div>
    `;
}

// 3. Favorites Logic (LocalStorage)
function saveWord(word) {
    let favorites = JSON.parse(localStorage.getItem('wordly_favs')) || [];
    if (!favorites.includes(word)) {
        favorites.push(word);
        localStorage.setItem('wordly_favs', JSON.stringify(favorites));
        updateFavoritesUI();
        
        // Dynamic CSS Update: Highlight success
        const btn = document.querySelector('.save-btn');
        btn.style.backgroundColor = '#2ecc71';
        btn.innerText = 'Saved!';
    }
}

function updateFavoritesUI() {
    const favorites = JSON.parse(localStorage.getItem('wordly_favs')) || [];
    favoritesList.innerHTML = favorites.map(word => `
        <li onclick="getWordData('${word}')">${word}</li>
    `).join('');
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const word = wordInput.value.trim();
    if (word) getWordData(word);
});

wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWordData(wordInput.value.trim());
});

// Init
updateFavoritesUI();