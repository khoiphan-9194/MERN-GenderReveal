// ===============================
// 1. IMPORT MODELS + HELPERS
// ===============================

// Import database models (like tables in SQL)
const { User, Room, Vote } = require("../models");

// Import helper functions:
// signToken → creates login token (JWT)
// AuthenticationError → custom error for login problems
const { signToken, AuthenticationError } = require("../utils/auth");

// ===============================
// 2. GRAPHQL RESOLVERS
// ===============================
// Resolvers = functions that run when frontend asks GraphQL API

const resolvers = {
  // ===============================
  // 3. QUERIES (GET DATA)
  // ===============================
  Query: {
    // ---------------------------
    // GET CURRENT LOGGED IN USER
    // ---------------------------
    me: async (parent, args, context) => {
      // check if user exists in request (from JWT token)
      if (!context.user) {
        throw new AuthenticationError("Not logged in");
      }

      // find user in database using their id
      return User.findById(context.user._id);
    },

    // ---------------------------
    // GET ALL ROOMS
    // ---------------------------
    rooms: async () => {
      // return every room from database
      return Room.find();
    },

    // ---------------------------
    // GET ONE ROOM BY CODE
    // ---------------------------
    roomByCode: async (parent, { roomCode }) => {
      // find room where roomCode matches
      // populate(createdBy) means also load user info
      return Room.findOne({ roomCode }).populate("createdBy");
    },

    // ---------------------------
    // GET ALL VOTES FOR A ROOM
    // ---------------------------
    votesByRoom: async (parent, { roomId }) => {
      // find all votes that belong to this room
      return Vote.find({ roomId });
    },
  },

  // ===============================
  // 4. MUTATIONS (CHANGE DATA)
  // ===============================
  Mutation: {
    // ===========================
    // AUTH - REGISTER NEW USER
    // ===========================
    register: async (parent, { input }) => {
      // create new user in database
      const user = await User.create(input);

      // create login token for user
      const token = signToken(user);

      // return both token + user info
      return { token, user };
    },

    // ===========================
    // AUTH - LOGIN USER
    // ===========================
    login: async (parent, { input }) => {
      // get email and password from input
      const { email, password } = input;

      // find user by email
      const user = await User.findOne({ email });

      // if user not found → error
      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }

      // check if password is correct
      const correctPw = await user.isCorrectPassword(password);

      // if password wrong → error
      if (!correctPw) {
        throw new AuthenticationError("Invalid credentials");
      }

      // create token if login is correct
      const token = signToken(user);

      // return token + user
      return { token, user };
    },

    // ===========================
    // CREATE ROOM
    // ===========================
    createRoom: async (parent, { input }, context) => {
      // check if user is logged in
      if (!context.user) {
        throw new AuthenticationError("Login required");
      }

      // generate random room code like "A1B2C3"
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // create room in database
      const room = await Room.create({
        roomName: input.roomName,
        roomCode, // generated above
        createdBy: context.user._id, // owner of room
      });

      return room;
    },

    // ===========================
    // TOGGLE ROOM VISIBILITY
    // ===========================
    toggleRoomVisibility: async (parent, { roomId }, context) => {
      // must be logged in
      if (!context.user) {
        throw new AuthenticationError("Login required");
      }

      // find room by id
      const room = await Room.findById(roomId);

      // flip true → false OR false → true
      room.isVisible = !room.isVisible;

      // save changes to database
      await room.save();

      return room;
    },

    // ===========================
    // REVEAL FINAL RESULT
    // ===========================
    revealResult: async (parent, { roomId, result }, context) => {
      // must be logged in
      if (!context.user) {
        throw new AuthenticationError("Login required");
      }

      // find room
      const room = await Room.findById(roomId);

      // save final result (example: "Male / Female / Yes / No")
      room.actualResult = result;

      // make room visible
      room.isVisible = true;

      await room.save();

      return room;
    },

    // ===========================
    // DELETE ROOM
    // ===========================
    deleteRoom: async (parent, { roomId }, context) => {
      // must be logged in
      if (!context.user) {
        throw new AuthenticationError("Login required");
      }

      // find room first
      const room = await Room.findById(roomId);

      // if room doesn't exist → error
      if (!room) {
        throw new Error("Room not found");
      }

      // delete room from database
      await Room.findByIdAndDelete(roomId);

      // delete all votes inside that room
      await Vote.deleteMany({ roomId });

      return room;
    },

    // ===========================
    // SUBMIT VOTE
    // ===========================
   submitVote: async (parent, { input }) => {
  const { voterName, guess, reason, roomCode } = input;

  // 1. Find room
  const room = await Room.findOne({ roomCode });

  if (!room) {
    throw new Error("Room not found");
  }

  if (!room.isVisible) {
    throw new Error("Voting is closed");
  }

  // 2. 🔥 CHECK IF USER ALREADY VOTED
  const existingVote = await Vote.findOne({
    roomId: room._id,
    voterName: voterName, // 👈 key check
  });

     if (existingVote) {
    
    throw new Error("You already voted in this room");
  }

  // 3. Create vote if not exists
  const vote = await Vote.create({
    voterName,
    guess,
    reason,
    roomId: room._id,
  });

  return vote;
},
  },

  // ===============================
  // 5. FIELD RESOLVERS
  // (help connect data together)
  // ===============================

  User: {
    // when asking user.rooms → get all rooms they created
    rooms: async (parent) => {
      return Room.find({ createdBy: parent._id });
    },
  },

  Room: {
    // when asking room.createdBy → get user info
    createdBy: async (parent) => {
      return User.findById(parent.createdBy);
    },

    // when asking room.votes → get all votes in this room
    votes: async (parent) => {
      return Vote.find({ roomId: parent._id });
    },
  },
};

// export resolvers so Apollo Server can use them
module.exports = resolvers;
