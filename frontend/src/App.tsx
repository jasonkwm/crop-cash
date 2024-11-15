import AppRouter from "./router/AppRouter";
import { useWeb3Auth } from "./context/Web3AuthProvider";
import { GoogleLogin } from "@react-oauth/google";

function App() {
  const { onSuccess, loginWithPasskey, isLoggedIn, web3authSFAuth, provider } = useWeb3Auth();

  const logoutView = (
    <div>
      <div className="w-[100px] h-[100px] bg-white"> potato banana</div>
      <GoogleLogin onSuccess={onSuccess} useOneTap />
      <button onClick={loginWithPasskey} className="card passkey">
        Login with Passkey
      </button>
    </div>
  );

  return (
    <div className="container">
      {isLoggedIn ? (
        <h1>LOGGING IN....</h1>
      ) : (
        <div className="grid">{web3authSFAuth ? provider ? <AppRouter /> : logoutView : null}</div>
      )}
    </div>
  );
}

export default App;
