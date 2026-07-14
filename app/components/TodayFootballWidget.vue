<template>
  <aside class="today-widget">
    <!-- ═══ Loading State ═══ -->
    <div v-if="pending" class="widget-loading">
      <div class="loading-spinner"></div>
      <span class="loading-text">Loading today's stats...</span>
    </div>

    <!-- ═══ Fallback / Empty State ═══ -->
    <div v-else-if="!stats" class="widget-empty">
      <div class="empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>
          <path d="M2 12h20"/>
        </svg>
      </div>
      <span class="empty-text">No stats available today</span>
    </div>

    <!-- ═══ Main Content ═══ -->
    <template v-else>
      <!-- ═══ Premium Header ═══ -->
      <div class="widget-header">
        <div class="header-left">
          <div class="header-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>
              <path d="M2 12h20"/>
            </svg>
          </div>
          <div class="header-title-group">
            <h3 class="widget-title">Today's Football</h3>
            <span class="live-indicator-group">
              <span class="live-dot"></span>
              <span class="live-text">Live</span>
            </span>
          </div>
        </div>
        <div class="header-right">
          <span class="update-timestamp">Updated {{ timeAgo }}</span>
        </div>
      </div>

      <!-- ═══ Featured Statistic ═══ -->
      <div class="featured-stat">
        <span class="featured-stat-number" ref="statRef">{{ stats.matches_today }}</span>
        <span class="featured-stat-label">Matches Today</span>
      </div>

      <!-- ═══ Live Match Highlight ═══ -->
      <div class="match-highlight">
        <div class="match-badge">Live</div>
        <div class="match-teams">
          <div class="match-team home">
            <img
              class="team-logo-img"
              src="/Images/teams-logo/fc-barcelona-logo-footylogos.png"
              alt="Home"
              loading="lazy"
            />
            <span class="team-full">{{ stats.biggest_match_h }}</span>
            <span class="team-score live">2</span>
          </div>
          <div class="match-divider">
            <span class="match-vs">vs</span>
            <span class="match-time">{{ stats.match_time }}</span>
          </div>
          <div class="match-team away">
            <img
              class="team-logo-img"
              src="/Images/teams-logo/real-madrid-logo-footylogos.png"
              alt="Away"
              loading="lazy"
            />
            <span class="team-full">{{ stats.biggest_match_a }}</span>
            <span class="team-score live">1</span>
          </div>
        </div>
        <div class="match-competition">
          <span>{{ stats.competition }}</span>
        </div>
      </div>

      <!-- ═══ Biggest Match Section ═══ -->
      <div class="biggest-match">
        <div class="section-heading">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>Biggest Match Today</span>
        </div>
        <div class="biggest-match-body">
          <div class="biggest-match-club">
            <img
              class="club-logo"
              src="/Images/teams-logo/real-madrid-logo-footylogos.png"
              alt="Home"
              loading="lazy"
            />
            <span class="club-name">{{ stats.biggest_match_h }}</span>
          </div>
          <div class="biggest-match-center">
            <span class="biggest-match-vs">vs</span>
            <span class="biggest-match-time">{{ stats.match_time }}</span>
          </div>
          <div class="biggest-match-club">
            <img
              class="club-logo"
              src="/Images/teams-logo/fc-barcelona-logo-footylogos.png"
              alt="Away"
              loading="lazy"
            />
            <span class="club-name">{{ stats.biggest_match_a }}</span>
          </div>
        </div>
        <div class="biggest-match-footer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <span>{{ stats.competition }}</span>
        </div>
      </div>

      <!-- ═══ Modern Statistic Cards ═══ -->
      <div class="stat-cards-grid">
        <div class="stat-card">
          <div class="stat-card-icon matches-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <div class="stat-card-info">
            <span class="stat-card-value">{{ stats.matches_today }}</span>
            <span class="stat-card-label">Matches Today</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon fire-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="stat-card-info">
            <span class="stat-card-value">{{ stats.biggest_match_h }} vs {{ stats.biggest_match_a }}</span>
            <span class="stat-card-label">Biggest Match</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon scorer-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-card-info">
            <span class="stat-card-value">{{ stats.top_scorer }}</span>
            <span class="stat-card-label">Top Scorer · {{ stats.goals }} Goals</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon assist-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div class="stat-card-info">
            <span class="stat-card-value">{{ stats.top_assist }}</span>
            <span class="stat-card-label">Top Assist · {{ stats.assists }} Assists</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon competition-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>
              <path d="M2 12h20"/>
            </svg>
          </div>
          <div class="stat-card-info">
            <span class="stat-card-value">{{ stats.competition }}</span>
            <span class="stat-card-label">Competition</span>
          </div>
        </div>
      </div>

      <!-- ═══ Player Statistics ═══ -->
      <div class="player-stats-section">
        <div class="section-heading">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          </svg>
          <span>Top Players Today</span>
        </div>

        <!-- Top Scorer -->
        <div class="player-stat-row">
          <div class="player-avatar" style="background: linear-gradient(135deg, #1E88E5, #1565C0);">
            <span>{{ getInitials(stats.top_scorer) }}</span>
          </div>
          <div class="player-info">
            <div class="player-name-row">
              <span class="player-name">{{ stats.top_scorer }}</span>
              <img class="player-team-badge" src="/Images/teams-logo/real-madrid-logo-footylogos.png" alt="Team" loading="lazy"/>
            </div>
            <span class="player-stat">{{ stats.goals }} Goals</span>
            <div class="progress-bar-wrap">
              <div class="progress-bar" :style="{ width: getProgressWidth(stats.goals, 40) + '%', background: 'linear-gradient(90deg, #16A34A, #22C55E)' }"></div>
            </div>
          </div>
        </div>

        <!-- Top Assist -->
        <div class="player-stat-row">
          <div class="player-avatar" style="background: linear-gradient(135deg, #A50044, #004D98);">
            <span>{{ getInitials(stats.top_assist) }}</span>
          </div>
          <div class="player-info">
            <div class="player-name-row">
              <span class="player-name">{{ stats.top_assist }}</span>
              <img class="player-team-badge" src="/Images/teams-logo/fc-barcelona-logo-footylogos.png" alt="Team" loading="lazy"/>
            </div>
            <span class="player-stat">{{ stats.assists }} Assists</span>
            <div class="progress-bar-wrap">
              <div class="progress-bar" :style="{ width: getProgressWidth(stats.assists, 30) + '%', background: 'linear-gradient(90deg, #16A34A, #22C55E)' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ Quick Stats Bar ═══ -->
      <div class="widget-stats-bar">
        <div class="stat-cell">
          <span class="stat-value">{{ stats.matches_today }}</span>
          <span class="stat-label">Matches</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-cell">
          <span class="stat-value">{{ stats.matches_today > 0 ? Math.min(Number(stats.matches_today), 8) : 0 }}</span>
          <span class="stat-label">Live Now</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-cell">
          <span class="stat-value">{{ stats.goals }}</span>
          <span class="stat-label">Goals</span>
        </div>
      </div>

      <!-- ═══ Footer CTA ═══ -->
      <button type="button" class="widget-cta">
        <span>View Full Stats</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    </template>
  </aside>
</template>

<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'
import { computed } from 'vue'

interface TodayStats {
  id: number
  matches_today: number
  biggest_match_h: string
  biggest_match_a: string
  match_time: string
  competition: string
  top_scorer: string
  scorer_team: string
  goals: number
  top_assist: string
  assist_team: string
  assists: number
  updated_at: string
}

const { supabase } = useSupabase()

const { data: stats, pending, error } = await useAsyncData<TodayStats | null>('today-stats', async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('today_stats')
      .select('*')
      .eq('id', 1)
      .single()

    if (fetchError) {
      console.error('Error fetching today stats:', fetchError)
      return null
    }

    return data as TodayStats
  } catch (err) {
    console.error('Unable to load today stats:', err)
    return null
  }
})

const timeAgo = computed(() => {
  if (!stats.value?.updated_at) return 'recently'

  const updated = new Date(stats.value.updated_at)
  const now = new Date()
  const diffMs = now.getTime() - updated.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
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

const getProgressWidth = (value: number, max: number): number => {
  if (!value || max <= 0) return 0
  return Math.min(Math.round((value / max) * 100), 100)
}
</script>