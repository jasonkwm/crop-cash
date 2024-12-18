import { useWeb3Auth } from "../context/Web3AuthProvider";
import { useGlobalState } from "../context/GlobalStateProvider";

const Navbar = () => {
  const { isSwitchOn, toggleSwitch } = useGlobalState();
  const { logout, smartWalletAddress, provider, loginWithPasskey, userInfo, registerPasskey } = useWeb3Auth();

  const shortenAddress = (address: string): string => `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <nav className="bg-[#01546b] text-white px-16 py-3 flex justify-between items-center shadow-lg">
      {/* Home Icon */}
      <div className="flex items-center space-x-2">
        <a href="/" className="text-lg font-bold hover:text-gray-300 p-2">
          <img src="/earth.gif" width={48} height={48} />
        </a>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {provider !== null ? (
          <>
            <button
              onClick={toggleSwitch}
              className={`w-8 h-4 flex items-center rounded-full ${
                isSwitchOn ? "bg-ourGreen hover:bg-ourGreenDark" : "bg-ourYellow"
              } relative`}
            >
              <div
                className={`w-4 h-4 bg-ourYellow rounded-full shadow-md transform transition-transform ${
                  isSwitchOn ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className="text-sm font-mono bg-gray-700 px-10 py-2 md:px-4 rounded font-normal"
              onClick={() => {
                navigator.clipboard.writeText(smartWalletAddress);
                alert("Address copied!");
              }}
            >
              {userInfo && userInfo.name ? userInfo.name : shortenAddress(smartWalletAddress)}
            </span>
            <button onClick={() => registerPasskey()} className="bg-blue-600">
              Register Passkey
            </button>
            <button
              onClick={logout}
              className="bg-secondary hover:bg-secondaryLight  px-10 py-2 md:px-4 rounded text-lg font-bold font-normal tracking-wider"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="text-black bg-ourGreen hover:bg-ourGreenDark px-10 py-2 rounded text-lg font-bold font-normal tracking-wider transition-all"
            onClick={loginWithPasskey}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
