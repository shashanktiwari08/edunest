import React, { useState } from 'react';
import { TrendingDown, TrendingUp, ChevronDown, X } from 'lucide-react';
import Gauge from './Gauge';

export default function DashboardPreview() {
  // State for Card 1 interactive toggle
  const [card1Active, setCard1Active] = useState('impressions'); // 'impressions' | 'clicks'
  // State for Card 3 interactive toggle
  const [card3Active, setCard3Active] = useState('clicks'); // 'clicks' | 'starts'

  // State for Card 2 form inputs
  const [monthTarget, setMonthTarget] = useState(10);
  const [yearTarget, setYearTarget] = useState(100);

  return (
    <div className="px-3 sm:px-4" style={{ width: '100%' }}>
      <div style={{
        backgroundColor: '#f5f2ee',
        borderRadius: '24px',
        padding: '1rem',
        width: '100%',
        maxWidth: '880px',
        margin: '0 auto',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02)'
      }} className="sm:p-6">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem'
        }}>
          
          {/* CARD 1 — Impressions / Clicks */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ef4d23', fontWeight: '600', fontSize: '13px' }}>
                {card1Active === 'impressions' ? 'Impressions' : 'Clicks'}
              </span>
              <span style={{ color: '#737373', fontSize: '13px' }}>This Month</span>
            </div>

            {/* Metrics */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '28px', fontWeight: '600', color: '#111827', letterSpacing: '-0.02em' }}>
                  {card1Active === 'impressions' ? '128,492' : '6,896'}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  borderRadius: '9999px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  <TrendingDown size={12} />
                  {card1Active === 'impressions' ? '-12.4%' : '-3,382 (33%)'}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#8e8e8e', display: 'block', marginTop: '2px' }}>
                Compared to yesterday
              </span>
            </div>

            {/* Target Label */}
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#4b5563', fontWeight: '500' }}>
              Month Target achieved
            </div>

            {/* Gauge */}
            <Gauge 
              value={card1Active === 'impressions' ? 92 : 78} 
              color="#ef4d23" 
              showLabels={true} 
              min="389K" 
              max="425K" 
            />

            {/* Toggle bottom */}
            <div style={{
              backgroundColor: '#f5f5f5',
              borderRadius: '9999px',
              padding: '4px',
              display: 'flex',
              marginTop: 'auto'
            }}>
              <button 
                onClick={() => setCard1Active('impressions')}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: card1Active === 'impressions' ? '#ffffff' : 'transparent',
                  color: card1Active === 'impressions' ? '#111827' : '#737373',
                  boxShadow: card1Active === 'impressions' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Impressions
              </button>
              <button 
                onClick={() => setCard1Active('clicks')}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: card1Active === 'clicks' ? '#ffffff' : 'transparent',
                  color: card1Active === 'clicks' ? '#111827' : '#737373',
                  boxShadow: card1Active === 'clicks' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Clicks
              </button>
            </div>
          </div>

          {/* CARD 2 — Form Configurator */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            {/* Dropdown 1 */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
                Show figures for
              </label>
              <button style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid #d4d4d8',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#1f2937',
                cursor: 'pointer'
              }}>
                This month
                <ChevronDown size={16} color="#71717a" />
              </button>
            </div>

            {/* Dropdown 2 */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
                Compare period by
              </label>
              <button style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid #d4d4d8',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#1f2937',
                cursor: 'pointer'
              }}>
                Month-to-date (MTD)
                <ChevronDown size={16} color="#71717a" />
              </button>
            </div>

            {/* Input 1 */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
                Set targets (This month)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '8px', color: '#a1a1aa', fontSize: '13px' }}>#</span>
                <input 
                  type="number"
                  value={monthTarget}
                  onChange={(e) => setMonthTarget(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 24px',
                    border: '1px solid #d4d4d8',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#1f2937',
                    outline: 'none',
                    fontWeight: '500'
                  }}
                />
              </div>
            </div>

            {/* Input 2 */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
                Set targets (This year)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '8px', color: '#a1a1aa', fontSize: '13px' }}>#</span>
                <input 
                  type="number"
                  value={yearTarget}
                  onChange={(e) => setYearTarget(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 24px',
                    border: '1px solid #d4d4d8',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#1f2937',
                    outline: 'none',
                    fontWeight: '500'
                  }}
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto', paddingTop: '6px' }}>
              <button style={{
                backgroundColor: '#ef4d23',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 20px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}>
                Save
              </button>
              <button style={{
                background: 'none',
                border: 'none',
                color: '#1f2937',
                fontSize: '13px',
                fontWeight: '500',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}>
                Cancel
              </button>
              <button style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#71717a'
              }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* CARD 3 — Video Starts */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifySelf: 'flex-start', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <span style={{ color: '#ef4d23', fontWeight: '600', fontSize: '13px' }}>
                {card3Active === 'clicks' ? 'Video Clicks' : 'Video Starts'}
              </span>
              <span style={{ color: '#737373', fontSize: '13px' }}>Today</span>
            </div>

            {/* Metrics */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '28px', fontWeight: '600', color: '#111827', letterSpacing: '-0.02em' }}>
                  {card3Active === 'clicks' ? '14' : '0'}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  borderRadius: '9999px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  <TrendingUp size={12} />
                  {card3Active === 'clicks' ? '+8' : '0'}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#8e8e8e', display: 'block', marginTop: '2px' }}>
                Compared to yesterday
              </span>
            </div>

            {/* Gauge */}
            <Gauge 
              value={card3Active === 'clicks' ? 68 : 0} 
              color="#9ca3af" 
              showLabels={false} 
            />

            {/* Toggle bottom */}
            <div style={{
              backgroundColor: '#f5f5f5',
              borderRadius: '9999px',
              padding: '4px',
              display: 'flex',
              marginTop: 'auto'
            }}>
              <button 
                onClick={() => setCard3Active('clicks')}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: card3Active === 'clicks' ? '#ffffff' : 'transparent',
                  color: card3Active === 'clicks' ? '#111827' : '#737373',
                  boxShadow: card3Active === 'clicks' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Video Clicks
              </button>
              <button 
                onClick={() => setCard3Active('starts')}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: card3Active === 'starts' ? '#ffffff' : 'transparent',
                  color: card3Active === 'starts' ? '#111827' : '#737373',
                  boxShadow: card3Active === 'starts' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Video Starts
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
