'use client'

import Link from 'next/link'

const tabs = [
  { label: '전체', value: 'all' },
  { label: '초안', value: 'draft' },
  { label: '발행됨', value: 'published' },
  { label: '예약됨', value: 'scheduled' },
]

export function FilterTabs({ currentFilter }: { currentFilter: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      backgroundColor: '#F5F5F5',
      borderRadius: '8px',
      padding: '3px',
    }}>
      {tabs.map((tab) => {
        const isActive = currentFilter === tab.value
        return (
          <Link
            key={tab.value}
            href={`/posts?filter=${tab.value}`}
            style={{
              padding: '4px 11px',
              fontSize: '12px',
              fontWeight: isActive ? '600' : '400',
              color: isActive ? '#111111' : '#AAAAAA',
              backgroundColor: isActive ? '#FFFFFF' : 'transparent',
              borderRadius: '6px',
              textDecoration: 'none',
              transition: 'all 0.12s',
              whiteSpace: 'nowrap',
              boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
