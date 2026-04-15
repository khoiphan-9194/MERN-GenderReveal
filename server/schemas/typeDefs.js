
const typeDefs = `#graphql

  # =========================
  # ENUMS
  # =========================

  enum GenderGuess {
    boy
    girl
  }



  # =========================
  # TYPES
  # =========================

  type User {
    _id: ID!
    username: String!
    email: String!
    rooms: [Room]   # resolved via createdBy
  }

  type Room {
    _id: ID!
    roomName: String!
    roomCode: String!
    isVisible: Boolean!
    actualResult: GenderGuess
    createdBy: User
    votes: [Vote]
  }

  type Vote {
    _id: ID!
    voterName: String!
    guess: GenderGuess!
    reason: String
    roomId: ID!
 
  }

  # =========================
  # AUTH TYPE
  # =========================

  type Auth {
    token: String!
    user: User
  }

  # =========================
  # INPUT TYPES
  # =========================

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateRoomInput {
    roomName: String!
  }

  input SubmitVoteInput {
    voterName: String!
    guess: GenderGuess!
    reason: String
    roomCode: String!
  }

  # =========================
  # QUERIES
  # =========================

  type Query {
    me: User

    # Admin: get all rooms
    rooms: [Room]

    # Guest: join room by code
    roomByCode(roomCode: String!): Room

    # Get votes in a room
    votesByRoom(roomId: ID!): [Vote]
  }

  # =========================
  # MUTATIONS
  # =========================

  type Mutation {

    # -------- AUTH --------
    register(input: RegisterInput!): Auth
    login(input: LoginInput!): Auth

    # -------- ROOM --------
    createRoom(input: CreateRoomInput!): Room
    toggleRoomVisibility(roomId: ID!): Room
    revealResult(roomId: ID!, result: GenderGuess!): Room
    deleteRoom(roomId: ID!):Room

    # -------- VOTE --------
    submitVote(input: SubmitVoteInput!): Vote
  }

`;

module.exports = typeDefs;