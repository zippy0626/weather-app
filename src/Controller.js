import fetcher from "./Fetcher.js";

const Controller = {
  isSearchErrorMsgShown: false,

  async init() {
    this.handleSearchBar();
  },

  handleSearchBar() {
    const searchBar = document.querySelector("#search-bar");
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && e.target !== searchBar) {
        e.preventDefault();
        searchBar.focus();
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
          console.log(data); //handle data here
        } catch (error) {
          this.showSearchError(4000);
          throw error;
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
