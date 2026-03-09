# 🚀 Как выложить сайт на GitHub Pages

## Шаг 1: Создай аккаунт на GitHub
1. Перейди на https://github.com
2. Нажми **Sign up**
3. Зарегистрируйся

## Шаг 2: Создай репозиторий
1. Нажми **+** → **New repository**
2. Имя репозитория: `mtg-mods` (или любое другое)
3. Visibility: **Public**
4. Нажми **Create repository**

## Шаг 3: Загрузи файлы
### Вариант А: Через браузер (просто)
1. В репозитории нажми **uploading an existing file**
2. Перетащи все файлы из папки `сайт`:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `mtgmods.png`
3. Нажми **Commit changes**

### Вариант Б: Через Git (правильно)
```bash
cd c:\Users\Ankon\Desktop\сайт
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ТВОЙ_НИК/repo-name.git
git push -u origin main
```

## Шаг 4: Включи GitHub Pages
1. В репозитории перейди в **Settings**
2. Слева выбери **Pages**
3. В **Source** выбери: `Deploy from a branch`
4. Branch: `main` → папка `/ (root)`
5. Нажми **Save**

## Шаг 5: Готово!
Через 1-2 минуты сайт будет доступен по ссылке:
```
https://ТВОЙ_НИК.github.io/ИМЯ_РЕПОЗИТОРИЯ/
```

---

# 🌐 Другие варианты хостинга

## Netlify (ещё проще)
1. https://www.netlify.com/
2. Перетащи папку `сайт` в окно браузера
3. Сайт сразу опубликован!

## Vercel
1. https://vercel.com/
2. Import GitHub репозиторий
3. Автоматический деплой

## Render
1. https://render.com/
2. New Static Site
3. Подключи GitHub

---

# ⚙️ Настройка бота для продакшена

## Чтобы бот работал 24/7, нужен сервер:

### 1. Railway (рекомендую)
1. https://railway.app/
2. New Project → Deploy from GitHub
3. Выбери свой репозиторий
4. В настройках укажи:
   - Build Command: `npm install`
   - Start Command: `node simple-bot.js`

### 2. Heroku
```bash
# Установи Heroku CLI
https://devcenter.heroku.com/articles/heroku-cli

# В терминале:
heroku login
heroku create mtg-mods-bot
git push heroku main
```

### 3. VPS (полный контроль)
- Timeweb Cloud, Selectel, DigitalOcean
- Аренда: ~200-500₽/месяц
- Установи Node.js и запусти бота

---

# 📝 Чек-лист перед публикацией

- [ ] Удалить `bot-server.js` (не нужен для сайта)
- [ ] Удалить `simple-bot.js` (если бот не нужен на хостинге)
- [ ] Удалить `package.json` (не нужен для сайта)
- [ ] Проверить, что `mtgmods.png` существует
- [ ] Проверить работу формы заказа
- [ ] Протестировать отправку в Telegram

---

**Создал Антон Чигур** © 2026
