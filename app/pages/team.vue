<script setup lang="ts">
import { useHead } from '#imports'
import TeamCard from '../components/TeamCard.vue'
import PlayerCard from '../components/PlayerCard.vue'

useHead({
  title: 'Teams | Football Hub',
  meta: [
    { name: 'description', content: 'Team profiles, squad analysis, league highlights and player form updates for the world’s top football clubs.' },
    { property: 'og:title', content: 'Football Hub Teams' },
    { property: 'og:description', content: 'Explore club profiles, squad strength, and player form across the biggest football leagues.' },
    { property: 'og:type', content: 'website' }
  ]
})

const teams = [
  { rank: 1, team: 'Manchester City', country: 'England', summary: 'A dominant squad with depth, tactical versatility, and elite attacking firepower.', logo: 'MC' },
  { rank: 2, team: 'Real Madrid', country: 'Spain', summary: 'European royalty with a winning mentality and a world-class midfield engine.', logo: 'RM' },
  { rank: 3, team: 'Bayern Munich', country: 'Germany', summary: 'A powerhouse with relentless intensity, elite goalscoring and tactical discipline.', logo: 'BM' },
  { rank: 4, team: 'Paris Saint-Germain', country: 'France', summary: 'Star-studded roster focused on domestic success and European ambition.', logo: 'PSG' }
]

const players = [
  { name: 'Erling Haaland', position: 'Striker', team: 'Manchester City', rating: '9.4', summary: 'A clinical finisher with devastating pace and aerial presence.' },
  { name: 'Vinícius Jr.', position: 'Winger', team: 'Real Madrid', rating: '9.2', summary: 'A creative dribbler who can unlock defences with a single run.' },
  { name: 'Jude Bellingham', position: 'Midfielder', team: 'Real Madrid', rating: '9.1', summary: 'A complete midfielder driving transition and creativity for his side.' }
]
</script>

<template>
  <main class="team-page">
    <section class="page-hero">
      <div class="container">
        <p class="section-label">Club coverage</p>
        <h1>Club profiles and player form guides</h1>
        <p class="section-copy">Detailed squad analysis and player spotlights to help you follow the clubs competing at the highest level.</p>
      </div>
    </section>

    <section class="team-section container">
      <div class="section-header">
        <p class="section-label">Club focus</p>
        <h2>Leading teams shaping the football season</h2>
      </div>
      <div class="team-grid">
        <TeamCard
          v-for="team in teams"
          :key="team.team"
          :team="team.team"
          :rank="team.rank"
          :country="team.country"
          :summary="team.summary"
          :logo="team.logo"
        />
      </div>
    </section>

    <section class="league-section container">
      <div class="section-header">
        <p class="section-label">Player spotlight</p>
        <h2>Elite performers to watch</h2>
      </div>
      <div class="player-grid">
        <PlayerCard
          v-for="player in players"
          :key="player.name"
          :name="player.name"
          :position="player.position"
          :team="player.team"
          :rating="player.rating"
          :summary="player.summary"
        />
      </div>
    </section>

    <section class="team-highlights container">
      <div class="section-header">
        <p class="section-label">Squad insight</p>
        <h2>The stories behind this season’s biggest clubs</h2>
      </div>
      <div class="highlight-grid">
        <article class="team-highlight-card">
          <h3>Manchester City</h3>
          <p>Elite balance and deep rotation keep them in every competition.</p>
        </article>
        <article class="team-highlight-card">
          <h3>Real Madrid</h3>
          <p>Experience and creativity combine to power their European charge.</p>
        </article>
        <article class="team-highlight-card">
          <h3>Bayern Munich</h3>
          <p>Consistency, strength, and a relentless attacking identity.</p>
        </article>
      </div>
    </section>
  </main>
</template>
