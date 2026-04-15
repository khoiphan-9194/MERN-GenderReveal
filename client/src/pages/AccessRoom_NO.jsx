import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import MainPageProvider from "../utils/MainPageContext";


import { QUERY_ROOM_BY_CODE, QUERY_VOTES_BY_ROOM } from "../utils/queries";

import {
  MUTATION_SUBMIT_VOTE,
  MUTATION_REVEAL_RESULT,
} from "../utils/mutations";

import Auth from "../utils/auth";

import RoomView from "./props/RoomView";

const AccessRoom = () => {
  // =========================
  // 1. GET ROOM CODE FROM URL
  // =========================
  // Example URL: /room/ABC123 → roomCode = "ABC123"
  const { roomCode } = useParams();

  return (
    <div>
      <MainPageProvider>
        <RoomView roomCode={roomCode}/>
      </MainPageProvider>

      </div>
  );
};

export default AccessRoom;
