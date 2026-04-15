
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ROOM_BY_CODE, QUERY_VOTES_BY_ROOM } from "../../utils/queries";
import { useMainPageContext } from "../../utils/MainPageContext";

const RoomView = ({ roomCode }) => {
  const {
    isLoggedIn, // boolean: user logged in or not
    getUserData, // function to get logged-in user
  } = useMainPageContext();

  // =========================
  // 1. GET ROOM DATA
  // =========================
  const { data: roomData, loading: roomLoading } = useQuery(
    QUERY_ROOM_BY_CODE,
    {
      variables: { roomCode },
    },
  );
  // extract roomId from backend response
  const roomId = roomData?.roomByCode?._id;
  // =========================
  // Actual result stored in roomData
  // actual result stored in DB (boy/girl)
  const actualResult = roomData?.roomByCode?.actualResult;

  return (
    <div className="access-room-container">
      {/* ROOM TITLE */}
          <h2>{roomData?.roomByCode?.roomName}</h2>
          
      </div>
      

      
      
      
  );
};

export default RoomView;
