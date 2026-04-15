import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query Me {
    me {
      _id
      username
      email
      rooms {
        _id
        roomName
        roomCode
      }
    }
  }
`;

export const QUERY_ROOMS = gql`
  query GetRooms {
    rooms {
      _id
      roomName
      roomCode
      isVisible
      actualResult
      createdBy {
        _id
        username
      }
    }
  }
`;

export const QUERY_ROOM_BY_CODE = gql`
  query GetRoomByCode($roomCode: String!) {
    roomByCode(roomCode: $roomCode) {
      _id
      roomName
      isVisible
      actualResult
      createdBy {
        _id
      }
    }
  }
`;

export const QUERY_VOTES_BY_ROOM = gql`
  query GetVotesByRoom($roomId: ID!) {
    votesByRoom(roomId: $roomId) {
      _id
      voterName
      guess
      reason
    }
  }
`;