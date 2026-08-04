#!/bin/zsh

cd -- "$(dirname -- "$0")" || exit 1

preview_url="http://127.0.0.1:4000"

(
  sleep 3
  open "$preview_url"
) &

bundle exec jekyll serve \
  --config _config.yml,_config.dev.yml \
  --host 127.0.0.1 \
  --port 4000 \
  --livereload \
  --livereload-port 35730
