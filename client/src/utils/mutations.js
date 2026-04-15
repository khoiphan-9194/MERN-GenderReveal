import { gql } from "@apollo/client";

export const MUTATION_REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const MUTATION_LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const MUTATION_CREATE_ROOM = gql`
  mutation CreateRoom($input: CreateRoomInput!) {
    createRoom(input: $input) {
      _id
      roomName
      roomCode
      isVisible
    }
  }
`;

export const MUTATION_TOGGLE_VISIBILITY = gql`
  mutation ToggleRoomVisibility($roomId: ID!) {
    toggleRoomVisibility(roomId: $roomId) {
      _id
      isVisible
    }
  }
`;

export const MUTATION_REVEAL_RESULT = gql`
  mutation RevealResult($roomId: ID!, $result: GenderGuess!) {
    revealResult(roomId: $roomId, result: $result) {
      _id
      actualResult
      isVisible
    }
  }
`;

export const MUTATION_SUBMIT_VOTE = gql`
  mutation SubmitVote($input: SubmitVoteInput!) {
    submitVote(input: $input) {
      _id
      voterName
      guess
      reason
      roomId
    }
  }
`;

export const MUTATION_DELETE_ROOM = gql`
  mutation DeleteRoom($roomId: ID!) {
    deleteRoom(roomId: $roomId) {
      _id
    }
  }
`;