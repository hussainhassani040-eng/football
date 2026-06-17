<script setup lang="ts">
import { useHead } from '#imports'
import NewsCard from '../components/NewsCard.vue'
import MatchCard from '../components/MatchCard.vue'

useHead({
  title: 'News | Football Hub',
  meta: [
    { name: 'description', content: 'Latest football headlines, match reports, transfer updates, and expert analysis from the world’s biggest leagues.' },
    { property: 'og:title', content: 'Football Hub News' },
    { property: 'og:description', content: 'Stay informed with real-time football news, breaking club updates, and detailed game coverage.' },
    { property: 'og:type', content: 'website' }
  ]
})

const featuredNews = [
  {
    category: 'Match Review',
    headline: 'Manchester City extend winning run with narrow victory',
    summary: 'A tense second half saw City secure a late winner to maintain their position at the top of the table.',
    image: '/Images/lionel-messi.jpg'
  },
  {
    category: 'Club Update',
    headline: 'Liverpool reshuffle after injury concerns',
    summary: 'Jurgen Klopp assesses squad depth ahead of a key run of fixtures in the league and cup.',
    image: '/Images/lionel-messi.jpg'
  },
  {
    category: 'Preview',
    headline: 'Champions League quarter-final draw throws up blockbuster ties',
    summary: 'Europe’s biggest clubs prepare for high-stakes meetings in the next round of the competition.',
    image: '/Images/lionel-messi.jpg'
  }
]

const recentMatches = [
  {
    league: 'Premier League',
    homeTeam: 'Manchester City',
    awayTeam: 'Tottenham',
    homeScore: 2,
    awayScore: 1,
    status: 'FT',
    summary: 'City relied on a second-half surge to pull away from a resilient Tottenham side.'
  },
  {
    league: 'Serie A',
    homeTeam: 'Juventus',
    awayTeam: 'Inter Milan',
    homeScore: 1,
    awayScore: 1,
    status: 'FT',
    summary: 'A tactical encounter ended in a draw as both teams balanced attack with caution.'
  },
  {
    league: 'La Liga',
    homeTeam: 'Atletico Madrid',
    awayTeam: 'Sevilla',
    homeScore: 3,
    awayScore: 0,
    status: 'FT',
    summary: 'Atletico produced a commanding display to keep pressure on the title race.'
  }
]
</script>

<template>
  <main class="news-page">
    <section class="page-hero">
      <div class="container">
        <p class="section-label">Latest headlines</p>
        <h1>Football news that matters</h1>
        <p class="section-copy">In-depth coverage of fixtures, transfers, injury updates and tactical insights from the world’s biggest competitions.</p>
      </div>
    </section>

    <section class="featured-section container">
      <div class="section-header">
        <p class="section-label">Featured reports</p>
        <h2>Top stories from the football calendar</h2>
      </div>
      <div class="featured-grid">
        <NewsCard v-for="story in featuredNews" :key="story.headline" :category="story.category" :headline="story.headline" :summary="story.summary" :image="story.image" />
      </div>
    </section>

    <section class="insight-section container">
      <div class="section-header">
        <p class="section-label">News spotlight</p>
        <h2>Quick context and key takeaways</h2>
      </div>
      <div class="insight-grid">
        <article class="news-insight-card">
          <h3>Midweek movers</h3>
          <p>Find out which games are shifting the title race, and which clubs are climbing the table right now.</p>
        </article>
        <article class="news-insight-card">
          <h3>Transfer pulse</h3>
          <p>Stay on top of the latest rumours, club targets, and confirmed moves before the window closes.</p>
        </article>
        <article class="news-insight-card">
          <h3>Injury watch</h3>
          <p>Critical updates on injured players and how absences could reshape upcoming matchups.</p>
        </article>
      </div>
    </section>

    <section class="trending-section container">
      <div class="section-header">
        <p class="section-label">Recent results</p>
        <h2>Match reaction and player storylines</h2>
      </div>
      <div class="trending-grid">
        <div class="trending-column">
          <MatchCard v-for="match in recentMatches" :key="match.homeTeam + match.awayTeam" :league="match.league" :home-team="match.homeTeam" :away-team="match.awayTeam" :home-score="match.homeScore" :away-score="match.awayScore" :status="match.status" :summary="match.summary" />
        </div>
        <aside class="trending-summary-card">
          <h3>League movers</h3>
          <p>These fixtures shaped the latest round and set the tone for the weeks ahead.</p>
          <ul class="summary-list">
            <li>Manchester City remain unbeaten after a late winner.</li>
            <li>Juventus and Inter share spoils in a high-stakes Derby d'Italia.</li>
            <li>Atletico asserted title credentials with a dominant home win.</li>
          </ul>
        </aside>
      </div>
    </section>
  </main>
</template>
