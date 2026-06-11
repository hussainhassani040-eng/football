<template>
  <article class="match-card group">
    <div class="match-header">
      <span class="match-status">{{ status }}</span>
      <span class="match-league">{{ league }}</span>
    </div>
    <div class="match-teams">
      <div class="team-block">
        <span class="team-name">{{ homeTeam }}</span>
        <span class="team-score">{{ homeScore }}</span>
      </div>
      <div class="match-vs">vs</div>
      <div class="team-block team-away">
        <span class="team-name">{{ awayTeam }}</span>
        <span class="team-score">{{ awayScore }}</span>
      </div>
    </div>
    <p class="match-summary">{{ summary }}</p>
  </article>
</template>

<script setup lang="ts">
const props = defineProps({
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  homeScore: { type: [Number, String], required: true },
  awayScore: { type: [Number, String], required: true },
  status: { type: String, required: true },
  league: { type: String, required: true },
  summary: { type: String, required: true }
})
</script>
