// Простой бот для MTG MODS - работает через polling
// Запуск: node simple-bot.js

const TELEGRAM_BOT_TOKEN = '8415434289:AAGyWPDpIIGF19DYIr20Jd4XArtuMLcMRKY';
const ADMIN_CHAT_ID = '5017662184';

let offset = 0;

// Функция отправки сообщения
async function sendMessage(chatId, text, parseMode = 'Markdown', replyMarkup = null) {
    try {
        const body = {
            chat_id: chatId,
            text: text,
            parse_mode: parseMode
        };
        if (replyMarkup) body.reply_markup = JSON.stringify(replyMarkup);
        
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return await response.json();
    } catch (error) {
        console.error('Ошибка отправки:', error);
    }
}

// Функция пересылки сообщения
async function forwardMessage(fromChatId, toChatId, messageId) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/forwardMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: toChatId,
                from_chat_id: fromChatId,
                message_id: messageId
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Ошибка пересылки:', error);
    }
}

// Обработка сообщений от пользователей
async function handleUpdate(update) {
    if (!update.message) return;
    
    const message = update.message;
    const chatId = message.chat.id;
    const text = message.text;
    const userName = message.from.username || message.from.first_name || 'Пользователь';
    const firstName = message.from.first_name || '';
    
    // Команда /start
    if (text === '/start') {
        const keyboard = {
            inline_keyboard: [
                [{ text: '💰 Прайс', callback_data: 'price' }],
                [{ text: '📋 Сделать заказ', callback_data: 'order' }],
                [{ text: '❌ Что не делаем', callback_data: 'notdoing' }]
            ]
        };
        
        await sendMessage(chatId, `👋 Привет, ${firstName}!

🎮 **MTG MODS Bot**

Я бот для приёма заказов на скрипты для Body и Arizona.

💰 **Цены:** $1 - $20
💳 **Принимаю:** в любой валюте

Выберите действие ниже 👇`, 'Markdown', keyboard);
        return;
    }
    
    // Обработка callback query (кнопки)
    if (update.callback_query) {
        const callback = update.callback_query;
        const data = callback.data;
        
        if (data === 'price') {
            await sendMessage(chatId, `💰 **ПРАЙС НА СКРИПТЫ**

📦 **Базовый** — $1-$5
• Простые скрипты
• Автокликеры
• Базовый автофарм
• Минимальный GUI

⭐ **Стандарт** — $6-$12
• Сложный автофарм
• Красивый GUI
• Кастомизация функций
• Поддержка 7 дней

💎 **Премиум** — $13-$20
• Уникальные решения
• Полный функционал
• Приоритетная поддержка
• Обновления бесплатно`);
        }
        else if (data === 'notdoing') {
            await sendMessage(chatId, `❌ **ЧТО МЫ НЕ ДЕЛАЕМ:**

🚫 Скрипты для ЦР
🚫 Криптомайнинг
🚫 Использование инвентаря
🚫 Читы`);
        }
        else if (data === 'order') {
            await sendMessage(chatId, `📋 **КАК СДЕЛАТЬ ЗАКАЗ:**

1️⃣ Опишите, какой скрипт вам нужен
2️⃣ Укажите бюджет ($1-$20)
3️⃣ Прикрепите файлы (если есть)

**Пример:**
"Нужен автофарм для Body, бюджет $10"

Отправьте мне своё описание заказа 👇`);
            return;
        }
        
        // Подтверждение нажатия кнопки
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callback_query_id: callback.id })
        });
        return;
    }
    
    // Обработка файлов
    if (message.document) {
        const fileId = message.document.file_id;
        const fileName = message.document.file_name;
        
        // Пересылаем файл админу
        await forwardMessage(chatId, ADMIN_CHAT_ID, message.message_id);
        
        await sendMessage(chatId, `✅ Файл **${fileName}** получен!
        
📩 Отправьте описание заказа или нажмите /start`);
        
        await sendMessage(ADMIN_CHAT_ID, `📎 **Получен файл от @${userName || firstName}**

ID: \`${chatId}\`
Файл: ${fileName}`, 'Markdown');
        return;
    }
    
    // Обработка текста (заказ)
    if (text && !text.startsWith('/')) {
        // Пересылаем сообщение админу
        await forwardMessage(chatId, ADMIN_CHAT_ID, message.message_id);
        
        await sendMessage(chatId, `✅ **Заказ принят!**

📝 **Ваш заказ:**
${text}

⏳ Разработчик свяжется с вами в ближайшее время.

💡 Для нового заказа нажмите /start`, 'Markdown');

        await sendMessage(ADMIN_CHAT_ID, `🎮 **НОВЫЙ ЗАКАЗ**

👤 От: @${userName || firstName}
💬 ID: \`${chatId}\`

📋 **Описание:**
${text}`, 'Markdown');
    }
}

// Long polling - получение обновлений
async function getUpdates() {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${offset}&timeout=30`);
        const data = await response.json();
        
        if (data.ok && data.result.length > 0) {
            for (const update of data.result) {
                offset = update.update_id + 1;
                await handleUpdate(update);
            }
        }
    } catch (error) {
        console.error('Ошибка получения обновлений:', error);
    }
    
    // Рекурсивный вызов через 1 секунду
    setTimeout(getUpdates, 1000);
}

// Запуск бота
console.log('🤖 MTG MODS Bot запускается...');
console.log('💾 ID админа:', ADMIN_CHAT_ID);
console.log('✅ Бот готов к работе!\n');

getUpdates();
