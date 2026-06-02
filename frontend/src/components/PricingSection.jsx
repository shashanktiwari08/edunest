import React from 'react';
import { Check } from 'lucide-react';

export default function PricingSection({ onBuyNow }) {
  const tiers = [
    {
      name: 'Starter Plan',
      price: '₹999',
      billing: '/ month',
      desc: 'Perfect for individual private tutors and home tuition teachers.',
      features: [
        'Up to 2 Active Batches',
        'Up to 30 Students enrolled',
        'Direct Mobile Number Sign In',
        'Real-time lecture notifications',
        'Daily digital attendance sheets',
        'Standard Email support'
      ],
      popular: false,
      btnText: 'Subscribe Starter'
    },
    {
      name: 'Professional Plan',
      price: '₹2,499',
      billing: '/ month',
      desc: 'Ideal for growing tutoring academies and private learning centers.',
      features: [
        'Unlimited Active Batches',
        'Unlimited Students enrolled',
        'Full Admin Operations Console',
        'Instant broadcast notice board',
        'Automatic 30-day billing cycles',
        'Interactive financial salary/fee ledgers',
        'Priority Phone & Email support'
      ],
      popular: true,
      btnText: 'Buy Premium Access'
    },
    {
      name: 'Enterprise Plan',
      price: '₹5,999',
      billing: '/ month',
      desc: 'Engineered for full-scale tuition institutes and coaching centers.',
      features: [
        'All Premium Plan features',
        'Multiple teacher account allocations',
        'Detailed operations audit trails',
        'White-label customized subdomain',
        'Dedicated account manager support',
        'Custom integration setup APIs'
      ],
      popular: false,
      btnText: 'Contact Enterprise'
    }
  ];

  return (
    <div id="pricing" style={{ padding: '4rem 1.25rem', width: '100%' }} className="sm:py-24">
      <div style={{ maxWidth: '1024px', margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
        <span className="badge badge-accent" style={{ marginBottom: '0.75rem', fontSize: '13px' }}>
          Affordable SaaS Subscriptions
        </span>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 6vw, 44px)',
          fontWeight: 700,
          color: '#111827',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: '1rem'
        }}>
          Power your tuition center with EduNest
        </h2>
        <p style={{
          fontSize: 'clamp(14px, 3vw, 17px)',
          color: '#4b5563',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.5
        }}>
          Choose the best membership plan that matches the scale of your coaching center. Sign up instantly and shape the future of your academy.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        maxWidth: '1024px',
        margin: '0 auto',
        alignItems: 'stretch'
      }}>
        {tiers.map((tier, idx) => (
          <div 
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '2.25rem 2rem',
              border: tier.popular ? '2.5px solid #ef4d23' : '1px solid #e5e5e5',
              boxShadow: tier.popular ? '0 20px 25px -5px rgba(239, 77, 35, 0.08)' : '0 4px 6px -1px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s',
              transform: tier.popular ? 'scale(1.03)' : 'scale(1)'
            }}
            className="pricing-card"
          >
            {tier.popular && (
              <div style={{
                position: 'absolute',
                top: '18px',
                right: '-32px',
                backgroundColor: '#ef4d23',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: '700',
                padding: '4px 32px',
                transform: 'rotate(45deg)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Popular
              </div>
            )}

            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                {tier.name}
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.4, marginBottom: '1.5rem', minHeight: '40px' }}>
                {tier.desc}
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '2rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.02em' }}>
                  {tier.price}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginLeft: '4px' }}>
                  {tier.billing}
                </span>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 2.5rem 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {tier.features.map((feat, fidx) => (
                  <li key={fidx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '13.5px',
                    color: '#374151',
                    lineHeight: 1.3
                  }}>
                    <Check size={16} color="#ef4d23" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onBuyNow(tier)}
              style={{
                width: '100%',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: tier.popular ? '#ef4d23' : '#1f2937',
                color: '#ffffff'
              }}
              className="pricing-btn"
            >
              {tier.btnText}
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pricing-card {
            transform: none !important;
            padding: 1.75rem 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
