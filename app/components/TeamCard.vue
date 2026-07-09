<template>
  <article class="team-card group" :style="cardStyles">
    <div class="team-card__top">
      <span class="team-card__rank">#{{ rank }}</span>
      <span class="team-card__chip">{{ league || 'League' }}</span>
    </div>

    <div class="team-card__hero">
      <div class="team-logo" :style="logoStyles">
        <img v-if="logoImageSrc && !logoLoadFailed" :src="logoImageSrc" :alt="`${team} logo`" class="team-logo__image" @error="logoLoadFailed = true">
        <span v-else>{{ logoText }}</span>
      </div>
      <div class="team-card__meta">
        <h3>{{ team }}</h3>
        <p class="team-card__location">{{ country }}</p>
      </div>
    </div>

    <p class="team-card__summary">{{ summary }}</p>

    <div class="team-card__footer">
      <span class="team-card__form">Form: {{ form }}</span>
      <NuxtLink v-if="profileTo" :to="profileTo" class="team-card__button" :aria-label="`View ${team} profile`">View profile</NuxtLink>
      <span v-else class="team-card__button">View profile</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps({
  team: { type: String, required: true },
  rank: { type: Number, required: true },
  country: { type: String, required: true },
  summary: { type: String, required: true },
  logo: { type: String, required: true },
  league: { type: String, default: '' },
  form: { type: String, default: '' },
  primaryColor: { type: String, default: '#16A34A' },
  secondaryColor: { type: String, default: '#FFFFFF' },
  profileTo: { type: [String, Object], default: '' }
})

const logoStyles = computed(() => ({
  background: props.primaryColor,
  color: props.secondaryColor
}))

const logoLoadFailed = ref(false)

const looksLikeImage = (value: string) => /\.(avif|jpe?g|png|svg|webp)$/i.test(value)

const logoImageSrc = computed(() => {
  const logo = props.logo.trim()

  if (/^https?:\/\//i.test(logo) || logo.startsWith('/')) return logo
  if (looksLikeImage(logo)) return `/Images/teams-logo/${logo}`
  return `/Images/teams-logo/${props.team}.jpg`
})

const logoText = computed(() => {
  const logo = props.logo.trim()
  return looksLikeImage(logo) ? props.team.slice(0, 2).toUpperCase() : logo
})

watch(() => [props.logo, props.team], () => {
  logoLoadFailed.value = false
})

const cardStyles = computed(() => ({
  '--team-primary': props.primaryColor,
  '--team-secondary': props.secondaryColor
}))
</script>
