<template>
  <NuxtLink v-if="to" :to="to" class="news-card-link">
    <article class="news-card group">
      <div class="news-thumb">
        <img :src="image" :alt="headline" loading="lazy" />
        <span class="news-tag">{{ category }}</span>
      </div>
      <div class="news-copy">
        <h3>{{ headline }}</h3>
        <span class="news-meta">{{ date }} &bull; {{ readingTime }}</span>
        <p class="news-summary">{{ summary }}</p>
      </div>
    </article>
  </NuxtLink>
  <article v-else class="news-card group">
    <div class="news-thumb">
      <img :src="image" :alt="headline" loading="lazy" />
      <span class="news-tag">{{ category }}</span>
    </div>
    <div class="news-copy">
      <h3>{{ headline }}</h3>
      <span class="news-meta">{{ date }} &bull; {{ readingTime }}</span>
      <p class="news-summary">{{ summary }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps({
  category: { type: String, required: true },
  headline: { type: String, required: true },
  summary: { type: String, required: true },
  image: { type: String, required: true },
  to: { type: [String, Object], default: '' },
  date: { type: String, default: '' },
  readingTime: { type: String, default: '3 min read' }
})
</script>