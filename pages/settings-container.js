class SettingsContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div
        class="prose page-container"
      >
        <h1 x-text="capitalize(page)"></h1>
      </div>
    `;
  }
}

customElements.define('settings-container', SettingsContainer);
