import React from 'react'
import { X, Check, Star } from 'lucide-react'

export default function SubscriptionModal({ onClose }) {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic rights scripts',
        'English language only',
        'Limited recording storage',
        'Community support'
      ],
      current: true
    },
    {
      name: 'Premium',
      price: '$5',
      period: 'month',
      features: [
        'All free features',
        'State-specific laws',
        'Multilingual support',
        'Unlimited cloud storage',
        'Advanced scripting',
        'Priority support',
        'Legal consultation referrals'
      ],
      recommended: true
    }
  ]

  const handleSubscribe = (plan) => {
    if (plan.name === 'Premium') {
      // In a real app, this would integrate with Stripe
      alert('Stripe integration would handle payment here')
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-lg z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-lg border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-textPrimary">Choose Your Plan</h2>
            <button
              onClick={onClose}
              className="p-sm hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-6 h-6 text-textSecondary" />
            </button>
          </div>
          <p className="text-textSecondary mt-sm">
            Upgrade to Premium for full access to state-specific laws and advanced features
          </p>
        </div>

        <div className="p-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-lg rounded-lg border-2 ${
                  plan.recommended
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-accent text-white px-md py-xs rounded-full text-sm font-medium flex items-center gap-xs">
                      <Star className="w-4 h-4" />
                      Recommended
                    </span>
                  </div>
                )}

                <div className="text-center mb-lg">
                  <h3 className="text-xl font-semibold text-textPrimary mb-sm">{plan.name}</h3>
                  <div className="mb-md">
                    <span className="text-4xl font-bold text-textPrimary">{plan.price}</span>
                    <span className="text-textSecondary">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-md mb-lg">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-sm">
                      <Check className="w-5 h-5 text-success mt-xs flex-shrink-0" />
                      <span className="text-textSecondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full py-md px-lg rounded-md font-medium transition-colors ${
                    plan.current
                      ? 'bg-gray-100 text-textSecondary cursor-default'
                      : plan.recommended
                      ? 'bg-accent text-white hover:bg-accent/90'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : `Choose ${plan.name}`}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-lg text-center">
            <p className="text-sm text-textSecondary">
              All plans include 7-day free trial. Cancel anytime. No hidden fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}