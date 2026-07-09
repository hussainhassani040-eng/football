<script setup lang="ts">
import { computed, useAsyncData, useHead } from '#imports'
import NewsCard from '../components/NewsCard.vue'
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
  'Premier League',
  'La Liga',
  'Champions League',
  'International Football',
  'Transfers'
]

const getTextValue = (record: Record<string, any>, keys: string[]) => {
  for (const key of keys) {
    const value = record?.[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }

  return ''
}

const normalizeArticle = (record: Record<string, any>) => {
  const headline = getTextValue(record, ['title', 'headline', 'name']) || 'Football update'
  const summary = getTextValue(record, ['summary', 'excerpt', 'description', 'content']) || 'Fresh football coverage from the Supabase news table.'
  const category = getTextValue(record, ['category', 'tag', 'type']) || 'Football'
  const image = getTextValue(record, ['image', 'image_url', 'cover_image', 'thumbnail', 'photo']) || '/barcelona.webp'

  return {
    category,
    headline,
    summary: summary.length > 140 ? `${summary.slice(0, 137)}...` : summary,
    image
  }
}

const { data: newsArticles, pending, error } = await useAsyncData('supabase-news-feed', async () => {
  const { supabase } = useSupabase()
  const { data, error: fetchError } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })

  if (fetchError) {
    throw new Error(`News feed query failed: ${fetchError.message}`)
  }

  if (!data?.length) {
    return []
  }

  return data.map((item: Record<string, any>) => normalizeArticle(item))
})

const latestArticles = computed(() => (newsArticles.value ?? []).slice(0, 4))

const featuredStory = computed(() => {
  const article = latestArticles.value[0]

  if (!article) {
    return {
      label: 'No Stories',
      headline: 'No news articles available',
      summary: 'Check back later for the latest updates.'
    }
  }

  return {
    label: 'Featured Story',
    headline: article.headline,
    summary: article.summary
  }
})

const trendingStories = computed(() => {
  return latestArticles.value.slice(0, 3).map((article) => ({
    tag: article.category,
    headline: article.headline
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
    <section class="page-hero news-hero">
      <div class="hero-overlay"></div>
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">Breaking Football News</span>
          <h1>A legend. Immediate analysis. Football coverage built for the modern fan.</h1>
          <p class="hero-copy-text">A premium football news hub with live headlines, transfer intelligence, and expert match coverage from across the world’s top leagues.</p>
          <div class="hero-actions">
            <button type="button" class="btn btn-primary">Follow Live Coverage</button>
            <button type="button" class="btn btn-secondary">View Match Tracker</button>
          </div>
        </div>
        <aside class="featured-hero-card">
          <span class="hero-card-label">{{ featuredStory.label }}</span>
          <h2>{{ featuredStory.headline }}</h2>
          <p>{{ featuredStory.summary }}</p>
          <button type="button" class="btn btn-tertiary">Read Full Story</button>
        </aside>
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

    <section class="news-content container" id="news">
      <div class="news-main">
        <article class="breaking-strip">
          <span class="breaking-label">Breaking</span>
          <h2>Rival clubs race for summer transfer priority</h2>
          <p>Our editorial team tracks the biggest transfer battles, how they impact the title fight, and what it means for managers across Europe.</p>
        </article>
        <div v-if="pending" class="loading-message">
          <p>Loading news from Supabase…</p>
        </div>
        <div v-else-if="error" class="error-message">
          <p>Error loading news from Supabase: {{ error.message }}</p>
        </div>
        <div v-else-if="latestArticles.length === 0" class="error-message">
          <p>No news articles available.</p>
        </div>
        <div v-else class="news-grid">
          <NewsCard
            v-for="article in latestArticles"
            :key="article.headline"
            :category="article.category"
            :headline="article.headline"
            :summary="article.summary"
            :image="article.image"
          />
        </div>
      </div>
      <aside class="news-sidebar">
        <div class="sidebar-card">
          <div class="section-label">Trending now</div>
          <h3>Match buzz and transfer heat</h3>
          <ul class="trending-list">
            <li v-for="story in trendingStories" :key="story.headline">
              <span class="trending-tag">{{ story.tag }}</span>
              <h4>{{ story.headline }}</h4>
            </li>
          </ul>
        </div>

        <div class="sidebar-card dark-card">
          <div class="section-label">Insight</div>
          <h3>Top football takeaways</h3>
          <ul class="summary-list">
            <li v-for="item in matchInsights" :key="item.headline">{{ item.headline }}</li>
          </ul>
        </div>
      </aside>
    </section>
  </main>
</template>