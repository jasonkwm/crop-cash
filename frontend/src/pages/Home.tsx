// import { useGlobalState } from "../context/GlobalStateProvider";
import FarmerDashboard from "../components/FarmerDashboard";
import InvestorDashboard from "../components/InvestorDashboard";
import { useGlobalState } from "../context/GlobalStateProvider";
import { useWeb3Auth } from "../context/Web3AuthProvider";
import { useSignAttestation } from "../hooks/useSignAttestation";

export default function Home() {
  // const { employee, setEmployee } = useGlobalState();
  const { logout, registerPasskey, listAllPasskeys, smartWallet, smartWalletAddress } = useWeb3Auth();
  const { createLandAttestation } = useSignAttestation();
  const { isSwitchOn } = useGlobalState();
  const loginView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={registerPasskey} className="card">
            Register passkey
          </button>
        </div>
        <div>
          <button onClick={listAllPasskeys} className="card">
            List passkeys
          </button>
        </div>
        <p>smartWalletAddress: {smartWalletAddress}</p>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
        <div>{/* <button onClick={createLandAttestation}>CreateAttestation</button> */}</div>
      </div>
    </>
  );
  return isSwitchOn ? <FarmerDashboard /> : <InvestorDashboard />;
}
