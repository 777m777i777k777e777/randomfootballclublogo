// ==========================================
// НАСТРОЙКИ
// ==========================================
const LOGO_EXTENSION = 'png';
const LOGOS_FOLDER_PATH = 'https://pub-e180267a78614921b022128e601edd36.r2.dev/';
const DATA_FILE = 'logos_clean.json';

// Глобальные переменные
let logosData = {};
let availableIds = [];
let isLoading = true;

// ==========================================
// ЗАГРУЗКА ДАННЫХ
// ==========================================
async function loadData() {
    try {
        console.log('📂 Loading data...');
        const response = await fetch(DATA_FILE);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${DATA_FILE} not found`);
        }
        
        logosData = await response.json();
        availableIds = Object.keys(logosData);
        
        console.log(`✅ Loaded ${availableIds.length} logos`);
        
        const button = document.getElementById('randomButton');
        button.disabled = false;
        button.textContent = 'GO';
        isLoading = false;
        
    } catch (error) {
        console.error('❌ Error loading:', error);
        
        const button = document.getElementById('randomButton');
        button.disabled = true;
        button.textContent = 'ERROR';
        
        const clubNameP = document.getElementById('clubName');
        clubNameP.textContent = `Error: ${error.message}`;
        document.getElementById('result').style.display = 'block';
        
        isLoading = false;
    }
}

// ==========================================
// ПОЛУЧЕНИЕ НАЗВАНИЯ КЛУБА ПО ID
// ==========================================
function getClubName(id) {
    const name = logosData[id.toString()];
    if (name && name.trim() !== '') {
        return name;
    }
    return `Club #${id}`;
}

// ==========================================
// ПОКАЗ СЛУЧАЙНОГО КЛУБА
// ==========================================
function showRandomClub() {
    if (isLoading) {
        document.getElementById('clubName').textContent = 'Loading...';
        document.getElementById('result').style.display = 'block';
        return;
    }
    
    if (availableIds.length === 0) {
        document.getElementById('clubName').textContent = 'No logos available';
        document.getElementById('result').style.display = 'block';
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableIds.length);
    const clubId = availableIds[randomIndex];
    const clubName = getClubName(clubId);
    const logoPath = `${LOGOS_FOLDER_PATH}${clubId}.${LOGO_EXTENSION}`;
    
    const clubLogoImg = document.getElementById('clubLogo');
    const clubNameP = document.getElementById('clubName');
    const resultDiv = document.getElementById('result');
    
    clubNameP.textContent = clubName;
    clubLogoImg.style.opacity = '0';
    clubLogoImg.src = logoPath;
    
    clubLogoImg.onload = () => {
        clubLogoImg.style.opacity = '1';
        resultDiv.style.display = 'block';
    };
    
    clubLogoImg.onerror = () => {
        console.warn(`⚠️ Image not found: ${logoPath}`);
        clubLogoImg.style.opacity = '0';
        clubNameP.textContent = `${clubName} (image missing)`;
        resultDiv.style.display = 'block';
    };
}

// ==========================================
// ОБРАТНАЯ СВЯЗЬ
// ==========================================
function setupFeedback() {
    const feedbackBtn = document.getElementById('feedbackBtn');
    const modal = document.getElementById('feedbackModal');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('feedbackForm');
    const status = document.getElementById('feedbackStatus');

    feedbackBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        status.textContent = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            status.textContent = '';
        }
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
                status.textContent = '✅ Thanks! Report sent.';
                status.style.color = '#4CAF50';
                form.reset();
                setTimeout(() => modal.style.display = 'none', 1500);
            } else {
                throw new Error('Failed');
            }
        } catch (error) {
            status.textContent = '❌ Error. Please try again.';
            status.style.color = '#ff4444';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            status.textContent = '';
        }
    });
}

// ==========================================
// ИНИЦИАЛИЗАЦИЯ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 App initialized');
    
    const button = document.getElementById('randomButton');
    button.disabled = true;
    button.textContent = 'Loading...';
    
    loadData();
    setupFeedback();
    
    button.addEventListener('click', showRandomClub);
    
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && !event.target.matches('input, textarea, button')) {
            event.preventDefault();
            if (!isLoading && !button.disabled) {
                showRandomClub();
            }
        }
    });
    
    window.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            console.warn('Image load error:', e.target.src);
            e.target.style.display = 'none';
        }
    }, true);
});
