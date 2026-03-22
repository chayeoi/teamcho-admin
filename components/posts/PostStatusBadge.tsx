import { PostStatus } from '@/lib/actions/posts'

const statusConfig = {
  draft: { label: '초안', dot: '#AAAAAA', color: '#555555', bg: '#F2F2F2', border: '#E5E5E5' },
  published: { label: '발행됨', dot: '#10B981', color: '#065F46', bg: '#ECFDF5', border: '#A7F3D0' },
  scheduled: { label: '예약됨', dot: '#F59E0B', color: '#92400E', bg: '#FFFBEB', border: '#FDE68A' },
}

export function PostStatusBadge({ status }: { status: PostStatus }) {
  const cfg = statusConfig[status]
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 9px',
      borderRadius: '20px',
      fontSize: '11.5px',
      fontWeight: '600',
      color: cfg.color,
      backgroundColor: cfg.bg,
      border: `1px solid ${cfg.border}`,
      letterSpacing: '0.01em',
    }}>
      <span style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        backgroundColor: cfg.dot,
        flexShrink: 0,
      }} />
      {cfg.label}
    </span>
  )
}
