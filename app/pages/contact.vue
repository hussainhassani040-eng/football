<script setup lang="ts">
import { useHead } from '#imports'
import ContactForm from '../components/ContactForm.vue'

useHead({
  title: 'Contact | Football News',
  meta: [
    { name: 'description', content: 'Contact Football News for editorial inquiries, partnerships, or media requests.' },
    { property: 'og:title', content: 'Contact Football News' },
    { property: 'og:description', content: 'Reach out to our football news team via email, phone, or visit our headquarters.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<template>
  <main class="contact-page">
    <section class="page-hero contact-hero">
      <div class="hero-overlay"></div>
      <div class="container contact-hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">Contact Football News</span>
          <h1>Have a story, partnership idea, or feedback?</h1>
          <p class="hero-copy-text">Our editorial team responds quickly to inquiries, media requests, and partnership opportunities. Connect with us and let's shape the future of football coverage together.</p>
        </div>
        <aside class="hero-contact-card">
          <div class="hero-card-label">Get in touch</div>
          <h3>We're here to help</h3>
          <div class="hero-stat-grid">
            <div class="stat-block">
              <span>24hr</span>
              <span>Response time</span>
            </div>
            <div class="stat-block">
              <span>Mon-Fri</span>
              <span>9am–6pm</span>
            </div>
            <div class="stat-block">
              <span>∞</span>
              <span>Story ideas</span>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="contact-layout container">
      <ContactForm />

      <aside class="contact-details-card">
        <div class="contact-details-block">
          <div class="contact-item">
            <div class="contact-icon">✉️</div>
            <div>
              <h3>Email</h3>
              <a href="mailto:contact@footballhub.com">contact@footballhub.com</a>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">📞</div>
            <div>
              <h3>Phone</h3>
              <a href="tel:+123456789">+123456789</a>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">🏟️</div>
            <div>
              <h3>Location</h3>
              <p>Football News Headquarters</p>
            </div>
          </div>
        </div>

        <div class="contact-support-card">
          <h3>Professional support</h3>
          <p>For editorial inquiries, partnerships, or media requests, our team is available weekdays to support your needs promptly.</p>
          <div class="support-list">
            <div>
              <strong>Response time</strong>
              <p>Within 24 hours</p>
            </div>
            <div>
              <strong>Business hours</strong>
              <p>Mon–Fri, 9am–6pm</p>
            </div>
          </div>
        </div>
      </aside>
    </section>
  </main>
</template>
