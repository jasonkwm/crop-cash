import { ADAPTER_EVENTS, CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { decodeToken, Web3Auth } from "@web3auth/single-factor-auth";
import { createContext, useContext, useEffect, useState } from "react";
import RPC from "../rpcs/ethersRPC";
import { CredentialResponse, googleLogout } from "@react-oauth/google";
import { ListPasskeyResponse, PasskeysPlugin } from "@web3auth/passkeys-sfa-plugin";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { shouldSupportPasskey } from "../utils";
import { AuthUserInfo } from "@web3auth/auth";
import { ethers } from "ethers";
import { BiconomySmartAccountV2, createPaymaster, createSmartAccountClient, IPaymaster } from "@biconomy/account";

const clientId = "BMOtGZg6Gtzh3MbWIgs8EJzl5Ig-tSFaPkULxG3HKm2jpUVVrH4HudSraHzHl73dm64WJ3qiowXvW_0xoinv8wM";
const verifier = "banana-google";

const chainConfig: any = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x8274f", // Please use 0x1 for Mainnet
  rpcTarget: "https://scroll-sepolia-rpc.publicnode.com",
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

export type Web3AuthProviderType = {
  onSuccess: (
    response: CredentialResponse
  ) => Promise<"Web3Auth Single Factor Auth SDK not initialized yet" | "Login Sucessful" | undefined>;
  loginWithPasskey: () => Promise<string>;
  logout: () => Promise<"Web3Auth Single Factor Auth SDK not initialized yet" | "Logout sucessful">;
  authenticateUser: () => Promise<any>;
  registerPasskey: () => Promise<
    "Browser not supported" | "plugin not initialized yet" | "Passkey saved successfully" | undefined
  >;
  listAllPasskeys: () => Promise<"plugin not initialized yet" | ListPasskeyResponse[]>;
  smartWallet: BiconomySmartAccountV2 | undefined;
  setSmartWallet: React.Dispatch<React.SetStateAction<BiconomySmartAccountV2 | undefined>>;
  smartWalletAddress: string;
  setSmartWalletAddress: React.Dispatch<React.SetStateAction<string>>;
  provider: IProvider | null;
  web3authSFAuth: any;
  wsPlugin: any;
  isLoggingIn: any;
  setIsLoggingIn: any;
  userInfo: any;
  setUserInfo: any;
  userAccount: any;
  setUserAccount: any;
  userBalance: any;
  setUserBalance: any;
};

export const Web3AuthContext = createContext<Web3AuthProviderType | null>(null);

export const Web3AuthProvider = ({ children }: { children: any }) => {
  const [web3authSFAuth, setWeb3authSFAuth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [pkPlugin, setPkPlugin] = useState<PasskeysPlugin | null>(null);
  const [wsPlugin, setWsPlugin] = useState<WalletServicesPlugin | null>(null);
  const [userInfo, setUserInfo] = useState<AuthUserInfo | null>(null);
  const [userAccount, setUserAccount] = useState<string>("");
  const [userBalance, setUserBalance] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [smartWallet, setSmartWallet] = useState<BiconomySmartAccountV2>();
  const [smartWalletAddress, setSmartWalletAddress] = useState("");

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
          postLoginFlow(web3authSfa, web3authSfa.provider);
        });
        web3authSfa.on(ADAPTER_EVENTS.DISCONNECTED, () => {
          console.log("sfa:disconnected");
          setProvider(null);
          setUserInfo(null);
          setUserAccount("");
          setUserBalance("");
          setSmartWallet(undefined);
          setSmartWalletAddress("");
        });
        await web3authSfa.init();
        setWeb3authSFAuth(web3authSfa);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const onSuccess = async (response: CredentialResponse) => {
    try {
      if (!web3authSFAuth) {
        return "Web3Auth Single Factor Auth SDK not initialized yet";
      }
      setIsLoggingIn(true);
      const idToken = response.credential;
      // console.log(idToken);
      if (!idToken) {
        setIsLoggingIn(false);
        return;
      }
      const { payload } = decodeToken(idToken);
      console.log("before payload");
      await web3authSFAuth.connect({
        verifier,
        verifierId: (payload as any)?.email,
        idToken: idToken!,
      });
      setIsLoggingIn(false);
      return "Login Sucessful";
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
        return "Browser not supported";
      }
      await pkPlugin.loginWithPasskey();
      return "Passkey logged in successfully";
    } catch (error) {
      return (error as Error).message;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    if (!web3authSFAuth) {
      return "Web3Auth Single Factor Auth SDK not initialized yet";
    }
    try {
      googleLogout();
    } catch (e: any) {
      console.log(e.message);
    }
    web3authSFAuth.logout();
    return "Logout sucessful";
  };

  const authenticateUser = async () => {
    if (!web3authSFAuth) {
      return "Web3Auth Single Factor Auth SDK not initialized yet";
    }
    try {
      const userCredential = await web3authSFAuth.authenticateUser();
      return userCredential;
    } catch (err: any) {
      return err.message;
    }
  };
  const registerPasskey = async () => {
    try {
      if (!pkPlugin || !web3authSFAuth) {
        return "plugin not initialized yet";
      }
      const result = shouldSupportPasskey();
      if (!result.isBrowserSupported) {
        return "Browser not supported";
      }
      const userInfo = await web3authSFAuth?.getUserInfo();
      const res = await pkPlugin.registerPasskey({
        username: `google|${userInfo?.email || userInfo?.name} - ${new Date().toLocaleDateString("en-GB")}`,
      });
      if (res) return "Passkey saved successfully";
    } catch (error: unknown) {
      console.log((error as Error).message);
    }
  };
  const listAllPasskeys = async () => {
    if (!pkPlugin) {
      return "plugin not initialized yet";
    }
    const res = await pkPlugin.listAllPasskeys();
    return res;
  };

  const postLoginFlow = async (web3AuthSfaParam: any, provider: IProvider | null) => {
    if (!web3AuthSfaParam) {
      return "Web3Auth Single Factor Auth SDK not initialized yet";
    }
    if (!provider) {
      return "No provider found";
    }

    const getUserInfo = await web3AuthSfaParam.getUserInfo();
    const rpc = new RPC(provider);
    const acc = await rpc.getAccounts();
    const balance = await rpc.getBalance();

    setUserInfo(getUserInfo);
    setUserAccount(acc);
    setUserBalance(balance);
    const biconomyConfig = {
      biconomyPaymasterApiKey: import.meta.env.VITE_BICONOMY_PAYMASTER_API_KEY,
      bundleUrl: `https://bundler.biconomy.io/api/v2/534351/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
    };
    if (web3AuthSfaParam && web3AuthSfaParam?.connected && provider) {
      const ethersProvider = new ethers.providers.Web3Provider(provider);

      const paymaster: IPaymaster = await createPaymaster({
        paymasterUrl: `https://paymaster.biconomy.io/api/v1/534351/${biconomyConfig.biconomyPaymasterApiKey}`,
        strictMode: false,
      });
      const sw = await createSmartAccountClient({
        signer: ethersProvider.getSigner() as any,
        biconomyPaymasterApiKey: biconomyConfig.biconomyPaymasterApiKey,
        // paymasterUrl: `https://paymaster.biconomy.io/api/v1/84532/${biconomyConfig.biconomyPaymasterApiKey}`,
        bundlerUrl: biconomyConfig.bundleUrl,
        paymaster: paymaster,
        rpcUrl: "https://scroll-sepolia-rpc.publicnode.com",
        chainId: 534351,
      });

      const swAddress = await sw.getAddress();
      setSmartWallet(sw);
      setSmartWalletAddress(swAddress);
    }
  };

  useEffect(() => {
    if (provider && web3authSFAuth) {
      postLoginFlow(web3authSFAuth, provider);
    }
  }, [provider, web3authSFAuth]);
  return (
    <Web3AuthContext.Provider
      value={{
        onSuccess,
        loginWithPasskey,
        logout,
        authenticateUser,
        registerPasskey,
        provider,
        web3authSFAuth,
        userInfo,
        setUserInfo,
        userAccount,
        setUserAccount,
        userBalance,
        setUserBalance,
        isLoggingIn,
        setIsLoggingIn,
        listAllPasskeys,
        smartWallet,
        setSmartWallet,
        smartWalletAddress,
        setSmartWalletAddress,
        wsPlugin,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext) as Web3AuthProviderType;
  if (context === undefined) {
    throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
  }
  return context;
};
