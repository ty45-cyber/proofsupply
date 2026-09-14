import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type { FoundContract, Contract } from '@midnight-ntwrk/midnight-js-contracts';
import type { ProofSupplyPrivateState } from '../../contract/src/index.js';

export const proofSupplyPrivateStateKey = 'proofSupplyPrivateState' as const;
export type ProofSupplyProviders = MidnightProviders;
export type ProofSupplyContract = Contract<ProofSupplyPrivateState>;
export type DeployedProofSupplyContract = FoundContract<ProofSupplyContract>;
