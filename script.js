// ==========================================
// CONFIGURATION
// ==========================================
const LOGO_EXTENSION = 'png';
const LOGOS_FOLDER_PATH = 'https://pub-e180267a78614921b022128e601edd36.r2.dev/';
const DATA_FILE = 'logos_clean.json';

// ==========================================
// STATE
// ==========================================
let logosData = {};
let availableIds = [];
let isLoading = true;
const history = [];
let historyIndex = -1;

// ==========================================
// DATA LOADING
// ==========================================
async function loadData() {
    try {
        const response = await fetch(DATA_FILE);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        logosData = await response.json();
        availableIds = Object.keys(logosData);
        
        const button = document.getElementById('randomButton');
        button.disabled = false;
        button.textContent = 'GO';
        isLoading = false;
    } catch (error) {
        const button = document.getElementById('randomButton');
        button.disabled = true;
        button.textContent = 'ERROR';
        document.getElementById('clubName').textContent = 'Error loading data';
        document.getElementById('result').style.display = 'block';
        isLoading = false;
    }
}

// ==========================================
// HELPERS
// ==========================================
function getClubName(id) {
    const name = logosData[id.toString()];
    return (name && name.trim()) ? name : `Club #${id}`;
}

function buildLogoUrl(clubId) {
    return `${LOGOS_FOLDER_PATH}${clubId}.${LOGO_EXTENSION}`;
}

// ==========================================
// DISPLAY CLUB
// ==========================================
function showClubById(clubId, clubName) {
    const img = document.getElementById('clubLogo');
    const nameEl = document.getElementById('clubName');
    const resultDiv = document.getElementById('result');
    
    nameEl.textContent = clubName;
    img.style.opacity = '0';
    img.src = buildLogoUrl(clubId);
    
    img.onload = () => {
        img.style.opacity = '1';
        resultDiv.style.display = 'block';
    };
    
    img.onerror = () => {
        img.style.opacity = '0';
        nameEl.textContent = `${clubName} (image missing)`;
        resultDiv.style.display = 'block';
    };
}

// ==========================================
// RANDOM CLUB
// ==========================================
function showRandomClub() {
    if (isLoading) return;
    if (availableIds.length === 0) return;
    
    const clubId = availableIds[Math.floor(Math.random() * availableIds.length)];
    const clubName = getClubName(clubId);
    
    showClubById(clubId, clubName);
    
    history.push({ clubId, clubName });
    historyIndex = history.length - 1;
    updateBackButton();
    updateHistoryDots();
}

// ==========================================
// HISTORY NAVIGATION
// ==========================================
function goBack() {
    if (historyIndex > 0) {
        historyIndex--;
        const prev = history[historyIndex];
        showClubById(prev.clubId, prev.clubName);
        updateBackButton();
    }
}

function jumpToHistory(index) {
    historyIndex = index;
    const item = history[index];
    showClubById(item.clubId, item.clubName);
    updateBackButton();
}

function updateBackButton() {
    const btn = document.getElementById('backButton');
    btn.classList.toggle('active', historyIndex > 0);
}

function updateHistoryDots() {
    const container = document.getElementById('historyDots');
    const recent = history.slice(-10);
    const startIndex = history.length - recent.length;
    
    container.innerHTML = '';
    recent.forEach((h, i) => {
        const dot = document.createElement('span');
        dot.className = 'history-dot';
        dot.setAttribute('data-name', h.clubName);
        dot.addEventListener('click', () => jumpToHistory(startIndex + i));
        container.appendChild(dot);
    });
}

// ==========================================
// FEEDBACK FORM
// ==========================================
function setupFeedback() {
    const btn = document.getElementById('feedbackBtn');
    const modal = document.getElementById('feedbackModal');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('feedbackForm');
    const status = document.getElementById('feedbackStatus');

    btn.addEventListener('click', () => { modal.style.display = 'flex'; });
    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; status.textContent = ''; });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { modal.style.display = 'none'; status.textContent = ''; }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                status.textContent = 'Thanks! Report sent.';
                status.style.color = '#4CAF50';
                form.reset();
                setTimeout(() => { modal.style.display = 'none'; }, 1500);
            } else {
                throw new Error('Failed');
            }
        } catch (error) {
            status.textContent = 'Error. Please try again.';
            status.style.color = '#ff4444';
        }
    });
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('randomButton');
    button.disabled = true;
    button.textContent = 'Loading...';
    
    loadData();
    setupFeedback();
    
    button.addEventListener('click', showRandomClub);
    document.getElementById('backButton').addEventListener('click', goBack);
    
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && !event.target.matches('input, textarea, button')) {
            event.preventDefault();
            if (!isLoading && !button.disabled) showRandomClub();
        }
        if (event.code === 'ArrowLeft' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            if (historyIndex > 0) goBack();
        }
    });
});