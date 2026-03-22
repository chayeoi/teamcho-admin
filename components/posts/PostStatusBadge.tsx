import { Badge } from '@/components/ui/badge'
import { PostStatus } from '@/lib/actions/posts'

const statusConfig = {
  draft: { label: '초안', className: 'bg-[#2A2A2A] text-[#888] border-[#333] hover:bg-[#2A2A2A]' },
  published: { label: '발행됨', className: 'bg-[#0D2818] text-[#4ADE80] border-[#1A4D2E] hover:bg-[#0D2818]' },
  scheduled: { label: '예약됨', className: 'bg-[#0D1A2B] text-[#60A5FA] border-[#1A3355] hover:bg-[#0D1A2B]' },
}

export function PostStatusBadge({ status }: { status: PostStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
