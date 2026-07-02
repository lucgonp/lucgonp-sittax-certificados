#!/usr/bin/env bash
set -e
cd "$HOME/cypress-libs"

# soname:pacote — deps de runtime do Electron/Cypress no Ubuntu 26.04 (t64).
PAIRS="
libasound.so.2:libasound2t64
libatk-1.0.so.0:libatk1.0-0t64
libatk-bridge-2.0.so.0:libatk-bridge2.0-0t64
libatspi.so.0:libatspi2.0-0t64
libcups.so.2:libcups2t64
libXss.so.1:libxss1
libXtst.so.6:libxtst6
libXcomposite.so.1:libxcomposite1
libXdamage.so.1:libxdamage1
libXrandr.so.2:libxrandr2
libXfixes.so.3:libxfixes3
libxkbcommon.so.0:libxkbcommon0
libdrm.so.2:libdrm2
libgbm.so.1:libgbm1
libpango-1.0.so.0:libpango-1.0-0
libpangocairo-1.0.so.0:libpango-1.0-0
libcairo.so.2:libcairo2
libcups.so.2:libcups2t64
libnss3.so:libnss3
"

PKGS=""
LIBDIR="$HOME/cypress-libs/root/usr/lib/x86_64-linux-gnu"
for pair in $PAIRS; do
  so="${pair%%:*}"; pkg="${pair##*:}"
  # já satisfeito pelo sistema OU pelo nosso prefixo?
  if ldconfig -p 2>/dev/null | grep -q "$so"; then continue; fi
  if [ -e "$LIBDIR/$so" ] || ls "$LIBDIR/$so"* >/dev/null 2>&1; then continue; fi
  echo "MISSING $so -> $pkg"
  case " $PKGS " in *" $pkg "*) ;; *) PKGS="$PKGS $pkg";; esac
done

echo "=== pacotes a baixar:$PKGS ==="
if [ -n "$PKGS" ]; then
  apt-get download $PKGS 2>&1 | tail -20 || true
fi
echo "=== re-extraindo todos os .deb ==="
rm -rf root && mkdir root
for f in *.deb; do dpkg-deb -x "$f" root; done
echo "=== total .so no prefixo ==="
find root -name '*.so*' -printf '%f\n' | sort -u | wc -l
