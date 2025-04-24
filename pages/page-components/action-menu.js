class ActionMenu extends HTMLElement {
  connectedCallback() {
    const endpoint = this.getAttribute('src') || 'mocks/action_menu/events.html';
    const filename = endpoint
      .split('/')
      .pop()
      .replace(/\.[^/.]+$/, ''); // e.g., "events"
    const htmxSwapTargetId = `menu-inner-${filename}`;

    this.innerHTML = `
      <div
        class="action-menu"
        hx-get="${endpoint}"
        hx-trigger="load"
        hx-target="#${htmxSwapTargetId}"
      >
        <div id="${htmxSwapTargetId}" class="action-menu-inner not-prose"></div>
      </div>
    `;
  }
}

customElements.define('action-menu', ActionMenu);
