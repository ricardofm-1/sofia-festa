#!/bin/bash
# Liga um servidor local para ver a página da festa no telemóvel.
# Faz duplo clique neste ficheiro no Finder para arrancar.
# Para desligar: fecha esta janela ou carrega em Ctrl+C.

cd "$(dirname "$0")" || exit 1

PORTA=8911
IP=$(ipconfig getifaddr "$(route -n get default 2>/dev/null | awk '/interface:/{print $2}')" 2>/dev/null)
[ -z "$IP" ] && IP=$(ipconfig getifaddr en0 2>/dev/null)

echo ""
echo "  Festa da Sofia · servidor local"
echo "  ---------------------------------------------"
echo "  No computador:  http://localhost:$PORTA"
if [ -n "$IP" ]; then
  echo "  No telemóvel:   http://$IP:$PORTA"
  echo ""
  echo "  (o telemóvel tem de estar na mesma rede Wi-Fi)"
else
  echo "  Sem rede Wi-Fi detetada: só funciona no computador."
fi
echo "  ---------------------------------------------"
echo "  Para desligar: Ctrl+C ou fecha esta janela."
echo ""

exec python3 -m http.server "$PORTA"
