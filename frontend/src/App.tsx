import AppRouter from "./router/AppRouter";
import { useWeb3Auth } from "./context/Web3AuthProvider";
import { GoogleLogin } from "@react-oauth/google";
import Navbar from "./components/Navbar";

function App() {
  const { onSuccess, loginWithPasskey, isLoggingIn, web3authSFAuth, provider } = useWeb3Auth();

  const logoutView = (
    <div className="h-1/4 flex flex-col justify-between">
      <h1 className="font-extrabold text-black text-6xl font-header">CROP CASH</h1>
      <div className="flex flex-col gap-4 w-[90%] text-center m-auto">
        <GoogleLogin onSuccess={onSuccess} useOneTap />
        <button onClick={loginWithPasskey} className="card passkey font-normal">
          Login with Passkey
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="w-screen max-w-[1920px] flex flex-col items-center justify-center md:flex-row md:justify-around p-4">
        {isLoggingIn ? <h1>LOGGING IN....</h1> : <>{web3authSFAuth ? provider ? <AppRouter /> : logoutView : null}</>}
      </div>
    </>
  );
}

export default App;
