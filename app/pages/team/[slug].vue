<script setup lang="ts">
import { useHead, useAsyncData, useRoute, computed, ref, watch } from '#imports'
import { useSupabase } from '~/composables/useSupabase'
import {
  getTeamDisplayName,
  getTeamLogo,
  getTeamPrimaryColor,
  getTeamSecondaryColor,
  getTeamSlug,
  getTeamSummary,
  isMissingSupabaseTableError,
  normalizeLeagueValue
} from '~/composables/useTeamTable'

type TeamRecord = Record<string, any>

const route = useRoute()
const slug = String(route.params.slug || '')
const requestedSource = typeof route.query.source === 'string' ? route.query.source : ''

const leagueTables = [
  { table: 'Laliga', league: 'LaLiga' },
  { table: 'premier league', league: 'Premier League' },
  { table: 'champions league', league: 'Champions League' },
  { table: 'international', league: 'International' },
  { table: 'serie a', league: 'Serie A' },
  { table: 'bundesliga', league: 'Bundesliga' },
  { table: 'ligue 1', league: 'Ligue 1' },
  { table: 'teams', league: '' }
]

const logoLoadFailed = ref(false)
const looksLikeImage = (value: string) => /\.(avif|jpe?g|png|svg|webp)$/i.test(value)

const formatLabel = (key: string) =>
  key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') return 'N/A'
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

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

const findTeamInTable = async (table: string, fallbackLeague: string) => {
  const { supabase } = useSupabase()
  const { data, error } = await supabase
    .from(table)
    .select('*')

  if (error) {
    if (!isMissingSupabaseTableError(error)) {
      console.warn(`Skipping ${table} profile lookup: ${error.message}`)
    }
    return null
  }

  const found = (data ?? []).find((item: TeamRecord) => getTeamSlug(item) === slug)
  if (!found) return null

  return {
    ...found,
    league: normalizeLeagueValue(found.league || fallbackLeague),
    source_table: table
  }
}

const { data: teamData, pending, error } = await useAsyncData(`team-profile-${requestedSource || 'all'}-${slug}`, async () => {
  const preferredTable = leagueTables.find((item) => item.table === requestedSource)
  const searchOrder = preferredTable
    ? [preferredTable, ...leagueTables.filter((item) => item.table !== preferredTable.table)]
    : leagueTables

  for (const item of searchOrder) {
    const result = await findTeamInTable(item.table, item.league)
    if (result) return result
  }

  return null
})

const team = computed(() => {
  const value = teamData.value
  if (!value) return null

  return {
    ...value,
    name: getTeamDisplayName(value),
    league: normalizeLeagueValue(value.league),
    summary: value.summary || value.description || value.bio || getTeamSummary(value),
    logo: getTeamLogo(value),
    primary_color: getTeamPrimaryColor(value),
    secondary_color: getTeamSecondaryColor(value)
  }
})

