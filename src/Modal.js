const ModalMaker = {
  showModal(msg, title) {//just in case
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector(".overlay");

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    modal.innerHTML = `
    <h2>${title}</h2>
    <p>${msg}</p>
    <div class="modal-buttons flex-row-wrapper">
      <button type="button">Ok</button>
    </div>
    `;
  },

  hideModal() {
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector(".overlay");

    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  },

  showLocationAccessDisabledModal() {
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector(".overlay");

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    modal.innerHTML = `
    <h2>Location access is disabled</h2>
    <p>Consider enabling location access in your browser if you need a more accurate location reading.</p>
    <div class="modal-buttons flex-row-wrapper">
      <button type="button">Ok</button>
      <button type="button">Don't Show Again</button>
    </div>
    `;
  },
};

export default ModalMaker;
