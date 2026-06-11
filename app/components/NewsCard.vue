<template>
  <article class="news-card group">
    <div class="news-thumb">
      <img :src="image" :alt="headline" loading="lazy" />
    </div>
    <div class="news-copy">
      <span class="news-tag">{{ category }}</span>
      <h3>{{ headline }}</h3>
      <p>{{ summary }}</p>
      <button type="button" class="btn btn-tertiary">Read More</button>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps({
  category: { type: String, required: true },
  headline: { type: String, required: true },
  summary: { type: String, required: true },
  image: { type: String, required: true }
})
</script>
