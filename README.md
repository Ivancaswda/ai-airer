# AI-Airer

AI SaaS-приложение для планирования поездок с помощью искусственного интеллекта.

## 🌐 Продакшен

Сайт уже задеплоен на Vercel: [https://ai-airer.vercel.app](https://ai-airer.vercel.app)  
Все функции, кроме Pro-подписки, доступны для просмотра.

---

## 🏗 Стек

- Frontend: Next.js 14  
- Backend / база: Convex DB  
- AI: OpenAI API  
- Оплата: LemonSqueezy (тестовый режим, фейковые платежи), можно заменить на ЮKassa/CloudPayments  
- Email: Gmail / Yandex для Contact-Us  
- Firebase: авторизация и хранение настроек  

---

## 📥 Установка локально

1. Клонируем репозиторий:

git clone https://github.com/username/ai-airer.git
2. входим в репозиторий 
cd ai-airer
Установить зависимости:

npm install

Поднять Convex проект (бэкенд):

npx convex dev

Создать файл .env и добавить ключи (пример):



CONVEX_DEPLOYMENT=dev:brazen-horse-855
NEXT_PUBLIC_CONVEX_URL=https://brazen-horse-855.convex.cloud
ARCJET_KEY=...
JWT_SECRET=...
OPENROUTER_API_KEY=...
GEMINI_API_KEY=...
GOOGLE_PLACE_API_KEY=
UNSPLASH_ACCESS_KEY=...
UNSPLASH_SECRET_KEY=...
UNSPLASH_APPLICATION_ID=795727
GMAIL_EMAIL=youremail@gmail.com
GMAIL_APP_PASSWORD=your_app_password
SUPPORT_EMAIL=support@example.com
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_IGNORE_SSR_ERRORS=true

# Для будущей интеграции ЮKassa
YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=
WEBHOOK_URL=
Запуск фронтенда:

bash
Copy code
npm run dev
Сайт будет доступен по адресу http://localhost:3000.

⚙️ Работа с Convex
Продакшен на Vercel использует базу на текущем аккаунте Convex.

Для локальной работы покупателю нужно:

Создать свой проект в Convex,

Подставить свои NEXT_PUBLIC_CONVEX_URL и CONVEX_DEPLOYMENT в .env,

Или по согласованию использовать существующий проект.

💳 Оплата и Pro-функции
В проекте Pro-подписка работает только через LemonSqueezy (тестовый режим, фейковые платежи).

Для подключения другой платёжной системы (например, ЮKassa) покупатель должен:

Получить аккаунт ЮKassa (самозанятый / ИП).

Вставить свои ключи (YOOKASSA_SHOP_ID, YOOKASSA_SECRET_KEY) в .env.

Настроить webhook на /api/payment/webhook и реализовать логику payment.succeeded.

⚠️ На данный момент полноценная подписка доступна только через LemonSqueezy.

📧 Email-формы
Contact-Us и About отправляют письма на адрес из SUPPORT_EMAIL.

Gmail использует GMAIL_EMAIL и GMAIL_APP_PASSWORD (пароль приложения).

💡 Дополнительно
Репозиторий готов к локальной разработке.

Продакшен-сайт на Vercel доступен для демонстрации.

Скриншоты и видео-демо можно посмотреть отдельно.

Для безопасности и полноценной работы платёжной системы рекомендуется менять ключи и домен после продажи.

> ⚠️ Все API-ключи (OpenAI, Convex, Unsplash, Gmail) должны быть получены покупателем. 
> Ключи продавца использовать нельзя.
---
