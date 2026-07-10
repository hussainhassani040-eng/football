<script setup lang="ts">
import { computed, useAsyncData, useHead, useRoute } from '#imports'
import { useSupabase } from '~/composables/useSupabase'

type NewsRecord = Record<string, any>

const route = useRoute()
const slug = String(route.params.slug || '')

const getTextValue = (record: NewsRecord | null | undefined, keys: string[]) => {
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

const getArticleSlug = (record: NewsRecord) => {
  const storedSlug = getTextValue(record, ['slug'])
  if (storedSlug) return storedSlug

  const title = getTextValue(record, ['title', 'headline', 'name'])
  if (title) return createSlug(title)

  return record?.id ? String(record.id) : ''
}

const { data: articleData, pending, error } = await useAsyncData(`news-detail-${slug}`, async () => {
  const { supabase } = useSupabase()
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    throw error
  }

  return (data ?? []).find((item: NewsRecord) => {
    const articleSlug = getArticleSlug(item)
    return articleSlug === slug || String(item.id || '') === slug
  }) ?? null
})

const article = computed(() => {
  const value = articleData.value
  if (!value) return null

  const headline = getTextValue(value, ['title', 'headline', 'name']) || 'Football update'
  const summary = getTextValue(value, ['summary', 'excerpt', 'description'])
  const content = getTextValue(value, ['content', 'body', 'details']) || summary || 'No full story content is available for this article yet.'
  const publishedAt = value.published_at || value.created_at

  return {
    headline,
    summary,
    content,
    category: getTextValue(value, ['category', 'tag', 'type']) || 'Football',
    image: getTextValue(value, ['image', 'image_url', 'cover_image', 'thumbnail', 'photo']) || '/barcelona.webp',
    author: getTextValue(value, ['author', 'writer', 'created_by']) || 'Football News Desk',
    team: getTextValue(value, ['team', 'club', 'team_name']),
    publishedAt
  }
})

const articleParagraphs = computed(() => {
  if (!article.value?.content) return []

  return article.value.content
    .split(/\n{2,}|\r\n\r\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
})

const formattedDate = computed(() => {
  if (!article.value?.publishedAt) return 'Latest update'

  return new Date(article.value.publishedAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
})

const readingTime = computed(() => {
  const words = article.value?.content?.trim().split(/\s+/).filter(Boolean).length || 0
  return `${Math.max(1, Math.ceil(words / 220))} min read`
})

useHead(() => ({
  title: article.value ? `${article.value.headline} | Football News` : 'News Detail | Football News',
  meta: [
    {
      name: 'description',
      content: article.value?.summary || 'Football news detail page.'
    }
  ]
}))
</script>

<template>
  <main class="news-detail-page">
    <section class="news-detail-hero" :style="{ '--article-image': `url('${article?.image || '/barcelona.webp'}')` }">
      <div class="news-detail-hero__overlay"></div>
      <div class="container news-detail-hero__grid">
        <div class="news-detail-hero__copy">
          <NuxtLink to="/news" class="news-detail-back">Back to news</NuxtLink>
          <span class="news-detail-kicker">{{ article?.category || 'News' }}</span>
          <h1>{{ article?.headline || 'News story' }}</h1>
          <p v-if="article?.summary">{{ article.summary }}</p>
          <div v-if="article" class="news-detail-meta">
            <span>{{ formattedDate }}</span>
            <span>{{ readingTime }}</span>
            <span>{{ article.author }}</span>
          </div>
        </div>

        <figure v-if="article" class="news-detail-hero__media">
          <img :src="article.image" :alt="article.headline">
        </figure>
      </div>
    </section>

    <section class="news-detail-shell container">
      <div v-if="pending" class="loading-message news-detail-status">
        <p>Loading story from Supabase...</p>
      </div>

      <div v-else-if="error" class="error-message news-detail-status">
        <p>Unable to load this story: {{ error.message }}</p>
      </div>

      <div v-else-if="!article" class="empty-message news-detail-status">
        <p>News story not found.</p>
      </div>

      <template v-else>
        <article class="news-detail-article">
          <div class="news-detail-article__lead">
            <span>{{ article.category }}</span>
            <p>{{ article.summary || article.headline }}</p>
          </div>

          <div class="news-detail-prose">
            <p v-for="paragraph in articleParagraphs" :key="paragraph">{{ paragraph }}</p>
          </div>
        </article>

        <aside class="news-detail-aside">
          <div class="news-detail-aside__block">
            <span>Published</span>
            <strong>{{ formattedDate }}</strong>
          </div>
          <div class="news-detail-aside__block">
            <span>Category</span>
            <strong>{{ article.category }}</strong>
          </div>
          <div v-if="article.team" class="news-detail-aside__block">
            <span>Club focus</span>
            <strong>{{ article.team }}</strong>
          </div>
          <div class="news-detail-aside__block">
            <span>Source</span>
            <strong>Supabase news</strong>
          </div>
        </aside>
      </template>
    </section>
  </main>
</template>
