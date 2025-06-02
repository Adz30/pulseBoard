import React, { useEffect, useState } from "react";
import {
  getAllVoteForms,
  getAllCommentRequests,
  hasVoted,
  saveVote,
  hasReplied,
  saveCommentReply,
} from "../components/firebaseLogging";
import { useAppKitAccount } from "@reown/appkit/react";

const styles = {
  container: {
    maxWidth: 700,
    margin: "auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "1rem",
    color: "#333",
  },
  heading: {
    borderBottom: "2px solid #0070f3",
    paddingBottom: "0.5rem",
    marginBottom: "1rem",
  },
  error: {
    color: "red",
    marginBottom: "1rem",
  },
  section: {
    marginBottom: "2rem",
  },
  cardsWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: 6,
    padding: "1rem",
    width: "300px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  button: {
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  optionItem: {
    marginBottom: "0.5rem",
  },
  voteSelected: {
    marginLeft: "0.5rem",
    color: "green",
    fontWeight: "600",
  },
  textarea: {
    width: "100%",
    marginTop: "0.5rem",
    padding: "0.5rem",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "1rem",
  },
  replyConfirmed: {
    color: "green",
    marginTop: "0.5rem",
    fontWeight: "600",
  },
};

function shortenAddress(address) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

function ContributorPage() {
  const { address: voterAddress } = useAppKitAccount();

  const [voteForms, setVoteForms] = useState([]);
  const [commentRequests, setCommentRequests] = useState([]);
  const [error, setError] = useState(null);

  const [userVotes, setUserVotes] = useState({}); // { voteFormId: optionIndex }
  const [loadingVotes, setLoadingVotes] = useState({});

  const [commentReplies, setCommentReplies] = useState({}); // { commentRequestId: replyText }
  const [userReplies, setUserReplies] = useState({}); // { commentRequestId: true }
  const [loadingReplies, setLoadingReplies] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [votes, comments] = await Promise.all([
          getAllVoteForms(),
          getAllCommentRequests(),
        ]);
        setVoteForms(votes);
        setCommentRequests(comments);

        if (voterAddress) {
          const votesMap = {};
          await Promise.all(
            votes.map(async (vote) => {
              const optionIndex = await hasVoted(vote.id, voterAddress);
              if (optionIndex !== false) {
                votesMap[vote.id] = optionIndex;
              }
            })
          );
          setUserVotes(votesMap);

          const repliesMap = {};
          await Promise.all(
            comments.map(async (comment) => {
              const replied = await hasReplied(comment.id, voterAddress);
              repliesMap[comment.id] = replied;
            })
          );
          setUserReplies(repliesMap);
        }
      } catch (err) {
        setError("Failed to fetch data: " + err.message);
      }
    };
    fetchData();
  }, [voterAddress]);

  const handleVote = async (voteFormId, optionIndex) => {
    if (!voterAddress) {
      alert("Connect your wallet to vote.");
      return;
    }
    if (userVotes[voteFormId] !== undefined) {
      alert("You have already voted on this form.");
      return;
    }

    const voteForm = voteForms.find((form) => form.id === voteFormId);
    if (!voteForm) {
      alert("Vote form not found.");
      return;
    }

    const selectedOption = voteForm.options?.[optionIndex];
    if (!selectedOption) {
      alert("Selected option is invalid.");
      return;
    }

    setLoadingVotes((prev) => ({ ...prev, [voteFormId]: true }));

    try {
      await saveVote({
        voteFormId,
        voterAddress,
        selectedOption,
      });
      setUserVotes((prev) => ({ ...prev, [voteFormId]: optionIndex }));
      alert("Vote saved!");
    } catch (err) {
      alert(err.message);
    }

    setLoadingVotes((prev) => ({ ...prev, [voteFormId]: false }));
  };

  const handleReplyChange = (commentId, text) => {
    setCommentReplies((prev) => ({ ...prev, [commentId]: text }));
  };

  const handleReplySubmit = async (commentId) => {
    if (!voterAddress) {
      alert("Connect your wallet to reply.");
      return;
    }
    const replyText = commentReplies[commentId];
    if (!replyText || replyText.trim() === "") {
      alert("Reply cannot be empty.");
      return;
    }

    setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));

    try {
      await saveCommentReply({
        commentRequestId: commentId,
        replyText,
        replierAddress: voterAddress,
      });
      setUserReplies((prev) => ({ ...prev, [commentId]: true }));
      alert("Reply saved!");
      setCommentReplies((prev) => ({ ...prev, [commentId]: "" }));
    } catch (err) {
      alert(err.message);
    }

    setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Contributor Page</h1>
      {error && <p style={styles.error}>{error}</p>}

      <section style={styles.section}>
        <h2 style={styles.heading}>Vote Forms</h2>
        {voteForms.length === 0 && <p>No vote forms found.</p>}
        <div style={styles.cardsWrapper}>
          {voteForms.map((form) => (
            <div key={form.id} style={styles.card}>
              <h3>{form.statement || "No statement"}</h3>
              <p>
                <strong>Creator:</strong> {shortenAddress(form.creatorAddress)}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {form.createdAt?.toDate
                  ? form.createdAt.toDate().toLocaleString()
                  : "Unknown"}
              </p>
              <div>
                <strong>Options:</strong>
                <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "0.5rem" }}>
                  {(form.options || []).map((opt, i) => (
                    <li key={i} style={styles.optionItem}>
                      <button
                        style={{
                          ...styles.button,
                          ...(loadingVotes[form.id] || userVotes[form.id] !== undefined
                            ? styles.buttonDisabled
                            : {}),
                        }}
                        disabled={
                          loadingVotes[form.id] !== undefined ||
                          userVotes[form.id] !== undefined
                        }
                        onClick={() => handleVote(form.id, i)}
                      >
                        {opt}
                      </button>
                      {userVotes[form.id] === i && (
                        <span style={styles.voteSelected}>(Your vote)</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.heading}>Comment Requests</h2>
        {commentRequests.length === 0 && <p>No comment requests found.</p>}
        <div style={styles.cardsWrapper}>
          {commentRequests.map((comment) => (
            <div key={comment.id} style={styles.card}>
              <h3>{comment.subject || "No subject"}</h3>
              <p>
                <strong>Creator:</strong> {shortenAddress(comment.creatorAddress)}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {comment.createdAt?.toDate
                  ? comment.createdAt.toDate().toLocaleString()
                  : "Unknown"}
              </p>
              <div>
                {userReplies[comment.id] ? (
                  <p style={styles.replyConfirmed}>You have already replied.</p>
                ) : (
                  <>
                    <textarea
                      rows={4}
                      placeholder="Write your reply here..."
                      value={commentReplies[comment.id] || ""}
                      onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                      style={styles.textarea}
                    />
                    <button
                      style={{
                        ...styles.button,
                        marginTop: "0.5rem",
                        ...(loadingReplies[comment.id] ? styles.buttonDisabled : {}),
                      }}
                      onClick={() => handleReplySubmit(comment.id)}
                      disabled={loadingReplies[comment.id]}
                    >
                      Submit Reply
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ContributorPage;
