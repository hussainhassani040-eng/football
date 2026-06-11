<template>
  <article class="player-card group">
    <div class="player-header">
      <span class="player-position">{{ position }}</span>
      <span class="player-rating">{{ rating }}</span>
    </div>
    <h3>{{ name }}</h3>
    <p class="player-team">{{ team }}</p>
    <p class="player-summary">{{ summary }}</p>
  </article>
</template>

<script setup lang="ts">
const props = defineProps({
  name: { type: String, required: true },
  position: { type: String, required: true },
  team: { type: String, required: true },
  rating: { type: [String, Number], required: true },
  summary: { type: String, required: true }
})
</script>
