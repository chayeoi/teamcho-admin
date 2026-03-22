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
      gap: '4px',
      backgroundColor: '#F4F5F7',
      borderRadius: '9px',
      padding: '3px',
    }}>
      {tabs.map((tab) => {
        const isActive = currentFilter === tab.value
        return (
          <Link
            key={tab.value}
            href={`/posts?filter=${tab.value}`}
            style={{
              padding: '5px 12px',
              fontSize: '12.5px',
              fontWeight: isActive ? '600' : '500',
              color: isActive ? '#111111' : '#888888',
              backgroundColor: isActive ? '#FFFFFF' : 'transparent',
              borderRadius: '7px',
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
