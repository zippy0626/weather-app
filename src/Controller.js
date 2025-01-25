import fetcher from "./Fetcher.js";
import Updater from "./Updater.js";

const Controller = {
  isSearchErrorMsgShown: false,

  async init() {
    this.handleSearchBar();
    try {
      const [long, lat] = await fetcher.getUserCoordinates();
      const data = await fetcher.getDailyData([long, lat]);
      Updater.updateToday(data);
    } catch (error) {
      const defaultAddress = "Brooklyn, NY";
      const data = await fetcher.getDailyData(defaultAddress);
      Updater.updateToday(data);
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
          const data = await fetcher.getDailyData(query);
          Updater.updateToday(data)
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
};

export default Controller;
