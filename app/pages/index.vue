<script setup lang="ts">
import { useAsyncData, useHead } from '#imports'
import NewsCard from '../components/NewsCard.vue'
import TransferCard from '../components/TransferCard.vue'
import MatchCard from '../components/MatchCard.vue'
import LeagueCard from '../components/LeagueCard.vue'
import TeamCard from '../components/TeamCard.vue'
import PlayerCard from '../components/PlayerCard.vue'
import { useSupabase } from '../composables/useSupabase'
import { buildTeamCardData, getTeamSlug, isMissingSupabaseTableError, normalizeLeagueValue } from '../composables/useTeamTable'

useHead({
  title: 'Football Hub | Latest Football News',
  meta: [
    { name: 'description', content: 'Football Hub brings breaking football news, transfer rumours, match reports and analysis from Premier League, La Liga, Bundesliga and more.' },
    { property: 'og:title', content: 'Football Hub | Breaking Football News' },
    { property: 'og:description', content: 'Stay ahead with fast updates on transfers, match analysis, and the latest football headlines.' },
    { property: 'og:type', content: 'website' }
  ]
})

const fallbackFeaturedNews = [
  {
    category: 'Latest Football News',
    headline: 'Manchester City edge past Liverpool in late thriller',
    summary: 'City held on in a dramatic Anfield clash after a stoppage-time counter sealed the win.',
    image: '/Images/lionel-messi.jpg',
    to: '/news-detail/manchester-city-edge-past-liverpool'
  },
  {
    category: 'Transfer News',
    headline: 'Real Madrid in talks for elite midfield target',
    summary: 'The reigning champions are closing in on a surprise move ahead of the summer window.',
    image: '/Images/lionel-messi.jpg',
    to: '/news-detail/real-madrid-talks-midfield-target'
  },
  {
    category: 'Match Analysis',
    headline: 'Tactical review: How Arsenal broke down the defence',
    summary: 'A closer look at the patterns that gave them control in the second half.',
    image: '/Images/lionel-messi.jpg',
    to: '/news-detail/tactical-review-arsenal-defence'
  },
  {
    category: 'Premier League',
    headline: 'Arsenal maintain title push with dominant display',
    summary: 'The Gunners delivered a commanding performance to keep pace at the top of the table.',
    image: '/Images/lionel-messi.jpg',
    to: '/news-detail/arsenal-title-push-dominant-display'
  },
  {
    category: 'La Liga',
    headline: 'Barcelona star admits frustration after dropped points',
    summary: 'A disappointing result leaves questions about consistency in the title race.',
    image: '/Images/lionel-messi.jpg',
    to: '/news-detail/barcelona-frustration-dropped-points'
  },
  {
    category: 'Bundesliga',
    headline: 'Bayern Munich extend lead with convincing victory',
    summary: 'The German champions showed their class with a comprehensive win on the road.',
    image: '/Images/lionel-messi.jpg',
    to: '/news-detail/bayern-munich-extend-lead'
  },
  {
    category: 'Serie A',
    headline: 'AC Milan revive season with crucial derby win',
    summary: 'A hard-fought victory breathes new life into Milan\'s campaign.',
    image: '/Images/lionel-messi.jpg',
    to: '/news-detail/ac-milan-derby-win'
  },
  {
    category: 'Champions League',
    headline: 'Knockout phase draw sets up tantalising ties',
    summary: 'The stage is set for thrilling European encounters in the round of 16.',
    image: '/Images/lionel-messi.jpg',
    to: '/news-detail/champions-league-knockout-draw'
  }
]

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

const normalizeFeaturedNews = (record: Record<string, any>) => {
  const headline = getTextValue(record, ['title', 'headline', 'name']) || 'Football update'
  const summary = getTextValue(record, ['summary', 'excerpt', 'description']) || 'Fresh football coverage from the Supabase news table.'
  const category = getTextValue(record, ['category', 'tag', 'type']) || 'Football'
  const image = getTextValue(record, ['image', 'image_url', 'cover_image', 'thumbnail', 'photo']) || '/Images/lionel-messi.jpg'
  const slug = getTextValue(record, ['slug']) || (record?.id ? String(record.id) : createSlug(headline))

  return {
    category,
    headline,
    summary: summary.length > 140 ? `${summary.slice(0, 137)}...` : summary,
    image,
    to: `/news-detail/${slug}`
  }
}

