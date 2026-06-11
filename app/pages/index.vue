<script setup lang="ts">
import { useHead } from '#imports'
import NewsCard from '../components/NewsCard.vue'
import TransferCard from '../components/TransferCard.vue'
import MatchCard from '../components/MatchCard.vue'
import LeagueCard from '../components/LeagueCard.vue'
import TeamCard from '../components/TeamCard.vue'
import PlayerCard from '../components/PlayerCard.vue'

useHead({
  title: 'Football Hub | Latest Football News',
  meta: [
    { name: 'description', content: 'Football Hub brings breaking football news, transfer rumours, match reports and analysis from Premier League, La Liga, Bundesliga and more.' },
    { property: 'og:title', content: 'Football Hub | Breaking Football News' },
    { property: 'og:description', content: 'Stay ahead with fast updates on transfers, match analysis, and the latest football headlines.' },
    { property: 'og:type', content: 'website' }
  ]
})

const featuredNews = [
  {
    category: 'Latest Football News',
    headline: 'Manchester City edge past Liverpool in late thriller',
    summary: 'City held on in a dramatic Anfield clash after a stoppage-time counter sealed the win.',
    image: '/Images/lionel-messi.jpg'
  },
  {
    category: 'Transfer News',
    headline: 'Real Madrid in talks for elite midfield target',
    summary: 'The reigning champions are closing in on a surprise move ahead of the summer window.',
    image: '/Images/lionel-messi.jpg'
  },
  {
    category: 'Match Analysis',
    headline: 'Tactical review: How Arsenal broke down the defence',
    summary: 'A closer look at the patterns that gave them control in the second half.',
    image: '/Images/lionel-messi.jpg'
  }
]

const trendingMatches = [
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

const transfers = [
  {
    player: 'Kylian Mbappé',
    status: 'Rumour',
    headline: 'PSG star linked with move to Premier League',
    summary: 'Top clubs are reportedly preparing offers as the striker evaluates his future.'
  },
  {
    player: 'Jude Bellingham',
    status: 'Confirmed',
    headline: 'Midfield maestro closes in on Real Madrid transfer',
    summary: 'The English international looks set for a headline move after a stellar season.'
  },
  {
    player: 'Riyad Mahrez',
    status: 'Latest',
    headline: 'Juventus monitor late-window winger option',
    summary: 'The Italian giants are keeping tabs on a creative wide attacker.'
  }
]

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

const players = [
  { name: 'Erling Haaland', position: 'Striker', team: 'Manchester City', rating: '9.3', summary: 'A relentless goalscorer with incredible pace and power.' },
  { name: 'Vinícius Jr.', position: 'Winger', team: 'Real Madrid', rating: '9.1', summary: 'Blistering dribbler who can change a game in an instant.' },
  { name: 'Jude Bellingham', position: 'Midfielder', team: 'Real Madrid', rating: '9.0', summary: 'A complete midfielder with vision, strength, and work rate.' }
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
          <NuxtLink to="/#news" class="btn btn-primary">Explore News</NuxtLink>
          <NuxtLink to="/#transfers" class="btn btn-secondary">Follow Transfers</NuxtLink>
        </div>
      </div>
    </section>

    <section class="featured-section container" id="news">
      <div class="section-header">
        <p class="section-label">Featured stories</p>
        <h2>Top headlines from the global game</h2>
      </div>
      <div class="featured-grid">
        <NewsCard v-for="item in featuredNews" :key="item.headline" :category="item.category" :headline="item.headline" :summary="item.summary" :image="item.image" />
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
          <TransferCard v-for="transfer in transfers" :key="transfer.player" :player="transfer.player" :status="transfer.status" :headline="transfer.headline" :summary="transfer.summary" />
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
        <div class="player-grid">
          <PlayerCard v-for="player in players" :key="player.name" :name="player.name" :position="player.position" :team="player.team" :rating="player.rating" :summary="player.summary" />
        </div>
      </div>
    </section>
  </main>
</template>
