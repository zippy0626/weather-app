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

  updateTodayInfo(data) {
    const currentTime = this.getMilitaryTime();

    const location = document.querySelector(".weather-location");
    const currentTemp = document.querySelector(".weather-temp");
    const flTemp = document.querySelector(".weather-fl-temp");
    const weatherSymbol = document.querySelector(".weather-symbol");

    location.textContent = data.resolvedAddress;

    //get first 2 digits of military time and plug it in
    let temp = this.roundStrToWholeNum(
      data.days[0].hours[currentTime.slice(0, 2)].temp
    );
    let fltemp = this.roundStrToWholeNum(
      data.days[0].hours[currentTime.slice(0, 2)].feelslike
    );

    currentTemp.textContent = temp + ` F°`;
    flTemp.textContent = `Feels like ${fltemp} F°`;
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
    hours2 = hours2.splice(0, currentTime + 1);

    let timeline = Array.prototype.concat(hours1, hours2).filter((time) => {
      return Number(time.datetime.slice(0, 2)) % 2 === 0;
    });

    let hourlyTimeline = document.querySelector("#hourly-info");
    hourlyTimeline.innerHTML = ``;

    for (const time of timeline) {
      //epoch is MS 
      const timeIndex = new Date(time.datetimeEpoch * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }).replace(/:\d{2}\s/, "");

      const conditions = time.conditions
      const temp = Math.round(time.temp);
      const windSpeed = Math.round(time.windspeed);
      const precipChance = Math.round(time.precipprob);
      const humidity = Math.round(time.humidity);

      const cardTemplate = `
      <div class="card flex-col-wrapper">
        <p class="current-time time">${timeIndex}</p>
        <img src="2164d3c4f5b55bd11f03.svg" alt="cloudy Day" class="card-weather-symbol" draggable="false">
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
