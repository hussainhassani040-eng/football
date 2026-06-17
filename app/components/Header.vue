<template>
  <header class="header-shell">
    <div class="header-inner container">
      <NuxtLink to="/" class="brand" @click="closeMenu">
        <img src="/Images/logo.png" alt="Football News logo" class="brand-logo-img" />
        <div class="brand-copy">
          <span class="brand-title">Football News</span>
          <span class="brand-subtitle">Live football coverage</span>
        </div>
      </NuxtLink>

      <button
        class="menu-toggle"
        type="button"
        @click="toggleMenu"
        aria-controls="site-navigation"
        :aria-expanded="menuOpen.toString()"
      >
        <span class="sr-only">Toggle menu</span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>

      <nav :class="['nav-links', { open: menuOpen }]" id="site-navigation">
        <NuxtLink to="/" exact-active-class="nav-link-active" class="nav-link" @click="closeMenu">Home</NuxtLink>
        <NuxtLink to="/news" active-class="nav-link-active" class="nav-link" @click="closeMenu">News</NuxtLink>
        <NuxtLink to="/transfer" active-class="nav-link-active" class="nav-link" @click="closeMenu">Transfers</NuxtLink>
        <NuxtLink to="/team" active-class="nav-link-active" class="nav-link" @click="closeMenu">Teams</NuxtLink>
        <NuxtLink to="/about" active-class="nav-link-active" class="nav-link" @click="closeMenu">About</NuxtLink>
        <NuxtLink to="/contact" active-class="nav-link-active" class="nav-link" @click="closeMenu">Contact</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const menuOpen = ref(false)
const route = useRoute()

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

watch(route, closeMenu)
</script>
