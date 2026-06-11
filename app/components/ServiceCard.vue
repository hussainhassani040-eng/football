<template>
  <article class="service-card group">
    <div class="service-icon" aria-hidden="true" v-html="iconSvg"></div>
    <h3 class="service-title">{{ title }}</h3>
    <p class="service-text">{{ description }}</p>
    <ul class="service-list" role="list">
      <li v-for="item in features" :key="item" class="service-feature">
        <span class="feature-dot"></span>
        <span>{{ item }}</span>
      </li>
    </ul>
    <button type="button" class="btn btn-secondary">Learn More</button>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: { type: Array, required: true },
  icon: { type: String, required: true }
})

const icons = {
  growth: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M4 19h16"/><path d="M18 15l-3-3-2 2-4-4-3 3"/></svg>`,
  strategy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M9 4h6"/><path d="M12 4v5"/><path d="M9 9h6"/><path d="M5 20h14"/><path d="M6 17l3 3 3-3"/><path d="M18 16v4"/></svg>`,
  support: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M18 10a6 6 0 0 0-12 0v5a6 6 0 0 0 12 0v-5z"/><path d="M9 10v-1a3 3 0 0 1 6 0v1"/><path d="M12 16v.01"/></svg>`,
  default: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2 2"/></svg>`
}

const iconSvg = computed(() => icons[props.icon] || icons.default)
</script>
