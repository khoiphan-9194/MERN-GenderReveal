import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";

import { QUERY_ROOM_BY_CODE, QUERY_VOTES_BY_ROOM } from "../utils/queries";

import {
  MUTATION_SUBMIT_VOTE,
  MUTATION_REVEAL_RESULT,
} from "../utils/mutations";

import Auth from "../utils/auth";

const AccessRoom = () => {
  // =========================
  // 1. GET ROOM CODE FROM URL
  // =========================
  // Example URL: /room/ABC123 → roomCode = "ABC123"
  const { roomCode } = useParams();

  // =========================
  // 2. LOCAL STATE (UI DATA)
  // =========================

  const [votes, setVotes] = useState([]);
  // stores all votes from backend

  const [guess, setGuess] = useState("");
  // user selects "boy" or "girl"

  const [voterName, setVoterName] = useState("");
  // user name input

  const [reason, setReason] = useState("");
  // optional message

  const [timeLeft, setTimeLeft] = useState(10);
  // countdown number (seconds)

  const [startCountdown, setStartCountdown] = useState(false);
  // controls if timer is running

  const [showResult, setShowResult] = useState(false);
  // controls when result is shown

  const [hasVoted, setHasVoted] = useState(false);
  // tracks if user has already voted (to prevent multiple votes)

  // =========================
  // 3. GET ROOM DATA
  // =========================
  const { data: roomData, loading: roomLoading } = useQuery(
    QUERY_ROOM_BY_CODE,
    {
      variables: { roomCode },
    },
  );

  // extract roomId from backend response
  const roomId = roomData?.roomByCode?._id;

  // actual result stored in DB (boy/girl)
  const actualResult = roomData?.roomByCode?.actualResult;

  // =========================
  // 4. GET VOTES (ONLY AFTER ROOM EXISTS)
  // =========================
  const { data: votesData, refetch: refetchVotes } = useQuery(
    QUERY_VOTES_BY_ROOM,
    {
      variables: { roomId },
      skip: !roomId, // don't run until roomId exists
    },
  );

  
  // =========================
  // 5. CHECK IF USER IS OWNER
  // =========================
  const profile = Auth.loggedIn() ? Auth.getProfile()?.data : null;

  const isOwner =
    profile?._id &&
    roomData?.roomByCode?.createdBy?._id &&
    profile._id === roomData.roomByCode.createdBy._id;

  // =========================
  // 6. UPDATE VOTES WHEN DATA CHANGES
  // =========================
  useEffect(() => {
    if (votesData?.votesByRoom) {
      // whenever backend sends new votes → update UI
      setVotes(votesData.votesByRoom);
    }
  }, [votesData]);

  // =========================
  // 7. SUBMIT VOTE
  // =========================
  const [submitVote] = useMutation(MUTATION_SUBMIT_VOTE, {
    onCompleted: () => {
      alert("Vote submitted!");

      // refresh vote list after submitting
      refetchVotes();

      // clear form
      setGuess("");
      setVoterName("");
      setReason("");
    },
    onError: (err) => {
      console.error("GraphQL Error:", err);

      // 🔥 Apollo usually stores backend message here:
      const message =
        err?.graphQLErrors?.[0]?.message || "Something went wrong";

      alert(message);
    },
  });

  const handleVoteSubmit = (e) => {
    e.preventDefault(); // stop page refresh

    if (!guess || !voterName) {
      return alert("Please enter name and guess");
    }

    submitVote({
      variables: {
        input: {
          voterName,
          guess,
          reason,
          roomCode,
        },
      },
    });
      setHasVoted(true); // mark that user has voted
  };

  // =========================
  // 8. REVEAL RESULT (OWNER ONLY)
  // =========================
  const [revealResult] = useMutation(MUTATION_REVEAL_RESULT);

  const handleReveal = async () => {
    try {
      // save result in database
      await revealResult({
        variables: {
          roomId,
          result: "boy", // you can make this dynamic later
        },
      });

      // refresh votes + room data
      refetchVotes();

      // start countdown AFTER reveal
      setStartCountdown(true);
      setTimeLeft(10);
      setShowResult(false);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // 9. COUNTDOWN TIMER LOGIC
  // =========================
  useEffect(() => {
    if (!startCountdown) return;

    // when timer reaches 0 → show result
    if (timeLeft <= 0) {
      setShowResult(true);
      setStartCountdown(false);
      return;
    }

    // decrease timer every 1 second
    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // cleanup timer to avoid bugs
    return () => clearTimeout(timer);
  }, [startCountdown, timeLeft]);

  // =========================
  // 10. CALCULATE VOTE STATISTICS
  // =========================
  const totalVotes = votes.length;

  const boyVotes = votes.filter((v) => v.guess === "boy").length;
  const girlVotes = votes.filter((v) => v.guess === "girl").length;

  // convert to percentage (avoid divide by 0)
  const boyPercentage = totalVotes
    ? Math.round((boyVotes / totalVotes) * 100)
    : 0;

  const girlPercentage = totalVotes
    ? Math.round((girlVotes / totalVotes) * 100)
    : 0;

  // =========================
  // 11. LOADING STATE
  // =========================
  if (roomLoading) return <p>Loading room...</p>; // if room data is still loading, show message

  // =========================
  // 12. UI (WHAT USER SEES)
  // =========================
  return (
    <div className="access-room-container">
      {/* ROOM TITLE */}
      <h2>{roomData?.roomByCode?.roomName}</h2>

      {/* VOTE PROGRESS BAR */}
      <div className="vote-percentage-bar">
        <div className="bar boy-bar" style={{ width: `${boyPercentage}%` }}>
          👦 {boyPercentage}%
        </div>

        <div className="bar girl-bar" style={{ width: `${girlPercentage}%` }}>
          👧 {girlPercentage}%
        </div>
      </div>
      {/* VOTES COLUMNS */}
      <div className="votes-container">
        {/* BOY COLUMN */}
        <div className="vote-column boy-column">
          <h3>👦 Boys</h3>
          {votes
            .filter((v) => v.guess === "boy")
            .map((v) => (
              <div key={v._id} className="vote-card">
                <div className="voter-name">{v.voterName}</div>
                {v.reason && <div className="vote-reason">"{v.reason}"</div>}
              </div>
            ))}
        </div>

        {/* GIRL COLUMN */}
        <div className="vote-column girl-column">
          <h3>👧 Girls</h3>
          {votes
            .filter((v) => v.guess === "girl")
            .map((v) => (
              <div key={v._id} className="vote-card">
                <div className="voter-name">{v.voterName}</div>
                {v.reason && <div className="vote-reason">"{v.reason}"</div>}
              </div>
            ))}
        </div>
      </div>

      {/* ========================= */}
      {/* REVEAL BUTTON (OWNER ONLY) */}
      {/* ========================= */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {isOwner ? (
          <button onClick={handleReveal} className="reveal-btn">
            🎉 Reveal Gender
          </button>
        ) : (
          <button disabled className="reveal-btn disabled">
            🔒 Only owner can reveal
          </button>
        )}
      </div>

      {/* ========================= */}
      {/* COUNTDOWN DISPLAY */}
      {/* ========================= */}
      {startCountdown && (
        <div className="countdown-timer">
          <h3>Revealing in...</h3>
          <p>{timeLeft} seconds</p>
        </div>
      )}

      {/* ========================= */}
      {/* FINAL RESULT DISPLAY */}
      {/* ========================= */}
      {showResult && actualResult && (
        <div className="actual-result">
          <h3>Actual Result:</h3>
          <h1>{actualResult === "boy" ? "👦 IT'S A BOY!" : "👧 IT'S A GIRL!"}</h1>
        </div>
      )}

      {/* ========================= */}
      {/* VOTE FORM */}
      {/* ========================= */}
      <form onSubmit={handleVoteSubmit} className="vote-form">
        {/* NAME INPUT */}
        <input
          placeholder="Your Name"
          value={voterName}
          onChange={(e) => setVoterName(e.target.value)}
        />

        {/* GUESS SELECT */}
        <select value={guess} onChange={(e) => setGuess(e.target.value)}>
          <option value="">Select Guess</option>
          <option value="boy">Boy</option>
          <option value="girl">Girl</option>
        </select>

        {/* REASON INPUT */}
        <input
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleVoteSubmit}
          disabled={hasVoted} // 🚫 block second click
        >
          {hasVoted ? "Already Voted" : "Submit Vote"}
        </button>
      </form>
    </div>
  );
};

export default AccessRoom;
