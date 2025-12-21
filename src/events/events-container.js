import { createApp } from 'vue';
import { createPinia } from 'pinia';
import EventsContainer from '../../vue-app/src/events/events-container.vue';

class EventsContainerElement extends HTMLElement {
  connectedCallback() {
    const app = createApp(EventsContainer);
    const pinia = createPinia();
    app.use(pinia);
    app.mount(this);
  }
}

customElements.define('events-container', EventsContainerElement);
