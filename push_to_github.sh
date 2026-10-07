#!/usr/bin/env bash
# push_to_github.sh
# Usage: ./push_to_github.sh <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>

if [ -z "$1" ]; then
  echo "Usage: ./push_to_github.sh <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>"
  echo "Or run manually:"
  echo "  git remote set-url origin https://<YOUR_TOKEN>@github.com/kanishka2610-web/EMILY.git"
  echo "  git push -u origin main"
  exit 1
fi

TOKEN="$1"
REMOTE_URL="https://${TOKEN}@github.com/kanishka2610-web/EMILY.git"

echo "Setting remote URL with token..."
git remote set-url origin "$REMOTE_URL"

echo "Pushing branch 'main' to GitHub..."
git push -u origin main

echo "Restoring clean remote URL without token..."
git remote set-url origin "https://github.com/kanishka2610-web/EMILY.git"

echo "Done! Successfully pushed to https://github.com/kanishka2610-web/EMILY.git"
