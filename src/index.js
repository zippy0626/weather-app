import "./style.css";
import Controller from "./Controller.js";
import fetcher from "./Fetcher.js";
import Updater from "./Updater.js";

// setTimeout(() => {
//   Controller.init()
// }, 0); //make happen last

const timelineData = await fetcher.get12HourTimeline("Brooklyn")
Updater.updateTodayTimeline(timelineData)