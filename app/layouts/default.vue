<template>
  <div class="layout-shell">
    <Header />
    <main class="page-shell">
      <transition name="page-fade" mode="out-in">
        <NuxtPage />
      </transition>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
</script>
