import { useEffect, useState, createContext, useContext } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_ROOMS } from "./queries";
import Auth from "./auth";

export const MainPageContext = createContext();
export const useMainPageContext = () => useContext(MainPageContext);

export default function MainPageProvider({ children }) {
  const { loading, error, data, refetch } = useQuery(QUERY_ROOMS);

  const [rooms, setRooms] = useState([]);

  const roomsData = data?.rooms || [];

  const isLoggedIn = Auth.loggedIn();

  const khoi = 10;

  function getUserData() {
    if (isLoggedIn) {
      return Auth.getProfile();
    }
    return null;
  }

  useEffect(() => {
    setRooms(roomsData);
  }, [roomsData]);

  // ===============================
  // 🔥 IMPORTANT FIX HERE
  // ===============================
  // NEVER skip Provider when loading
  // ALWAYS provide context values

  return (
    <MainPageContext.Provider
      value={{
        rooms,
        refetch, // ✅ now always available
        isLoggedIn,
        error,
        loading,
        getUserData,
        khoi
      }}
    >
      {/* optional loading UI (does NOT break context anymore) */}
      {loading ? <p>Loading....</p> : children}
    </MainPageContext.Provider>
  );
}
