<script setup lang="ts">
import { computed, useAsyncData, useHead } from '#imports'
import TransferCard from '../components/TransferCard.vue'
import { useSupabase } from '../composables/useSupabase'

useHead({
  title: 'Transfers | Football News',
  meta: [
    { name: 'description', content: 'In-depth transfer coverage, rumours, confirmed deals, and squad movement analysis across the world\'s top clubs.' },
    { property: 'og:title', content: 'Football News Transfers' },
    { property: 'og:description', content: 'Track the latest football transfer activity, key rumours, and confirmed signings in one place.' },
    { property: 'og:type', content: 'website' }
  ]
})

const getTextValue = (record: Record<string, any>, keys: string[]) => {
  for (const key of keys) {
    const value = record?.[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

const createSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const normalizeTransfer = (record: Record<string, any>) => {
  const player = getTextValue(record, ['player', 'player_name', 'name']) || 'Transfer target'
  const status = getTextValue(record, ['status', 'transfer_status', 'type']) || 'Latest'
  const club = getTextValue(record, ['club', 'team', 'to_club', 'destination_club'])
  const headline = getTextValue(record, ['headline', 'title', 'name']) || (club ? `${player} linked with ${club}` : `${player} transfer update`)
  const summary = getTextValue(record, ['summary', 'excerpt', 'description', 'content', 'details']) || 'Fresh transfer coverage from the Supabase transfer_news table.'
  const slug = getTextValue(record, ['slug']) || (record?.id ? String(record.id) : createSlug(headline))

  return {
    player,
    status,
    headline,
    summary: summary.length > 130 ? `${summary.slice(0, 127)}...` : summary,
    to: `/transfer-detail/${slug}`
  }
}

const fallbackTransfers = [
  {
    player: 'Kylian Mbappé',
    status: 'Rumour',
    headline: 'Premier League giants weigh up blockbuster bid',
    summary: 'The French forward remains the hottest name in the market as clubs prepare major offers.',
    to: '/transfer-detail/kylian-mbappe-blockbuster-bid'
  },
  {
    player: 'Jude Bellingham',
    status: 'Negotiating',
    headline: 'Midfield maestro linked with a record-breaking move',
    summary: 'Continued talks leave the superstar\'s next destination in doubt ahead of the deadline.',
    to: '/transfer-detail/jude-bellingham-record-move'
  },
  {
    player: 'Antoine Griezmann',
    status: 'Rumour',
    headline: 'French forward tipped to return to La Liga',
    summary: 'A potential swap deal is generating interest in the Spanish market and beyond.',
    to: '/transfer-detail/antoine-griezmann-la-liga-return'
  },
  {
    player: 'Declan Rice',
    status: 'Confirmed',
    headline: 'West Ham captain completes move to Arsenal',
    summary: 'A major midfield signing that instantly boosts the Gunners\' title credentials.',
    to: '/transfer-detail/declan-rice-arsenal'
  },
  {
    player: 'Theo Hernández',
    status: 'Official',
    headline: 'AC Milan secure defender with contract extension',
    summary: 'The left-back will remain a cornerstone of Milan\'s backline after sealing fresh terms.',
    to: '/transfer-detail/theo-hernandez-milan-extension'
  },
  {
    player: 'Rafa Márquez',
    status: 'Confirmed',
    headline: 'Barcelona add pace with a promising winger signing',
    summary: 'The Catalans complete a move for one of Europe\'s most exciting wide attackers.',
    to: '/transfer-detail/rafa-marquez-barcelona'
  }
]

const { data: transferData, pending, error } = await useAsyncData('transfers-all', async () => {
  try {
    const { supabase } = useSupabase()
    const { data, error: fetchError } = await supabase
      .from('transfer_news')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      throw fetchError
    }

    if (!data?.length) {
      return fallbackTransfers
    }

    return data.map((item: Record<string, any>) => normalizeTransfer(item))
  } catch (err) {
    console.error('Unable to load transfers from Supabase:', err)
    return fallbackTransfers
  }
})

// Split into Rumour/Negotiating and Confirmed/Official
const transferRumours = computed(() => {
  const all = transferData.value ?? []
  return all.filter(item => {
    const status = item.status?.toLowerCase() || ''
    return status === 'rumour' || status === 'negotiating'
  })
})

const confirmedDeals = computed(() => {
  const all = transferData.value ?? []
  return all.filter(item => {
    const status = item.status?.toLowerCase() || ''
    return status === 'confirmed' || status === 'official'
  })
})

// Calculate stats from actual data
const stats = computed(() => {
  const all = transferData.value ?? []
  const totalDeals = all.length
  const confirmedCount = all.filter(item => {
    const s = item.status?.toLowerCase() || ''
    return s === 'confirmed' || s === 'official'
  }).length
  const negotiatingCount = all.filter(item => {
    const s = item.status?.toLowerCase() || ''
    return s === 'negotiating'
  }).length

  return { totalDeals, confirmedCount, negotiatingCount }
})
</script>

<template>
  <main class="transfer-page">
    <section class="page-hero transfer-hero">
      <div class="hero-overlay"></div>
      <div class="container transfer-hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">Transfer centre</span>
          <h1>Window power plays, rumours and official deals in elite detail.</h1>
          <p class="hero-copy-text">Follow the market with club intelligence, contract updates, and expert transfer tracking from football\'s biggest leagues.</p>
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
              <span>{{ stats.totalDeals }}</span>
              <span>Deals tracked</span>
            </div>
            <div class="stat-block">
              <span>{{ stats.confirmedCount }}</span>
              <span>Confirmed moves</span>
            </div>
            <div class="stat-block">
              <span>{{ stats.negotiatingCount }}</span>
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
      <div v-if="pending" class="loading-message">
        <p>Loading transfers from Supabase…</p>
      </div>
      <div v-else-if="error" class="error-message">
        <p>Unable to load transfers right now. Showing fallback stories instead.</p>
      </div>
      <div v-else-if="transferRumours.length === 0" class="empty-message">
        <p>No rumour or negotiating stories at the moment. Check back soon.</p>
      </div>
      <div v-else class="transfer-grid">
        <TransferCard
          v-for="rumour in transferRumours"
          :key="rumour.player + rumour.headline"
          :player="rumour.player"
          :status="rumour.status"
          :headline="rumour.headline"
          :summary="rumour.summary"
          :to="rumour.to"
        />
      </div>
    </section>

    <section class="transfer-confirmed container">
      <div class="section-header">
        <p class="section-label">Confirmed deals</p>
        <h2>Recent signings with immediate impact</h2>
      </div>
      <div v-if="pending" class="loading-message">
        <p>Loading transfers from Supabase…</p>
      </div>
      <div v-else-if="error" class="error-message">
        <p>Unable to load transfers right now. Showing fallback stories instead.</p>
      </div>
      <div v-else-if="confirmedDeals.length === 0" class="empty-message">
        <p>No confirmed deals yet. Stay tuned for official announcements.</p>
      </div>
      <div v-else class="confirmed-grid">
        <TransferCard
          v-for="deal in confirmedDeals"
          :key="deal.player + deal.headline"
          :player="deal.player"
          :status="deal.status"
          :headline="deal.headline"
          :summary="deal.summary"
          :to="deal.to"
        />
      </div>
    </section>

  </main>
</template>