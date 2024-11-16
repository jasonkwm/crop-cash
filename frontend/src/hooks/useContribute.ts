import toast from "react-hot-toast";
import { useWeb3Auth } from "../context/Web3AuthProvider";
import { encodeFunctionData } from "viem";
import { CropCashFundABI } from "../abis/CropCashFund";
import { PaymasterMode, UserOpResponse } from "@biconomy/account";
import { CropCashUSDCABI } from "../abis/CropCashUSDC";

export const useContribute = () => {
  const { smartWallet, smartWalletAddress } = useWeb3Auth();

  const contribute = async (tokenId: number, amount: number) => {
    console.log("Contributing...");
    const loadingToast = toast.loading("Contributing...");
    const encodedDataApproval = encodeFunctionData({
      abi: CropCashUSDCABI,
      functionName: "approve",
      args: [import.meta.env.VITE_CROP_CASH_FUND as `0x${string}`, BigInt(amount)],
    });
    const txApproval = {
      to: import.meta.env.VITE_CROP_CASH_USDC,
      data: encodedDataApproval,
    };
    const { waitForTxHash: waitForTxHashApproval } = (await smartWallet?.sendTransaction(txApproval, {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    })) as UserOpResponse;
    const { transactionHash: txHashApproval, userOperationReceipt: userOpReceiptApproval } =
      await waitForTxHashApproval();
    console.log("Finish approving LFG");
    console.log(txHashApproval, userOpReceiptApproval);

    const encodedData = encodeFunctionData({
      abi: CropCashFundABI,
      functionName: "fundProject",
      args: [BigInt(tokenId), BigInt(amount)],
    });
    const tx = {
      to: import.meta.env.VITE_CROP_CASH_FUND,
      data: encodedData,
    };
    console.log(tx);

    const { waitForTxHash } = (await smartWallet?.sendTransaction(tx, {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    })) as UserOpResponse;
    const { transactionHash, userOperationReceipt } = await waitForTxHash();
    console.log("Finish contributing LFG");
    console.log(transactionHash, userOperationReceipt);
    toast.dismiss(loadingToast);
    toast.success(`Tx: ${transactionHash}`);
  };

  return { contribute };
};
