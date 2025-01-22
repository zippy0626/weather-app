import fetcher from "./Fetcher.js"

const Controller = {
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
          const data = await fetcher.getDailyWeather(query);
          console.log(data)
        } catch (error) {
          throw error;
        }
      }
    });
  },
};

export default Controller;
