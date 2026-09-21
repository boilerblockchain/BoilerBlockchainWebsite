import { createConfig, http } from "wagmi";
import {
  base,
  baseSepolia,
  mainnet,
  arbitrum,
  optimism,
  polygon,
} from "wagmi/chains";
import { injected, coinbaseWallet, walletConnect } from "wagmi/connectors";

/**
 * WalletConnect project id — lets any wallet (MetaMask, Coinbase, Rainbow,
 * Trust, …) connect and sign, including via mobile deep links. Get a free id at
 * https://cloud.reown.com and set NEXT_PUBLIC_WC_PROJECT_ID.
 */
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "";

/**
 * We don't transact, so several common chains are listed only so a wallet's
 * current network is "supported" and no switch is forced — the signature itself
 * is network-agnostic (no chainId in the signing domain).
 */
export const wagmiConfig = createConfig({
  chains: [baseSepolia, base, mainnet, arbitrum, optimism, polygon],
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({ appName: "Boiler Blockchain Attendance" }),
    // Only register WalletConnect when a project id is configured.
    ...(projectId
      ? [walletConnect({ projectId, showQrModal: true })]
      : []),
  ],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
  },
  ssr: true,
});

/** True when WalletConnect (mobile-wallet support) is configured. */
export const walletConnectEnabled = Boolean(projectId);

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
