import { useGlobalState } from "../context/GlobalStateProvider";
import { useWeb3Auth } from "../context/Web3AuthProvider";

export default function Home() {
  // const { employee, setEmployee } = useGlobalState();
  const { logout, registerPasskey, listAllPasskeys } = useWeb3Auth();
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

        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );
  return <>{loginView}</>;
}
