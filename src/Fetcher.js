function Fetcher() {
  const k = `8TVX7CLKQ9TNDWBRZ96G9QW4D`;

  return {
    getUserCoordinates() {
      if ("geolocation" in navigator) {
        return new Promise((resolve, reject) => {
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

          navigator.geolocation.getCurrentPosition(
            handleSuccess,
            handleError,
            options
          );
        });
      } else {
        throw new Error(
          "Geolocation object not found, cannot get User coordinates."
        );
      }
    },

    async getWeatherDataToday(location) {
      //fix getting date later
      let [month, date, year] = new Date().toLocaleDateString().split("/");
      if (month.length === 1) month = `0` + month;
      let formattedDate = `${year}-${month}-${date}`;

      try {
        if (!location) {
          throw new Error("Please provide a location parameter.");
        }

        const link = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location.toString()}/${formattedDate}?key=${k}`;

        const response = await fetch(link);

        if (!response.ok) {
          throw new Error(`HTTP error. Status: ${response.status}`);
        } else {
          const json = await response.json();
          return json;
        }
      } catch (error) {
        console.log(
          `Error fetching weather data from location: ${location}, on date: ${formattedDate}\n`
        );
        throw error;
      }
    },
  };
}

const fetcher = Fetcher();
export default fetcher;
