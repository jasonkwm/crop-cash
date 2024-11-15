import { ADAPTER_EVENTS, CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { decodeToken, Web3Auth } from "@web3auth/single-factor-auth";
import { createContext, useContext, useEffect, useState } from "react";
import RPC from "../rpcs/ethersRPC";
import { CredentialResponse, googleLogout } from "@react-oauth/google";
import { PasskeysPlugin } from "@web3auth/passkeys-sfa-plugin";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { shouldSupportPasskey } from "../utils";

const clientId = "BMOtGZg6Gtzh3MbWIgs8EJzl5Ig-tSFaPkULxG3HKm2jpUVVrH4HudSraHzHl73dm64WJ3qiowXvW_0xoinv8wM";
const verifier = "banana-google";

const chainConfig: any = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x8274f", // Please use 0x1 for Mainnet
  rpcTarget: "https://sepolia-rpc.scroll.io",
  displayName: "Scroll Sepolia",
  blockExplorerUrl: "https://sepolia.scrollscan.com/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://images.toruswallet.io/eth.svg",
};
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3authSfa = new Web3Auth({
  clientId, // Get your Client ID from Web3Auth Dashboard
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

web3authSfa.init();

type Web3AuthProvider = {
  provider: any;
  setProvider: (value: any) => void;
  web3authSFAuth: any;
  setWeb3authSFAuth: any;
  pkPlugin: any;
  setPkPlugin: any;
  wsPlugin: any;
  setWsPlugin: any;
  isLoggingIn: any;
  setIsLoggingIn: any;
};

function uiConsole(...args: any[]): void {
  const el = document.querySelector("#console>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
  }
}

const Web3AuthContext = createContext<any>(undefined);

export const Web3AuthProvider = ({ children }: { children: any }) => {
  const [web3authSFAuth, setWeb3authSFAuth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [pkPlugin, setPkPlugin] = useState<PasskeysPlugin | null>(null);
  const [wsPlugin, setWsPlugin] = useState<WalletServicesPlugin | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });
        // Initialising Web3Auth Single Factor Auth SDK
        const web3authSfa = new Web3Auth({
          clientId, // Get your Client ID from Web3Auth Dashboard
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET, // ["sapphire_mainnet", "sapphire_devnet", "mainnet", "cyan", "aqua", and "testnet"]
          usePnPKey: false, // Setting this to true returns the same key as PnP Web SDK, By default, this SDK returns CoreKitKey.
          privateKeyProvider: ethereumPrivateKeyProvider,
        });
        const plugin = new PasskeysPlugin({ buildEnv: "testing" });
        web3authSfa?.addPlugin(plugin);
        setPkPlugin(plugin);
        const wsPlugin = new WalletServicesPlugin({
          walletInitOptions: {
            whiteLabel: {
              logoLight: "https://web3auth.io/images/web3auth-logo.svg",
              logoDark: "https://web3auth.io/images/web3auth-logo.svg",
            },
          },
        });
        web3authSfa?.addPlugin(wsPlugin);
        setWsPlugin(wsPlugin);
        web3authSfa.on(ADAPTER_EVENTS.CONNECTED, (data) => {
          console.log("sfa:connected", data);
          console.log("sfa:state", web3authSfa?.state);
          setProvider(web3authSfa.provider);
        });
        web3authSfa.on(ADAPTER_EVENTS.DISCONNECTED, () => {
          console.log("sfa:disconnected");
          setProvider(null);
        });
        await web3authSfa.init();
        setWeb3authSFAuth(web3authSfa);
        // (window as any).web3auth = web3authSfa;
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const onSuccess = async (response: CredentialResponse) => {
    try {
      if (!web3authSFAuth) {
        uiConsole("Web3Auth Single Factor Auth SDK not initialized yet");
        return;
      }
      setIsLoggingIn(true);
      const idToken = response.credential;
      // console.log(idToken);
      if (!idToken) {
        setIsLoggingIn(false);
        return;
      }
      const { payload } = decodeToken(idToken);
      await web3authSFAuth.connect({
        verifier,
        verifierId: (payload as any)?.email,
        idToken: idToken!,
      });
      setIsLoggingIn(false);
    } catch (err) {
      // Single Factor Auth SDK throws an error if the user has already enabled MFA
      // One can use the Web3AuthNoModal SDK to handle this case
      setIsLoggingIn(false);
      console.error(err);
    }
  };

  const loginWithPasskey = async () => {
    try {
      setIsLoggingIn(true);
      if (!pkPlugin) throw new Error("Passkey plugin not initialized");
      const result = shouldSupportPasskey();
      if (!result.isBrowserSupported) {
        uiConsole("Browser not supported");
        return;
      }
      await pkPlugin.loginWithPasskey();
      uiConsole("Passkey logged in successfully");
    } catch (error) {
      console.error((error as Error).message);
      uiConsole((error as Error).message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const getUserInfo = async () => {
    if (!web3authSFAuth) {
      uiConsole("Web3Auth Single Factor Auth SDK not initialized yet");
      return;
    }
    const getUserInfo = await web3authSFAuth.getUserInfo();
    uiConsole(getUserInfo);
  };

  const logout = async () => {
    if (!web3authSFAuth) {
      uiConsole("Web3Auth Single Factor Auth SDK not initialized yet");
      return;
    }
    googleLogout();
    web3authSFAuth.logout();
    return;
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(provider);
    const userAccount = await rpc.getAccounts();
    uiConsole(userAccount);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };
  const authenticateUser = async () => {
    if (!web3authSFAuth) {
      uiConsole("Web3Auth Single Factor Auth SDK not initialized yet");
      return;
    }
    try {
      const userCredential = await web3authSFAuth.authenticateUser();
      uiConsole(userCredential);
    } catch (err) {
      uiConsole(err);
    }
  };
  const registerPasskey = async () => {
    try {
      if (!pkPlugin || !web3authSFAuth) {
        uiConsole("plugin not initialized yet");
        return;
      }
      const result = shouldSupportPasskey();
      if (!result.isBrowserSupported) {
        uiConsole("Browser not supported");
        return;
      }
      const userInfo = await web3authSFAuth?.getUserInfo();
      const res = await pkPlugin.registerPasskey({
        username: `google|${userInfo?.email || userInfo?.name} - ${new Date().toLocaleDateString("en-GB")}`,
      });
      if (res) uiConsole("Passkey saved successfully");
    } catch (error: unknown) {
      uiConsole((error as Error).message);
    }
  };
  return (
    <Web3AuthContext.Provider
      value={{
        onSuccess,
        loginWithPasskey,
        getUserInfo,
        logout,
        getAccounts,
        getBalance,
        authenticateUser,
        registerPasskey,
        provider,
        web3authSFAuth,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (context === undefined) {
    throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
  }
  return context;
};
