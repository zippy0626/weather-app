import { format } from "date-fns";
import { addDays } from "date-fns";
import Controller from "./Controller.js";

function Fetcher() {
  const k = `8TVX7CLKQ9TNDWBRZ96G9QW4D`;

  return {
    getUserCoordinates() {
      return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
          //callback fns for geolocation
          function handleSuccess(position) {
            const userCoords = [
              position.coords.latitude,
              position.coords.longitude,
            ];
            resolve(userCoords);
          }

          function handleError(err) {
            const messages = {
              1: "Location access denied. Please enable location services in your browser settings.",
              2: "Location unavailable. Please check your internet connection or try again later.",
              3: "Request timed out. Please try again.",
            };

            const message = messages[err.code] || "An unknown error occurred.";

            alert(message); // Replace with a custom UI notification if needed
            reject(new Error(message));
          }

          const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          };
          //

          navigator.geolocation.getCurrentPosition(
            handleSuccess,
            handleError,
            options
          );
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      });
    },

    getReadableUserLocation(lat, long) {}, //least priority right now

    async getDailyWeather(location) {
      const formattedDate = format(new Date(), "yyyy-MM-dd");

      if (!location) {
        throw new Error("Please provide a location parameter.");
      }

      const link = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location.toString()}/${formattedDate}?key=${k}`;

      try {
        const response = await fetch(link);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch weather data.\nStatus: ${
              response.status
            }\nMessage: ${response.statusText || "No details available."}`
          );
        }
        return await response.json();
      } catch (error) {
        Controller.showSearchError(4000);
        throw error;
      }
    },

    async getWeeklyWeather(location) {
      const startDate = format(new Date(), `yyyy-MM-dd`);
      const endDate = format(addDays(new Date(), 6), `yyyy-MM-dd`);

      if (!location) {
        throw new Error("Please provide a location parameter.");
      }

      const link = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location.toString()}/${startDate}/${endDate}?key=${k}`;

      try {
        const response = await fetch(link);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch weather data.\nStatus: ${
              response.status
            }\nMessage: ${response.statusText || "No details available."}`
          );
        }

        return await response.json();
      } catch (error) {
        Controller.showSearchError(4000);
        throw error;
      }
    },
  };
}

const fetcher = Fetcher();
export default fetcher;
