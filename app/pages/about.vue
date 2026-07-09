<script setup lang="ts">
import { useHead } from '#imports'

useHead({
  title: 'About | Football News',
  meta: [
    { name: 'description', content: 'Learn about Football News, our mission to deliver reliable football news, transfer updates, match previews, and tactical analysis.' },
    { property: 'og:title', content: 'About Football News' },
    { property: 'og:description', content: 'Football News provides global football coverage, transfer rumours, match reports and player analysis.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<template>
  <main class="about-page">
    <section class="page-hero about-hero">
      <div class="hero-overlay"></div>
      <div class="container about-hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">About Football News</span>
          <h1>Trusted coverage built for modern football fans.</h1>
          <p class="hero-copy-text">Expert-led football journalism with curated stories, transfer intelligence, tactical breakdowns, and league-wide perspective from the world's biggest competitions.</p>
        </div>
        <aside class="hero-about-card">
          <div class="hero-card-label">Our mission</div>
          <h3>Clarity, speed and expert insight</h3>
          <div class="hero-stat-grid">
            <div class="stat-block">
              <span>100K+</span>
              <span>Active readers</span>
            </div>
            <div class="stat-block">
              <span>50+</span>
              <span>Leagues covered</span>
            </div>
            <div class="stat-block">
              <span>24/7</span>
              <span>Live updates</span>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="about-grid container">
      <div class="about-copy">
        <h2>What makes us different</h2>
        <p>We combine fast news updates with deep tactical insight, transfer tracking, and club-by-club analysis so fans get the full picture before kickoff.</p>
        <ul class="feature-list">
          <li>Breaking headlines from global leagues</li>
          <li>Transfer market intelligence and confirmed moves</li>
          <li>Match previews, reactions, and tactical breakdowns</li>
          <li>Player form reports and squad evaluations</li>
          <li>Club-focused coverage built for season-long follow-up</li>
        </ul>
      </div>
      <div class="about-image">
        <img src="/Images/bdv.jpg" alt="Football action" loading="lazy" decoding="async" />
      </div>
    </section>

    <section class="mission-section container">
      <div class="section-header">
        <p class="section-label">Our mission</p>
        <h2>Deliver clarity, speed and expert context</h2>
      </div>
      <div class="mission-grid">
        <article class="mission-card">
          <h3>Fast, reliable updates</h3>
          <p>We publish the latest football stories quickly without sacrificing accuracy.</p>
        </article>
        <article class="mission-card">
          <h3>Transfer certainty</h3>
          <p>Our coverage distinguishes confirmed deals from rumours with clear sourcing and insight.</p>
        </article>
        <article class="mission-card">
          <h3>Match intelligence</h3>
          <p>From pre-game previews to tactical reaction, we explain the game beyond the scoreline.</p>
        </article>
      </div>
    </section>
  </main>
</template>
