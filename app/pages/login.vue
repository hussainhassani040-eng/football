<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { navigateTo, useHead } from '#imports'

useHead({
  title: 'Log in | Football News',
  meta: [
    { name: 'description', content: 'Log in or create a Football News account.' },
    { property: 'og:title', content: 'Log in | Football News' },
    { property: 'og:description', content: 'Access your Football News account with Supabase authentication.' },
    { property: 'og:type', content: 'website' }
  ]
})

const { user, loading, initialize, signIn, signUp } = useAuth()

const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const buttonLabel = computed(() => {
  if (loading.value) {
    return mode.value === 'login' ? 'Logging in...' : 'Creating account...'
  }

  return mode.value === 'login' ? 'Log in' : 'Create account'
})

const pageCopy = computed(() => {
  return mode.value === 'login'
    ? 'Welcome back. Sign in to keep your Football News profile ready.'
    : 'Create your account and start building your Football News profile.'
})

const switchMode = (nextMode: 'login' | 'signup') => {
  mode.value = nextMode
  errorMessage.value = ''
  successMessage.value = ''
}

const submitAuth = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (mode.value === 'login') {
      await signIn(email.value, password.value)
      await navigateTo('/dashboard')
      return
    }

    const data = await signUp(email.value, password.value)

    if (data.session) {
      await navigateTo('/dashboard')
      return
    }

    successMessage.value = 'Account created. Check your email to confirm your account before logging in.'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Authentication failed. Please try again.'
  }
}

onMounted(async () => {
  await initialize()
})

watch(user, async (currentUser) => {
  if (currentUser) {
    await navigateTo('/dashboard')
  }
})
</script>

<template>
  <main class="auth-page">
    <section class="auth-shell container">
      <div class="auth-panel">
        <div class="auth-copy">
          <span class="section-label">Football News account</span>
          <h1>{{ mode === 'login' ? 'Log in' : 'Create account' }}</h1>
          <p>{{ pageCopy }}</p>
        </div>

        <div class="auth-tabs" aria-label="Authentication mode">
          <button type="button" :class="['auth-tab', { active: mode === 'login' }]" @click="switchMode('login')">
            Log in
          </button>
          <button type="button" :class="['auth-tab', { active: mode === 'signup' }]" @click="switchMode('signup')">
            Sign up
          </button>
        </div>

        <form class="auth-form" @submit.prevent="submitAuth">
          <label class="form-field">
            <span>Email</span>
            <input v-model="email" type="email" autocomplete="email" required placeholder="you@example.com" />
          </label>

          <label class="form-field">
            <span>Password</span>
            <input
              v-model="password"
              type="password"
              :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
              required
              minlength="6"
              placeholder="At least 6 characters"
            />
          </label>

          <p v-if="errorMessage" class="field-error">{{ errorMessage }}</p>
          <p v-if="successMessage" class="form-success">{{ successMessage }}</p>

          <button class="btn btn-primary auth-submit" type="submit" :disabled="loading">
            {{ buttonLabel }}
          </button>
        </form>
      </div>
    </section>
  </main>
</template>
