// Плавный скролл для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Анимация при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Применяем анимацию ко всем карточкам и секциям
document.querySelectorAll('.feature-card, .pricing-card, .timeline-item, .not-doing-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Обработка формы заказа
document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const contact = document.getElementById('contact').value.trim();
    const script = document.getElementById('script').value.trim();
    const budget = document.getElementById('budget').value.trim();
    const filesInput = document.getElementById('files');

    // === НАСТРОЙКИ TELEGRAM ===
    const TG_BOT_TOKEN = '8415434289:AAGyWPDpIIGF19DYIr20Jd4XArtuMLcMRKY';
    const TG_CHAT_ID = '5017662184';
    // =========================

    // Проверка контакта
    function validateContact(contact) {
        // Telegram: @username или username
        const tgRegex = /^@?[a-zA-Z0-9_]{3,32}$/;
        // Discord: username#0000 или новый формат username
        const dcRegex = /^([a-zA-Z0-9_.]{2,32}#\d{4}|[a-zA-Z0-9_.]{2,32})$/;
        
        if (tgRegex.test(contact)) {
            return { valid: true, type: 'Telegram' };
        }
        if (dcRegex.test(contact)) {
            return { valid: true, type: 'Discord' };
        }
        return { valid: false, type: null };
    }

    const validation = validateContact(contact);
    if (!validation.valid) {
        alert('❌ Неверный формат контакта!\n\nTelegram: @username или username\nDiscord: username#0000 или username');
        return;
    }

    const message = `🎮 *Новый заказ на скрипт!*

👤 *Имя:* ${name}
📱 *Контакт:* ${contact} (${validation.type})
📝 *Описание:* ${script}
💰 *Бюджет:* $${budget}`;

    // Отправка в Telegram
    if (TG_BOT_TOKEN !== 'YOUR_BOT_TOKEN' && TG_CHAT_ID !== 'YOUR_CHAT_ID') {
        try {
            // Отправляем текстовое сообщение
            const response = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: TG_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });
            
            const data = await response.json();
            console.log('Telegram response:', data);
            
            if (!data.ok) {
                throw new Error(data.description || 'Ошибка отправки');
            }

            // Отправляем файлы если есть
            if (filesInput.files.length > 0) {
                for (let file of filesInput.files) {
                    const formData = new FormData();
                    formData.append('chat_id', TG_CHAT_ID);
                    formData.append('document', file);
                    formData.append('caption', `📎 Файл: ${file.name}`);
                    
                    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendDocument`, {
                        method: 'POST',
                        body: formData
                    });
                }
            }

            alert('✅ Заказ успешно отправлен!');
            this.reset();
            
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Ошибка: ' + error.message);
        }
    } else {
        alert('⚠️ Telegram не настроен!');
    }
});

// Эффект параллакса для частиц
document.addEventListener('mousemove', (e) => {
    const particles = document.getElementById('particles');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    particles.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
});

// Анимация хедера при скролле
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.background = 'rgba(10, 10, 15, 0.98)';
        header.style.boxShadow = '0 5px 30px rgba(0, 245, 255, 0.1)';
    } else {
        header.style.background = 'rgba(10, 10, 15, 0.9)';
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Добавляем эффект свечения при наведении на карточки
document.querySelectorAll('.pricing-card, .feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 245, 255, 0.15), rgba(20, 20, 35, 0.8))`;
    });
    
    card.addEventListener('mouseleave', function() {
        card.style.background = 'rgba(20, 20, 35, 0.8)';
    });
});

// Анимация чисел в прайсе
const priceElements = document.querySelectorAll('.pricing-price');
const priceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'pulse 2s ease-in-out';
        }
    });
});

priceElements.forEach(el => priceObserver.observe(el));

// Добавляем CSS анимацию pulse
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Console easter egg
console.log('%c🎮 MTG MODS - Professional Body Scripts', 'color: #00f5ff; font-size: 20px; font-weight: bold;');
console.log('%cСоздал Антон Чигур', 'color: #7b2fff; font-size: 14px;');
