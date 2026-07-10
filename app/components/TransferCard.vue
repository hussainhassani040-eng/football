<template>
  <article class="transfer-card group">
    <div class="transfer-top">
      <span class="transfer-player">{{ player }}</span>
      <span class="transfer-status">{{ status }}</span>
    </div>
    <div class="transfer-meta">
      <h3>{{ headline }}</h3>
      <p>{{ summary }}</p>
    </div>
    <button type="button" class="btn btn-tertiary">Follow Transfer</button>
  </article>
</template>

<script setup lang="ts">
const props = defineProps({
  player: { type: String, required: true },
  status: { type: String, required: true },
  headline: { type: String, required: true },
  summary: { type: String, required: true }
})
</script>