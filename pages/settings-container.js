class SettingsContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="prose">
      SETTINGS
      </div>
    `;
  }
}

customElements.define('settings-container', SettingsContainer);
