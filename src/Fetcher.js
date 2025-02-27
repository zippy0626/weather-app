import { format } from "date-fns";
import { addDays } from "date-fns";

const Fetcher = {
  k: `8TVX7CLKQ9TNDWBRZ96G9QW4D`,

  resetIsRequesting() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.isRequesting = false;
    }, this.LIMITMS);
  },

  getMilitaryTime() {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  },

  getUserCoordinates() {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
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

          reject(new Error(message));
        }

        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        };

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

  async getDailyData(location) {
    const startDate = format(new Date(), "yyyy-MM-dd");
    const endDate = format(addDays(new Date(), 1), "yyyy-MM-dd");

    if (!location) {
      throw new Error("Please provide a location parameter.");
    }

    const link = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location.toString()}/${startDate}/${endDate}?key=${
      this.k
    }`;

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
      throw error;
    }
  },

  async getWeeklyData(location) {
    const startDate = format(new Date(), `yyyy-MM-dd`);
    const endDate = format(addDays(new Date(), 6), `yyyy-MM-dd`);

    if (!location) {
      throw new Error("Please provide a location parameter.");
    }

    const link = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location.toString()}/${startDate}/${endDate}?key=${
      this.k
    }`;

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
      throw error;
    }
  },
};

export default Fetcher;
