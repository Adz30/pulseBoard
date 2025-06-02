import React, { useState, useEffect } from "react";
import {
  saveVoteForm,
  saveCommentRequest,
  getVoteFormsWithVotesByCreator,
  getCommentRequestsByCreator,
  getRepliesForCommentRequest,
  deleteVoteForm,
  deleteCommentRequest,
} from "../components/firebaseLogging";
import { useAppKitAccount } from "@reown/appkit/react";

function CreatorPage() {
  const { address } = useAppKitAccount();

  const [formType, setFormType] = useState("");
  const [statement, setStatement] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [subject, setSubject] = useState("");

  const [voteForms, setVoteForms] = useState([]);
  const [commentRequests, setCommentRequests] = useState([]);
  const [commentReplies, setCommentReplies] = useState({});

  useEffect(() => {
    if (!address) return;

    async function fetchData() {
      try {
        const votesData = await getVoteFormsWithVotesByCreator(address);
        setVoteForms(votesData);

        const commentsData = await getCommentRequestsByCreator(address);
        setCommentRequests(commentsData);

        const allReplies = {};
        for (const comment of commentsData) {
          const replies = await getRepliesForCommentRequest(comment.id);
          allReplies[comment.id] = replies;
        }
        setCommentReplies(allReplies);
      } catch (err) {
        console.error("Error loading creator data:", err);
      }
    }

    fetchData();
  }, [address]);

  const handleFormTypeChange = (e) => setFormType(e.target.value);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address) {
      alert("Connect your wallet before submitting.");
      return;
    }
    try {
      if (formType === "vote") {
        await saveVoteForm({
          statement,
          options: options.filter((opt) => opt.trim() !== ""),
          creatorAddress: address,
        });
        alert("Vote form saved!");
      } else if (formType === "comment") {
        await saveCommentRequest({
          subject,
          creatorAddress: address,
        });
        alert("Comment request saved!");
      } else {
        alert("Please select a form type.");
        return;
      }
      setStatement("");
      setOptions(["", ""]);
      setSubject("");
      setFormType("");

      const votesData = await getVoteFormsWithVotesByCreator(address);
      setVoteForms(votesData);
      const commentsData = await getCommentRequestsByCreator(address);
      setCommentRequests(commentsData);
      const allReplies = {};
      for (const comment of commentsData) {
        const replies = await getRepliesForCommentRequest(comment.id);
        allReplies[comment.id] = replies;
      }
      setCommentReplies(allReplies);
    } catch (err) {
      alert("Error saving form: " + err.message);
      console.error(err);
    }
  };
  const handleDeleteVoteForm = async (formId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vote form?"
    );
    if (!confirmDelete) return;

    try {
      await deleteVoteForm(formId);
      setVoteForms((prev) => prev.filter((form) => form.id !== formId));
      alert("Vote form deleted successfully!");
    } catch (error) {
      console.error("Failed to delete vote form:", error);
      alert("Failed to delete vote form. Please try again.");
    }
  };

  const handleDeleteCommentForm = async (formId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment request?"
    );
    if (!confirmDelete) return;

    try {
      await deleteCommentRequest(formId);
      setCommentRequests((prev) => prev.filter((form) => form.id !== formId));
      alert("Comment request deleted successfully!");
    } catch (error) {
      console.error("Failed to delete comment request:", error);
      alert("Failed to delete comment request. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Create a New Form</h2>
      <select
        className="form-select"
        value={formType}
        onChange={handleFormTypeChange}
      >
        <option value="">Select form type</option>
        <option value="vote">Vote</option>
        <option value="comment">Request Comment</option>
      </select>

      <form onSubmit={handleSubmit} className="form">
        {formType === "vote" && (
          <>
            <div className="form-control">
              <label>Statement:</label>
              <input
                type="text"
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label>Options:</label>
              {options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  required
                  className="input-option"
                />
              ))}
              <button
                type="button"
                className="btn-add-option"
                onClick={addOption}
              >
                + Add Option
              </button>
            </div>
          </>
        )}

        {formType === "comment" && (
          <div className="form-control">
            <label>Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit">Save</button>
      </form>

      <section>
        <h2>Your Vote Forms</h2>
        {voteForms.length === 0 && <p>No vote forms created yet.</p>}
        {voteForms.map((form) => (
          <div key={form.id} className="card">
            <div className="card-header">
              <p>
                <strong>Statement:</strong> {form.statement}
              </p>
              <button
                onClick={() => handleDeleteVoteForm(form.id)}
                className="btn-delete"
                title="Delete vote form"
              >
                ❌
              </button>
            </div>
            <p>
              <strong>Created At:</strong>{" "}
              {form.createdAt?.toDate
                ? form.createdAt.toDate().toLocaleString()
                : new Date(form.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Results:</strong>
            </p>
            <ul className="list">
              {form.options.map((opt) => (
                <li key={opt} className="list-item">
                  {opt}: {form.votesCount?.[opt] || 0} votes
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2>Your Comment Requests</h2>
        {commentRequests.length === 0 && <p>No comment requests created yet.</p>}
        {commentRequests.map((comment) => (
          <div key={comment.id} className="card">
            <div className="card-header">
              <p>
                <strong>Subject:</strong> {comment.subject}
              </p>
              <button
                onClick={() => handleDeleteCommentForm(comment.id)}
                className="btn-delete"
                title="Delete comment request"
              >
                ❌
              </button>
            </div>
            <p>
              <strong>Created At:</strong>{" "}
              {comment.createdAt?.toDate
                ? comment.createdAt.toDate().toLocaleString()
                : new Date(comment.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Replies:</strong>
            </p>
            {commentReplies[comment.id] && commentReplies[comment.id].length > 0 ? (
              <ul className="list">
                {commentReplies[comment.id].map((reply, idx) => (
                  <li key={idx} className="list-item">
                    {reply.replyText}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No replies yet.</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default CreatorPage;
