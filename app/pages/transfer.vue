<script setup lang="ts">
import { useHead } from '#imports'
import TransferCard from '../components/TransferCard.vue'

useHead({
  title: 'Transfers | Football News',
  meta: [
    { name: 'description', content: 'In-depth transfer coverage, rumours, confirmed deals, and squad movement analysis across the world’s top clubs.' },
    { property: 'og:title', content: 'Football News Transfers' },
    { property: 'og:description', content: 'Track the latest football transfer activity, key rumours, and confirmed signings in one place.' },
    { property: 'og:type', content: 'website' }
  ]
})

const transferRumours = [
  {
    player: 'Kylian Mbappé',
    status: 'Rumour',
    headline: 'Premier League giants weigh up blockbuster bid',
    summary: 'The French forward remains the hottest name in the market as clubs prepare major offers.'
  },
  {
    player: 'Jude Bellingham',
    status: 'Negotiating',
    headline: 'Midfield maestro linked with a record-breaking move',
    summary: 'Continued talks leave the superstar’s next destination in doubt ahead of the deadline.'
  },
  {
    player: 'Antoine Griezmann',
    status: 'Rumour',
    headline: 'French forward tipped to return to La Liga',
    summary: 'A potential swap deal is generating interest in the Spanish market and beyond.'
  }
]

const confirmedDeals = [
  {
    player: 'Declan Rice',
    status: 'Confirmed',
    headline: 'West Ham captain completes move to Arsenal',
    summary: 'A major midfield signing that instantly boosts the Gunners’ title credentials.'
  },
  {
    player: 'Theo Hernández',
    status: 'Official',
    headline: 'AC Milan secure defender with contract extension',
    summary: 'The left-back will remain a cornerstone of Milan’s backline after sealing fresh terms.'
  },
  {
    player: 'Rafa Márquez',
    status: 'Confirmed',
    headline: 'Barcelona add pace with a promising winger signing',
    summary: 'The Catalans complete a move for one of Europe’s most exciting wide attackers.'
  }
]

const clubActivity = [
  {
    club: 'Manchester City',
    activity: 'Tracking two midfield targets while closing on a defensive upgrade.'
  },
  {
    club: 'Real Madrid',
    activity: 'Preparing a list of forwards to supplement its squad depth.'
  },
  {
    club: 'Paris Saint-Germain',
    activity: 'Monitoring central midfield options as part of a summer rebuild.'
  }
]
</script>

<template>
  <main class="transfer-page">
    <section class="page-hero transfer-hero">
      <div class="hero-overlay"></div>
      <div class="container transfer-hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">Transfer centre</span>
          <h1>Window power plays, rumours and official deals in elite detail.</h1>
          <p class="hero-copy-text">Follow the market with club intelligence, contract updates, and expert transfer tracking from football’s biggest leagues.</p>
          <div class="hero-status-pill-list">
            <span class="status-pill confirmed">Confirmed</span>
            <span class="status-pill rumour">Rumour</span>
            <span class="status-pill negotiating">Negotiating</span>
            <span class="status-pill official">Official</span>
          </div>
        </div>
        <aside class="hero-deck">
          <div class="hero-card-label">Market headline</div>
          <h3>Elite clubs prepare for a fast-moving window</h3>
          <div class="hero-stat-grid">
            <div class="stat-block">
              <span>42</span>
              <span>Deals tracked</span>
            </div>
            <div class="stat-block">
              <span>17</span>
              <span>Confirmed moves</span>
            </div>
            <div class="stat-block">
              <span>9</span>
              <span>Negotiations underway</span>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="transfer-market container" id="transfers">
      <div class="section-header">
        <p class="section-label">Rumour watch</p>
        <h2>Transfer stories gaining momentum</h2>
      </div>
      <div class="transfer-grid">
        <TransferCard
          v-for="rumour in transferRumours"
          :key="rumour.player"
          :player="rumour.player"
          :status="rumour.status"
          :headline="rumour.headline"
          :summary="rumour.summary"
        />
      </div>
    </section>

    <section class="transfer-confirmed container">
      <div class="section-header">
        <p class="section-label">Confirmed deals</p>
        <h2>Recent signings with immediate impact</h2>
      </div>
      <div class="confirmed-grid">
        <TransferCard
          v-for="deal in confirmedDeals"
          :key="deal.player"
          :player="deal.player"
          :status="deal.status"
          :headline="deal.headline"
          :summary="deal.summary"
        />
      </div>
    </section>

    <section class="club-activity container">
      <div class="section-header">
        <p class="section-label">Club transfer activity</p>
        <h2>How top squads are shaping their squads</h2>
      </div>
      <div class="activity-grid">
        <article v-for="item in clubActivity" :key="item.club" class="activity-card">
          <span class="hero-card-label">{{ item.club }}</span>
          <p>{{ item.activity }}</p>
        </article>
      </div>
    </section>
  </main>
</template>