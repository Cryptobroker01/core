import { ContractTransactionReceipt } from "ethers";

import { ether, findEventsWithInterfaces, impersonate, log } from "lib";

import { discover } from "./discover";
import { provision } from "./provision";
import { ProtocolContext, ProtocolContextFlags, ProtocolSigners, Signer } from "./types";

const getSigner = async (signer: Signer, balance = ether("100"), signers: ProtocolSigners) => {
  const signerAddress = signers[signer] ?? signer;
  return impersonate(signerAddress, balance);
};

export const getProtocolContext = async (): Promise<ProtocolContext> => {
  const { contracts, signers } = await discover();
  const interfaces = Object.values(contracts).map((contract) => contract.interface);

  // By default, all flags are "on"
  const flags = {
    withSimpleDvtModule: process.env.INTEGRATION_SIMPLE_DVT_MODULE !== "off",
  } as ProtocolContextFlags;

  log.debug("Protocol context flags", {
    "With simple DVT module": flags.withSimpleDvtModule,
  });

  const context = {
    contracts,
    signers,
    interfaces,
    flags,
    getSigner: async (signer: Signer, balance?: bigint) => getSigner(signer, balance, signers),
    getEvents: (receipt: ContractTransactionReceipt, eventName: string) =>
      findEventsWithInterfaces(receipt, eventName, interfaces),
  } as ProtocolContext;

  await provision(context);

  return context;
};
