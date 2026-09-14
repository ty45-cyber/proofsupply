import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import * as CompiledProofSupply from './managed/proofsupply/contract/index.js';
import * as Witnesses from './witnesses.js';

export * from './managed/proofsupply/contract/index.js';
export * from './witnesses.js';

export const CompiledProofSupplyContract = CompiledContract.make<
  CompiledProofSupply.Contract<Witnesses.ProofSupplyPrivateState>
>('ProofSupply', CompiledProofSupply.Contract<Witnesses.ProofSupplyPrivateState>).pipe(
  CompiledContract.withWitnesses(Witnesses.witnesses),
  CompiledContract.withCompiledFileAssets('./managed/proofsupply'),
);
