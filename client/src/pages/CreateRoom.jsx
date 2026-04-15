// ===============================
// 1. IMPORTS (GETTING TOOLS)
// ===============================

// React hook → lets us store and update data inside the component
import { useState } from "react";

// React Bootstrap → pre-built styled UI components
import { Container, Form, Button, Alert } from "react-bootstrap";

// Apollo Client → used to talk to GraphQL backend
import { useMutation } from "@apollo/client";

// GraphQL mutation → used to CREATE a room in the database
import { MUTATION_CREATE_ROOM } from "../utils/mutations";

// GraphQL query → used to refresh room list after creating a new room
import { QUERY_ROOMS } from "../utils/queries";

// React Router → lets us move user between pages
import { useNavigate } from "react-router-dom";

// Auth helper → checks if user is logged in
import Auth from "../utils/auth";



// ===============================
// 2. MAIN COMPONENT
// ===============================
const CreateRoom = () => {
  // ===============================
  // 3. STATE (MEMORY INSIDE COMPONENT)
  // ===============================
  // Stores what user types into input box
  const [roomName, setRoomName] = useState("");

  // Controls whether error message is shown
  const [showAlert, setShowAlert] = useState(false);

  // ===============================
  // 4. GRAPHQL MUTATION (SEND DATA TO BACKEND)
  // ===============================

  const [createRoom, { loading, error }] = useMutation(MUTATION_CREATE_ROOM, {
    // 🔄 AFTER creating room → automatically refresh room list
    refetchQueries: [
      {
        query: QUERY_ROOMS,
      },
    ],
    // ⏳ wait until refresh finishes before continuing
    awaitRefetchQueries: true,
  });

  // ===============================
  // 5. NAVIGATION (MOVE BETWEEN PAGES)
  // ===============================

  const navigate = useNavigate();

  // ===============================
  // 6. LOGIN CHECK
  // ===============================

  const isLoggedIn = Auth.loggedIn();

  // ===============================
  // 7. HANDLE FORM SUBMIT
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ❗ stop page from refreshing (default browser behavior)

    try {
      // =========================
      // STEP 1: CREATE ROOM
      // =========================

      await createRoom({
        variables: {
          input: {
            roomName,
            // send user input to backend
          },
        },
      });

      // =========================
      // STEP 2: SUCCESS FLOW
      // =========================
      // Apollo automatically refetches QUERY_ROOMS
      // so UI updates without manual work
      // Show success message and navigate back to main page
      alert("Room created successfully!");
      // After creating room, navigate back to main page
      navigate("/");
    } catch (err) {
      // =========================
      // ERROR FLOW
      // =========================

      console.error("Failed to create room:", err);
      setShowAlert(true);
    }

    // =========================
    // STEP 3: RESET INPUT FIELD
    // =========================

    setRoomName("");
  };

  // ===============================
  // 8. BLOCK UNLOGGED USERS
  // ===============================

  if (!isLoggedIn) {
    return (
      <Container className="text-center mt-5">
        <h3>🚫 You must be logged in to create a room</h3>
      </Container>
    );
  }

  // ===============================
  // 9. UI (WHAT USER SEES)
  // ===============================

  return (
    <Container className="create-room-container">
      {/* PAGE TITLE */}
      <h2 className="create-room-title">🎀 Create a New Room</h2>

      {/* FORM START */}
      <Form onSubmit={handleSubmit} className="create-room-form">
        {/* =========================
            ERROR MESSAGE BOX
        ========================= */}
        <Alert
          show={showAlert}
          variant="danger"
          dismissible
          onClose={() => setShowAlert(false)}
        >
          Something went wrong. Please try again.
        </Alert>

        {/* =========================
            INPUT FIELD
        ========================= */}
        <Form.Group className="mb-3">
          <Form.Label>Room Name</Form.Label>

          <Form.Control
            type="text"
            placeholder="e.g. Family Party 🎉"
            value={roomName}
            // whenever user types → update state
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
        </Form.Group>

        {/* =========================
            BUTTONS
        ========================= */}
        <div style={{ display: "flex", gap: "10px" }}>
          {/* CREATE BUTTON */}
          <Button
            type="submit"
            disabled={!roomName || loading}
            // disable if:
            // - input empty
            // - request still loading

            className="create-room-btn"
          >
            {loading ? "Creating..." : "✨ Create Room"}
          </Button>

          {/* CANCEL BUTTON */}
          <Button variant="secondary" onClick={() => navigate("/")}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

// ===============================
// 10. EXPORT COMPONENT
// ===============================

export default CreateRoom;
