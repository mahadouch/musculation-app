#!/bin/sh
# Entrypoint: si le volume est vide, copier la DB seed depuis le build
if [ ! -f /app/data/musculation.db ]; then
  mkdir -p /app/data
  cp /app/musculation.db /app/data/musculation.db
  cp /app/musculation.db-wal /app/data/musculation.db-wal 2>/dev/null || true
  cp /app/musculation.db-shm /app/data/musculation.db-shm 2>/dev/null || true
  echo "📦 Database initialisée depuis le seed"
fi
exec node server.js
