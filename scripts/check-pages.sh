#!/usr/bin/env bash
# scripts/check-pages.sh

BASE=http://localhost:3000
ROUTES=(
  /home /menu /specials /about /store /customer /contact /test
  /login
  /manager/dashboard /manager/menu /manager/specials /manager/customers /manager/store
  /admin/dashboard /admin/customers /managers /admin/store /admin/about
)

echo "Checking routes on $BASE …"
for path in "${ROUTES[@]}"; do
  code=$(curl -o /dev/null -s -w "%{http_code}" "$BASE$path")
  if [ "$code" -eq 200 ]; then
    echo "✅ $path → $code"
  else
    echo "❌ $path → $code"
  fi
done
