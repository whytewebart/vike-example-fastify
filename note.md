
    "dev": "npm run server",
    "dev:debug": "tsx --inspect ./server/index.ts",
    "prod": "npm run build && npm run server:prod",
    "build": "vite build && npm run build:server",
    "build:server": "tsc --build ./server",
    "server": "tsx ./server/index.ts",
    "server:prod": "cross-env NODE_ENV=production npm run server",
    "preview": "cross-env NODE_ENV=production NODE_OPTIONS='--inspect' node ./build/index.js"