const getScoreValue = (record: Record<string, any>, keys: string[]) => {
  for (const key of keys) {
    const value = record?.[key]
    if (value !== null && value !== undefined && value !== '') return value
  }

  return '0'
}

const getDisplayValue = (record: Record<string, any>, keys: string[], fallback: string) => {
  for (const key of keys) {
    const value = record?.[key]
    if (value !== null && value !== undefined && value !== '') return String(value)
  }

  return fallback
}

const { data: featuredNews } = await useAsyncData('home-featured-news', async () => {
  try {
    const { supabase } = useSupabase()
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) {
      throw error
    }

    if (!data?.length) {
      return fallbackFeaturedNews
    }

    return data.map((item: Record<string, any>) => normalizeFeaturedNews(item))
  } catch (err) {
    console.error('Unable to load featured news from Supabase:', err)
    return fallbackFeaturedNews
  }
})

const fallbackTrendingMatches = [
  {
    league: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    homeScore: 3,
    awayScore: 2,
    status: 'FT',
    summary: 'Arsenal fought back with two late goals to claim a dramatic London derby victory.'
  },
  {
    league: 'La Liga',
    homeTeam: 'Barcelona',
    awayTeam: 'Atletico Madrid',
    homeScore: 1,
    awayScore: 1,
    status: 'FT',
    summary: 'A tactical stalemate at Camp Nou leaves both sides searching for consistency.'
  },
  {
    league: 'Bundesliga',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    homeScore: 2,
    awayScore: 1,
    status: 'FT',
    summary: 'Bayern edged past Dortmund in a high-intensity Klassiker showdown.'
  }
]

const fallbackTransfers = [
  {
    player: 'Kylian Mbappé',
    status: 'Rumour',
    headline: 'PSG star linked with move to Premier League',
    summary: 'Top clubs are reportedly preparing offers as the striker evaluates his future.',
    to: '/transfer-detail/kylian-mbappe-transfer-rumour'
  },
  {
    player: 'Jude Bellingham',
    status: 'Confirmed',
    headline: 'Midfield maestro closes in on Real Madrid transfer',
    summary: 'The English international looks set for a headline move after a stellar season.',
    to: '/transfer-detail/jude-bellingham-real-madrid-transfer'
  },
  {
    player: 'Riyad Mahrez',
    status: 'Latest',
    headline: 'Juventus monitor late-window winger option',
    summary: 'The Italian giants are keeping tabs on a creative wide attacker.',
    to: '/transfer-detail/riyad-mahrez-juventus-latest'
  }
]

const normalizeMatchResult = (record: Record<string, any>) => {
  const homeTeam = getTextValue(record, ['home_team', 'homeTeam', 'team_home', 'home', 'home_club']) || 'Home team'
  const awayTeam = getTextValue(record, ['away_team', 'awayTeam', 'team_away', 'away', 'away_club']) || 'Away team'
  const league = getTextValue(record, ['league', 'competition', 'tournament']) || 'Football'
  const status = getTextValue(record, ['status', 'match_status', 'result_status']) || 'FT'
  const summary = getTextValue(record, ['summary', 'description', 'report', 'notes']) || `${homeTeam} vs ${awayTeam} from the latest match results.`

  return {
    league,
    homeTeam,
    awayTeam,
    homeScore: getScoreValue(record, ['home_score', 'homeScore', 'home_goals', 'homeGoals']),
    awayScore: getScoreValue(record, ['away_score', 'awayScore', 'away_goals', 'awayGoals']),
    status,
    summary: summary.length > 130 ? `${summary.slice(0, 127)}...` : summary
  }
}

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

const { data: trendingMatches } = await useAsyncData('home-trending-match-results', async () => {
  try {
    const { supabase } = useSupabase()
    const { data, error } = await supabase
      .from('match_results')
      .select('*')
      .order('match_date', { ascending: false })
      .limit(3)

    if (error) {
      throw error
    }

    if (!data?.length) {
      return fallbackTrendingMatches
    }

    return data.map((item: Record<string, any>) => normalizeMatchResult(item))
  } catch (err) {
    console.error('Unable to load trending match results from Supabase:', err)
    return fallbackTrendingMatches
  }
})

const { data: transfers } = await useAsyncData('home-trending-transfer-news', async () => {
  try {
    const { supabase } = useSupabase()
    const { data, error } = await supabase
      .from('transfer_news')
      .select('*')
      .limit(3)

    if (error) {
      throw error
    }

    if (!data?.length) {
      return fallbackTransfers
    }

    return data.map((item: Record<string, any>) => normalizeTransfer(item))
  } catch (err) {
    console.error('Unable to load transfer news from Supabase:', err)
    return fallbackTransfers
  }
})