const profileLogoSrc = computed(() => {
  if (!team.value) return ''

  const logo = String(team.value.logo || '').trim()
  if (/^https?:\/\//i.test(logo) || logo.startsWith('/')) return logo
  if (looksLikeImage(logo)) return `/Images/teams-logo/${logo}`
  return ''
})

const profileLogoText = computed(() => {
  if (!team.value) return ''

  const logo = String(team.value.logo || '').trim()
  return looksLikeImage(logo) || !logo ? team.value.name.slice(0, 2).toUpperCase() : logo
})

watch(() => team.value?.logo, () => {
  logoLoadFailed.value = false
})

useHead(() => ({
  title: team.value ? `${team.value.name} | Team Profile` : `Team | ${slug}`,
  meta: [
    {
      name: 'description',
      content: team.value
        ? `${team.value.name} profile with club information from Supabase.`
        : 'Team details page for Football News.'
    }
  ]
}))

const profileStats = computed(() => {
  if (!team.value) return []

  return [
    { label: 'League', value: team.value.league },
    { label: 'Country', value: team.value.country },
    { label: 'City', value: team.value.city },
    { label: 'Founded', value: team.value.founded },
    { label: 'Stadium', value: team.value.stadium },
    { label: 'Capacity', value: team.value.capacity },
    { label: 'Coach', value: team.value.coach },
    { label: 'Short Name', value: team.value.short_name }
  ].filter((item) => item.value !== null && item.value !== undefined && item.value !== '')
})

const colorSwatches = computed(() => {
  if (!team.value) return []

  return [
    { label: 'Primary', value: team.value.primary_color },
    { label: 'Secondary', value: team.value.secondary_color }
  ].filter((item) => item.value)
})

const additionalFields = computed(() => {
  if (!team.value) return []

  const hiddenFields = new Set([
    'id',
    'name',
    'team',
    'club',
    'title',
    'fullname',
    'slug',
    'short_name',
    'stadium',
    'city',
    'founded',
    'country',
    'league',
    'website',
    'capacity',
    'coach',
    'manager',
    'primary_color',
    'secondary_color',
    'summary',
    'description',
    'bio',
    'logo',
    'logo_url',
    'badge_url',
    'image_url',
    'crest',
    'source_table',
    'created_at',
    'updated_at'
  ])

  return Object.entries(team.value)
    .filter(([key, value]) => !hiddenFields.has(key) && value !== null && value !== undefined && value !== '')
    .map(([key, value]) => ({ label: formatLabel(key), value: formatValue(value) }))
})

const getNewsDate = (article: Record<string, any>) => article.published_at || article.created_at || ''

const getNewsSlug = (article: Record<string, any>) => {
  const storedSlug = getTextValue(article, ['slug'])
  if (storedSlug) return storedSlug

  const headline = getTextValue(article, ['title', 'headline', 'name'])
  if (headline) return createSlug(headline)

  return article.id ? String(article.id) : ''
}

const normalizeTeamNews = (article: Record<string, any>) => {
  const headline = getTextValue(article, ['title', 'headline', 'name']) || 'Football update'
  const summary = getTextValue(article, ['summary', 'excerpt', 'description', 'content']) || 'Fresh update from the news table.'
  const date = getNewsDate(article)
  const articleSlug = getNewsSlug(article)

  return {
    id: article.id || articleSlug || headline,
    headline,
    summary: summary.length > 150 ? `${summary.slice(0, 147)}...` : summary,
    date,
    to: articleSlug ? `/news-detail/${articleSlug}` : ''
  }
}

const isNewsForTeam = (article: Record<string, any>) => {
  if (!team.value) return false

  const teamName = team.value.name
  const teamSlug = getTeamSlug(team.value)
  const explicitTeamValues = [
    getTextValue(article, ['team_slug']),
    getTextValue(article, ['team', 'club', 'team_name', 'club_name']),
    getTextValue(article, ['teams', 'clubs', 'related_teams'])
  ].filter(Boolean)

  if (explicitTeamValues.some((value) => createSlug(value) === teamSlug || value.toLowerCase().includes(teamName.toLowerCase()))) {
    return true
  }

  const searchableText = [
    getTextValue(article, ['title', 'headline', 'name']),
    getTextValue(article, ['summary', 'excerpt', 'description']),
    getTextValue(article, ['content', 'body', 'details'])
  ].join(' ').toLowerCase()

  return searchableText.includes(teamName.toLowerCase())
}

const { data: latestNews } = await useAsyncData(`news-${slug}`, async () => {
  if (!team.value) return []

  const { supabase } = useSupabase()

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    console.warn(`Skipping team news: ${error.message}`)
    return []
  }

  return (data ?? [])
    .filter((article: Record<string, any>) => isNewsForTeam(article))
    .sort((a: Record<string, any>, b: Record<string, any>) => new Date(getNewsDate(b)).getTime() - new Date(getNewsDate(a)).getTime())
    .slice(0, 6)
    .map((article: Record<string, any>) => normalizeTeamNews(article))
})
</script>

