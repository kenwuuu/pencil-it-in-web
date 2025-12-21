<template>
  <div>
    <div class="block xl:hidden">
      <button class="btn btn-md" @click="$emit('createEvent')">
        <a data-testid="create-event-button">Create Event</a>
      </button>
    </div>
    <div class="hidden xl:block">
      <ul class="action-menu">
        <li @click="$emit('createEvent')">
          <a class="sidebar-menu-item" data-testid="create-event-button">
            <iconify-icon icon="mdi:plus"></iconify-icon>
            Create Event
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Emits {
  (e: 'createEvent'): void
}

defineEmits<Emits>()
</script>