const leagues = [
  { league: 'Premier League', description: 'Fast-paced English football with high drama in every match.', logo: 'PL' },
  { league: 'La Liga', description: 'World-class flair and strategy across Spain’s top clubs.', logo: 'LL' },
  { league: 'Serie A', description: 'Italian tactical battles and iconic football traditions.', logo: 'SA' },
  { league: 'Bundesliga', description: 'Germany’s top league built on speed, precision and passionate supporters.', logo: 'BL' },
  { league: 'Ligue 1', description: 'French stars shine in a league of young talent and European contenders.', logo: 'L1' },
  { league: 'Champions League', description: 'The biggest nights in club football, with elite European rivalries.', logo: 'UCL' }
]

const homeTeamTargets = [
  {
    names: ['Manchester City', 'Man City'],
    fallback: { team: 'Manchester City', country: 'England', league: 'Premier League', summary: 'Dominant champions with elite depth and star power.', logo: 'MC' }
  },
  {
    names: ['Real Madrid'],
    fallback: { team: 'Real Madrid', country: 'Spain', league: 'LaLiga', summary: 'Historic European giants chasing more silverware.', logo: 'RM' }
  },
  {
    names: ['Bayern Munich', 'FC Bayern Munich'],
    fallback: { team: 'Bayern Munich', country: 'Germany', league: 'Bundesliga', summary: 'Consistent Bundesliga leaders with attacking firepower.', logo: 'BM' }
  },
  {
    names: ['Paris Saint-Germain', 'Paris Saint Germain', 'PSG'],
    fallback: { team: 'Paris Saint-Germain', country: 'France', league: 'Ligue 1', summary: 'High-profile squad built for European glory.', logo: 'PSG' }
  }
]

const homeTeamSources = [
  { table: 'Laliga', league: 'LaLiga' },
  { table: 'premier league', league: 'Premier League' },
  { table: 'champions league', league: 'Champions League' },
  { table: 'international', league: 'International' },
  { table: 'serie a', league: 'Serie A' },
  { table: 'bundesliga', league: 'Bundesliga' },
  { table: 'ligue 1', league: 'Ligue 1' },
  { table: 'teams', league: '' }
]

const normalizeMatchText = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const normalizeHomeTeam = (record: Record<string, any>, source: { table: string, league: string }) => ({
  ...record,
  league: normalizeLeagueValue(record.league || source.league),
  source_table: source.table
})

const teamMatchesTarget = (record: Record<string, any>, targetNames: string[]) => {
  const recordNames = [
    record.name,
    record.team,
    record.club,
    record.title,
    record.fullname,
    record.short_name,
    record.slug,
    getTeamSlug(record)
  ]
    .filter(Boolean)
    .map((value) => normalizeMatchText(String(value)))

  return targetNames
    .map((name) => normalizeMatchText(name))
    .some((name) => recordNames.includes(name))
}

const fallbackHomeTeams = homeTeamTargets.map((target, index) => ({
  ...target.fallback,
  rank: index + 1,
  form: 'N/A',
  primary_color: '#16A34A',
  secondary_color: '#FFFFFF',
  source_table: ''
}))

const getTeamProfileRoute = (team: Record<string, any>) => {
  if (!team.source_table) return ''

  return {
    path: `/team/${team.slug || getTeamSlug(team)}`,
    query: { source: team.source_table }
  }
}

const { data: teams } = await useAsyncData('home-featured-teams', async () => {
  try {
    const { supabase } = useSupabase()
    const sourceResults = await Promise.all(
      homeTeamSources.map(async (source) => {
        const { data, error } = await supabase
          .from(source.table)
          .select('*')
          .limit(100)

        if (error) {
          if (!isMissingSupabaseTableError(error)) {
            console.warn(`Skipping ${source.table} home teams: ${error.message}`)
          }
          return []
        }

        return (data ?? []).map((team: Record<string, any>) => normalizeHomeTeam(team, source))
      })
    )

    const supabaseTeams = sourceResults.flat()

    return homeTeamTargets.map((target, index) => {
      const found = supabaseTeams.find((team) => teamMatchesTarget(team, target.names))

      if (!found) {
        return fallbackHomeTeams[index]
      }

      return buildTeamCardData(found, index)
    })
  } catch (err) {
    console.error('Unable to load featured teams from Supabase:', err)
    return fallbackHomeTeams
  }
})

