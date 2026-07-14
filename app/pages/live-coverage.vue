<script setup lang="ts">
import { useHead } from '#imports'

useHead({
  title: 'Live Coverage | Football News',
  meta: [
    { name: 'description', content: 'Follow live football coverage, real-time match updates, scores, and commentary from leagues around the world.' },
    { property: 'og:title', content: 'Live Football Coverage' },
    { property: 'og:description', content: 'Real-time match updates, live scores, and minute-by-minute commentary from the world’s biggest leagues.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<template>
  <main class="news-page">
    <section class="page-hero news-hero" style="background-image: url('/Images/stadium.jpg'); background-size: cover; background-position: center;">
      <div class="hero-overlay"></div>
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">Live Now</span>
          <h1>Live Football Coverage</h1>
          <p class="hero-copy-text">Real-time match updates, live scores, and minute-by-minute commentary from across the world’s top leagues and competitions.</p>
          <div class="hero-actions">
            <NuxtLink to="/news" class="btn btn-primary">Back to News</NuxtLink>
            <NuxtLink to="/" class="btn btn-secondary">Go to Home</NuxtLink>
          </div>
        </div>
        <aside class="featured-hero-card">
          <span class="hero-card-label">Live Updates</span>
          <h2>Follow the action as it happens</h2>
          <p>Stay tuned for real-time match events, goals, cards, substitutions, and post-match analysis from every major fixture.</p>
        </aside>
      </div>
    </section>

    <section class="container" style="padding: 4rem 0;">
      <div class="section-header">
        <span class="section-label">Coming Soon</span>
        <h2 class="section-title">Live Match Tracker</h2>
        <p class="section-copy">We're building a comprehensive live match tracker with real-time updates, interactive timelines, and expert commentary. Check back soon for the full experience.</p>
      </div>
    </section>
  </main>
</template>