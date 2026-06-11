<script setup lang="ts">
import { useHead } from '#imports'

useHead({
  title: 'About | Football Hub',
  meta: [
    { name: 'description', content: 'Learn about Football Hub, our mission to deliver reliable football news, transfer updates, match previews, and tactical analysis.' },
    { property: 'og:title', content: 'About Football Hub' },
    { property: 'og:description', content: 'Football Hub provides global football coverage, transfer rumours, match reports and player analysis.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<template>
  <main class="about-page">
    <section class="page-hero">
      <div class="container">
        <p class="section-label">About Us</p>
        <h1>Who We Are</h1>
        <p class="section-copy">Football Hub is a global football news platform delivering the latest headlines, transfer rumours, match previews, and in-depth analysis across the world’s top leagues.</p>
      </div>
    </section>

    <section class="about-grid container">
      <div class="about-image">
        <img src="/Images/lionel-messi.jpg" alt="Football action" loading="lazy" decoding="async" />
      </div>
      <div class="about-copy">
        <h2>Our coverage includes:</h2>
        <ul class="feature-list">
          <li>Football news and breaking stories</li>
          <li>Transfer rumours and deals</li>
          <li>Match previews and post-game analysis</li>
          <li>League standings and player statistics</li>
          <li>Tactical breakdowns and team performance insights</li>
        </ul>
      </div>
    </section>

    <section class="mission-section container">
      <div class="section-header">
        <p class="section-label">Our mission</p>
        <h2>Bringing football coverage to fans everywhere</h2>
      </div>
      <div class="mission-grid">
        <article class="mission-card">
          <h3>Accurate updates</h3>
          <p>We publish verified news fast, with clarity and context for every football fan.</p>
        </article>
        <article class="mission-card">
          <h3>Transfer insight</h3>
          <p>Our transfer coverage highlights rumours, moves and market activity from Europe’s top clubs.</p>
        </article>
        <article class="mission-card">
          <h3>Global coverage</h3>
          <p>From Premier League to Champions League, we cover the biggest stories from every competition.</p>
        </article>
      </div>
    </section>
  </main>
</template>
