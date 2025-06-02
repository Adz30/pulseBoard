import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

function Home() {
  const { walletAddress } = useContext(UserContext);
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/rolepicker");
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Welcome to The Pulse Board</h1>
      <p style={{ maxWidth: 600, margin: "1rem auto" }}>
        Pulse Board lets you connect your wallet, choose your role, and either create or contribute to ideas that matter.
      </p>

      {walletAddress ? (
        <>
          <p>Connected as: <strong>{walletAddress}</strong></p>
          <button onClick={handleContinue} >
            Continue to Role Selection
          </button>
        </>
      ) : (
        <p>Please connect your wallet using the button above to get started.</p>
      )}
    </div>
  );
}

export default Home;