// Utility functions for storing and retrieving visitor info in localStorage

/**
 * Fetches the user's IP address from a public API.
 * @returns {Promise<string|null>} The IP address or null if fetch fails.
 */
export const getUserIpAddress = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return null;
  }
};

/**
 * Stores visitor info in localStorage.
 * @param {Object} info - The visitor info object to store.
 */
export const setVisitorInfo = (info) => {
  try {
    localStorage.setItem("visitorInfo", JSON.stringify(info));
  } catch (error) {
    console.error("Error storing visitor info:", error);
  }
};

/**
 * Retrieves visitor info from localStorage.
 * @returns {Object|null} The visitor info object or null if not found.
 */
export const getVisitorInfo = () => {
  try {
    const info = localStorage.getItem("visitorInfo");
    return info ? JSON.parse(info) : null;
  } catch (error) {
    console.error("Error retrieving visitor info:", error);
    return null;
  }
};

/**
 * Clears visitor info from localStorage.
 */
export const clearVisitorInfo = () => {
  try {
    localStorage.removeItem("visitorInfo");
  } catch (error) {
    console.error("Error clearing visitor info:", error);
  }
};
