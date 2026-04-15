// ================= IMPORTS =================
import { Container, Col, Card, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useMainPageContext } from "../utils/MainPageContext";
import { useMutation } from "@apollo/client";

import {
  MUTATION_TOGGLE_VISIBILITY,
  MUTATION_DELETE_ROOM,
} from "../utils/mutations";

function Roomlist() {
  // ================= CONTEXT DATA =================
  const {
    rooms, // all rooms from backend
    refetch, // function to refresh rooms
    isLoggedIn, // boolean: user logged in or not
    error, // error from query
    loading, // loading state
    getUserData, // function to get logged-in user
  } = useMainPageContext();

  // ================= MUTATIONS =================
  const [toggleVisibility] = useMutation(MUTATION_TOGGLE_VISIBILITY);
  const [deleteRoom] = useMutation(MUTATION_DELETE_ROOM);

  // ================= CURRENT USER =================
  const userData = getUserData()?.data || null;

  // ================= FILTER ROOMS =================
  // Guests → only visible rooms
  // Logged in → see all rooms
  const visibleRooms = isLoggedIn
    ? rooms
    : rooms.filter((room) => room.isVisible);

  // ================= CHECK OWNER =================
  const isOwner = (room) => {
    return (
      userData?._id &&
      room.createdBy?._id &&
      userData._id === room.createdBy._id
    );
  };

  // ================= TOGGLE VISIBILITY =================
  const handleToggle = async (roomId) => {
    try {
      await toggleVisibility({ variables: { roomId } });
      refetch();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  // ================= DELETE ROOM =================
  const handleDelete = async (roomId) => {
    try {
      await deleteRoom({ variables: { roomId } });

      const roomName = rooms.find((r) => r._id === roomId)?.roomName || "Room";

      alert(`"${roomName}" deleted successfully!`);

      refetch();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ================= RENDER =================
  return (
    <>
      {/* ================= HEADER ================= */}
      <div
        style={{
          background: "linear-gradient(135deg, #ffb6c1, #add8e6)",
          padding: "60px 0",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Container>
          <h1 style={{ fontSize: "4rem", fontWeight: "600" }}>
            👶 Gender Reveal 🎉
          </h1>

          <p>Cast your guess and join the fun!</p>

          {/* Show create button if logged in */}
          {isLoggedIn && userData && (
            <Button
              as={Link}
              to={`/createRoom/${userData._id}`}
              variant="light"
              style={{ marginTop: "20px", fontWeight: "600" }}
            >
              ➕ Create Room
            </Button>
          )}
        </Container>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <Container style={{ marginTop: "40px" }}>
        {/* Title */}
        <h2 className="text-center mb-4">
          {loading
            ? "Loading rooms..."
            : visibleRooms.length
              ? `🎈 ${visibleRooms.length} Rooms Available`
              : "No rooms available"}
        </h2>

        {/* Error */}
        {error && (
          <p className="text-danger text-center">Error loading rooms</p>
        )}

        {/* Guest fallback */}
        {!isLoggedIn && !loading && visibleRooms.length === 0 && (
          <p className="text-center text-muted">
            ❌ No rooms available. Please contact the admin.
          </p>
        )}

        {/* ================= ROOM LIST ================= */}
        <Row>
          {visibleRooms.map((room) => {
            // ✅ FIX: store result of isOwner
            const owner = isOwner(room);

            return (
              <Col md="4" key={room._id} className="mb-4">
                <Card
                  style={{
                    borderRadius: "20px",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                    border: "none",
                  }}
                >
                  <Card.Body style={{ textAlign: "center" }}>
                    {/* Room name */}
                    <Card.Title
                      style={{ fontSize: "1.5rem", fontWeight: "600" }}
                    >
                      🎀 {room.roomName}
                      <p style={{ fontSize: "0.9rem", color: "#ff69b4" }}>
                        by {room.createdBy?.username || "Unknown"}
                      </p>
                    </Card.Title>

                    {/* Room code */}
                    <p>
                      <strong>Code:</strong>{" "}
                      <span style={{ color: "#ff69b4" }}>{room.roomCode}</span>
                    </p>

                    {/* Visibility */}
                    <p>
                      <strong>Visible:</strong>{" "}
                      {room.isVisible ? "👀 Open" : "🔒 Closed"}
                    </p>

                    {/* Result */}
                    <p>
                      <strong>Result:</strong>{" "}
                      {room.actualResult
                        ? room.actualResult === "boy"
                          ? "💙 Boy!"
                          : "💖 Girl!"
                        : "❓ Not revealed"}
                    </p>

                    {/* ================= BUTTONS ================= */}
                    <div className="d-flex justify-content-center gap-2">
                      {/* Join button (everyone) */}
                      <Button
                        as={Link}
                        to={`/public/joinroom/${room.roomCode}`}
                      >
                        🚪 Join Room
                      </Button>

                      {/* Owner-only buttons */}
                      {owner && (
                        <>
                          <Button
                            variant={room.isVisible ? "danger" : "success"}
                            onClick={() => handleToggle(room._id)}
                          >
                            {room.isVisible ? "Close Room" : "Open Room"}
                          </Button>

                          <Button
                            variant="outline-danger"
                            onClick={() => handleDelete(room._id)}
                          >
                            🗑️ Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
}

export default Roomlist;
