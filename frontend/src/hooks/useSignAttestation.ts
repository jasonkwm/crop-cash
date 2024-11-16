import { useContext } from "react";
import { Web3AuthContext, Web3AuthProviderType } from "../context/Web3AuthProvider";
import { Attestation } from "@ethsign/sp-sdk";
import { encodeFunctionData, parseAbi } from "viem";
import { ethers } from "ethers";
import { PaymasterMode, UserOpResponse } from "@biconomy/account";

export const useSignAttestation = () => {
  const { smartWallet } = useContext(Web3AuthContext) as Web3AuthProviderType;

  const createLandAttestation = async () => {
    console.log("Creating land attestation...");
    const attesterAddress = await smartWallet?.getAccountAddress();
    const attestionObj: Attestation = {
      schemaId: "0x58",
      data: {
        coordinate1: "[100.1995513267014,5.352340029111249]",
        coordinate2: "[100.19905780024266,5.3498938331027075]",
        coordinate3: "[100.20274851984715,5.348996536044997]",
        coordinate4: "[100.2034244365189,5.351667059132401]",
      },
      attester: attesterAddress,
      indexingValue: String(attesterAddress),
      recipients: [attesterAddress as `0x${string}`],
    };

    const encodedCall = encodeFunctionData({
      abi: parseAbi([
        "function attest((uint64,uint64,uint64,uint64,address,uint64,uint8,bool,bytes[],bytes),string,bytes,bytes)",
      ]),
      functionName: "attest",
      args: [
        [
          BigInt(attestionObj.schemaId),
          BigInt(0),
          BigInt(0),
          BigInt(0),
          attestionObj.attester as `0x${string}`,
          BigInt(0),
          0,
          false,
          attestionObj.recipients as `0x${string}`[],
          ethers.utils.defaultAbiCoder.encode(
            ["string", "string", "string", "string"],
            [
              (attestionObj.data as any).coordinate1,
              (attestionObj.data as any).coordinate2,
              (attestionObj.data as any).coordinate3,
              (attestionObj.data as any).coordinate4,
            ]
          ) as `0x${string}`,
        ],
        attestionObj.recipients![0],
        "0x",
        ethers.utils.defaultAbiCoder.encode(
          ["address", "string", "string", "string", "string", "uint256"],
          [
            attestionObj.recipients![0] as `0x${string}`,
            (attestionObj.data as any).coordinate1,
            (attestionObj.data as any).coordinate2,
            (attestionObj.data as any).coordinate3,
            (attestionObj.data as any).coordinate4,
            12,
          ]
        ) as `0x${string}`,
      ],
    });
    const tx = {
      to: "0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD",
      data: encodedCall,
    };

    console.log(tx);

    const { waitForTxHash } = (await smartWallet?.sendTransaction(tx, {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    })) as UserOpResponse;
    const { transactionHash, userOperationReceipt } = await waitForTxHash();

    console.log("Finish Attesting LFG");
    console.log(transactionHash, userOperationReceipt);
  };

  return {
    createLandAttestation,
  };
};
