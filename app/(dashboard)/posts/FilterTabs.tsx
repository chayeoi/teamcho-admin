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
    <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #262626', marginBottom: '24px' }}>
      {tabs.map((tab) => {
        const isActive = currentFilter === tab.value
        return (
          <Link
            key={tab.value}
            href={`/posts?filter=${tab.value}`}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              color: isActive ? '#E8D5B0' : '#666',
              borderBottom: isActive ? '2px solid #E8D5B0' : '2px solid transparent',
              textDecoration: 'none',
              fontWeight: isActive ? '500' : '400',
              transition: 'color 0.15s',
            }}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
