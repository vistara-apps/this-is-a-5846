// Stripe service for handling payments
// In a real app, this would be handled by your backend

export async function createPaymentIntent(amount, currency = 'usd') {
  try {
    // This would normally be a call to your backend API
    // which would then call Stripe's API
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Stripe expects amount in cents
        currency
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create payment intent')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

export async function confirmSubscription(paymentMethodId, priceId) {
  try {
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_method: paymentMethodId,
        price_id: priceId
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create subscription')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw error
  }
}