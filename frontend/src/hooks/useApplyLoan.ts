import { encodeFunctionData } from "viem";
import { useWeb3Auth, Web3AuthProviderType } from "../context/Web3AuthProvider";
import { CropCashConsumerABI } from "../abis/CropCashConsumer";
import { PaymasterMode, UserOpResponse } from "@biconomy/account";
import toast from "react-hot-toast";
import { useState } from "react";

export const useApplyLoan = () => {
  const { smartWallet } = useWeb3Auth() as Web3AuthProviderType;
  const [appliedDone, setAppliedDone] = useState(false);

  const applyLoan = async (attestationId: number, amount: number) => {
    console.log(`Applying loan for token ${attestationId} for ${amount}`);
    const loadingToast = toast.loading("Applying for loan...");
    const encodedCall = encodeFunctionData({
      abi: CropCashConsumerABI,
      functionName: "initializeLoan",
      args: [BigInt(attestationId), BigInt(amount)],
    });

    const tx = {
      to: import.meta.env.VITE_CROP_CASH_CONSUMER,
      data: encodedCall,
    };

    const { waitForTxHash } = (await smartWallet?.sendTransaction(tx, {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    })) as UserOpResponse;
    const { transactionHash, userOperationReceipt } = await waitForTxHash();

    console.log("Apply Load Hash", transactionHash);
    console.log("Apply Loan UserOperationReceipt", userOperationReceipt);
    toast.dismiss(loadingToast);

    toast.success(`Tx: ${transactionHash}`, { duration: 5000 });

    setAppliedDone(true);
  };

  return { applyLoan, appliedDone };
};
