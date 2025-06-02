import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

function ContributorBoard() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPolls() {
      const querySnapshot = await getDocs(collection(db, "polls"));
      const pollsData = [];
      querySnapshot.forEach((doc) => {
        pollsData.push({ id: doc.id, ...doc.data() });
      });
      setPolls(pollsData);
      setLoading(false);
    }
    fetchPolls();
  }, []);

  if (loading) return <p>Loading polls...</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {polls.map((poll) => (
        <div
          key={poll.id}
          onClick={() => navigate(`/contributor/${poll.id}`)}
          style={{
            cursor: "pointer",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            width: "250px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <h3>{poll.title}</h3>
          <p>
            Type: <strong>{poll.type === "vote" ? "Vote" : "Comment"}</strong>
          </p>
          {poll.type === "vote" ? (
            <p>{poll.statement?.slice(0, 80)}...</p>
          ) : (
            <p>{poll.subject?.slice(0, 80)}...</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default ContributorBoard;
