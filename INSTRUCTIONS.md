# Main

## Docker
  ---                                                                                                                      
  Docker Manual for exp project                                                                                            
                                                                                                                           
  1. Install Docker                                                                                                        
                                                                                                                           
  Download Docker Desktop from docker.com. After install, verify:                                                          
                                                                                                                           
  docker --version                                                                                                         
  docker compose version                                                                                                   
                                                                                                                           
  ---                                                                                                                      
  2. What you need to create (4 files in project root)                                                                     
                                                                                                                           
  Dockerfile                                                                                                               
                                                                                                                           
  Multi-stage build — first stage builds the app with Node, second stage serves it with nginx. Final image is ~25 MB       
  instead of ~1 GB.                                                                                                        
                                                                                                                           
  ### Stage 1: build                                                                                                         
  FROM node:20-alpine AS builder                                                                                          
  WORKDIR /app
  COPY package.json package-lock.json ./                                                                                   
  RUN npm ci                                                                                                               
  COPY . .                                                                                                                 
  RUN npm run build                                                                                                        
                                                                                                                           
  ### Stage 2: serve                                                                                                        
  FROM nginx:alpine
  COPY --from=builder /app/dist /usr/share/nginx/html
  COPY nginx.conf /etc/nginx/conf.d/default.conf                                                                           
  EXPOSE 80                                                                                                                
                                                                                                                           
  How it works:                                                                                                            
  - FROM node:20-alpine AS builder — pulls a lightweight Linux image with Node 20                                          
  - COPY package.json first, then RUN npm ci — Docker caches this layer, so reinstalling dependencies only happens when    
  package.json changes                                                                                                     
  - COPY . . + npm run build — copies your source and builds dist/                                                         
  - Second FROM nginx:alpine — starts a fresh image with only nginx, copies the built dist/ into it. Node.js is thrown away
   — not needed at runtime                                                                                                 
                                                                                                                           
  nginx.conf                                                                                                               
                                                                                                                           
  server {                                                                                                                 
      listen 80;                                                                                                          
      root /usr/share/nginx/html;
      index index.html;
                                                                                                                           
      location / {                                                                                                         
          try_files $uri $uri/ /index.html;                                                                                
      }                                                                                                                    
                                                                                                                           
      location /assets/ {                                                                                                 
          expires 1y;
          add_header Cache-Control "public, immutable";
      }
  }
                                                                                                                           
  - try_files — SPA fallback: any unknown URL serves index.html so React handles routing                                   
  - /assets/ — Vite hashes filenames, so browser can cache them forever                                                    
                                                                                                                           
  docker-compose.yml                                                                                                       
                                                                                                                           
  services:                                                                                                                
    frontend:                                                                                                              
      build: .                                                                                                            
      ports:
        - "3000:80"
      restart: unless-stopped
                                                                                                                           
  - build: . — build from Dockerfile in current dir                                                                        
  - 3000:80 — your machine's port 3000 maps to container's port 80                                                         
  - restart: unless-stopped — auto-restarts on crash                                                                       
                                                                                                                           
  .dockerignore                                                                                                            
                                                                                                                           
  node_modules                                                                                                             
  dist                                                                                                                     
  .git                                                                                                                     
  .github                                                                                                                  
  *.md                                                                                                                    
                                                                                                                           
  Same idea as .gitignore — keeps the build context small and fast by not sending unnecessary files into the container.    
                                                                                                                           
  ---                                                                                                                      
  3. Important: base in vite.config.js                                                                                     
                                                                                                                           
  Your current config has base: '/Web_claude/' for GitHub Pages. Docker serves from root, so for Docker builds you need    
  base: '/'.                                                                                                               
                                                                                                                           
  Two options:                                                                                                             
  - Simple: just change it to '/' when working with Docker                                                                 
  - Flexible: use env variable: base: process.env.VITE_BASE || '/' and set VITE_BASE=/Web_claude/ only in your GitHub      
  Actions workflow                                                                                                                                                                                                 
        
  #### Build and start (first time or after changes)                                                                          
  docker compose up -d --build                                                                                             
                                                                                                                           
  #### Open in browser                                                                                                        
  #### http://localhost:3000                                                                                                  
                                                                                                                           
  #### Stop                                                                                                                   
  docker compose down                                                                                                      
                                                                                                                           
  #### See logs                                                                                                              
  docker compose logs -f frontend
                                                                                                                           
  #### Rebuild only (no start)                                                                                                
  docker compose build                                                                                                     
                                                                                                                           
  #### Check running containers                                                                                               
  docker ps                                                                                                               

  ---
  5. When you add a backend later                                                                                          
                                                                                                                           
  Expand docker-compose.yml:                                                                                               
                                                                                                                           
  services:                                                                                                                
    frontend:                                                                                                              
      build: .                                                                                                             
      ports:                                                                                                              
        - "3000:80"
      restart: unless-stopped

    backend:
      build: ./backend          # separate Dockerfile in backend/ folder                                                   
      ports:                                                                                                               
        - "4000:4000"                                                                                                      
      restart: unless-stopped                                                                                              
                                                                                                                           
  Your project structure would look like:                                                                                  
                                                                                                                           
  exp/                                                                                                                     
  ├── src/                  # frontend source (same as now)                                                                
  ├── backend/              # new folder for backend                                                                       
  │   ├── Dockerfile                                                                                                       
  │   └── ...                                                                                                              
  ├── Dockerfile            # frontend Dockerfile                                                                          
  ├── nginx.conf                                                                                                           
  ├── docker-compose.yml    # orchestrates both services                                                                   
  └── ...                                                                                                                  
                                                                                                                           
  Then docker compose up -d --build starts both at once. Frontend at :3000, backend at :4000.                              
                                                                                                                           
  ---                                                                                                                      
  6. Key concepts cheat sheet                                                                                              
                                                                                                                          
  ┌───────────────────┬──────────────────────────────────────────────────────────────┐                                     
  │      Concept      │                        What it means                         │                                     
  ├───────────────────┼──────────────────────────────────────────────────────────────┤                                     
  │ Image             │ A snapshot/template (like a class). Built from Dockerfile    │                                     
  ├───────────────────┼──────────────────────────────────────────────────────────────┤                                     
  │ Container         │ A running instance of an image (like an object)              │                                     
  ├───────────────────┼──────────────────────────────────────────────────────────────┤                                     
  │ Volume            │ Persistent storage that survives container restarts          │                                     
  ├───────────────────┼──────────────────────────────────────────────────────────────┤                                     
  │ Port mapping      │ host:container — connects your machine's port to container's │                                     
  ├───────────────────┼──────────────────────────────────────────────────────────────┤                                     
  │ docker compose    │ Runs multiple containers defined in docker-compose.yml       │                                     
  ├───────────────────┼──────────────────────────────────────────────────────────────┤                                     
  │ Multi-stage build │ Multiple FROM in one Dockerfile — keeps final image small    │    
  └───────────────────┴──────────────────────────────────────────────────────────────┘   

