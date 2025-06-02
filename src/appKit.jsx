// src/appkit.js
import { createAppKit } from "@reown/appkit";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, arbitrum, base } from "@reown/appkit/networks";

const projectId = import.meta.env.VITE_PROJECT_ID;


const metadata = {
  name: "Pulse Board",
  description: "Pulse Board signing app",
  url: window.location.origin,
  icons: ["https://example.com/favicon.ico"],
};

const modal = createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: [mainnet, arbitrum, base],
  projectId,
  features: { analytics: true },
});

export default modal;