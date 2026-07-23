<template>
  <div class="donate-page">
    <div class="donate-container">
      <div class="donate-header">
        <h1>Support Football News</h1>
        <p>Your donation helps us keep bringing you the latest football coverage, match analysis, and transfer news.</p>
      </div>

      <div v-if="!clientSecret" class="donate-form">
        <div class="amount-section">
          <label for="amount">Choose an amount</label>
          <div class="amount-options">
            <button
              v-for="preset in presetAmounts"
              :key="preset"
              :class="['amount-btn', { active: selectedAmount === preset }]"
              @click="selectAmount(preset)"
            >
              ${{ preset }}
            </button>
          </div>
          <div class="custom-amount">
            <span class="currency-sign">$</span>
            <input
              id="amount"
              v-model="customAmount"
              type="number"
              min="1"
              step="1"
              placeholder="Custom amount"
              @input="onCustomAmountInput"
            />
          </div>
        </div>

        <div class="donor-section">
          <label for="donor-name">Your Name (optional)</label>
          <input
            id="donor-name"
            v-model="donorName"
            type="text"
            placeholder="Enter your name"
            class="donor-input"
          />
        </div>

        <button
          class="pay-button"
          :disabled="!validAmount || loading"
          @click="handleProceedToPay"
        >
          <span v-if="loading" class="spinner"></span>
          <span v-else>Donate ${{ displayAmount }}</span>
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>
      </div>

      <div v-else class="payment-section">
        <div class="payment-summary">
          <p class="payment-amount">${{ displayAmount }}</p>
          <p class="payment-label">Donation</p>
        </div>

        <div id="stripe-card-element" class="stripe-card-wrapper">
          <div ref="cardElementRef" class="stripe-card-element"></div>
        </div>

        <button
          class="pay-button"
          :disabled="processing"
          @click="handleConfirmPayment"
        >
          <span v-if="processing" class="spinner"></span>
          <span v-else>Confirm Payment</span>
        </button>

        <button class="back-button" @click="resetPayment">
          ← Change amount
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>
        <p v-if="success" class="success-message">Thank you for your donation! 🎉</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { loadStripe } from '@stripe/stripe-js'

const config = useRuntimeConfig()

const presetAmounts = [5, 10, 25, 50, 100]
const selectedAmount = ref<number | null>(null)
const customAmount = ref<string>('')
const donorName = ref<string>('')
const clientSecret = ref<string | null>(null)
const loading = ref(false)
const processing = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const cardElementRef = ref<HTMLDivElement | null>(null)

let stripeInstance: any = null
let elements: any = null
let cardElement: any = null

const displayAmount = computed(() => {
  if (selectedAmount.value) return selectedAmount.value
  const custom = parseFloat(customAmount.value)
  return isNaN(custom) ? 0 : custom
})

const validAmount = computed(() => displayAmount.value >= 1)

function selectAmount(amount: number) {
  selectedAmount.value = amount
  customAmount.value = ''
  error.value = null
}

function onCustomAmountInput() {
  selectedAmount.value = null
  error.value = null
}

async function handleProceedToPay() {
  if (!validAmount.value) return

  loading.value = true
  error.value = null

  try {
    const amountInCents = Math.round(displayAmount.value * 100)

    const response = await $fetch<{ clientSecret: string }>('/api/create-payment-intent', {
      method: 'POST',
      body: { amount: amountInCents },
    })

    clientSecret.value = response.clientSecret

    // Load Stripe and create Elements
    const stripePublishableKey = config.public.stripePublishableKey
    if (!stripePublishableKey) {
      throw new Error('Stripe publishable key is not configured')
    }

    stripeInstance = await loadStripe(stripePublishableKey)
    if (!stripeInstance) {
      throw new Error('Failed to load Stripe')
    }

    // Wait for next tick to ensure DOM is rendered
    await nextTick()

    elements = stripeInstance.elements()
    cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
        },
      },
    })

    if (cardElementRef.value) {
      cardElement.mount(cardElementRef.value)
    }
  } catch (err: any) {
    error.value = err.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleConfirmPayment() {
  if (!stripeInstance || !cardElement || !clientSecret.value) return

  processing.value = true
  error.value = null

  try {
    const { error: confirmError, paymentIntent } = await stripeInstance.confirmCardPayment(clientSecret.value, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: donorName.value || 'Anonymous Donor',
        },
      },
    })

    if (confirmError) {
      throw new Error(confirmError.message)
    }

    if (paymentIntent.status === 'succeeded') {
      success.value = true
      cardElement.clear()
      cardElement.unmount()
    }
  } catch (err: any) {
    error.value = err.message || 'Payment failed. Please try again.'
  } finally {
    processing.value = false
  }
}

function resetPayment() {
  clientSecret.value = null
  error.value = null
  success.value = false
  if (cardElement) {
    cardElement.unmount()
    cardElement = null
  }
  stripeInstance = null
  elements = null
}
</script>

<style scoped>
.donate-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.donate-container {
  width: 100%;
  max-width: 480px;
  background: #1e293b;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.donate-header {
  text-align: center;
  margin-bottom: 2rem;
}

.donate-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
}

.donate-header p {
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.5;
}

.amount-section {
  margin-bottom: 1.5rem;
}

.amount-section label,
.donor-section label {
  display: block;
  color: #cbd5e1;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.amount-options {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.amount-btn {
  padding: 0.625rem 0.25rem;
  border: 2px solid #334155;
  border-radius: 8px;
  background: transparent;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.amount-btn:hover {
  border-color: #3b82f6;
  color: #fff;
}

.amount-btn.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.custom-amount {
  position: relative;
}

.currency-sign {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 1.125rem;
  font-weight: 600;
}

.custom-amount input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.25rem;
  border: 2px solid #334155;
  border-radius: 8px;
  background: #0f172a;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.custom-amount input:focus {
  border-color: #3b82f6;
}

.custom-amount input::placeholder {
  color: #475569;
}

.donor-section {
  margin-bottom: 1.5rem;
}

.donor-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #334155;
  border-radius: 8px;
  background: #0f172a;
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.donor-input:focus {
  border-color: #3b82f6;
}

.donor-input::placeholder {
  color: #475569;
}

.pay-button {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.pay-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-1px);
}

.pay-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  color: #f87171;
  font-size: 0.875rem;
  margin-top: 1rem;
  text-align: center;
}

.success-message {
  color: #34d399;
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 1rem;
  text-align: center;
}

.payment-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.payment-summary {
  text-align: center;
  margin-bottom: 1.5rem;
}

.payment-amount {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
}

.payment-label {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.stripe-card-wrapper {
  background: #0f172a;
  border: 2px solid #334155;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
}

.stripe-card-element {
  min-height: 40px;
}

.back-button {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #334155;
  border-radius: 8px;
  background: transparent;
  color: #94a3b8;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.75rem;
}

.back-button:hover {
  border-color: #475569;
  color: #fff;
}
</style>