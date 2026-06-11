<template>
  <article class="team-card group">
    <div class="team-top">
      <span class="team-rank">#{{ rank }}</span>
      <span class="team-country">{{ country }}</span>
    </div>
    <div class="team-logo">{{ logo }}</div>
    <div class="team-body">
      <h3>{{ team }}</h3>
      <p>{{ summary }}</p>
    </div>
    <button type="button" class="btn btn-tertiary">View profile</button>
  </article>
</template>

<script setup lang="ts">
const props = defineProps({
  team: { type: String, required: true },
  rank: { type: Number, required: true },
  country: { type: String, required: true },
  summary: { type: String, required: true },
  logo: { type: String, required: true }
})
</script>
