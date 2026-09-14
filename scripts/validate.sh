#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

command -v node >/dev/null || { echo "node is required"; exit 1; }
node --check web/app.js
python3 - <<'PY'
from pathlib import Path
import json
root = Path('.')
required = [
    'package.json',
    'contract/package.json',
    'contract/src/proofsupply.compact',
    'contract/src/index.ts',
    'contract/src/witnesses.ts',
    'api/src/index.ts',
    'web/index.html',
    'web/app.js',
]
for item in required:
    assert (root / item).is_file(), item

compact = (root / 'contract/src/proofsupply.compact').read_text()
for marker in ['privateAnnualRevenue', 'privateCertificationValid', 'privateJurisdiction', 'disclose(commitment)', 'state = VerificationState.QUALIFIED']:
    assert marker in compact, marker

pkg = json.loads((root / 'package.json').read_text())
assert pkg['workspaces'] == ['contract', 'api']
print('ProofSupply repository validation: PASS')
PY
