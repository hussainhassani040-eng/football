<script setup lang="ts">
import { useHead } from '#imports'

useHead({
  title: 'Live Coverage | Football News',
  meta: [
    { name: 'description', content: 'Follow live football coverage, real-time match updates, scores, and commentary from leagues around the world.' },
    { property: 'og:title', content: 'Live Football Coverage' },
    { property: 'og:description', content: 'Real-time match updates, live scores, and minute-by-minute commentary from the world\'s biggest leagues.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<template>
  <main class="live-page">
    <section class="live-hero">
      <div class="live-hero-bg"></div>
      <div class="live-hero-overlay"></div>
      <div class="container live-hero-grid">
        <div class="live-hero-left">
          <span class="live-badge">
            <span class="live-badge-dot"></span>
            LIVE NOW
          </span>
          <h1 class="live-hero-title">Live Football Coverage</h1>
          <p class="live-hero-subtitle">
            Real-time scores, live match updates, minute-by-minute commentary, team lineups, statistics, and breaking moments from every major competition.
          </p>
          <div class="live-hero-actions">
            <NuxtLink to="/live" class="btn-live-primary">
              <span class="btn-live-icon">🔴</span> View Live Matches
            </NuxtLink>
            <NuxtLink to="/fixtures" class="btn-live-secondary">
              <span class="btn-live-icon">📅</span> Today's Fixtures
            </NuxtLink>
          </div>
        </div>
        <aside class="live-stats-card">
          <div class="live-stats-header">
            <span class="live-stats-indicator">
              <span class="live-stats-dot"></span>
              LIVE STATUS
            </span>
            <span class="live-stats-updated">Just now</span>
          </div>
          <div class="live-stats-body">
            <div class="live-stat-item">
              <span class="live-stat-label">Live Matches</span>
              <span class="live-stat-value">18</span>
            </div>
            <div class="live-stat-item">
              <span class="live-stat-label">Today's Fixtures</span>
              <span class="live-stat-value">42</span>
            </div>
          </div>
          <div class="live-stats-divider"></div>
          <div class="live-stats-competitions">
            <span class="live-comp-label">Competitions</span>
            <ul class="live-comp-list">
              <li>Premier League</li>
              <li>La Liga</li>
              <li>Serie A</li>
              <li>Bundesliga</li>
              <li>Ligue 1</li>
              <li>Champions League</li>
            </ul>
          </div>
          <div class="live-stats-footer">
            <span class="live-stats-updated small">Last Updated: Just now</span>
          </div>
        </aside>
      </div>
    </section>

    <TodayFixtures :limit="8" />

    <section class="container" style="padding: 4rem 0;">
      <div class="section-header">
        <span class="section-label">Coming Soon</span>
        <h2 class="section-title">Live Match Tracker</h2>
        <p class="section-copy">We're building a comprehensive live match tracker with real-time updates, interactive timelines, and expert commentary. Check back soon for the full experience.</p>
      </div>
    </section>
  </main>
</template>