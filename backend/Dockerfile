FROM node:20-alpine

# Outils de compilation pour better-sqlite3 (module natif C++)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# Créer la DB seed pendant le build
RUN node scripts/import_to_sqlite.js

# Entrypoint: copie la DB seed vers le volume si nécessaire
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["/app/entrypoint.sh"]