const fallbackPlayers = [
  { name: 'Erling Haaland', position: 'Striker', team: 'Manchester City', rating: '9.3', summary: 'A relentless goalscorer with incredible pace and power.' },
  { name: 'Vinícius Jr.', position: 'Winger', team: 'Real Madrid', rating: '9.1', summary: 'Blistering dribbler who can change a game in an instant.' },
  { name: 'Jude Bellingham', position: 'Midfielder', team: 'Real Madrid', rating: '9.0', summary: 'A complete midfielder with vision, strength, and work rate.' },
  { name: 'Kylian Mbappe', position: 'Forward', team: 'Real Madrid', rating: '8.9', summary: 'An explosive forward who stretches defences and finishes chances at pace.' }
]

const normalizeTopPerformer = (record: Record<string, any>) => {
  const name = getDisplayValue(record, ['name', 'player', 'player_name'], 'Top performer')
  const position = getDisplayValue(record, ['position', 'role'], 'Player')
  const team = getDisplayValue(record, ['team', 'club', 'team_name'], 'Football club')
  const rating = getDisplayValue(record, ['rating', 'score', 'form_rating'], '9.0')
  const summary = getTextValue(record, ['summary', 'description', 'bio', 'notes']) || `${name} is among the latest top performers.`

  return {
    name,
    position,
    team,
    rating,
    summary: summary.length > 130 ? `${summary.slice(0, 127)}...` : summary
  }
}

const { data: players } = await useAsyncData('home-top-performers', async () => {
  try {
    const { supabase } = useSupabase()
    const { data, error } = await supabase
      .from('top_performers')
      .select('*')
      .order('rating', { ascending: false })

    if (error) {
      throw error
    }

    if (!data?.length) {
      return fallbackPlayers
    }

    return data.map((item: Record<string, any>) => normalizeTopPerformer(item))
  } catch (err) {
    console.error('Unable to load top performers from Supabase:', err)
    return fallbackPlayers
  }
})
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
          <NuxtLink to="/news" class="btn btn-primary">Explore News</NuxtLink>
          <NuxtLink to="/transfer" class="btn btn-secondary">Follow Transfers</NuxtLink>
        </div>
      </div>
    </section>

    <section class="featured-section container" id="news">
      <div class="section-header">
        <p class="section-label">Featured stories</p>
        <h2>Top headlines from the global game</h2>
      </div>
      <div class="featured-grid">
        <NewsCard v-for="item in featuredNews" :key="item.headline" :category="item.category" :headline="item.headline" :summary="item.summary" :image="item.image" :to="item.to" />
      </div>
    </section>

    <section class="trending-section container">
      <div class="section-header">
        <p class="section-label">Trending now</p>
        <h2>Popular transfers and recent results</h2>
      </div>
      <div class="trending-grid">
        <div class="trending-column">
          <MatchCard v-for="match in trendingMatches" :key="match.homeTeam + match.awayTeam" :league="match.league" :home-team="match.homeTeam" :away-team="match.awayTeam" :home-score="match.homeScore" :away-score="match.awayScore" :status="match.status" :summary="match.summary" />
        </div>
        <div class="trending-column">
          <TransferCard v-for="transfer in transfers" :key="transfer.player" :player="transfer.player" :status="transfer.status" :headline="transfer.headline" :summary="transfer.summary" :to="transfer.to" />
        </div>
      </div>
    </section>

    <section class="team-section container" id="teams">
      <div class="section-header">
        <p class="section-label">Teams & players</p>
        <h2>Club form, elite squads and standout performers</h2>
      </div>
      <div class="team-grid">
        <TeamCard
          v-for="team in teams"
          :key="team.team"
          :team="team.team"
          :rank="team.rank"
          :league="team.league"
          :country="team.country"
          :form="team.form || 'N/A'"
          :summary="team.summary"
          :logo="team.logo"
          :primary-color="team.primary_color"
          :secondary-color="team.secondary_color"
          :profile-to="getTeamProfileRoute(team)"
        />
      </div>
      <div class="player-section">
        <p class="section-label">Top performers</p>
        <div class="player-grid">
          <PlayerCard v-for="player in players" :key="player.name" :name="player.name" :position="player.position" :team="player.team" :rating="player.rating" :summary="player.summary" />
        </div>
      </div>
    </section>
  </main>
</template>