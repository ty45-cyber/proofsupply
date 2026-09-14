#!/usr/bin/env node
/**
 * scripts/deploy.mjs
 * Deploy the ProofSupply contract to Midnight testnet.
 *
 * Prerequisites:
 *   1. npm run build:contract
 *   2. Midnight Lace wallet running with testnet funds
 *   3. .env populated with MIDNIGHT_* URLs
 *
 * Usage:  npm run deploy
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');

// ── Load .env ────────────────────────────────────────────────────────────────
const envPath = resolve(root, '.env');
const envLines = readFileSync(envPath, 'utf8').split('\n');
const env = Object.fromEntries(
  envLines
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => l.split('=').map(s => s.trim()))
);

const {
  MIDNIGHT_NODE_URL,
  MIDNIGHT_INDEXER_URL,
  MIDNIGHT_PROOF_SERVER_URL,
  MIDNIGHT_NETWORK,
} = env;

if (!MIDNIGHT_NODE_URL || !MIDNIGHT_INDEXER_URL || !MIDNIGHT_PROOF_SERVER_URL) {
  console.error('❌  Missing MIDNIGHT_* variables in .env — check .env.example');
  process.exit(1);
}

console.log(`\n🌐  Network : ${MIDNIGHT_NETWORK}`);
console.log(`   Node     : ${MIDNIGHT_NODE_URL}`);
console.log(`   Indexer  : ${MIDNIGHT_INDEXER_URL}`);
console.log(`   Prover   : ${MIDNIGHT_PROOF_SERVER_URL}\n`);

// ── Dynamic imports (built artefacts must exist) ──────────────────────────────
let deployProofSupply, createProofSupplyPrivateState;
try {
  ({ deployProofSupply } = await import('../api/src/index.js'));
  ({ createProofSupplyPrivateState } = await import('../contract/dist/index.js'));
} catch (e) {
  console.error('❌  Could not import built artefacts. Run: npm run build:contract');
  console.error(e.message);
  process.exit(1);
}

// ── Build Midnight providers ──────────────────────────────────────────────────
const { NetworkId } = await import('@midnight-ntwrk/midnight-js-network-id');
const { indexerPublicDataProvider } = await import('@midnight-ntwrk/midnight-js-indexer-public-data-provider');
const { httpClientProofProvider } = await import('@midnight-ntwrk/midnight-js-http-client-proof-provider');
const { levelPrivateStateProvider } = await import('@midnight-ntwrk/midnight-js-level-private-state-provider');
const { FetchZkConfigProvider } = await import('@midnight-ntwrk/midnight-js-fetch-zk-config-provider');

const networkId = MIDNIGHT_NETWORK === 'mainnet' ? NetworkId.MainNet : NetworkId.TestNet;

const providers = {
  publicDataProvider: indexerPublicDataProvider(MIDNIGHT_INDEXER_URL, networkId),
  proofProvider: httpClientProofProvider(MIDNIGHT_PROOF_SERVER_URL),
  privateStateProvider: levelPrivateStateProvider({ db: resolve(root, '.private-state') }),
  zkConfigProvider: new FetchZkConfigProvider(MIDNIGHT_NODE_URL, fetch),
  // walletProvider is injected by Midnight Lace via window.midnight in the browser.
  // For a headless deploy, set MIDNIGHT_WALLET_SEED in .env and use wallet-sdk here.
};

// ── Initial private state (demo values — supplier fills real values in the UI) ─
const enc = new TextEncoder();
const privateState = createProofSupplyPrivateState(
  crypto.getRandomValues(new Uint8Array(32)),   // secretKey
  BigInt(750_000),                               // annualRevenue (demo)
  true,                                          // certificationValid
  enc.encode('ke').slice(0, 32).reduce((a, b, i) => { a[i] = b; return a; }, new Uint8Array(32)),
);

// ── Deploy ────────────────────────────────────────────────────────────────────
console.log('🚀  Deploying ProofSupply contract…');
let api;
try {
  api = await deployProofSupply(providers, privateState);
} catch (e) {
  console.error('❌  Deployment failed:', e.message);
  process.exit(1);
}

const { contractAddress } = api;
const txHash = api.deployedContract.deployTxData?.public?.txHash ?? 'n/a';

console.log('\n✅  Contract deployed!');
console.log(`   Contract address : ${contractAddress}`);
console.log(`   Transaction hash : ${txHash}`);

// ── Patch .env with CONTRACT_ADDRESS ─────────────────────────────────────────
const updated = readFileSync(envPath, 'utf8').replace(
  /^CONTRACT_ADDRESS=.*$/m,
  `CONTRACT_ADDRESS=${contractAddress}`,
);
writeFileSync(envPath, updated);
console.log('\n📝  CONTRACT_ADDRESS written to .env');
console.log('   Copy it into Vercel → Settings → Environment Variables too.\n');
