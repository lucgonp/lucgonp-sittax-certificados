#!/usr/bin/env bash
set -e
cd "$HOME/cypress-libs"
rm -rf root
mkdir -p root

# Extrai todos os .deb baixados para o prefixo userspace ~/cypress-libs/root
for f in *.deb; do
  echo "extract: $f"
  dpkg-deb -x "$f" root
done

LIBDIR="$HOME/cypress-libs/root/usr/lib/x86_64-linux-gnu"
echo "=== .so extraídos ==="
find root -name '*.so*' -printf '%f\n' | sort -u
echo "LIBDIR=$LIBDIR"
