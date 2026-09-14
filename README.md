# ProofSupply

Privacy-preserving supplier qualification on Midnight.

## Problem

Enterprise procurement often requires suppliers to reveal sensitive revenue, certification, and jurisdiction information simply to prove eligibility. ProofSupply flips that model: the supplier keeps the evidence private and generates a Midnight zero-knowledge proof that satisfies the buyer's policy.

## Wave 1 flow

1. Buyer publishes a policy: minimum annual revenue + required jurisdiction.
2. Supplier keeps annual revenue, certification validity, jurisdiction, and secret key in private state.
3. The `verifyEligibility` Compact circuit reads those values through witnesses.
4. The circuit proves the predicates without disclosing the private values.
5. Only the qualification state, supplier commitment, policy values, and verification ID are disclosed on ledger.

## Privacy boundary

The contract intentionally never writes the supplier's raw revenue, certification status, or private jurisdiction to ledger state. `disclose()` is used only for the derived supplier commitment and the buyer's public policy/result identifiers.

## Current Midnight toolchain target

This repository follows the current Midnight example structure and pins the dependency family used by the official `example-bboard` project: Node 24.11.1+, Midnight.js 4.1.1, wallet SDK 1.2.0, and Compact language version 0.23. The official developer docs currently describe Midnight as a privacy-first chain with dual public/private state, selective disclosure, and Compact contracts. See the source links in `docs/DEMO.md`.

## Local setup

Requirements:

- Node.js 24.11.1+
- Docker Compose v2
- Compact CLI/toolchain

Install:

```bash
npm install
```

Compile the real Compact contract:

```bash
npm run compact
```

Build generated TypeScript bindings:

```bash
npm run build
```

Run repository validation:

```bash
npm run validate
```

For a full local Midnight devnet/proof-server workflow, use the official `create-mn-app` / Midnight example environment and configure the generated contract artifacts under `contract/src/managed/proofsupply`.

## Production verification gate

Before submission, do not mark the app as live until all of these pass:

- Compact compiler succeeds.
- Generated contract TypeScript builds.
- Contract simulation tests pass.
- Proof server starts successfully.
- Contract deploys to the selected Midnight network.
- A real `verifyEligibility` transaction finalizes.
- Explorer/network evidence is captured.
- UI is wired to the deployed contract address.

The repository deliberately does not contain fake transaction hashes, fake contract addresses, or fabricated network results.