## For Claude Code and me
- Чтобы происнтруктировать docker для запуска сервера, мне нужно сперва написать этот сервер. Поскольку я собираюсь запускать на node.js, то мне стоит наверное сперва написать этот сервер? 

# Vellow Portfolio — Как устроен проект

> Документ объясняет каждый элемент структуры проекта: папки, технологии, процесс сборки, деплой и рендеринг.

---

## Содержание

1. [5 главных папок](#1--5-главных-папок)
2. [Что такое Vite](#2--что-такое-vite)
3. [Как работает React](#3--как-работает-react)
4. [Rendering Flow — путь от запроса до пикселей](#4--rendering-flow--путь-от-запроса-до-пикселей)
5. [dist/assets/ — почему файлы нечитаемые](#5--distassets--почему-файлы-нечитаемые)
6. [node_modules и Node.js](#6--node_modules-и-nodejs)
7. [Как работает деплой](#7--как-работает-деплой)
8. [Что можно улучшить](#8--что-можно-улучшить)
9. [Docker — как контейнеризировать проект](#9--docker--как-контейнеризировать-проект)
10. [Вопросы для дальнейшего изучения](#10--вопросы-для-дальнейшего-изучения)

---

## 1 — 5 главных папок

```
exp/
├── src/            ← Исходный код (то, что пишешь ты)
├── public/         ← Статические файлы (копируются as-is)
├── dist/           ← Готовая сборка (то, что видит браузер)
├── node_modules/   ← Зависимости (скачанные пакеты)
└── .github/        ← CI/CD конфигурация (автодеплой)
```

### `src/` — исходный код

Здесь живёт весь код, который ты пишешь руками. Vite берёт эту папку, обрабатывает и превращает в готовый сайт.

```
src/
├── main.jsx              # Entry point — точка входа React
├── App.jsx               # Главный компонент (boot → terminal)
├── index.css             # Глобальные стили + Tailwind + CRT-тема
├── components/           # UI-компоненты
│   ├── BootScreen.jsx    # Анимация загрузки
│   ├── DesktopLayout.jsx # Основной layout (терминал + sidebar)
│   ├── Terminal.jsx      # Интерактивный терминал
│   ├── CommandInput.jsx  # Поле ввода команд
│   ├── ProfilePanel.jsx  # Правая панель с профилем
│   └── CrtOverlay.jsx    # Визуальные эффекты CRT-монитора
├── commands/             # Команды терминала
│   ├── index.jsx         # Registry — маршрутизатор команд
│   ├── help.jsx          # Вывод help
│   ├── about.jsx         # О себе
│   ├── contact.jsx       # Контакты
│   ├── experience.jsx    # Опыт работы
│   ├── projects.jsx      # Проекты
│   └── clear.js          # Очистка терминала
├── hooks/                # Custom React hooks
│   ├── useTypewriter.js  # Эффект печатной машинки
│   └── useBootSequence.js # Анимация boot-последовательности
├── data/                 # Данные (контент сайта)
│   ├── bio.js            # Имя, навыки, языки
│   ├── experience.js     # Работа/образование
│   └── projects.js       # Портфолио проектов
└── assets/               # Медиа-файлы (обрабатываются Vite)
    ├── hero.png
    ├── vite.svg
    └── react.svg
```

**Ключевой момент:** Файлы в `src/assets/` проходят через Vite-пайплайн (оптимизация, хэширование), а файлы в `public/` — нет.

### `public/` — статика без обработки

```
public/
├── favicon.svg   # Иконка вкладки
├── icons.svg     # SVG-спрайт с иконками
└── 404.html      # Редирект для GitHub Pages SPA
```

Всё из `public/` копируется в `dist/` без изменений. Если положишь сюда файл `photo.jpg`, он будет доступен по адресу `/Web_claude/photo.jpg` на сайте.

### `dist/` — production build

Результат команды `npm run build`. Это то, что реально загружается в браузер пользователя.

```
dist/
├── index.html                    # HTML с подключёнными бандлами
├── favicon.svg                   # Из public/
├── icons.svg                     # Из public/
├── 404.html                      # Из public/
└── assets/
    ├── index-D3MN09Di.js         # Весь JS в одном файле (~207 KB)
    └── index-NwAeqBWA.css        # Весь CSS в одном файле (~12 KB)
```

**Никогда не редактируй файлы в `dist/` вручную** — они перезаписываются при каждом `npm run build`.

### `node_modules/` — зависимости

Содержит все npm-пакеты, от которых зависит проект (React, Vite, Tailwind и их зависимости). Подробнее — в [разделе 6](#6--node_modules-и-nodejs).

### `.github/` — автоматизация

```
.github/
└── workflows/
    └── deploy.yml    # GitHub Actions: автодеплой на GitHub Pages
```

Подробнее — в [разделе 7](#7--как-работает-деплой).

---

## 2 — Что такое Vite

**Vite** (франц. «быстрый») — это **build tool** (инструмент сборки) и **dev server** (сервер для разработки).

### Проблема, которую решает Vite

Браузер не понимает:
- **JSX** — `<BootScreen onComplete={handleBootComplete} />` — это не валидный HTML/JS
- **Импорты CSS в JS** — `import './index.css'` — это не стандартный JavaScript
- **Модули из node_modules** — `import { useState } from 'react'` — браузер не знает, где лежит `react`

Vite берёт всё это и превращает в то, что браузер понимает: обычные `.js` и `.css` файлы.

### Два режима работы

#### Development (`npm run dev`)
```
Ты редактируешь src/App.jsx
        ↓
Vite мгновенно перекомпилирует ТОЛЬКО этот файл
        ↓
Браузер обновляется без перезагрузки страницы (HMR)
```

**HMR** (Hot Module Replacement) — Vite заменяет изменённый модуль прямо в работающем приложении. Ты меняешь цвет кнопки — он обновляется в браузере за миллисекунды, без потери state.

#### Production (`npm run build`)
```
Все файлы из src/
        ↓
Vite собирает их в минимальное количество файлов
        ↓
Минифицирует (убирает пробелы, сокращает имена)
        ↓
Добавляет хэш в имена файлов (для кэширования)
        ↓
Результат → dist/
```

### `vite.config.js` — конфигурация

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/Web_claude/',
})
```

| Строка | Что делает |
|--------|-----------|
| `plugins: [react()]` | Учит Vite понимать JSX и React Fast Refresh |
| `plugins: [tailwindcss()]` | Обрабатывает Tailwind-классы и генерирует CSS |
| `base: '/Web_claude/'` | Все URL ассетов будут начинаться с `/Web_claude/` (нужно для GitHub Pages, потому что сайт лежит не в корне домена, а в подпапке) |

---

## 3 — Как работает React

### Главная идея

React — это **библиотека для построения UI из компонентов**. Вместо того чтобы писать весь HTML в одном файле, ты разбиваешь интерфейс на переиспользуемые кусочки (компоненты).

### JSX — это не HTML

```jsx
// Это JSX (пишешь ты):
<BootScreen onComplete={handleBootComplete} />

// Это JavaScript (видит браузер после Vite):
React.createElement(BootScreen, { onComplete: handleBootComplete })
```

JSX — синтаксический сахар. Он выглядит как HTML, но на самом деле это JavaScript-вызовы, которые создают объекты-описания UI. Vite (через плагин `@vitejs/plugin-react`) трансформирует JSX в обычный JS при сборке.

### Component Tree — дерево компонентов

Твоё приложение — дерево компонентов, где каждый отвечает за свою часть UI:

```
App                             ← Управляет фазами (boot / terminal)
├── CrtOverlay                  ← Наложение эффекта CRT-монитора
├── BootScreen                  ← Фаза 1: анимация загрузки
│   └── (typewriter effect)
└── DesktopLayout               ← Фаза 2: основной интерфейс
    ├── Terminal                ← Левая часть: терминал
    │   ├── (command output)
    │   └── CommandInput        ← Поле ввода
    └── ProfilePanel            ← Правая часть: профиль
```

### Точка монтирования

**`index.html`** содержит пустой `<div id="root"></div>`.

**`src/main.jsx`** — entry point React:

```jsx
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

`createRoot` находит `<div id="root">` в HTML и говорит React: «рендери всё дерево компонентов сюда». React берёт на себя управление содержимым этого div. Весь видимый контент страницы генерируется JavaScript'ом.

### State и фазы

```jsx
// App.jsx
const [phase, setPhase] = useState(alreadyBooted ? 'terminal' : 'boot')
```

**`useState`** — React hook, который создаёт «состояние» компонента. Когда `phase` меняется — React автоматически перерисовывает нужную часть UI:

- `phase === 'boot'` → показывает `<BootScreen />`
- `phase === 'terminal'` → показывает `<DesktopLayout />`

`sessionStorage` запоминает, что boot уже прошёл — при обновлении страницы анимация не повторяется.

### Virtual DOM

React не меняет DOM напрямую. Сначала он строит лёгкую копию DOM в памяти (Virtual DOM), сравнивает её с предыдущей версией, и применяет только разницу (diffing). Это быстрее, чем пересоздавать HTML целиком.

---

## 4 — Rendering Flow — путь от запроса до пикселей

Когда пользователь открывает твой сайт:

```
1. Браузер запрашивает https://veterba.github.io/Web_claude/
                    ↓
2. GitHub Pages отдаёт dist/index.html
                    ↓
3. Браузер парсит HTML, находит ссылки:
   - <link href="/Web_claude/assets/index-NwAeqBWA.css">
   - <script src="/Web_claude/assets/index-D3MN09Di.js">
   - <link href="fonts.googleapis.com/...Press+Start+2P">
                    ↓
4. Браузер скачивает CSS, JS и шрифт ПАРАЛЛЕЛЬНО
                    ↓
5. CSS применяется → страница пока пустая (только <div id="root">)
                    ↓
6. JS загружается и выполняется:
   a) React инициализируется
   b) createRoot(document.getElementById('root'))
   c) <App /> рендерится
   d) useState проверяет sessionStorage
   e) phase === 'boot' → рендерится <BootScreen />
                    ↓
7. React генерирует DOM-элементы и вставляет их в <div id="root">
                    ↓
8. Браузер отрисовывает пиксели (paint)
                    ↓
9. Boot-анимация завершается → setPhase('terminal')
                    ↓
10. React заменяет <BootScreen /> на <DesktopLayout />
                    ↓
11. Пользователь видит терминал и может вводить команды
```

**Важный нюанс:** Пока JS не загрузится и не выполнится — пользователь видит пустую страницу. Это особенность **SPA** (Single Page Application) — весь контент генерируется JavaScript'ом на клиенте.

---

## 5 — dist/assets/ — почему файлы нечитаемые

### `index-D3MN09Di.js` (~207 KB)

Открой этот файл — увидишь что-то вроде:

```javascript
function Hd(e){var t,n,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object"
```

Это **весь твой проект в одном файле**: React runtime + все компоненты + все стили + все данные. Выглядит страшно, но это тот же код, что в `src/`, только обработанный.

### Что произошло с кодом

**1. Bundling (объединение)**
Vite взял ~20+ файлов из `src/` и все зависимости из `node_modules/` (React, ReactDOM) и склеил в один `.js` файл. Браузеру быстрее скачать 1 файл на 207 KB, чем 50 мелких файлов с отдельными HTTP-запросами.

**2. Minification (сжатие)**
```javascript
// Было (твой код):
const handleBootComplete = useCallback(() => {
    sessionStorage.setItem(SKIP_KEY, '1')
    setPhase('terminal')
}, [])

// Стало (после минификации):
const h=useCallback(()=>{sessionStorage.setItem(s,"1"),p("terminal")},[])
```

- Убраны все пробелы, переносы строк, комментарии
- Переменные переименованы: `handleBootComplete` → `h`, `SKIP_KEY` → `s`
- Размер файла уменьшен в несколько раз

**3. Hashing (хэширование имени)**

`index-D3MN09Di.js` — `D3MN09Di` — это **content hash**. Он вычисляется из содержимого файла.

Зачем: **cache busting**. Браузер кэширует файлы по имени. Если ты обновил код, хэш меняется → имя файла меняется → браузер скачивает новую версию вместо старой из кэша.

### `index-NwAeqBWA.css` (~12 KB)

Тот же принцип:
- Весь Tailwind CSS (только используемые классы) + твои кастомные стили из `index.css`
- Минифицирован (всё в одну строку)
- Хэш в имени для кэширования

### Почему это хорошо

| Метрика | Без сборки | С Vite |
|---------|-----------|--------|
| Файлов для загрузки | ~50+ | 2 (JS + CSS) |
| Размер JS | ~800+ KB | ~207 KB |
| Кэширование | Ломается при любом изменении | Обновляется только то, что изменилось |
| Читаемость | Для людей | Для браузеров |

---

## 6 — node_modules и Node.js

### Используем ли мы Node?

**Да, но не как сервер.** Node.js в этом проекте выполняет роль **build toolchain** (инструментария сборки):

```
                 Что делает Node.js в проекте
                 ────────────────────────────
npm install    → Скачивает зависимости в node_modules/
npm run dev    → Запускает Vite dev server (localhost:5173)
npm run build  → Собирает production-бандл в dist/
npm run lint   → Запускает ESLint для проверки кода
```

В production (на GitHub Pages) **Node.js не работает** — сайт раздаётся как статические HTML/CSS/JS файлы. Node нужен только на этапе разработки и сборки.

### Что внутри node_modules/

```
node_modules/
├── react/            ← Сама библиотека React
├── react-dom/        ← React для работы с браузерным DOM
├── vite/             ← Сборщик и dev server
├── tailwindcss/      ← CSS-фреймворк
├── eslint/           ← Линтер кода
├── ... (130+ пакетов)
```

Большинство — это **транзитивные зависимости** (зависимости зависимостей). Ты указал 10 пакетов в `package.json`, но у каждого из них свои зависимости.

### `package.json` vs `package-lock.json`

| Файл | Назначение |
|------|-----------|
| `package.json` | Список зависимостей с диапазонами версий (`^19.2.4` = любая 19.x.x) |
| `package-lock.json` | Точные версии ВСЕХ пакетов (включая транзитивные). Гарантирует, что `npm ci` установит одинаковые версии на любой машине |

### Почему node_modules в .gitignore

Папка весит сотни мегабайт и содержит ~130 директорий. Хранить её в git бессмысленно — любой может воссоздать её командой `npm install` (по `package-lock.json`).

---

## 7 — Как работает деплой

### Полная цепочка

```
git push origin main
        ↓
GitHub обнаруживает push → запускает .github/workflows/deploy.yml
        ↓
┌─────────────────────────────────────────────┐
│  GitHub Actions Runner (облачный сервер)     │
│                                              │
│  1. git checkout (скачивает код)             │
│  2. Установка Node.js v20                    │
│  3. npm ci (установка зависимостей)          │
│  4. npm run build (Vite собирает dist/)      │
│  5. Загрузка dist/ как artifact              │
│  6. Деплой на GitHub Pages                   │
└─────────────────────────────────────────────┘
        ↓
Сайт доступен: https://veterba.github.io/Web_claude/
```

### `npm ci` vs `npm install`

- `npm install` — может обновить пакеты и изменить `package-lock.json`
- `npm ci` — устанавливает **точно** те версии, что в `package-lock.json`. Используется в CI/CD для воспроизводимых сборок

### `base: '/Web_claude/'` — зачем?

GitHub Pages для репозитория `Veterba/Web_claude` разворачивает сайт не в корне домена, а в подпапке:

```
https://veterba.github.io/Web_claude/
                         ^^^^^^^^^^^
                         это base path
```

Без `base` в vite.config.js бандлы искались бы по `/assets/index-xxx.js` (от корня домена), а они лежат в `/Web_claude/assets/index-xxx.js`.

### `public/404.html` — трюк для SPA

GitHub Pages не знает о client-side routing. Если пользователь обновит страницу или перейдёт по прямой ссылке — GitHub Pages вернёт 404. Файл `404.html` содержит редирект обратно на `index.html`, чтобы React мог обработать URL самостоятельно.

В твоём случае это одностраничный сайт без роутинга, но `404.html` всё равно полезен — он перенаправляет любые «битые» URL на главную.

---

## 8 — Что можно улучшить

### Структурные улучшения

**1. TypeScript**
Сейчас проект на чистом JavaScript. TypeScript добавляет типизацию — IDE будет подсказывать ошибки до запуска кода. Миграция для проекта такого размера занимает пару часов: переименуй `.jsx` → `.tsx` и добавь типы постепенно.

**2. Группировка по фичам**
Сейчас компоненты, данные и команды разложены по типу файла. Альтернатива — группировка по фиче:

```
src/
├── features/
│   ├── boot/
│   │   ├── BootScreen.tsx
│   │   └── useBootSequence.ts
│   ├── terminal/
│   │   ├── Terminal.tsx
│   │   ├── CommandInput.tsx
│   │   └── commands/
│   └── profile/
│       └── ProfilePanel.tsx
```

Для одностраничного портфолио текущая структура OK. Это имеет смысл, когда проект растёт.

**3. SEO и метатеги**
SPA-сайты плохо индексируются поисковиками — бот видит пустой `<div id="root">`. Добавь в `index.html`:

```html
<meta name="description" content="Vellow — portfolio ...">
<meta property="og:title" content="Vellow | Portfolio">
<meta property="og:image" content="/Web_claude/preview.png">
```

Это не решит проблему полностью, но улучшит превью при шаринге ссылки в Telegram/Twitter.

**4. Lazy loading**
`React.lazy()` позволяет загружать компоненты по требованию. Для однострника это overkill, но если добавишь больше «страниц» (разделов) — стоит рассмотреть.

**5. Environment variables**
Сейчас `base` захардкожен в `vite.config.js`. Можно использовать `.env` файлы:

```
# .env.production
VITE_BASE=/Web_claude/

# .env.development
VITE_BASE=/
```

---

## 9 — Docker — как контейнеризировать проект

### Зачем Docker для статического сайта?

- **Воспроизводимость**: не нужно устанавливать Node.js — Docker сам подтягивает нужную версию
- **Изоляция**: проект не зависит от системных настроек твоей машины
- **Production-ready**: nginx внутри контейнера — это реальный веб-сервер (быстрее и надёжнее, чем `vite preview`)
- **Портативность**: один `docker compose up` — и сайт работает на любой машине

### Dockerfile (multi-stage build)

```dockerfile
# ─── Этап 1: Сборка ───
FROM node:20-alpine AS builder

WORKDIR /app

# Сначала копируем только package*.json — это позволяет Docker
# кэшировать слой с npm ci, пока зависимости не изменятся
COPY package.json package-lock.json ./
RUN npm ci

# Теперь копируем остальной код и собираем
COPY . .
RUN npm run build

# ─── Этап 2: Продакшен ───
FROM nginx:alpine

# Копируем собранный dist/ из первого этапа в nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Кастомный nginx-конфиг для SPA (все запросы → index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

**Multi-stage build**: первый этап (builder) устанавливает Node, собирает проект. Второй этап берёт только `dist/` и кладёт в nginx. Итоговый образ — ~25 MB (вместо ~1 GB с Node).

### nginx.conf

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback: все неизвестные URL → index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кэширование ассетов с хэшем в имени — навечно
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### docker-compose.yml

```yaml
services:
  portfolio:
    build: .
    ports:
      - "3000:80"    # localhost:3000 → nginx внутри контейнера
    restart: unless-stopped
```

### Использование

```bash
# Собрать и запустить:
docker compose up -d

# Открыть: http://localhost:3000

# Остановить:
docker compose down

# Пересобрать после изменений:
docker compose up -d --build
```

### Важно при Docker

Если деплоишь через Docker (на свой VPS или Render/Railway), `base` в `vite.config.js` нужно поменять с `/Web_claude/` на `/` — потому что сайт будет в корне домена, а не в подпапке GitHub Pages.

---

## 10 — Вопросы для дальнейшего изучения

Вот темы, которые логично изучить следующими, исходя из твоего проекта:

1. **Что такое `<StrictMode>` в `main.jsx`?** — Почему React рендерит компоненты дважды в dev-режиме и зачем это нужно?

2. **Как работает Tailwind CSS v4?** — Ты используешь `@import "tailwindcss"` в CSS — что за утилитарные классы генерируются и как работает tree-shaking (удаление неиспользуемых стилей)?

3. **Что такое hooks (`useState`, `useCallback`, `useEffect`)?** — Ты используешь их в компонентах, но понимаешь ли ты, зачем нужен `useCallback` с массивом зависимостей `[]`?

4. **Как устроен GitHub Actions?** — `deploy.yml` — это декларативный пайплайн. Что такое jobs, steps, runners, artifacts?

5. **Что такое SPA vs SSR vs SSG?** — Твой сайт — SPA. Какие альтернативы (Next.js, Astro) и когда они лучше подходят для портфолио?

6. **Как работает npm и semver?** — Что значит `^19.2.4`? Почему `npm ci` безопаснее `npm install` в CI?

7. **Как работает DNS и HTTPS для GitHub Pages?** — Если захочешь кастомный домен — как подключить?

---

*Документ сгенерирован на основе анализа структуры проекта `exp/` (Vellow Portfolio). Актуально на 2026-04-02.*
