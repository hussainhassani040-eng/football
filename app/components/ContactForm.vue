<template>
  <section class="contact-form-card">
    <div class="section-label">Send a Message</div>
    <h2 class="section-heading">Get in touch</h2>
    <p class="section-description">Share your project details and we’ll respond within one business day.</p>

    <form @submit.prevent="handleSubmit" novalidate>
      <div class="form-grid">
        <label class="form-field">
          <span>Name</span>
          <input
            v-model="form.name"
            name="name"
            type="text"
            placeholder="Your name"
            :aria-invalid="errors.name ? 'true' : 'false'"
            aria-describedby="error-name"
          />
          <span v-if="errors.name" id="error-name" class="field-error">{{ errors.name }}</span>
        </label>

        <label class="form-field">
          <span>Email</span>
          <input
            v-model="form.email"
            name="email"
            type="email"
            placeholder="your@email.com"
            :aria-invalid="errors.email ? 'true' : 'false'"
            aria-describedby="error-email"
          />
          <span v-if="errors.email" id="error-email" class="field-error">{{ errors.email }}</span>
        </label>

        <label class="form-field form-full">
          <span>Subject</span>
          <input
            v-model="form.subject"
            name="subject"
            type="text"
            placeholder="Project subject"
            :aria-invalid="errors.subject ? 'true' : 'false'"
            aria-describedby="error-subject"
          />
          <span v-if="errors.subject" id="error-subject" class="field-error">{{ errors.subject }}</span>
        </label>

        <label class="form-field form-full">
          <span>Message</span>
          <textarea
            v-model="form.message"
            name="message"
            rows="6"
            placeholder="How can we help you?"
            :aria-invalid="errors.message ? 'true' : 'false'"
            aria-describedby="error-message"
          ></textarea>
          <span v-if="errors.message" id="error-message" class="field-error">{{ errors.message }}</span>
        </label>
      </div>

      <button type="submit" class="btn btn-primary">Send Message</button>
      <p v-if="successMessage" class="form-success" role="status">{{ successMessage }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

const form = reactive({ name: '', email: '', subject: '', message: '' })
const errors = reactive({ name: '', email: '', subject: '', message: '' })
const successMessage = ref('')

const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const validate = () => {
  errors.name = form.name.trim() ? '' : 'Please enter your name.'
  errors.email = form.email.trim() ? (validateEmail(form.email) ? '' : 'Enter a valid email address.') : 'Please enter your email.'
  errors.subject = form.subject.trim() ? '' : 'Please enter a subject.'
  errors.message = form.message.trim() ? '' : 'Please share your message.'
  return !errors.name && !errors.email && !errors.subject && !errors.message
}

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
}

const handleSubmit = () => {
  if (!validate()) {
    successMessage.value = ''
    return
  }
  successMessage.value = 'Thanks! Your message has been sent successfully.'
  resetForm()
}

watch(form, () => {
  if (successMessage.value) successMessage.value = ''
}, { deep: true })
</script>
