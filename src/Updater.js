const Updater = {
  roundStrToWholeNum(str) {
    return Math.round(Number(str));
  },

  getMilitaryTime() {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date());
  },

  updateTodayInfo(data) {
    const currentTime = this.getMilitaryTime();

    const location = document.querySelector(".weather-location");
    const currentTemp = document.querySelector(".weather-temp");
    const flTemp = document.querySelector(".weather-fl-temp");
    const weatherSymbol = document.querySelector(".weather-symbol");

    location.textContent = data.resolvedAddress;

    //get first 2 digits of military time
    let temp = this.roundStrToWholeNum(data.days[0].hours[currentTime.slice(0,2)].temp)
    let fltemp = this.roundStrToWholeNum(data.days[0].hours[currentTime.slice(0,2)].feelslike)

    currentTemp.textContent = temp + ` F°`;
    flTemp.textContent = `Feels like ${fltemp} F°`
  },

  updateTodayAlerts(data) {},
};

export default Updater;
