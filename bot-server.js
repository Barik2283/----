// Bot server для обработки сообщений от пользователей
// Запуск: node bot-server.js

const TELEGRAM_BOT_TOKEN = '8415434289:AAGyWPDpIIGF19DYIr20Jd4XArtuMLcMRKY';
const ADMIN_CHAT_ID = '5017662184';

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Webhook для Telegram бота
app.post(`/webhook/${TELEGRAM_BOT_TOKEN}`, async (req, res) => {
    try {
        const update = req.body;
        console.log('Получено обновление:', JSON.stringify(update, null, 2));

        // Обработка сообщения
        if (update.message) {
            const message = update.message;
            const chatId = message.chat.id;
            const text = message.text;
            const userName = message.from.username || message.from.first_name;

            // Команда /start
            if (text === '/start') {
                await sendMessage(chatId, `👋 Привет, ${userName}!

🎮 **MTG MODS Bot**

Я бот для приёма заказов на скрипты.

**Как сделать заказ:**
1. Отправь описание скрипта
2. Укажи бюджет
3. Прикрепи файлы (если есть)

**Что я НЕ принимаю:**
❌ Скрипты для ЦР
❌ Криптомайнинг
❌ Использование инвентаря
❌ Читы

💰 Цены: $1 - $20
💳 Принимаю в любой валюте

Отправь мне свой заказ!`);
            }
            // Обработка файлов
            else if (message.document) {
                const fileId = message.document.file_id;
                const fileName = message.document.file_name;
                
                // Пересылаем файл админу
                await forwardMessage(chatId, ADMIN_CHAT_ID, message.message_id);
                
                await sendMessage(chatId, `✅ Файл **${fileName}** получен!`);
                await sendMessage(ADMIN_CHAT_ID, `📎 **Получен файл от @${userName}**

Файл: ${fileName}
Чат: ${chatId}`);
            }
            // Обработка текста
            else if (text) {
                // Пересылаем сообщение админу
                await forwardMessage(chatId, ADMIN_CHAT_ID, message.message_id);
                
                await sendMessage(chatId, `✅ Сообщение получено!

📝 **Ваш заказ:**
${text}

⏳ Я передал заказ разработчику.
Он свяжется с вами в ближайшее время.`);

                await sendMessage(ADMIN_CHAT_ID, `🎮 **Новый заказ от @${userName}**

ID чата: \`${chatId}\`
Сообщение:
${text}`);
            }
        }

        // Обработка ответа на сообщение (reply)
        if (update.callback_query) {
            const callback = update.callback_query;
            console.log('Callback query:', callback);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Ошибка:', error);
        res.sendStatus(500);
    }
});

// Функция отправки сообщения
async function sendMessage(chatId, text, parseMode = 'Markdown') {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: parseMode
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
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

// Установка webhook при запуске
async function setWebhook() {
    const webhookUrl = 'https://your-domain.com/webhook/' + TELEGRAM_BOT_TOKEN;
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl })
    });
    
    const data = await response.json();
    console.log('Webhook установлен:', data);
}

app.listen(port, () => {
    console.log(`🤖 Bot server запущен на http://localhost:${port}`);
    console.log(`📡 Webhook URL: https://your-domain.com/webhook/${TELEGRAM_BOT_TOKEN}`);
});
