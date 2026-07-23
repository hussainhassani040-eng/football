<template>
  <section class="today-fixtures-section">
    <div class="fixtures-inner">
      <!-- ═══ Section Header ═══ -->
      <div class="fixtures-header">
        <div class="fixtures-header-left">
          <span class="fixtures-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
            Today's Fixtures
          </span>
          <span class="fixtures-count">{{ fixtures.length }} Matches</span>
        </div>
        <NuxtLink to="/fixtures" class="fixtures-view-all">
          View All
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- ═══ Loading State ═══ -->
      <div v-if="pending" class="fixtures-loading">
        <div class="fixtures-loading-spinner"></div>
        <span>Loading fixtures...</span>
      </div>

      <!-- ═══ Empty State ═══ -->
      <div v-else-if="!fixtures.length" class="fixtures-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>
          <path d="M2 12h20"/>
        </svg>
        <span>No fixtures scheduled for today</span>
      </div>

      <!-- ═══ Fixtures Grid ═══ -->
      <div v-else class="fixtures-grid">
        <div
          v-for="fixture in fixtures"
          :key="fixture.id"
          class="fixture-card"
        >
          <!-- Competition Badge -->
          <div class="fixture-competition">
            <span class="fixture-comp-badge">{{ fixture.competition || 'Friendly' }}</span>
            <span class="fixture-time">{{ fixture.time || 'TBD' }}</span>
          </div>

          <!-- Teams -->
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

          <!-- Score or Status -->
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

          <!-- Venue -->
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
</template>

<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'
import { computed } from 'vue'

interface TodayFixture {
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

const props = withDefaults(defineProps<{
  limit?: number
}>(), {
  limit: 0,
})

const { supabase } = useSupabase()

const { data: fixturesData, pending } = await useAsyncData<TodayFixture[]>('today-fixtures', async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('today_fixtures')
      .select('*')
      .order('time', { ascending: true, nullsFirst: false })

    if (fetchError) {
      console.error('Error fetching today fixtures:', fetchError)
      return []
    }

    return (data || []) as TodayFixture[]
  } catch (err) {
    console.error('Unable to load today fixtures:', err)
    return []
  }
})

const fixtures = computed(() => {
  const all = fixturesData.value || []
  return props.limit > 0 ? all.slice(0, props.limit) : all
})

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