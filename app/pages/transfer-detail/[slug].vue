<script setup lang="ts">
import { computed, useAsyncData, useHead, useRoute } from '#imports'
import { useSupabase } from '~/composables/useSupabase'

type TransferRecord = Record<string, any>

const route = useRoute()
const slug = String(route.params.slug || '')

const getTextValue = (record: TransferRecord | null | undefined, keys: string[]) => {
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

const getTransferSlug = (record: TransferRecord) => {
  const storedSlug = getTextValue(record, ['slug'])
  if (storedSlug) return storedSlug

  const headline = getTextValue(record, ['headline', 'title', 'name'])
  if (headline) return createSlug(headline)

  const player = getTextValue(record, ['player', 'player_name'])
  if (player) return createSlug(player)

  return record?.id ? String(record.id) : ''
}

const { data: transferData, pending, error } = await useAsyncData(`transfer-detail-${slug}`, async () => {
  const { supabase } = useSupabase()

  // Try to find in the transfer_news table
  const { data, error } = await supabase
    .from('transfer_news')
    .select('*')
    .limit(200)

  if (error) {
    throw error
  }

  return (data ?? []).find((item: TransferRecord) => {
    const itemSlug = getTransferSlug(item)
    return itemSlug === slug || String(item.id || '') === slug
  }) ?? null
})

const transfer = computed(() => {
  const value = transferData.value
  if (!value) return null

  const player = getTextValue(value, ['player', 'player_name', 'name']) || 'Transfer target'
  const status = getTextValue(value, ['status', 'transfer_status', 'type']) || 'Latest'
  const headline = getTextValue(value, ['headline', 'title', 'name']) || `${player} transfer update`
  const summary = getTextValue(value, ['summary', 'excerpt', 'description'])
  const content = getTextValue(value, ['content', 'body', 'details']) || summary || 'No full story content is available for this transfer yet.'
  const clubFrom = getTextValue(value, ['from_club', 'source_club', 'selling_club'])
  const clubTo = getTextValue(value, ['club', 'to_club', 'destination_club', 'team'])
  const publishedAt = value.published_at || value.created_at

  return {
    player,
    status,
    headline,
    summary,
    content,
    clubFrom,
    clubTo,
    category: getTextValue(value, ['category', 'tag', 'type']) || 'Transfer News',
    image: getTextValue(value, ['image', 'image_url', 'cover_image', 'thumbnail', 'photo']) || '/barcelona.webp',
    author: getTextValue(value, ['author', 'writer', 'created_by']) || 'Transfer Desk',
    publishedAt
  }
})

const transferParagraphs = computed(() => {
  if (!transfer.value?.content) return []
  return transfer.value.content
    .split(/\n{2,}|\r\n\r\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
})

const formattedDate = computed(() => {
  if (!transfer.value?.publishedAt) return 'Latest update'
  return new Date(transfer.value.publishedAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
})

const readingTime = computed(() => {
  const words = transfer.value?.content?.trim().split(/\s+/).filter(Boolean).length || 0
  return `${Math.max(1, Math.ceil(words / 220))} min read`
})

const statusClass = computed(() => {
  const s = transfer.value?.status?.toLowerCase() || ''
  if (s === 'confirmed' || s === 'official') return 'status-confirmed'
  if (s === 'rumour') return 'status-rumour'
  if (s === 'negotiating') return 'status-negotiating'
  return 'status-latest'
})

useHead(() => ({
  title: transfer.value ? `${transfer.value.headline} | Transfer News` : 'Transfer Detail | Football News',
  meta: [
    {
      name: 'description',
      content: transfer.value?.summary || 'Transfer news detail page.'
    }
  ]
}))
</script>

<template>
  <main class="transfer-detail-page">
    <section class="news-detail-hero" :style="{ '--article-image': `url('${transfer?.image || '/barcelona.webp'}')` }">
      <div class="news-detail-hero__overlay"></div>
      <div class="container news-detail-hero__grid">
        <div class="news-detail-hero__copy">
          <NuxtLink to="/transfer" class="news-detail-back">Back to transfers</NuxtLink>
          <span class="news-detail-kicker">{{ transfer?.category || 'Transfer News' }}</span>
          <h1>{{ transfer?.headline || 'Transfer story' }}</h1>
          <p v-if="transfer?.summary">{{ transfer.summary }}</p>
          <div v-if="transfer" class="news-detail-meta">
            <span>{{ formattedDate }}</span>
            <span>{{ readingTime }}</span>
            <span>{{ transfer.author }}</span>
          </div>
        </div>

        <figure v-if="transfer" class="news-detail-hero__media">
          <img :src="transfer.image" :alt="transfer.headline">
        </figure>
      </div>
    </section>

    <section class="news-detail-shell container">
      <div v-if="pending" class="loading-message news-detail-status">
        <p>Loading transfer from Supabase...</p>
      </div>

      <div v-else-if="error" class="error-message news-detail-status">
        <p>Unable to load this transfer: {{ error.message }}</p>
      </div>

      <div v-else-if="!transfer" class="empty-message news-detail-status">
        <p>Transfer story not found.</p>
      </div>

      <template v-else>
        <article class="news-detail-article">
          <div class="news-detail-article__lead">
            <span :class="statusClass">{{ transfer.status }}</span>
            <p>{{ transfer.summary || transfer.headline }}</p>
          </div>

          <div class="transfer-detail-players">
            <div class="transfer-detail-player-card">
              <span class="transfer-detail-label">Player</span>
              <strong>{{ transfer.player }}</strong>
            </div>
            <div v-if="transfer.clubFrom" class="transfer-detail-player-card">
              <span class="transfer-detail-label">From</span>
              <strong>{{ transfer.clubFrom }}</strong>
            </div>
            <div v-if="transfer.clubTo" class="transfer-detail-player-card">
              <span class="transfer-detail-label">To</span>
              <strong>{{ transfer.clubTo }}</strong>
            </div>
            <div class="transfer-detail-player-card">
              <span class="transfer-detail-label">Status</span>
              <strong :class="statusClass">{{ transfer.status }}</strong>
            </div>
          </div>

          <div class="news-detail-prose">
            <p v-for="paragraph in transferParagraphs" :key="paragraph">{{ paragraph }}</p>
          </div>
        </article>

        <aside class="news-detail-aside">
          <div class="news-detail-aside__block">
            <span>Published</span>
            <strong>{{ formattedDate }}</strong>
          </div>
          <div class="news-detail-aside__block">
            <span>Category</span>
            <strong>{{ transfer.category }}</strong>
          </div>
          <div class="news-detail-aside__block">
            <span>Player</span>
            <strong>{{ transfer.player }}</strong>
          </div>
          <div class="news-detail-aside__block">
            <span>Source</span>
            <strong>Supabase transfer news</strong>
          </div>
        </aside>

        <!-- Transfer Verdict Section -->
        <section class="transfer-verdict">
          <div class="transfer-verdict__header">
            <div class="transfer-verdict__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 12l2 2 4-4"/>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h3 class="transfer-verdict__title">Transfer Verdict</h3>
              <p class="transfer-verdict__subtitle">Status assessment and market intelligence</p>
            </div>
          </div>

          <div class="transfer-verdict__body">
            <div class="transfer-verdict__status-bar">
              <div class="transfer-verdict__status-step" :class="{ 'transfer-verdict__status-step--active': true, 'transfer-verdict__status-step--complete': transfer.status === 'Confirmed' || transfer.status === 'Official' || transfer.status === 'Negotiating' }">
                <div class="transfer-verdict__step-dot"></div>
                <span>Rumour</span>
              </div>
              <div class="transfer-verdict__status-line" :class="{ 'transfer-verdict__status-line--filled': transfer.status === 'Confirmed' || transfer.status === 'Official' || transfer.status === 'Negotiating' }"></div>
              <div class="transfer-verdict__status-step" :class="{ 'transfer-verdict__status-step--active': transfer.status === 'Negotiating', 'transfer-verdict__status-step--complete': transfer.status === 'Confirmed' || transfer.status === 'Official' }">
                <div class="transfer-verdict__step-dot"></div>
                <span>Negotiating</span>
              </div>
              <div class="transfer-verdict__status-line" :class="{ 'transfer-verdict__status-line--filled': transfer.status === 'Confirmed' || transfer.status === 'Official' }"></div>
              <div class="transfer-verdict__status-step" :class="{ 'transfer-verdict__status-step--active': transfer.status === 'Confirmed' || transfer.status === 'Official' }">
                <div class="transfer-verdict__step-dot"></div>
                <span>Completed</span>
              </div>
            </div>

            <div class="transfer-verdict__stats">
              <div class="transfer-verdict__stat">
                <span class="transfer-verdict__stat-label">Status</span>
                <strong class="transfer-verdict__stat-value" :class="statusClass">{{ transfer.status }}</strong>
              </div>
              <div class="transfer-verdict__stat">
                <span class="transfer-verdict__stat-label">Confidence</span>
                <strong class="transfer-verdict__stat-value">{{ transfer.status === 'Confirmed' || transfer.status === 'Official' ? '92%' : transfer.status === 'Negotiating' ? '65%' : '38%' }}</strong>
              </div>
              <div class="transfer-verdict__stat">
                <span class="transfer-verdict__stat-label">Stage</span>
                <strong class="transfer-verdict__stat-value">{{ transfer.status === 'Confirmed' || transfer.status === 'Official' ? 'Deal Complete' : transfer.status === 'Negotiating' ? 'Active Talks' : 'Early Stage' }}</strong>
              </div>
            </div>

            <div class="transfer-verdict__note">
              <div class="transfer-verdict__note-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </div>
              <p>
                <strong>Market note:</strong>
                {{ transfer.status === 'Confirmed' || transfer.status === 'Official'
                  ? 'This transfer has been officially confirmed by the clubs involved. All parties have reached a full agreement and the deal is now complete.'
                  : transfer.status === 'Negotiating'
                    ? 'Negotiations are actively underway between the clubs. Personal terms are being discussed and a resolution is expected within the coming days.'
                    : 'This rumour is still in its early stages. Multiple sources are monitoring the situation but no formal talks have been confirmed yet.' }}
              </p>
            </div>
          </div>
        </section>
      </template>
    </section>
  </main>
</template>