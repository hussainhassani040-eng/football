<script setup lang="ts">
import { useHead } from '#imports'
import { useSupabase } from '~/composables/useSupabase'
import { computed } from 'vue'

useHead({
  title: 'All Fixtures | Football News',
  meta: [
    { name: 'description', content: 'Browse all football fixtures, upcoming matches, and scheduled games from leagues around the world.' },
    { property: 'og:title', content: 'All Fixtures | Football News' },
    { property: 'og:description', content: 'Complete list of football fixtures from every major competition.' },
    { property: 'og:type', content: 'website' }
  ]
})

interface Fixture {
  id: number
  home_team: string
  away_team: string
  home_logo?: string
  away_logo?: string
  home_score?: number
  away_score?: number
  time?: string
  status?: 'upcoming' | 'live' | 'finished'
  competition?: string
  venue?: string
  created_at?: string
}

const { supabase } = useSupabase()

const { data: fixturesData, pending } = await useAsyncData<Fixture[]>('all-fixtures', async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('today_fixtures')
      .select('*')
      .order('time', { ascending: true, nullsFirst: false })

    if (fetchError) {
      console.error('Error fetching fixtures:', fetchError)
      return []
    }

    return (data || []) as Fixture[]
  } catch (err) {
    console.error('Unable to load fixtures:', err)
    return []
  }
})

const fixtures = computed(() => fixturesData.value || [])

const getInitials = (name: string): string => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <main class="fixtures-page">
    <!-- Hero -->
    <section class="fixtures-hero">
      <div class="fixtures-hero-bg"></div>
      <div class="fixtures-hero-overlay"></div>
      <div class="container fixtures-hero-content">
        <span class="fixtures-hero-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
          All Fixtures
        </span>
        <h1 class="fixtures-hero-title">Football Fixtures</h1>
        <p class="fixtures-hero-subtitle">
          Browse all scheduled matches, live games, and completed fixtures from every major competition.
        </p>
      </div>
    </section>

    <!-- All Fixtures -->
    <section class="today-fixtures-section">
      <div class="fixtures-inner container">
        <div class="fixtures-header">
          <div class="fixtures-header-left">
            <span class="fixtures-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
              All Matches
            </span>
            <span class="fixtures-count">{{ fixtures.length }} Matches</span>
          </div>
        </div>

        <div v-if="pending" class="fixtures-loading">
          <div class="fixtures-loading-spinner"></div>
          <span>Loading fixtures...</span>
        </div>

        <div v-else-if="!fixtures.length" class="fixtures-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>
            <path d="M2 12h20"/>
          </svg>
          <span>No fixtures scheduled</span>
        </div>

        <div v-else class="fixtures-grid">
          <div
            v-for="fixture in fixtures"
            :key="fixture.id"
            class="fixture-card"
          >
            <div class="fixture-competition">
              <span class="fixture-comp-badge">{{ fixture.competition || 'Friendly' }}</span>
              <span class="fixture-time">{{ fixture.time || 'TBD' }}</span>
            </div>

            <div class="fixture-teams">
              <div class="fixture-team home">
                <img
                  v-if="fixture.home_logo"
                  :src="fixture.home_logo"
                  :alt="fixture.home_team"
                  class="fixture-team-logo"
                  loading="lazy"
                />
                <div v-else class="fixture-team-logo-placeholder">
                  {{ getInitials(fixture.home_team) }}
                </div>
                <span class="fixture-team-name">{{ fixture.home_team }}</span>
              </div>

              <div class="fixture-vs">
                <span class="fixture-vs-text">vs</span>
              </div>

              <div class="fixture-team away">
                <img
                  v-if="fixture.away_logo"
                  :src="fixture.away_logo"
                  :alt="fixture.away_team"
                  class="fixture-team-logo"
                  loading="lazy"
                />
                <div v-else class="fixture-team-logo-placeholder">
                  {{ getInitials(fixture.away_team) }}
                </div>
                <span class="fixture-team-name">{{ fixture.away_team }}</span>
              </div>
            </div>

            <div class="fixture-status">
              <template v-if="fixture.status === 'live'">
                <span class="fixture-live-badge">
                  <span class="fixture-live-dot"></span>
                  LIVE
                </span>
                <span class="fixture-score">{{ fixture.home_score }} - {{ fixture.away_score }}</span>
              </template>
              <template v-else-if="fixture.status === 'finished'">
                <span class="fixture-finished-badge">FT</span>
                <span class="fixture-score finished">{{ fixture.home_score }} - {{ fixture.away_score }}</span>
              </template>
              <template v-else>
                <span class="fixture-upcoming-badge">{{ fixture.time || 'TBD' }}</span>
              </template>
            </div>

            <div v-if="fixture.venue" class="fixture-venue">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{{ fixture.venue }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.fixtures-page {
  min-height: 100vh;
  background: #F8FAFC;
}

/* Hero */
.fixtures-hero {
  position: relative;
  overflow: hidden;
  padding: 5rem 0 4rem;
}

.fixtures-hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
}

.fixtures-hero-overlay {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 20% 50%, rgba(59,130,246,0.08) 0%, transparent 60%),
                    radial-gradient(circle at 80% 50%, rgba(139,92,246,0.06) 0%, transparent 60%);
}

.fixtures-hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.fixtures-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(59,130,246,0.15);
  color: #60A5FA;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 1.2rem;
}

.fixtures-hero-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: white;
  margin: 0 0 1rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.fixtures-hero-subtitle {
  color: #94A3B8;
  font-size: 1.1rem;
  line-height: 1.7;
  margin: 0;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .fixtures-hero {
    padding: 3.5rem 0 2.5rem;
  }
  .fixtures-hero-title {
    font-size: 1.8rem;
  }
  .fixtures-hero-subtitle {
    font-size: 0.95rem;
  }
}
</style>