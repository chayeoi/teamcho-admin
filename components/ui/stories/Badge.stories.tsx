import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '../Badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
    children: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { variant: 'default', children: '발행됨' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: '초안' },
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: '삭제됨' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: '예약됨' },
}

export const PostStatuses: Story = {
  name: '포스트 상태 뱃지',
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge variant="default">발행됨</Badge>
      <Badge variant="secondary">초안</Badge>
      <Badge variant="outline">예약됨</Badge>
    </div>
  ),
}
