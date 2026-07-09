<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { navigateTo, useHead } from '#imports'

useHead({
  title: 'Dashboard | Football News',
  meta: [
    { name: 'description', content: 'Manage your Football News profile, news posts, leagues, and transfer updates.' },
    { property: 'og:title', content: 'Dashboard | Football News' },
    { property: 'og:description', content: 'A private dashboard for managing Football News content.' },
    { property: 'og:type', content: 'website' }
  ]
})

const { user, loading, initialize, signOut } = useAuth()
const { supabase } = useSupabase()

const profileStatus = ref('')
const profileError = ref('')
const draftMessage = ref('')
const savingProfile = ref(false)
const activeMenu = ref('Profile')

const profile = reactive({
  fullName: '',
  role: 'Editor',
  bio: ''
})

const newsForm = reactive({
  headline: '',
  category: 'News',
  summary: ''
})

const leagueForm = reactive({
  name: '',
  region: '',
  description: ''
})

const transferForm = reactive({
  player: '',
  club: '',
  status: 'Rumour'
})

const draftNews = ref([
  { headline: 'Derby preview leads weekend coverage', category: 'Match Preview', summary: 'A tactical preview ready for final editing.' }
])

const draftLeagues = ref([
  { name: 'Premier League', region: 'England', description: 'Fast-moving coverage for the title race.' }
])

const draftTransfers = ref([
  { player: 'Kylian Mbappe', club: 'Real Madrid', status: 'Confirmed' }
])

const matchResults = ref<any[]>([])
const loadingMatchResults = ref(false)
const resultsError = ref('')

const dashboardMenuItems = [
  { label: 'Profile', marker: 'P' },
  { label: 'News', marker: 'N' },
  { label: 'Leagues', marker: 'L' },
  { label: 'Transfers', marker: 'T' },
  { label: 'Results', marker: 'R' },
  { label: 'Drafts', marker: 'D' }
]

const userInitial = computed(() => {
  return (profile.fullName || user.value?.email || 'U').charAt(0).toUpperCase()
})

const displayName = computed(() => {
  return profile.fullName || user.value?.email || 'Editor'
})

const applyUserProfile = () => {
  const metadata = user.value?.user_metadata

  profile.fullName = typeof metadata?.full_name === 'string' ? metadata.full_name : ''
  profile.role = typeof metadata?.role === 'string' ? metadata.role : 'Editor'
  profile.bio = typeof metadata?.bio === 'string' ? metadata.bio : ''
}

const getResultValue = (result: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = result[key]
    if (value !== null && value !== undefined && value !== '') {
      return String(value)
    }
  }

  return 'TBD'
}

const getScoreLabel = (result: Record<string, unknown>) => {
  const homeScore = getResultValue(result, ['home_score', 'homeScore', 'home_goals', 'homeGoals'])
  const awayScore = getResultValue(result, ['away_score', 'awayScore', 'away_goals', 'awayGoals'])

  if (homeScore !== 'TBD' && awayScore !== 'TBD') {
    return `${homeScore} - ${awayScore}`
  }

  return 'vs'
}

const formatResultDate = (result: Record<string, unknown>) => {
  const rawDate = result.match_date || result.date || result.played_at || result.created_at

  if (!rawDate) {
    return 'Scheduled'
  }

  const parsedDate = new Date(String(rawDate))

  if (Number.isNaN(parsedDate.getTime())) {
    return String(rawDate)
  }

  return parsedDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const fetchMatchResults = async () => {
  if (!supabase) {
    return
  }

  loadingMatchResults.value = true
  resultsError.value = ''

  const { data, error } = await supabase
    .from('match_results')
    .select('*')
    .order('match_date', { ascending: false })
    .limit(10)

  loadingMatchResults.value = false

  if (error) {
    resultsError.value = error.message
    matchResults.value = []
    return
  }

  matchResults.value = data ?? []
}

const saveProfile = async () => {
  profileStatus.value = ''
  profileError.value = ''
  savingProfile.value = true

  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: profile.fullName,
      role: profile.role,
      bio: profile.bio
    }
  })

  savingProfile.value = false

  if (error) {
    profileError.value = error.message
    return
  }

  profileStatus.value = 'Profile updated successfully.'
}

const addNews = () => {
  draftNews.value.unshift({ ...newsForm })
  newsForm.headline = ''
  newsForm.category = 'News'
  newsForm.summary = ''
  draftMessage.value = 'News draft added.'
}

