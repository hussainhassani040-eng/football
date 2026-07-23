import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2025-03-31.basil' as any,
  })

  const body = await readBody(event)
  const { amount } = body

  if (!amount || amount < 100) {
    throw createError({
      statusCode: 400,
      message: 'Amount must be at least 100 cents ($1.00)',
    })
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      clientSecret: paymentIntent.client_secret,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create payment intent',
    })
  }
})