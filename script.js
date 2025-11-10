// Элементы DOM
const themeToggle = document.getElementById('themeToggle');
const changePhotoBtn = document.getElementById('changePhotoBtn');
const avatar = document.getElementById('avatar');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const gallery = document.getElementById('gallery');
const contactForm = document.getElementById('contactForm');
const notification = document.getElementById('notification');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const langButtons = document.querySelectorAll('.lang-btn');

// Смена темы
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Светлая тема';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Темная тема';
        localStorage.setItem('theme', 'light');
    }
});

// Загрузка темы из localStorage
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Светлая тема';
    }
}

// Смена аватара
changePhotoBtn.addEventListener('click', () => {
    const newAvatarUrl = prompt('Введите URL нового аватара:');
    if (newAvatarUrl) {
        avatar.src = newAvatarUrl;
        showNotification('Аватар успешно изменен!');
        localStorage.setItem('avatar', newAvatarUrl);
    }
});

// Загрузка аватара из localStorage
function loadAvatar() {
    const savedAvatar = localStorage.getItem('avatar');
    if (savedAvatar) {
        avatar.src = savedAvatar;
    }
}

// Загрузка фотографий
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    addImageToGallery(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }
        showNotification('Фото успешно загружены в галерею!');
    }
});

// Добавление изображения в галерею
function addImageToGallery(src) {
    const img = document.createElement('div');
    img.className = 'gallery-item';
    img.innerHTML = `
        <img src="${src}" alt="Загруженное фото">
        <div class="delete-btn"><i class="fas fa-times"></i></div>
    `;
    gallery.appendChild(img);
    
    // Добавляем обработчик удаления
    const deleteBtn = img.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        img.remove();
        saveGallery();
        showNotification('Фото удалено из галереи');
    });
    
    saveGallery();
}

// Сохранение галереи в localStorage
function saveGallery() {
    const images = [];
    document.querySelectorAll('.gallery-item img').forEach(img => {
        images.push(img.src);
    });
    localStorage.setItem('gallery', JSON.stringify(images));
}

// Загрузка галереи из localStorage
function loadGallery() {
    const savedGallery = localStorage.getItem('gallery');
    if (savedGallery) {
        const images = JSON.parse(savedGallery);
        images.forEach(src => {
            addImageToGallery(src);
        });
    }
}

// Перетаскивание файлов
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.backgroundColor = '';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = '';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        const event = new Event('change');
        fileInput.dispatchEvent(event);
    }
});

// Табы
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Убираем активный класс у всех табов
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Добавляем активный класс к выбранному табу
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Форма обратной связи
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // В реальном приложении здесь был бы код для отправки данных на сервер
    showNotification('Сообщение успешно отправлено!');
    contactForm.reset();
});

// Уведомления
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Смена языка
langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        langButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // В реальном приложении здесь была бы логика смены языка
        const lang = btn.getAttribute('data-lang');
        if (lang === 'en') {
            showNotification('Language changed to English');
        } else {
            showNotification('Язык изменен на русский');
        }
    });
});

// Генерация случайного аватара при загрузке
function generateRandomAvatar() {
    const randomId = Math.floor(Math.random() * 70) + 1;
    return `https://i.pravatar.cc/300?img=${randomId}`;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadAvatar();
    loadGallery();
    
    // Если аватар не был загружен, устанавливаем случайный
    if (!localStorage.getItem('avatar')) {
        avatar.src = generateRandomAvatar();
    }
});