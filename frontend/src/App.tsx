import AppRouter from "./router/AppRouter";
import { useWeb3Auth } from "./context/Web3AuthProvider";
import { GoogleLogin } from "@react-oauth/google";

function App() {
  const {
    onSuccess,
    loginWithPasskey,
    getUserInfo,
    logout,
    getAccounts,
    getBalance,
    authenticateUser,
    registerPasskey,
    isLoggedIn,
    web3authSFAuth,
    provider,
  } = useWeb3Auth();
  const loginView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={registerPasskey} className="card">
            Register passkey
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

  const logoutView = (
    <>
      <GoogleLogin onSuccess={onSuccess} useOneTap />
      <button onClick={loginWithPasskey} className="card passkey">
        Login with Passkey
      </button>
      <div>
        <button onClick={registerPasskey} className="card">
          Register passkey
        </button>
      </div>
    </>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/core-kit/sfa-web" rel="noreferrer">
          Web3Auth
        </a>{" "}
        SFA React Google + Passkeys Example
      </h1>

      <p className="grid">Sign in with Google and register passkeys before doing Login with Passkey</p>

      {isLoggedIn ? (
        <h1>LOGGING IN....</h1>
      ) : (
        <div className="grid">{web3authSFAuth ? (provider ? loginView : logoutView) : null}</div>
      )}

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-core-kit-examples/tree/main/single-factor-auth-web/sfa-web-google-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;
