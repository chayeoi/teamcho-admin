'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

const tabs = [
  { label: '전체', value: 'all' },
  { label: '초안', value: 'draft' },
  { label: '발행됨', value: 'published' },
  { label: '예약됨', value: 'scheduled' },
]

export function FilterTabs({ currentFilter }: { currentFilter: string }) {
  return (
    <div className="flex items-center gap-0.5 bg-[#F5F5F5] rounded-lg p-0.5">
      {tabs.map((tab) => {
        const isActive = currentFilter === tab.value
        return (
          <Link
            key={tab.value}
            href={`/posts?filter=${tab.value}`}
            className={cn(
              'px-[11px] py-1 text-[12px] rounded-md no-underline whitespace-nowrap transition-all duration-[120ms]',
              isActive
                ? 'bg-white text-[#111111] font-semibold shadow-sm'
                : 'text-[#AAAAAA] font-normal hover:text-[#666666]'
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
