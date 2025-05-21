class SettingsContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <div
        class="prose page-container px-8 sm:px-16"
      >
        <h1 x-text="capitalize(page)"></h1>
      </div>
    `;
    }
}

customElements.define('settings-container', SettingsContainer);
