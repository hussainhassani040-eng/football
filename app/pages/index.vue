<script setup lang="ts">
import { useHead } from '#imports'
import LeagueCard from '../components/LeagueCard.vue'

useHead({
  title: 'Football Hub | Home',
  meta: [
    { name: 'description', content: 'Football Hub is your home for football news, transfer rumours, team coverage and match analysis from the world’s leading leagues.' },
    { property: 'og:title', content: 'Football Hub | Home' },
    { property: 'og:description', content: 'Discover the latest football headlines, transfer stories and club insights in one place.' },
    { property: 'og:type', content: 'website' }
  ]
})

const highlights = [
  {
    title: 'Daily news updates',
    description: 'Headlines and match reports from the biggest leagues, delivered with clarity and perspective.'
  },
  {
    title: 'Transfer market coverage',
    description: 'Rumours, confirmed deals and contract news from European football’s top clubs.'
  },
  {
    title: 'Team and player breakdowns',
    description: 'In-depth profiles, rankings and tactical insight on squads across every competition.'
  }
]

const leagues = [
  { league: 'Premier League', description: 'England’s top tier built on pace, pressure and world-class stars.', logo: 'PL' },
  { league: 'La Liga', description: 'Spanish football with flair, technical quality and iconic rivalries.', logo: 'LL' },
  { league: 'Bundesliga', description: 'A fast-paced league where precision, speed and fans drive every match.', logo: 'BL' },
  { league: 'Champions League', description: 'Europe’s elite clubs contest the most prestigious trophy in club football.', logo: 'UCL' }
]
</script>

<template>
  <main class="home-page">
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <p class="eyebrow">Football from every angle</p>
        <h1>News, transfers, teams and analysis in one place</h1>
        <p class="hero-copy">Football News gives fans a professional, organized view of today’s biggest stories — from headline transfers to match reaction and squad deep dives.</p>
        <div class="hero-actions">
          <NuxtLink to="/news" class="btn btn-primary">Read Latest News</NuxtLink>
          <NuxtLink to="/transfer" class="btn btn-secondary">Explore Transfers</NuxtLink>
        </div>
      </div>
    </section>

    <section class="featured-section container">
      <div class="section-header">
        <p class="section-label">What we cover</p>
        <h2>Complete football coverage for modern fans</h2>
      </div>
      <div class="featured-grid">
        <article v-for="item in highlights" :key="item.title" class="news-card">
          <div class="news-copy">
            <span class="news-tag">Professional</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="league-section container">
      <div class="section-header">
        <p class="section-label">Top leagues</p>
        <h2>Follow the competitions shaping the season</h2>
      </div>
      <div class="league-grid">
        <LeagueCard v-for="league in leagues" :key="league.league" :league="league.league" :description="league.description" :logo="league.logo" />
      </div>
    </section>
  </main>
</template>
