import { encodeFunctionData } from "viem";
import { useWeb3Auth } from "../context/Web3AuthProvider";
import { CropCashUSDCABI } from "../abis/CropCashUSDC";
import { PaymasterMode, UserOpResponse } from "@biconomy/account";
import toast from "react-hot-toast";

export const useMintUSDC = () => {
  const { smartWallet, smartWalletAddress } = useWeb3Auth();

  const mintUSDC = async () => {
    console.log("Minting USDC...");
    const loadingToast = toast.loading("Minting USDC...");
    const encodedData = encodeFunctionData({
      abi: CropCashUSDCABI,
      functionName: "mint",
      args: [smartWalletAddress as `0x${string}`, BigInt(2000)],
    });

    const tx = {
      to: import.meta.env.VITE_CROP_CASH_USDC,
      data: encodedData,
    };

    console.log(tx);

    const { waitForTxHash } = (await smartWallet?.sendTransaction(tx, {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    })) as UserOpResponse;
    const { transactionHash, userOperationReceipt } = await waitForTxHash();
    console.log("Finish minting LFG");
    console.log(transactionHash, userOperationReceipt);
    toast.dismiss(loadingToast);
    toast.success(`Tx: ${transactionHash}`);
  };

  return { mintUSDC };
};