const addLeague = () => {
  draftLeagues.value.unshift({ ...leagueForm })
  leagueForm.name = ''
  leagueForm.region = ''
  leagueForm.description = ''
  draftMessage.value = 'League draft added.'
}

const addTransfer = () => {
  draftTransfers.value.unshift({ ...transferForm })
  transferForm.player = ''
  transferForm.club = ''
  transferForm.status = 'Rumour'
  draftMessage.value = 'Transfer draft added.'
}

const handleSignOut = async () => {
  await signOut()
}

onMounted(async () => {
  await initialize()

  if (!user.value) {
    await navigateTo('/login')
    return
  }

  applyUserProfile()
  await fetchMatchResults()
})

watch(user, async (currentUser) => {
  if (!currentUser) {
    await navigateTo('/login')
    return
  }

  applyUserProfile()
  await fetchMatchResults()
})
</script>

<template>
  <main class="dashboard-page">
    <section class="dashboard-hero">
      <div class="container dashboard-hero-grid">
        <div class="dashboard-intro">
          <span class="section-label">Editor dashboard</span>
          <h1>Manage your football coverage</h1>
          <p>Update your profile and prepare the latest news, league, and transfer content from one clean workspace.</p>
        </div>

        <aside class="dashboard-profile-summary">
          <div class="profile-avatar">{{ userInitial }}</div>
          <div>
            <h2>{{ displayName }}</h2>
            <p>{{ user?.email }}</p>
          </div>
          <button class="btn btn-secondary dashboard-signout" type="button" :disabled="loading" @click="handleSignOut">
            Log out
          </button>
        </aside>
      </div>
    </section>

    <section class="dashboard-content container">
      <aside class="dashboard-side-menu" aria-label="Dashboard sections">
        <div class="side-menu-header">
          <span class="section-label">Menu</span>
          <h2>Workspace</h2>
        </div>

        <nav class="side-menu-links">
          <button v-for="item in dashboardMenuItems" :key="item.label" type="button" class="side-menu-link" :class="{ active: activeMenu === item.label }" @click="activeMenu = item.label">
            <span>{{ item.marker }}</span>
            {{ item.label }}
          </button>
        </nav>
      </aside>

      <div class="dashboard-main">
      <div class="dashboard-grid">
        <form v-if="activeMenu === 'Profile'" class="dashboard-panel profile-panel" @submit.prevent="saveProfile">
          <div class="panel-heading">
            <span class="section-label">Profile</span>
            <h2>Update profile</h2>
          </div>

          <label class="form-field">
            <span>Full name</span>
            <input v-model="profile.fullName" type="text" autocomplete="name" placeholder="Your name" />
          </label>

          <label class="form-field">
            <span>Role</span>
            <input v-model="profile.role" type="text" placeholder="Editor, Admin, Reporter" />
          </label>

          <label class="form-field">
            <span>Bio</span>
            <textarea v-model="profile.bio" rows="5" placeholder="Short editorial bio"></textarea>
          </label>

          <p v-if="profileError" class="field-error">{{ profileError }}</p>
          <p v-if="profileStatus" class="form-success">{{ profileStatus }}</p>

          <button class="btn btn-primary dashboard-action" type="submit" :disabled="savingProfile">
            {{ savingProfile ? 'Saving...' : 'Save profile' }}
          </button>
        </form>

        <div v-if="activeMenu === 'News'" class="dashboard-panel content-panel">
          <div class="panel-heading">
            <span class="section-label">Content</span>
            <h2>Add news</h2>
          </div>

          <form class="dashboard-form" @submit.prevent="addNews">
            <label class="form-field">
              <span>Headline</span>
              <input v-model="newsForm.headline" type="text" required placeholder="Story headline" />
            </label>
            <label class="form-field">
              <span>Category</span>
              <input v-model="newsForm.category" type="text" required placeholder="Transfers, Match Review" />
            </label>
            <label class="form-field form-full">
              <span>Summary</span>
              <textarea v-model="newsForm.summary" rows="4" required placeholder="Brief story summary"></textarea>
            </label>
            <button class="btn btn-primary dashboard-action" type="submit">Add news</button>
          </form>
        </div>

        <div v-if="activeMenu === 'Leagues'" class="dashboard-panel content-panel">
          <div class="panel-heading">
            <span class="section-label">Leagues</span>
            <h2>Add league</h2>
          </div>

          <form class="dashboard-form" @submit.prevent="addLeague">
            <label class="form-field">
              <span>League name</span>
              <input v-model="leagueForm.name" type="text" required placeholder="Premier League" />
            </label>
            <label class="form-field">
              <span>Region</span>
              <input v-model="leagueForm.region" type="text" required placeholder="England" />
            </label>
            <label class="form-field form-full">
              <span>Description</span>
              <textarea v-model="leagueForm.description" rows="4" required placeholder="League coverage note"></textarea>
            </label>
            <button class="btn btn-primary dashboard-action" type="submit">Add league</button>
          </form>
        </div>

        <div v-if="activeMenu === 'Transfers'" class="dashboard-panel content-panel">
          <div class="panel-heading">
            <span class="section-label">Transfers</span>
            <h2>Add transfer</h2>
          </div>

          <form class="dashboard-form" @submit.prevent="addTransfer">
            <label class="form-field">
              <span>Player</span>
              <input v-model="transferForm.player" type="text" required placeholder="Player name" />
            </label>
            <label class="form-field">
              <span>Club</span>
              <input v-model="transferForm.club" type="text" required placeholder="Club involved" />
            </label>
            <label class="form-field">
              <span>Status</span>
              <select v-model="transferForm.status" required>
                <option>Rumour</option>
                <option>Negotiating</option>
                <option>Confirmed</option>
                <option>Official</option>
              </select>
            </label>
            <button class="btn btn-primary dashboard-action" type="submit">Add transfer</button>
          </form>
        </div>

        <div v-if="activeMenu === 'Results'" class="dashboard-panel content-panel">
          <div class="panel-heading">
            <span class="section-label">Results</span>
            <h2>Latest match results</h2>
          </div>

          <p v-if="resultsError" class="field-error">{{ resultsError }}</p>

          <div v-if="loadingMatchResults" class="results-loading">Loading results…</div>

          <div v-else-if="matchResults.length" class="results-list">
            <article v-for="result in matchResults" :key="result.id || `${getResultValue(result, ['home_team', 'homeTeam', 'team_home'])}-${getResultValue(result, ['away_team', 'awayTeam', 'team_away'])}`" class="result-card">
              <div class="result-score-row">
                <span>{{ getResultValue(result, ['home_team', 'homeTeam', 'team_home']) }}</span>
                <strong>{{ getScoreLabel(result) }}</strong>
                <span>{{ getResultValue(result, ['away_team', 'awayTeam', 'team_away']) }}</span>
              </div>
              <p class="result-meta">{{ formatResultDate(result) }}</p>
            </article>
          </div>

          <p v-else class="empty-state">No match results are available yet.</p>
        </div>
      </div>

      <div v-if="activeMenu === 'Drafts'" class="dashboard-activity">
        <div class="panel-heading">
          <span class="section-label">Drafts</span>
          <h2>Recent updates</h2>
          <p v-if="draftMessage" class="form-success">{{ draftMessage }}</p>
        </div>

        <div class="activity-columns">
          <article class="activity-panel">
            <h3>News</h3>
            <ul>
              <li v-for="item in draftNews" :key="item.headline">
                <strong>{{ item.headline }}</strong>
                <span>{{ item.category }}</span>
              </li>
            </ul>
          </article>

          <article class="activity-panel">
            <h3>Leagues</h3>
            <ul>
              <li v-for="item in draftLeagues" :key="item.name">
                <strong>{{ item.name }}</strong>
                <span>{{ item.region }}</span>
              </li>
            </ul>
          </article>

          <article class="activity-panel">
            <h3>Transfers</h3>
            <ul>
              <li v-for="item in draftTransfers" :key="`${item.player}-${item.club}`">
                <strong>{{ item.player }}</strong>
                <span>{{ item.club }} - {{ item.status }}</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.dashboard-panel .results-list {
  display: grid;
  gap: 0.9rem;
}

.dashboard-panel .result-card {
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 0.9rem;
  padding: 0.95rem 1rem;
  background: #f8fafc;
}

.dashboard-panel .result-score-row {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  font-weight: 700;
  color: #0f172a;
}

.dashboard-panel .result-meta {
  margin-top: 0.4rem;
  color: #475569;
  font-size: 0.9rem;
}

.dashboard-panel .results-loading,
.dashboard-panel .empty-state {
  color: #475569;
}

.side-menu-link.active {
  background: #2563eb;
  color: #fff;
}

.side-menu-link {
  width: 100%;
  cursor: pointer;
  border: none;
  text-align: left;
}
</style>