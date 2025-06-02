import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Your Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getAllVoteForms() {
  const voteFormsRef = collection(db, "voteForms");
  const q = query(voteFormsRef, where("type", "==", "vote"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getAllCommentRequests() {
  const commentReqRef = collection(db, "commentRequests");
  const q = query(commentReqRef, where("type", "==", "comment"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Save vote form data
export async function saveVoteForm({ statement, options, creatorAddress }) {
  if (!statement) throw new Error("Statement is required");
  if (!Array.isArray(options) || options.length === 0)
    throw new Error("Options must be a non-empty array");
  if (!creatorAddress) throw new Error("Creator address is required");

  try {
    const docRef = await addDoc(collection(db, "voteForms"), {
      type: "vote",
      creatorAddress,
      statement,
      options,
      createdAt: Timestamp.now(),
    });
    console.log("Vote form saved with ID: ", docRef.id);
  } catch (error) {
    console.error("Error saving vote form: ", error);
    throw error;
  }
}
export const deleteVotesSubcollection = async (formId) => {
  const votesRef = collection(db, "voteForms", formId, "votes");
  const votesSnapshot = await getDocs(votesRef);

  const deletePromises = votesSnapshot.docs.map((docSnap) => {
    const voteDocRef = doc(db, "voteForms", formId, "votes", docSnap.id);
    return deleteDoc(voteDocRef);
  });

  await Promise.all(deletePromises);
};

// 2. Delete the vote form document itself
export const deleteVoteForm = async (formId) => {
  try {
    await deleteVotesSubcollection(formId);
    const formRef = doc(db, "voteForms", formId);
    await deleteDoc(formRef);
    console.log(`Successfully deleted vote form ${formId} and all its votes`);
  } catch (error) {
    console.error("Failed to delete vote form:", error);
    throw error;
  }
};

// Save comment request form data
export async function saveCommentRequest({ subject, creatorAddress }) {
  if (!subject) throw new Error("Subject is required");
  if (!creatorAddress) throw new Error("Creator address is required");

  try {
    const docRef = await addDoc(collection(db, "commentRequests"), {
      type: "comment",
      creatorAddress,
      subject,
      createdAt: Timestamp.now(),
    });
    console.log("Comment request saved with ID: ", docRef.id);
  } catch (error) {
    console.error("Error saving comment request: ", error);
    throw error;
  }
}

export async function saveVote({ voteFormId, selectedOption, voterAddress }) {
  if (!voteFormId) throw new Error("voteFormId is required");
  if (!selectedOption)
    throw new Error("Selected option must be provided and not undefined");
  if (!voterAddress) throw new Error("voterAddress is required");

  const voteDocRef = doc(db, "voteForms", voteFormId, "votes", voterAddress);

  const existingVote = await getDoc(voteDocRef);
  if (existingVote.exists()) {
    throw new Error("You have already voted on this form.");
  }

  await setDoc(voteDocRef, {
    selectedOption,
    createdAt: Timestamp.now(),
  });
}

// Check if a user already voted on a specific voteForm
export async function hasVoted(voteFormId, voterAddress) {
  if (!voterAddress) return false;

  const voteDocRef = doc(db, "voteForms", voteFormId, "votes", voterAddress);
  const voteDoc = await getDoc(voteDocRef);
  return voteDoc.exists();
}

// Save a reply as a subdocument under "replies" subcollection of a commentRequest
export async function saveCommentReply({
  commentRequestId,
  replyText,
  replierAddress,
}) {
  if (!commentRequestId) throw new Error("commentRequestId is required");
  if (!replyText) throw new Error("Reply text is required");
  if (!replierAddress) throw new Error("replierAddress is required");

  const replyDocRef = doc(
    db,
    "commentRequests",
    commentRequestId,
    "replies",
    replierAddress
  );

  const existingReply = await getDoc(replyDocRef);
  if (existingReply.exists()) {
    throw new Error("You have already replied to this comment request.");
  }

  await setDoc(replyDocRef, {
    replyText,
    createdAt: Timestamp.now(),
  });
}

// 1. Delete all replies in a comment request's subcollection
export const deleteRepliesSubcollection = async (commentRequestId) => {
  const repliesRef = collection(
    db,
    "commentRequests",
    commentRequestId,
    "replies"
  );
  const repliesSnapshot = await getDocs(repliesRef);

  const deletePromises = repliesSnapshot.docs.map((docSnap) => {
    const replyDocRef = doc(
      db,
      "commentRequests",
      commentRequestId,
      "replies",
      docSnap.id
    );
    return deleteDoc(replyDocRef);
  });

  await Promise.all(deletePromises);
};

// 2. Delete the comment request document itself
export const deleteCommentRequest = async (commentRequestId) => {
  try {
    await deleteRepliesSubcollection(commentRequestId);
    const commentRef = doc(db, "commentRequests", commentRequestId);
    await deleteDoc(commentRef);
    console.log(
      `Successfully deleted comment request ${commentRequestId} and all its replies`
    );
  } catch (error) {
    console.error("Failed to delete comment request:", error);
    throw error;
  }
};

// 3. Delete a single reply (if you want to allow individual reply deletion)
export const deleteSingleReply = async (commentRequestId, replierAddress) => {
  try {
    const replyRef = doc(
      db,
      "commentRequests",
      commentRequestId,
      "replies",
      replierAddress
    );
    await deleteDoc(replyRef);
    console.log(
      `Successfully deleted reply from ${replierAddress} in comment request ${commentRequestId}`
    );
  } catch (error) {
    console.error("Failed to delete reply:", error);
    throw error;
  }
};

// Check if a user already replied on a specific commentRequest
export async function hasReplied(commentRequestId, replierAddress) {
  if (!replierAddress) return false;

  const replyDocRef = doc(
    db,
    "commentRequests",
    commentRequestId,
    "replies",
    replierAddress
  );
  const replyDoc = await getDoc(replyDocRef);
  return replyDoc.exists();
}

// Get vote forms by creator
export async function getVoteFormsByCreator(creatorAddress) {
  if (!creatorAddress) throw new Error("creatorAddress is required");

  const q = query(
    collection(db, "voteForms"),
    where("creatorAddress", "==", creatorAddress)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Get comment requests by creator
export async function getCommentRequestsByCreator(creatorAddress) {
  if (!creatorAddress) throw new Error("creatorAddress is required");

  const q = query(
    collection(db, "commentRequests"),
    where("creatorAddress", "==", creatorAddress)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Get votes for a specific vote form ID (from subcollection)
export async function getVotesForForm(formId) {
  if (!formId) throw new Error("formId is required");

  const votesSnapshot = await getDocs(
    collection(db, "voteForms", formId, "votes")
  );
  return votesSnapshot.docs.map((doc) => doc.data());
}

// Get replies for a specific comment request ID (from subcollection)
export async function getRepliesForCommentRequest(commentRequestId) {
  if (!commentRequestId) throw new Error("commentRequestId is required");

  const repliesSnapshot = await getDocs(
    collection(db, "commentRequests", commentRequestId, "replies")
  );
  return repliesSnapshot.docs.map((doc) => doc.data());
}

// Get vote forms with votes count by creator
export async function getVoteFormsWithVotesByCreator(creatorAddress) {
  if (!creatorAddress) throw new Error("creatorAddress is required");

  const q = query(
    collection(db, "voteForms"),
    where("creatorAddress", "==", creatorAddress)
  );
  const snapshot = await getDocs(q);

  const voteFormsData = [];

  for (const docSnap of snapshot.docs) {
    const formData = docSnap.data();
    const formId = docSnap.id;

    // Validate options array exists
    if (!Array.isArray(formData.options)) {
      continue; // skip invalid data
    }

    const votesSnapshot = await getDocs(
      collection(db, "voteForms", formId, "votes")
    );

    // Initialize counts per option
    const votesCount = {};
    formData.options.forEach((option) => {
      votesCount[option] = 0;
    });

    votesSnapshot.forEach((voteDoc) => {
      const vote = voteDoc.data();
      if (
        vote.selectedOption &&
        Object.prototype.hasOwnProperty.call(votesCount, vote.selectedOption)
      ) {
        votesCount[vote.selectedOption]++;
      }
    });

    voteFormsData.push({
      id: formId,
      statement: formData.statement,
      options: formData.options,
      createdAt: formData.createdAt,
      votesCount,
    });
  }

  return voteFormsData;
}
