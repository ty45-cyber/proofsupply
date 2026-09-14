import type { Logger } from 'pino';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { CompiledProofSupplyContract } from '../../contract/src/index.js';
import type { ProofSupplyPrivateState } from '../../contract/src/index.js';
import { proofSupplyPrivateStateKey, type DeployedProofSupplyContract, type ProofSupplyProviders } from './common-types.js';

export type VerificationPolicy = {
  minimumRevenue: bigint;
  requiredJurisdiction: Uint8Array;
  verificationId: Uint8Array;
};

export type ProofSupplyApi = {
  deployedContract: DeployedProofSupplyContract;
  contractAddress: ContractAddress;
  verifyEligibility: (policy: VerificationPolicy) => Promise<{ txHash: string }>;
};

export async function deployProofSupply(
  providers: ProofSupplyProviders,
  privateState: ProofSupplyPrivateState,
  logger?: Logger,
): Promise<ProofSupplyApi> {
  logger?.info('deploying ProofSupply contract');

  const deployedContract = await deployContract(providers, {
    compiledContract: CompiledProofSupplyContract,
    privateStateId: proofSupplyPrivateStateKey,
    initialPrivateState: privateState,
  });

  return {
    deployedContract,
    contractAddress: deployedContract.deployTxData.public.contractAddress,
    verifyEligibility: async (policy) => {
      const tx = await deployedContract.callTx.verifyEligibility(
        policy.minimumRevenue,
        policy.requiredJurisdiction,
        policy.verificationId,
      );
      return { txHash: tx.public.txHash };
    },
  };
}
