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
            <div class="contact-icon">📍</div>
            <div>
              <h3>Address</h3>
              <p>Football Hub Headquarters</p>
            </div>
          </div>
        </div>

        <div class="map-frame">
          <iframe
            title="Football Hub headquarters"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.3268386596757!2d-122.41941518468245!3d37.77492977975947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064dfc032a1%3A0x3568f4f7a9e66482!2sMarket%20St%2C%20San%20Francisco%2C%20CA%2094110%2C%20USA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </aside>
    </section>
  </main>
</template>
