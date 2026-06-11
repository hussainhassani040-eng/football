<template>
  <article class="league-card group">
    <div class="league-icon"><span>{{ logo }}</span></div>
    <div>
      <h3>{{ league }}</h3>
      <p>{{ description }}</p>
    </div>
    <button type="button" class="btn btn-secondary">Latest updates</button>
  </article>
</template>

<script setup lang="ts">
const props = defineProps({
  league: { type: String, required: true },
  description: { type: String, required: true },
  logo: { type: String, required: true }
})
</script>
