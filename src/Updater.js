import day from "./assets/icons/amcharts_weather_icons_1.0.0/animated/day.svg";
import night from "./assets/icons/amcharts_weather_icons_1.0.0/animated/night.svg";
import cloudyDay from "./assets/icons/amcharts_weather_icons_1.0.0/animated/cloudy.svg";
import cloudyNight3 from "./assets/icons/amcharts_weather_icons_1.0.0/animated/cloudy-night-3.svg";
import partlyCloudyDay2 from "./assets/icons/amcharts_weather_icons_1.0.0/animated/cloudy-day-2.svg";
import partlyCloudyNight2 from "./assets/icons/amcharts_weather_icons_1.0.0/animated/cloudy-night-2.svg";
import rainyDay3 from "./assets/icons/amcharts_weather_icons_1.0.0/animated/rainy-3.svg";
import rainyNight6 from "./assets/icons/amcharts_weather_icons_1.0.0/animated/rainy-6.svg";
import snowyDay3 from "./assets/icons/amcharts_weather_icons_1.0.0/animated/snowy-3.svg";
import snowyNight5 from "./assets/icons/amcharts_weather_icons_1.0.0/animated/snowy-5.svg";

const Updater = {
  roundStrToWholeNum(str) {
    return Math.round(Number(str));
  },

  getMilitaryTime() {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  },

  getWeatherIconSrcAndAlt(data) {
    const condition = data.currentConditions
      ? data.currentConditions.conditions.toLowerCase()
      : data.conditions.toLowerCase(); //hour data

    if (condition.includes("clear")) {
      return [day, "Clear Day"];
    }
    if (
      (condition.includes("cloudy") || condition.includes("overcast")) &&
      !(condition.includes("snow") || condition.includes("rain"))
    ) {
      return [cloudyDay, "Cloudy Day"];
    }
    if (condition.includes("cloudy") && condition.includes("partial")) {
      return [partlyCloudyDay2, "Partly Day"];
    }
    if (condition.includes("rain") && !condition.includes("snow")) {
      return [rainyDay3, "Rainy Day"];
    }
    if (condition.includes("snow")) {
      return [snowyDay3, "Snowy Day"];
    }

    //fallback
    return ["", ""];
  },

  updateTodayInfo(data) {
    const currentTime = this.getMilitaryTime();

    const location = document.querySelector(".weather-location");
    const condition = document.querySelector(".weather-condition");
    const currentTemp = document.querySelector(".weather-temp");
    const flTemp = document.querySelector(".weather-fl-temp");
    const weatherSymbol = document.querySelector(".weather-symbol");

    location.textContent = data.resolvedAddress;
    condition.textContent = data.currentConditions.conditions;

    //get first 2 digits of military time and plug it in
    let temp = this.roundStrToWholeNum(
      data.days[0].hours[currentTime.slice(0, 2)].temp
    );
    let fltemp = this.roundStrToWholeNum(
      data.days[0].hours[currentTime.slice(0, 2)].feelslike
    );

    currentTemp.textContent = temp + ` F°`;
    flTemp.textContent = `Feels like ${fltemp} F°`;

    const [src, alt] = this.getWeatherIconSrcAndAlt(data);
    weatherSymbol.src = src;
    weatherSymbol.alt = alt;
  },

  updateTodayAlerts(data) {
    function makeAlert(alertData) {
      const alert = document.createElement("div");
      alert.classList.add("alert", "flex-col-wrapper");

      const eventTitle = document.createElement("h3");
      eventTitle.classList.add("alert-event-title");
      eventTitle.textContent = alertData.event;

      const headLine = document.createElement("p");
      headLine.classList.add("alert-headline");
      headLine.textContent = alertData.headline;

      const desc = document.createElement("p");
      desc.classList.add("alert-description");
      desc.innerHTML = alertData.description.replaceAll("\n\n", "<br>");

      alert.appendChild(eventTitle);
      alert.appendChild(headLine);
      alert.appendChild(desc);

      return alert;
    }

    const alertContainer = document.querySelector(".alert-container");
    const todaysAlerts = document.querySelector(".weather-today-alerts");

    if (data.alerts && data.alerts.length) {
      if (data.alerts.length > 1) {
        todaysAlerts.style.width = `500px`;
        todaysAlerts.style.height = `350px`;
      }

      alertContainer.innerHTML = `<div class="no-active-alerts hidden">No Alerts At This Time.</div>`;

      for (const alertData of data.alerts) {
        const alert = makeAlert(alertData);
        alertContainer.appendChild(alert);
      }
    } else {
      todaysAlerts.style.width = `450px`;
      todaysAlerts.style.height = `300px`;

      alertContainer.innerHTML = `<div class="no-active-alerts">No Alerts At This Time.</div>`;
    }
  },

  updateTodayTimeline(data) {
    const currentTime = Number(this.getMilitaryTime().slice(0, 2));

    let hours1 = data.days[0].hours;
    let hours2 = data.days[1].hours;
    hours1 = hours1.splice(currentTime, hours1.length);
    hours2 = hours2.splice(0, 16 - hours1.length + 1);

    //combine and return even times.
    let timeline = Array.prototype.concat(hours1, hours2).filter((time) => {
      return Number(time.datetime.slice(0, 2)) % 2 === 0;
    });

    let hourlyTimeline = document.querySelector("#hourly-info");
    hourlyTimeline.innerHTML = ``;
    for (const time of timeline) {
      const timeIndex = new Date(time.datetimeEpoch * 1000)
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .replace(/:\d{2}\s/, "");
      const [src, alt] = this.getWeatherIconSrcAndAlt(time);
      const conditions = time.conditions;
      const temp = Math.round(time.temp);
      const windSpeed = Math.round(time.windspeed);
      const precipChance = Math.round(time.precipprob);
      const humidity = Math.round(time.humidity);

      //after 10pm is a tomorrow divider
      const cardTemplate =
        timeIndex === "10PM"
          ? `
      <div class="card flex-col-wrapper">
        <p class="current-time time">${timeIndex}</p>
        <img src="${src}" alt="${alt}" class="card-weather-symbol" draggable="false">
        <p class="card-current-conditions">${conditions}</p>
        <p class="card-temperature">${temp} F°</p>
        <p class="card-wind-speed">${windSpeed} mph</p>
        <p class="card-rain-chance">${precipChance}% rain</p>
        <p class="card-humidity">${humidity}% humid</p>
      </div>
      <div class="tomorrow-divider">Tomorrow</div>
      `
          : `
      <div class="card flex-col-wrapper">
        <p class="current-time time">${timeIndex}</p>
        <img src="${src}" alt="${alt}" class="card-weather-symbol" draggable="false">
        <p class="card-current-conditions">${conditions}</p>
        <p class="card-temperature">${temp} F°</p>
        <p class="card-wind-speed">${windSpeed} mph</p>
        <p class="card-rain-chance">${precipChance}% rain</p>
        <p class="card-humidity">${humidity}% humid</p>
      </div>
      `;

      hourlyTimeline.innerHTML += cardTemplate;
    }
  },

  updateToday(data) {
    this.updateTodayInfo(data);
    this.updateTodayAlerts(data);
    this.updateTodayTimeline(data);
  },
};

export default Updater;
