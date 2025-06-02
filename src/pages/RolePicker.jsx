import React from "react";
import { useNavigate } from "react-router-dom";

export default function RolePickerPage() {
  const navigate = useNavigate();

  const goToCreator = () => navigate("/creator");
  const goToContributor = () => navigate("/contributor");

  return (
    <section className="container" style={{ textAlign: "center" }}>
      <h2 className="heading">Choose Your Role</h2>

      <div className="button-group" style={{ justifyContent: "center", marginTop: "1rem" }}>
        <button onClick={goToCreator}>
          Creator
        </button>
        <button onClick={goToContributor} type="button">
          Contributor
        </button>
      </div>
    </section>
  );
}