#!/usr/bin/env bash
# Wrapper de execução: WSLg fornece o display (:0) e as libs de browser vêm do prefixo
# userspace ~/cypress-libs (instaladas sem root via apt-get download + dpkg-deb -x).
export DISPLAY="${DISPLAY:-:0}"
export LD_LIBRARY_PATH="$HOME/cypress-libs/root/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH"
cd "$(dirname "$0")"
exec node_modules/.bin/cypress "$@"
