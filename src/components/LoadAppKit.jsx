import React, { useState } from "react";
import { useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import modal from "../appKit";

export function WalletButton() {
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const [hovered, setHovered] = useState(false);

  const openModal = () => modal.open();

  const handleDisconnect = async () => {
    try {
      await disconnect();
      console.log("Disconnected");
    } catch (err) {
      console.error("Failed to disconnect:", err);
    }
  };

  if (!isConnected) {
    return (
      <button
        onClick={openModal}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={openModal}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        title={address}
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>

      {hovered && (
        <div className="absolute z-10 bg-white text-black shadow p-3 rounded top-full mt-1 w-48">
          <div className="text-sm mb-2 break-words">Account: {address}</div>
          <button
            onClick={handleDisconnect}
            className="bg-blue-600 text-white px-3 py-1 rounded w-full text-sm"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}