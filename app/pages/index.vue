<script setup lang="ts">
import { computed, useAsyncData, useHead } from '#imports'
import NewsCard from '../components/NewsCard.vue'
import TransferCard from '../components/TransferCard.vue'
import MatchCard from '../components/MatchCard.vue'
import LeagueCard from '../components/LeagueCard.vue'
import TeamCard from '../components/TeamCard.vue'
import PlayerCard from '../components/PlayerCard.vue'
import { useSupabase } from '../composables/useSupabase'

useHead({
  title: 'Football Hub | Latest Football News',
  meta: [
    { name: 'description', content: 'Football Hub brings breaking football news, transfer rumours, match reports and analysis from Premier League, La Liga, Bundesliga and more.' },
    { property: 'og:title', content: 'Football Hub | Breaking Football News' },
    { property: 'og:description', content: 'Stay ahead with fast updates on transfers, match analysis, and the latest football headlines.' },
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

const normalizeArticle = (record: Record<string, any>) => {
  const headline = getTextValue(record, ['title', 'headline', 'name']) || 'Football update'
  const summary = getTextValue(record, ['summary', 'excerpt', 'description', 'content']) || 'Fresh football coverage from the Supabase news table.'
  const category = getTextValue(record, ['category', 'tag', 'type']) || 'Football'
  const image = getTextValue(record, ['image', 'image_url', 'cover_image', 'thumbnail', 'photo']) || '/Images/lionel-messi.jpg'

  return {
    category,
    headline,
    summary: summary.length > 140 ? `${summary.slice(0, 137)}...` : summary,
    image
  }
}

const getResultValue = (record: Record<string, any>, keys: string[]) => {
  for (const key of keys) {
    const value = record?.[key]
    if (value !== null && value !== undefined && value !== '') {
      return String(value)
    }
  }

  return ''
}

const normalizeTopPerformer = (record: Record<string, any>) => ({
  name: getTextValue(record, ['name', 'player_name', 'player', 'full_name']) || 'Player',
  position: getTextValue(record, ['position', 'role']) || 'Player',
  team: getTextValue(record, ['team', 'club', 'team_name']) || 'Club',
  rating: getResultValue(record, ['rating', 'score', 'performance_rating']) || 'N/A',
  summary: getTextValue(record, ['summary', 'description', 'bio', 'notes']) || 'A standout performer from the top_performers table.'
})

const { data: featuredNews, pending, error } = await useAsyncData('home-featured-news', async () => {
  const { supabase } = useSupabase()
  const { data, error: fetchError } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  if (fetchError) {
    throw new Error(`News query failed: ${fetchError.message}`)
  }

  if (!data?.length) {
    return []
  }

  return data.map((item: Record<string, any>) => normalizeArticle(item))
})

const featuredStories = computed(() => (featuredNews.value ?? []).slice(0, 3))

const { data: trendingResults } = await useAsyncData('home-trending-results', async () => {
  const { supabase } = useSupabase()
  const { data, error: fetchError } = await supabase
    .from('match_results')
    .select('*')
    .order('match_date', { ascending: false })
    .limit(3)

  if (fetchError) {
    throw new Error(`Match results query failed: ${fetchError.message}`)
  }

  if (!data?.length) {
    return []
  }

  return data.map((item: Record<string, any>) => {
    const homeTeam = getTextValue(item, ['home_team', 'homeTeam', 'team_home']) || 'Home team'
    const awayTeam = getTextValue(item, ['away_team', 'awayTeam', 'team_away']) || 'Away team'
    const homeScore = Number(getResultValue(item, ['home_score', 'homeScore', 'home_goals', 'homeGoals'])) || 0
    const awayScore = Number(getResultValue(item, ['away_score', 'awayScore', 'away_goals', 'awayGoals'])) || 0

    return {
      league: getTextValue(item, ['league', 'competition', 'competition_name', 'tournament']) || 'Featured match',
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      status: getTextValue(item, ['status', 'result', 'match_status']) || 'FT',
      summary: getTextValue(item, ['summary', 'description', 'report']) || `${homeTeam} and ${awayTeam} met in a recent fixture.`
    }
  })
})

const trendingMatches = computed(() => (trendingResults.value ?? []).slice(0, 3))

const { data: trendingTransfers } = await useAsyncData('home-trending-transfers', async () => {
  const { supabase } = useSupabase()
  const { data, error: fetchError } = await supabase
    .from('transfer_news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  if (fetchError) {
    throw new Error(`Transfer news query failed: ${fetchError.message}`)
  }

  if (!data?.length) {
    return []
  }

  return data.map((item: Record<string, any>) => ({
    player: getTextValue(item, ['player', 'player_name', 'name', 'full_name']) || 'Player update',
    status: getTextValue(item, ['status', 'transfer_status', 'type']) || 'Latest',
    headline: getTextValue(item, ['headline', 'title', 'summary']) || 'Transfer update',
    summary: getTextValue(item, ['details', 'description', 'content', 'summary']) || 'Latest transfer news from the Supabase transfer_news table.'
  }))
})

const transfers = computed(() => (trendingTransfers.value ?? []).slice(0, 3))

const { data: topPerformers, pending: performersPending, error: performersError } = await useAsyncData('home-top-performers', async () => {
  const { supabase } = useSupabase()
  const { data, error: fetchError } = await supabase
    .from('top_performers')
    .select('*')
    .order('created_at', { ascending: false })

  if (fetchError) {
    throw new Error(`Top performers query failed: ${fetchError.message}`)
  }

  return (data ?? []).map((item: Record<string, any>) => normalizeTopPerformer(item))
})

const players = computed(() => topPerformers.value ?? [])

const leagues = [
  { league: 'Premier League', description: 'Fast-paced English football with high drama in every match.', logo: 'PL' },
  { league: 'La Liga', description: 'World-class flair and strategy across Spain’s top clubs.', logo: 'LL' },
  { league: 'Serie A', description: 'Italian tactical battles and iconic football traditions.', logo: 'SA' },
  { league: 'Bundesliga', description: 'Germany’s top league built on speed, precision and passionate supporters.', logo: 'BL' },
  { league: 'Ligue 1', description: 'French stars shine in a league of young talent and European contenders.', logo: 'L1' },
  { league: 'Champions League', description: 'The biggest nights in club football, with elite European rivalries.', logo: 'UCL' }
]

const teams = [
  { rank: 1, team: 'Manchester City', country: 'England', summary: 'Dominant champions with elite depth and star power.', logo: 'MC' },
  { rank: 2, team: 'Real Madrid', country: 'Spain', summary: 'Historic European giants chasing more silverware.', logo: 'RM' },
  { rank: 3, team: 'Bayern Munich', country: 'Germany', summary: 'Consistent Bundesliga leaders with attacking firepower.', logo: 'BM' },
  { rank: 4, team: 'Paris Saint-Germain', country: 'France', summary: 'High-profile squad built for European glory.', logo: 'PSG' }
]

</script>

<template>
  <main class="home-page">
    <section class="hero-section" id="home">
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <p class="eyebrow">Breaking Football Coverage</p>
        <h1>Latest Football News & Transfer Updates</h1>
        <p class="hero-copy">Breaking football news, transfer rumours, match reports and analysis from around the world.</p>
        <div class="hero-actions">
          <NuxtLink to="/news#news" class="btn btn-primary">Explore News</NuxtLink>
          <NuxtLink to="/transfer#transfers" class="btn btn-secondary">Follow Transfers</NuxtLink>
        </div>
      </div>
    </section>

    <section class="featured-section container" id="news">
      <div class="section-header">
        <p class="section-label">Featured stories</p>
        <h2>Top headlines from the global game</h2>
      </div>
      <div v-if="pending" class="featured-grid">
        <p class="loading-message">Loading featured stories from Supabase…</p>
      </div>
      <div v-else-if="error" class="featured-grid">
        <p class="loading-message">Error loading featured stories: {{ error.message }}</p>
      </div>
      <div v-else-if="featuredStories.length === 0" class="featured-grid">
        <p class="loading-message">No featured stories available.</p>
      </div>
      <div v-else class="featured-grid">
        <NewsCard v-for="item in featuredStories" :key="item.headline" :category="item.category" :headline="item.headline" :summary="item.summary" :image="item.image" />
      </div>
    </section>

    <section class="trending-section container">
      <div class="section-header">
        <p class="section-label">Trending now</p>
        <h2>Popular transfers and recent results</h2>
      </div>
      <div class="trending-grid">
        <div class="trending-column">
          <MatchCard v-for="match in trendingMatches" :key="`${match.homeTeam}-${match.awayTeam}`" :league="match.league" :home-team="match.homeTeam" :away-team="match.awayTeam" :home-score="match.homeScore" :away-score="match.awayScore" :status="match.status" :summary="match.summary" />
        </div>
        <div class="trending-column">
          <TransferCard v-for="transfer in transfers" :key="`${transfer.player}-${transfer.headline}`" :player="transfer.player" :status="transfer.status" :headline="transfer.headline" :summary="transfer.summary" />
        </div>
      </div>
    </section>

    <section class="league-section container">
      <div class="section-header">
        <p class="section-label">Leagues</p>
        <h2>Follow the biggest competitions in world football</h2>
      </div>
      <div class="league-grid">
        <LeagueCard v-for="item in leagues" :key="item.league" :league="item.league" :description="item.description" :logo="item.logo" />
      </div>
    </section>

    <section class="team-section container" id="teams">
      <div class="section-header">
        <p class="section-label">Teams & players</p>
        <h2>Club form, elite squads and standout performers</h2>
      </div>
      <div class="team-grid">
        <TeamCard v-for="team in teams" :key="team.team" :team="team.team" :rank="team.rank" :country="team.country" :summary="team.summary" :logo="team.logo" />
      </div>
      <div class="player-section">
        <p class="section-label">Top performers</p>
        <div v-if="performersPending" class="player-grid">
          <p class="loading-message">Loading top performers from Supabase…</p>
        </div>
        <div v-else-if="performersError" class="player-grid">
          <p class="loading-message">Error loading top performers: {{ performersError.message }}</p>
        </div>
        <div v-else-if="players.length === 0" class="player-grid">
          <p class="loading-message">No top performers available.</p>
        </div>
        <div v-else class="player-grid">
          <PlayerCard v-for="player in players" :key="player.name" :name="player.name" :position="player.position" :team="player.team" :rating="player.rating" :summary="player.summary" />
        </div>
      </div>
    </section>
  </main>
</template>
