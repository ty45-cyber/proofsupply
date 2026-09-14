import { Ledger } from './managed/proofsupply/contract/index.js';
import { WitnessContext } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';

export type ProofSupplyPrivateState = {
  readonly secretKey: Uint8Array;
  readonly annualRevenue: bigint;
  readonly certificationValid: boolean;
  readonly jurisdiction: Uint8Array;
};

export const createProofSupplyPrivateState = (
  secretKey: Uint8Array,
  annualRevenue: bigint,
  certificationValid: boolean,
  jurisdiction: Uint8Array,
): ProofSupplyPrivateState => ({
  secretKey,
  annualRevenue,
  certificationValid,
  jurisdiction,
});

export const witnesses = {
  localSecretKey: ({ privateState }: WitnessContext<Ledger, ProofSupplyPrivateState>): [ProofSupplyPrivateState, Uint8Array] => [privateState, privateState.secretKey],
  privateAnnualRevenue: ({ privateState }: WitnessContext<Ledger, ProofSupplyPrivateState>): [ProofSupplyPrivateState, bigint] => [privateState, privateState.annualRevenue],
  privateCertificationValid: ({ privateState }: WitnessContext<Ledger, ProofSupplyPrivateState>): [ProofSupplyPrivateState, boolean] => [privateState, privateState.certificationValid],
  privateJurisdiction: ({ privateState }: WitnessContext<Ledger, ProofSupplyPrivateState>): [ProofSupplyPrivateState, Uint8Array] => [privateState, privateState.jurisdiction],
};
