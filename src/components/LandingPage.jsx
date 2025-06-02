import React, { useEffect } from "react";
import { Modal, useAppKitAccount } from "@reown/appkit/react";

export default function LandingPage({ onLogin }) {
  const { address, isConnected } = useAppKitAccount();

  useEffect(() => {
    if (isConnected && address) {
      onLogin({ address });
    }
  }, [isConnected, address, onLogin]);

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1>Welcome to Pulse Board</h1>
      {!isConnected ? (
        <Modal>
          {({ open }) => (
            <button onClick={open}>Connect Wallet & Login</button>
          )}
        </Modal>
      ) : (
        <p>Connected as {address}</p>
      )}
    </div>
  );
}
