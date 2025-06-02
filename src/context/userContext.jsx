import React, { createContext, useState, useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const { address, isConnected } = useAppKitAccount();
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
    } else {
      setWalletAddress(null);
    }
  }, [address, isConnected]);

  return (
    <UserContext.Provider value={{ walletAddress }}>
      {children}
    </UserContext.Provider>
  );
}
