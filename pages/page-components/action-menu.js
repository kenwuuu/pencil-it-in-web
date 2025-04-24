class ActionMenu extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div
        class="action-menu"
        hx-get="mocks/action_menu/events.html"
        hx-trigger="load"
        hx-target=".action-menu-inner"
      >
        <div class="action-menu-inner not-prose"></div>
      </div>
    `;
  }
}

customElements.define('action-menu', ActionMenu);
