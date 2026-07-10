<script setup lang="ts">
import { useHead, useAsyncData, ref, computed } from '#imports'
import { useSupabase } from '~/composables/useSupabase'
import { buildTeamCardData, getTeamSlug, isMissingSupabaseTableError, normalizeLeagueValue } from '~/composables/useTeamTable'
import TeamCard from '~/components/TeamCard.vue'

useHead({
  title: 'Teams | Football News',
  meta: [
    { name: 'description', content: 'Team profiles, squad analysis, league highlights and team details powered by Supabase.' },
    { property: 'og:title', content: 'Football News Teams' },
    { property: 'og:description', content: 'Explore club profiles, squad strength, and player form across the biggest football leagues.' },
    { property: 'og:type', content: 'website' }
  ]
})

const leagueTabs = [
  'La Liga',
  'Premier League',
  'Champions League',
  'International',
  'Serie A',
  'Ligue 1',
  'Bundesliga'
]

const selectedLeague = ref('La Liga')

const { data: allTeams, pending, error } = await useAsyncData('teams-directory', async () => {
  const { supabase } = useSupabase()
  const teamSelect = '*'

  const { data: laLigaData, error: laLigaError } = await supabase
    .from('Laliga')
    .select(teamSelect)
    .order('name', { ascending: true })

  if (laLigaError) throw new Error(`La Liga query failed: ${laLigaError.message}`)

  const fetchOptionalLeague = async (table: string) => {
    const { data, error } = await supabase
      .from(table)
      .select(teamSelect)
      .order('name', { ascending: true })

    if (error) {
      if (!isMissingSupabaseTableError(error)) {
        console.warn(`Skipping ${table} teams: ${error.message}`)
      }
      return []
    }

    return data ?? []
  }

  const normalizeTeams = (data: Record<string, any>[] | null, fallbackLeague?: string, sourceTable?: string) =>
    (data ?? []).map((team: Record<string, any>) => ({
      ...team,
      league: normalizeLeagueValue(team.league || fallbackLeague),
      source_table: sourceTable
    }))

  const laLigaTeams = normalizeTeams(laLigaData, 'LaLiga', 'Laliga')
  const [premierLeagueTeams, championsLeagueTeams, internationalTeams, serieATeams, leagueOneTeams, bundesligaTeams] = await Promise.all([
    fetchOptionalLeague('premier league').then((teams) => normalizeTeams(teams, 'Premier League', 'premier league')),
    fetchOptionalLeague('champions league').then((teams) => normalizeTeams(teams, 'Champions League', 'champions league')),
    fetchOptionalLeague('international').then((teams) => normalizeTeams(teams, 'International', 'international')),
    fetchOptionalLeague('serie a').then((teams) => normalizeTeams(teams, 'Serie A', 'serie a')),
    fetchOptionalLeague('ligue 1').then((teams) => normalizeTeams(teams, 'Ligue 1', 'ligue 1')),
    fetchOptionalLeague('bundesliga').then((teams) => normalizeTeams(teams, 'Bundesliga', 'bundesliga'))
  ])

  return [...laLigaTeams, ...premierLeagueTeams, ...championsLeagueTeams, ...internationalTeams, ...serieATeams, ...leagueOneTeams, ...bundesligaTeams]
})

const { data: topPerformers, pending: performersPending, error: performersError } = await useAsyncData('top-performers', async () => {
  const { supabase } = useSupabase()
  const { data, error } = await supabase
    .from('top_performers')
    .select('*')
    .order('rating', { ascending: false })

  if (error) {
    console.warn('Failed to load top performers:', error.message)
    return []
  }

  return data ?? []
})

const laLigaCount = computed(() => ((allTeams.value ?? []).filter((team: Record<string, any>) => normalizeLeagueValue(team.league) === 'LaLiga').length))

const premierLeagueCount = computed(() => ((allTeams.value ?? []).filter((team: Record<string, any>) => normalizeLeagueValue(team.league) === 'Premier League').length))

const championsLeagueCount = computed(() => ((allTeams.value ?? []).filter((team: Record<string, any>) => normalizeLeagueValue(team.league) === 'Champions League').length))

const internationalCount = computed(() => ((allTeams.value ?? []).filter((team: Record<string, any>) => normalizeLeagueValue(team.league) === 'International').length))

const serieACount = computed(() => ((allTeams.value ?? []).filter((team: Record<string, any>) => normalizeLeagueValue(team.league) === 'Serie A').length))

const leagueTeams = computed(() => {
  const leagueMap: Record<string, string> = {
    'La Liga': 'LaLiga',
    'Premier League': 'Premier League',
    'Champions League': 'Champions League',
    'International': 'International',
    'Serie A': 'Serie A',
    'Ligue 1': 'Ligue 1',
    'Bundesliga': 'Bundesliga'
  }
  const normalizedLeague = leagueMap[selectedLeague.value] || selectedLeague.value

  return (allTeams.value ?? [])
    .filter((team: Record<string, any>) => normalizeLeagueValue(team.league) === normalizedLeague)
    .map((team: Record<string, any>, index: number) => buildTeamCardData(team, index))
})

const getTeamProfileRoute = (team: Record<string, any>) => {
  const route = {
    path: `/team/${getTeamSlug(team)}`
  } as { path: string, query?: Record<string, string> }

  if (team.source_table) {
    route.query = { source: team.source_table }
  }

  return route
}
</script>

<template>
  <main class="team-page">
    <section class="page-hero team-hero">
      <div class="hero-overlay"></div>
      <div class="container team-hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">Club directory</span>
          <h1>Elite squads, league storylines, and form trackers for football’s leading clubs.</h1>
          <p class="hero-copy-text">A premium club-focused page with team data, league comparison, and form insight for modern supporters.</p>
        </div>
        <aside class="hero-team-summary">
          <div class="hero-card-label">Top leagues</div>
          <h3>Featured clubs</h3>
          <div class="hero-stat-grid">
            <div class="stat-block">
              <span>7</span>
              <span>Leagues covered</span>
            </div>
            <div class="stat-block">
              <span>{{ laLigaCount }}</span>
              <span>Teams in La Liga</span>
            </div>
            <div class="stat-block">
              <span>Fresh</span>
              <span>Live Supabase data</span>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="team-tabs-panel container">
      <p class="section-label">League selector</p>
      <div class="team-tabs">
        <button
          v-for="league in leagueTabs"
          :key="league"
          type="button"
          :class="['team-tab', { active: selectedLeague === league }]"
          @click="selectedLeague = league"
        >
          {{ league }}
        </button>
      </div>
    </section>

    <section class="team-directory container">
      <div class="section-header">
        <p class="section-label">{{ selectedLeague }}</p>
        <h2>{{ selectedLeague === 'La Liga' ? 'La Liga Clubs' : 'Top teams shaping the season' }}</h2>
      </div>
      <div v-if="error" class="error-message">
        <p>Unable to load teams from Supabase: {{ error.message }}</p>
      </div>
      <div v-if="pending" class="loading-message">
        <p>Loading teams from Supabase…</p>
      </div>
      <div v-if="!pending && !error && leagueTeams.length === 0" class="empty-message">
        <p>No teams found for {{ selectedLeague }}.</p>
      </div>
      <div v-if="!error" class="team-grid">
        <div
          v-for="team in leagueTeams"
          :key="team.slug || team.team"
          class="team-card-link"
        >
          <TeamCard
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
      </div>
    </section>
  </main>
</template>
