<script setup lang="ts">
import { useHead } from '#imports'
import TransferCard from '../components/TransferCard.vue'

useHead({
  title: 'Transfers | Football Hub',
  meta: [
    { name: 'description', content: 'In-depth transfer coverage, rumours, confirmed deals, and squad movement analysis across the world’s top clubs.' },
    { property: 'og:title', content: 'Football Hub Transfers' },
    { property: 'og:description', content: 'Track the latest football transfer activity, key rumours, and confirmed signings in one place.' },
    { property: 'og:type', content: 'website' }
  ]
})

const transferHighlights = [
  {
    player: 'Kylian Mbappé',
    status: 'Rumour',
    headline: 'Premier League giants weighing up blockbuster bid',
    summary: 'The French forward remains one of the most sought-after players ahead of the summer window.'
  },
  {
    player: 'Jude Bellingham',
    status: 'Confirmed',
    headline: 'Midfield maestro set for Real Madrid switch',
    summary: 'The England international has agreed personal terms and is poised to join the Spanish champions.'
  },
  {
    player: 'David de Gea',
    status: 'Latest',
    headline: 'Goalkeeper linked with late-window Premier League return',
    summary: 'A veteran shot-stopper is being monitored as clubs look for experienced cover between the posts.'
  }
]

const dealList = [
  {
    player: 'Declan Rice',
    status: 'Confirmed',
    headline: 'West Ham captain completes move to Arsenal',
    summary: 'Rice joins the Gunners in a major midfield signing to bolster their title challenge.'
  },
  {
    player: 'Rafa Márquez',
    status: 'Rumour',
    headline: 'Barcelona linked with talented winger',
    summary: 'The Catalans are reportedly preparing an offer for a fast, creative wide attacker.'
  },
  {
    player: 'Theo Hernández',
    status: 'Confirmed',
    headline: 'AC Milan extend left-back contract after interest from Madrid',
    summary: 'Milan keep their key defender after rejecting multiple high-profile offers.'
  }
]
</script>

<template>
  <main class="transfer-page">
    <section class="page-hero">
      <div class="container">
        <p class="section-label">Transfer market</p>
        <h1>Transfer news, rumours and confirmed deals</h1>
        <p class="section-copy">Stay ahead with expert coverage of transfers, contract updates, and squad rebuilding plans from Europe’s biggest clubs.</p>
      </div>
    </section>

    <section class="market-overview container">
      <div class="market-banner">
        <p class="section-label">Market watch</p>
        <h2>Tracking the deals that shape the window</h2>
        <p>From high-profile rumours to confirmed moves, get the transfers that matter in one polished briefing.</p>
      </div>
    </section>

    <section class="featured-section container">
      <div class="section-header">
        <p class="section-label">Featured rumours</p>
        <h2>Stories shaping the next transfer window</h2>
      </div>
      <div class="featured-grid">
        <TransferCard
          v-for="item in transferHighlights"
          :key="item.player"
          :player="item.player"
          :status="item.status"
          :headline="item.headline"
          :summary="item.summary"
        />
      </div>
    </section>

    <section class="league-section container">
      <div class="section-header">
        <p class="section-label">Confirmed deals</p>
        <h2>Recent moves that matter</h2>
      </div>
      <div class="league-grid">
        <TransferCard
          v-for="deal in dealList"
          :key="deal.player"
          :player="deal.player"
          :status="deal.status"
          :headline="deal.headline"
          :summary="deal.summary"
        />
      </div>
    </section>
  </main>
</template>
