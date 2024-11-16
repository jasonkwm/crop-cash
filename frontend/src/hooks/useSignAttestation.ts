import { useContext, useState } from "react";
import { Web3AuthContext, Web3AuthProviderType } from "../context/Web3AuthProvider";
import { Attestation } from "@ethsign/sp-sdk";
import { encodeFunctionData, parseAbi } from "viem";
import { ethers } from "ethers";
import { PaymasterMode, UserOpResponse } from "@biconomy/account";
import toast from "react-hot-toast";

export const useSignAttestation = () => {
  const { smartWallet, provider } = useContext(Web3AuthContext) as Web3AuthProviderType;

  const [attestionId, setAttestationId] = useState("");

  const createLandAttestation = async (c1: string, c2: string, c3: string, c4: string, size: number) => {
    console.log("Creating land attestation...");
    const toastId = toast.loading("Signing...");
    const attesterAddress = await smartWallet?.getAccountAddress();
    const attestionObj: Attestation = {
      schemaId: "0x58",
      data: {
        coordinate1: c1,
        coordinate2: c2,
        coordinate3: c3,
        coordinate4: c4,
      },
      attester: attesterAddress,
      indexingValue: String(attesterAddress),
      recipients: [attesterAddress as `0x${string}`],
    };

    console.log("attestationdata", attestionObj.data);
    console.log("attestationdatasize", size);

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
            size,
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

    toast.dismiss(toastId);
    toast.success("Finish Signing", { duration: 2000 });

    const ethersProvider = new ethers.providers.JsonRpcProvider("https://scroll-sepolia-rpc.publicnode.com");
    const targetAddress = "0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD".toLowerCase(); // Sign contract address
    const targetTopic = ethers.utils.id("AttestationMade(uint64,string)");
    const receipts = await ethersProvider.getTransactionReceipt(transactionHash!);

    const attestationMades = receipts.logs.filter((log) => {
      return log.address.toLowerCase() === targetAddress && log.topics.includes(targetTopic);
    });

    const iface = new ethers.utils.Interface(["event AttestationMade(uint64 attestationId, string indexingKey)"]);

    // Decode the log using the Interface
    const decodedLog = iface.parseLog(attestationMades[0]);

    console.log("decodedLog", decodedLog);

    // Extract the first parameter (uint64 indexed id)
    const attestationId = decodedLog.args[0]; // The first uint64 parameter

    setAttestationId(`0x${Number(attestationId).toString(16)}`);
  };

  return {
    createLandAttestation,
    attestionId,
  };
};
