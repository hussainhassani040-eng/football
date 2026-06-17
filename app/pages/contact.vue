<script setup lang="ts">
import { useHead } from '#imports'
import ContactForm from '../components/ContactForm.vue'

useHead({
  title: 'Contact | Football Hub',
  meta: [
    { name: 'description', content: 'Contact Football Hub for editorial inquiries, partnerships, or media requests.' },
    { property: 'og:title', content: 'Contact Football Hub' },
    { property: 'og:description', content: 'Reach out to our football news team via email, phone, or visit our headquarters.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<template>
  <main class="contact-page">
    <section class="page-hero">
      <div class="container">
        <p class="section-label">Contact Us</p>
        <h1>Get in Touch</h1>
        <p class="section-copy">Have a story, partnership idea, or feedback? Send us a message and our team will respond quickly.</p>
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
              <p>Football Hub Headquarters</p>
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