<template>
  <main class="team-detail-page">
    <section class="team-profile-hero" :style="{ '--team-primary': team?.primary_color || '#16A34A', '--team-secondary': team?.secondary_color || '#FFFFFF' }">
      <div class="container team-profile-hero__grid">
        <div class="team-profile-hero__copy">
          <a href="#" class="team-profile-back" @click.prevent="$router.back()">Back to teams</a>
          <p class="section-label">Team profile</p>
          <h1>{{ team?.name || 'Team not found' }}</h1>
          <p v-if="team">{{ team.summary }}</p>
          <p v-else>We could not find this team in the connected Supabase league tables.</p>
        </div>

        <aside v-if="team" class="team-profile-identity">
          <div class="team-profile-logo">
            <img v-if="profileLogoSrc && !logoLoadFailed" :src="profileLogoSrc" :alt="`${team.name} logo`" @error="logoLoadFailed = true">
            <span v-else>{{ profileLogoText }}</span>
          </div>
          <div>
            <span>{{ team.short_name || team.name }}</span>
            <strong>{{ team.league }}</strong>
          </div>
        </aside>
      </div>
    </section>

    <section class="team-profile-status container" v-if="pending">
      <p>Loading team profile...</p>
    </section>

    <section class="team-profile-status container" v-else-if="error">
      <p>Error loading team: {{ error.message }}</p>
    </section>

    <section class="team-profile-status container" v-else-if="!team">
      <p>Team not found or the slug is invalid.</p>
    </section>

    <template v-else>
      <section class="team-profile-overview container">
        <div class="team-profile-main">
          <div class="section-header">
            <p class="section-label">Club overview</p>
            <h2>{{ team.name }}</h2>
          </div>
          <p>{{ team.summary }}</p>

          <div class="team-color-row" v-if="colorSwatches.length">
            <div v-for="color in colorSwatches" :key="color.label" class="team-color-chip">
              <span :style="{ background: color.value }"></span>
              <div>
                <strong>{{ color.label }}</strong>
                <small>{{ color.value }}</small>
              </div>
            </div>
          </div>
        </div>

        <aside class="team-profile-side">
          <p class="section-label">Source</p>
          <h3>{{ team.source_table }}</h3>
          <p>This profile is loaded from the Supabase {{ team.source_table }} table.</p>
          <a v-if="team.website && team.website !== '#'" :href="team.website" target="_blank" rel="noreferrer" class="btn btn-primary">Official website</a>
        </aside>
      </section>

      <section class="team-profile-facts container">
        <article v-for="item in profileStats" :key="item.label" class="team-profile-fact">
          <span>{{ item.label }}</span>
          <strong>{{ formatValue(item.value) }}</strong>
        </article>
      </section>

      <section class="team-profile-extra container" v-if="additionalFields.length">
        <div class="section-header">
          <p class="section-label">More from Supabase</p>
          <h2>Additional team information</h2>
        </div>
        <div class="team-profile-extra__grid">
          <article v-for="item in additionalFields" :key="item.label" class="team-detail-card">
            <strong>{{ item.label }}</strong>
            <p>{{ item.value }}</p>
          </article>
        </div>
      </section>

      <section class="team-news container">
        <div class="section-header">
          <p class="section-label">Latest news</p>
          <h2>{{ team.name }} news</h2>
        </div>

        <div v-if="latestNews && latestNews.length" class="team-news-grid">
          <article
            v-for="article in latestNews"
            :key="article.id"
            class="team-news-card"
          >
            <div class="team-news-card__meta">
              <span>Club news</span>
              <time v-if="article.date">{{ new Date(article.date).toLocaleDateString() }}</time>
            </div>
            <h3>{{ article.headline }}</h3>
            <p>{{ article.summary }}</p>
            <NuxtLink v-if="article.to" :to="article.to" class="team-news-card__link">Read story</NuxtLink>
          </article>
        </div>

        <p v-else class="team-news-empty">No news available for this team.</p>
      </section>
    </template>
  </main>
</template>
