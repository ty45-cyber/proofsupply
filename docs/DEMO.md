# Judge Demo

## 90-second path

1. Buyer opens **Create policy**.
2. Set minimum revenue to `$500,000` and jurisdiction to `KE`.
3. Supplier enters private evidence: revenue `$1,200,000`, certification valid, jurisdiction `KE`.
4. Click **Generate qualification proof**.
5. Midnight generates and verifies the ZK proof.
6. Buyer receives **QUALIFIED**.
7. Show that the buyer never receives the raw `$1,200,000` value or private certification record.
8. Open the transaction/network evidence.

## Technical proof points

- Private supplier inputs enter the Compact circuit through witnesses.
- The circuit enforces all three predicates.
- Raw private values are not disclosed to ledger state.
- The supplier commitment is disclosed instead of the secret key.
- The buyer's policy and verification identifier are public audit metadata.

## Current official references

- Midnight developer documentation: https://docs.midnight.network/
- Midnight example DApp structure: https://github.com/midnightntwrk/example-bboard
- Midnight application scaffold: https://github.com/midnightntwrk/create-mn-app
- Midnight mainnet/developer information: https://midnight.network/

## Submission evidence checklist

- [ ] GitHub repository
- [ ] Deployed frontend
- [ ] Midnight contract address
- [ ] Real transaction hash
- [ ] Short demo video
- [ ] Architecture diagram
- [ ] README with privacy model
- [ ] Tests and build logs
