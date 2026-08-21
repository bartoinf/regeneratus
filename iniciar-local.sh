#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo "Regeneratus disponível em: http://localhost:5500/"
echo "Pressione Ctrl+C para encerrar o servidor."
python3 -m http.server 5500
