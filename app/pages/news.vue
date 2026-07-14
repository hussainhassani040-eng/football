<script setup lang="ts">
import { computed, useAsyncData, useHead } from '#imports'
import NewsCard from '../components/NewsCard.vue'
import TodayFootballWidget from '../components/TodayFootballWidget.vue'
import { useSupabase } from '../composables/useSupabase'

useHead({
  title: 'News | Football News',
  meta: [
    { name: 'description', content: 'Latest football headlines, match reports, transfer updates, and expert analysis from the world’s biggest leagues.' },
    { property: 'og:title', content: 'Football News' },
    { property: 'og:description', content: 'Stay informed with real-time football news, breaking club updates, and detailed game coverage.' },
    { property: 'og:type', content: 'website' }
  ]
})

const newsCategories = [
  'La Liga',
  'Premier League',
  'Champions League',
  'International',
  'Serie A',
  'Ligue 1',
  'Bundesliga'
]

const fallbackNews = [
  {
    category: 'La Liga',
    headline: 'Barcelona continue to shape the season with fresh momentum',
    summary: 'The latest updates from the Camp Nou and the wider La Liga landscape are now flowing into the site.',
    image: '/barcelona.webp',
    to: '/news-detail/barcelona-shape-season'
  },
  {
    category: 'Transfers',
    headline: 'Top clubs chase elite winger ahead of summer window',
    summary: 'Reports suggest a multi-club battle for one of Europe’s most dangerous attackers.',
    image: '/barcelona.webp',
    to: '/news-detail/top-clubs-chase-winger'
  },
  {
    category: 'Match Review',
    headline: 'Classic derby ends with last-minute drama',
    summary: 'A late goal and controversial call left fans debating the outcome long after full-time.',
    image: '/barcelona.webp',
    to: '/news-detail/classic-derby-drama'
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

const normalizeArticle = (record: Record<string, any>) => {
  const headline = getTextValue(record, ['title', 'headline', 'name']) || 'Football update'
  const summary = getTextValue(record, ['summary', 'excerpt', 'description']) || 'Fresh football coverage from the Supabase news table.'
  const category = getTextValue(record, ['category', 'tag', 'type']) || 'Football'
  const image = getTextValue(record, ['image', 'image_url', 'cover_image', 'thumbnail', 'photo']) || '/barcelona.webp'
  const slug = getTextValue(record, ['slug']) || (record?.id ? String(record.id) : createSlug(headline))

  return {
    category,
    headline,
    summary: summary.length > 140 ? `${summary.slice(0, 137)}...` : summary,
    image,
    to: `/news-detail/${slug}`
  }
}

const { data: newsArticles, pending, error } = await useAsyncData('supabase-news-feed', async () => {
  try {
    const { supabase } = useSupabase()
    const { data, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      throw fetchError
    }

    if (!data?.length) {
      return fallbackNews
    }

    return data.map((item: Record<string, any>) => normalizeArticle(item))
  } catch (err) {
    console.error('Unable to load news from Supabase:', err)
    return fallbackNews
  }
})

const latestArticles = computed(() => (newsArticles.value ?? []).slice(0, 8))

const allArticles = computed(() => newsArticles.value ?? [])

const featuredStory = computed(() => {
  const article = latestArticles.value[0] || fallbackNews[0]

  return {
    label: 'Featured Story',
    headline: article.headline,
    summary: article.summary,
    image: article.image,
    to: article.to,
    category: article.category
  }
})

const liveBuzzStories = computed(() => {
  return latestArticles.value.slice(0, 5).map((article, index) => ({
    rank: index + 1,
    headline: article.headline,
    category: article.category,
    to: article.to
  }))
})

const matchInsights = [
  { headline: 'Tactical shifts hint at a season-long battle.' },
  { headline: 'Clubs manage squad depth ahead of packed fixtures.' },
  { headline: 'Market activity continues to drive championship momentum.' }
]
</script>

<template>
  <main class="news-page">
    <!-- ═══ Full-Width Hero Section with Ronaldo Background ═══ -->
    <section class="news-hero-section">
      <div class="news-hero-overlay"></div>
      <div class="container news-hero-inner">
        <div class="news-hero-top">
          <span class="news-hero-eyebrow">Breaking Football News</span>
          <h1 class="news-hero-title">Your Premier Source for Football Coverage</h1>
          <p class="news-hero-desc">Live headlines, transfer intelligence, and expert match analysis from across the world's top leagues.</p>
          <div class="news-hero-actions">
            <NuxtLink to="/live-coverage" class="btn btn-primary">Follow Live Coverage</NuxtLink>
            <NuxtLink to="/live-coverage" class="btn btn-secondary hero-btn-outline">View Match Tracker</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="news-filters container">
      <div class="filters-panel">
        <p class="section-label">Categories</p>
        <div class="filter-list">
          <button v-for="category in newsCategories" :key="category" type="button" class="filter-pill active">{{ category }}</button>
        </div>
      </div>
    </section>

    <!-- ═══ Featured Story + Live Buzz (below hero) ═══ -->
    <section class="featured-live-section container">
      <div class="magazine-hero-grid">
        <!-- Featured Story (70%) -->
        <NuxtLink :to="featuredStory.to" class="featured-story-card">
          <div class="featured-story-bg" :style="{ backgroundImage: `url(${featuredStory.image})` }"></div>
          <div class="featured-story-overlay"></div>
          <div class="featured-story-content">
            <span class="featured-story-badge">Featured Story</span>
            <h2 class="featured-story-headline">{{ featuredStory.headline }}</h2>
            <p class="featured-story-summary">{{ featuredStory.summary }}</p>
            <div class="featured-story-meta">
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Just now
              </span>
              <span class="meta-divider">•</span>
              <span class="meta-item">{{ featuredStory.category }}</span>
              <span class="meta-divider">•</span>
              <span class="meta-item">3 min read</span>
            </div>
            <span class="featured-story-cta">
              Read Full Story
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </div>
        </NuxtLink>

        <!-- Live Buzz Panel (30%) -->
        <aside class="live-buzz-panel">
          <div class="live-buzz-header">
            <div class="live-buzz-title-row">
              <span class="live-buzz-fire">🔥</span>
              <span class="live-buzz-title">Live Buzz</span>
            </div>
            <span class="live-buzz-count">Top 5</span>
          </div>
          <div class="live-buzz-list">
            <NuxtLink
              v-for="story in liveBuzzStories"
              :key="story.rank"
              :to="story.to"
              class="live-buzz-item"
            >
              <span class="buzz-rank">{{ story.rank }}</span>
              <div class="buzz-content">
                <span class="buzz-category">{{ story.category }}</span>
                <h4 class="buzz-headline">{{ story.headline }}</h4>
              </div>
            </NuxtLink>
          </div>
        </aside>
      </div>
    </section>

    <section class="news-content container">
      <div class="news-main">
        <div v-if="pending" class="loading-message">
          <p>Loading news from Supabase…</p>
        </div>
        <div v-else-if="error" class="error-message">
          <p>Unable to load news right now. Showing the latest fallback stories instead.</p>
        </div>
        <div v-else class="news-grid">
          <NewsCard
            v-for="article in latestArticles"
            :key="article.headline"
            :category="article.category"
            :headline="article.headline"
            :summary="article.summary"
            :image="article.image"
            :to="article.to"
          />
        </div>
      </div>
      <aside class="news-sidebar">
        <TodayFootballWidget />
      </aside>
    </section>

    <!-- ═══ All News Section ═══ -->
    <section class="all-news-section container">
      <div class="section-header all-news-header">
        <span class="section-label">Full Coverage</span>
        <h2 class="section-title">All News</h2>
        <p class="section-copy">Browse every football story we've covered — from breaking headlines to in-depth analysis across all leagues and competitions.</p>
      </div>
      <div v-if="pending" class="loading-message">
        <p>Loading stories…</p>
      </div>
      <div v-else-if="allArticles.length === 0" class="all-news-empty">
        <p>No additional stories available yet. Check back soon for more coverage.</p>
      </div>
      <div v-else class="all-news-grid">
        <NewsCard
          v-for="article in allArticles"
          :key="`all-${article.headline}`"
          :category="article.category"
          :headline="article.headline"
          :summary="article.summary"
          :image="article.image"
          :to="article.to"
        />
      </div>
    </section>
  </main>
</template>