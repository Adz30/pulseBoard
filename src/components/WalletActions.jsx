import React from "react";
import {
  useAppKitAccount,
  useAppKitProvider,
  useAppKitNetworkCore,
} from "@reown/appkit/react";

import {
  BrowserProvider,
  JsonRpcSigner,
  formatEther,
  parseUnits,
} from "ethers";

export default function WalletActions() {
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider();

  const getBalance = async () => {
    if (!walletProvider || !address || !chainId) return;
    const provider = new BrowserProvider(walletProvider, chainId);
    const balance = await provider.getBalance(address);
    const eth = formatEther(balance);
    console.log(`Balance: ${eth} ETH`);
    alert(`Balance: ${eth} ETH`);
  };

  const signMessage = async () => {
    if (!walletProvider || !address || !chainId) return;
    const provider = new BrowserProvider(walletProvider, chainId);
    const signer = new JsonRpcSigner(provider, address);
    const signature = await signer.signMessage("Hello Reown AppKit!");
    console.log("Signature:", signature);
    alert(`Signature: ${signature}`);
  };

  const sendTransaction = async () => {
    if (!walletProvider || !address || !chainId) return;
    const provider = new BrowserProvider(walletProvider, chainId);
    const signer = new JsonRpcSigner(provider, address);

    const tx = {
      to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
      value: parseUnits("0.0001", "gwei"),
    };

    try {
      const transactionResponse = await signer.sendTransaction(tx);
      console.log("Transaction sent:", transactionResponse);
      alert(`Transaction sent: ${transactionResponse.hash}`);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert(`Transaction failed: ${error.message}`);
    }
  };

  if (!isConnected) {
    return <p>Please connect your wallet to use wallet actions.</p>;
  }

  return (
    <div>
      <h2>Connected account: {address}</h2>
      <button onClick={getBalance}>Get Balance</button>
      <button onClick={signMessage}>Sign Message</button>
      <button onClick={sendTransaction}>Send Transaction</button>
    </div>
  );
}
