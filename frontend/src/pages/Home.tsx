// import { useGlobalState } from "../context/GlobalStateProvider";
import FarmerDashboard from "../components/FarmerDashboard";
import InvestorDashboard from "../components/InvestorDashboard";
import { useGlobalState } from "../context/GlobalStateProvider";
// import { useWeb3Auth } from "../context/Web3AuthProvider";

export default function Home() {
  // const { employee, setEmployee } = useGlobalState();
  const { isSwitchOn } = useGlobalState();
  return isSwitchOn ? <InvestorDashboard /> : <FarmerDashboard />;
}

// const loginView = () => {
//   const { logout, registerPasskey, listAllPasskeys, userBalance, userAccount, smartWalletAddress } = useWeb3Auth();
//   return (
//     <>
//       <div className="flex-container">
//         <div>
//           <button onClick={registerPasskey} className="card">
//             Register passkey
//           </button>
//         </div>
//         <div>
//           <button onClick={listAllPasskeys} className="card">
//             List passkeys
//           </button>
//         </div>
//         <p>userBalance: {userBalance}</p>
//         <p>userAccount: {userAccount}</p>
//         <p>smartWalletAddress: {smartWalletAddress}</p>
//         <div>
//           <button onClick={logout} className="card">
//             Log Out
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };
