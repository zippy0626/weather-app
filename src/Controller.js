import Fetcher from "./Fetcher.js";
import Updater from "./Updater.js";
import ModalMaker from "./Modal.js";

const Controller = {
  isSearchErrorMsgShown: false,

  async init() {
    this.handleTimelineResize();
    this.handleSearchBar();
    try {
      //user allows location
      const [long, lat] = await Fetcher.getUserCoordinates();
      const data = await Fetcher.getDailyData([long, lat]);
      console.log(data, "regular data");
      Updater.updateToday(data);

      ModalMaker.hideModal();
      localStorage.removeItem("dontShowAgain");
    } catch (error) {
      //user denies location
      const defaultAddress = "Manhattan, NY";
      const data = await Fetcher.getDailyData(defaultAddress);
      Updater.updateToday(data);

      //dont show again
      if (localStorage.getItem("dontShowAgain")) {
        ModalMaker.hideModal();
      } else {
        ModalMaker.showLocationAccessDisabledModal();
        this.handleModalButtons();
      }

      throw error;
    }
  },

  handleSearchBar() {
    const searchBar = document.querySelector("#search-bar");
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && e.target !== searchBar) {
        e.preventDefault();
        searchBar.focus();
        searchBar.select();
      }
    });

    searchBar.addEventListener("keydown", async (e) => {
      if (e.key === "Enter" && e.target === searchBar) {
        e.preventDefault();
        searchBar.blur();

        if (!searchBar.value.trim()) return;
        const query = searchBar.value.trim();

        try {
          const data = await Fetcher.getDailyData(query);
          Updater.updateToday(data);
        } catch (error) {
          throw error;
        } finally {
          this.showSearchError(4000);
        }
      }
    });
  },

  showSearchError(MILLISECONDS) {
    if (this.isSearchErrorMsgShown) return;
    const errorMsg = document.querySelector(".error-msg");

    errorMsg.classList.remove("hidden");
    this.isSearchErrorMsgShown = true;

    setTimeout(() => {
      errorMsg.classList.add("hidden");
      this.isSearchErrorMsgShown = false;
    }, MILLISECONDS);
  },

  handleModalButtons() {
    const modalBtnContainer = document.querySelector(".modal-buttons");
    modalBtnContainer.addEventListener("click", (e) => {
      const target = e.target;
      if (target.type !== "button") return;

      if (target.textContent === "Ok") {
        ModalMaker.hideModal();
      } else {
        localStorage.setItem("dontShowAgain", true);
        ModalMaker.hideModal();
      }
    });
  },

  handleTimelineResize() {
    function test(mediaQuery) {
      if (mediaQuery.matches) {
        const hourlyTimeline = document.querySelector("#hourly-info");
        hourlyTimeline.style.justifyContent = "start";
      } else {
        const hourlyTimeline = document.querySelector("#hourly-info");
        hourlyTimeline.style.justifyContent = "center";
      }
    }

    const mediaQuery = window.matchMedia("(max-width: 1000px)");

    test(mediaQuery);

    mediaQuery.addEventListener("change", () => {
      test(mediaQuery);
    });
  },
};

export default Controller;
