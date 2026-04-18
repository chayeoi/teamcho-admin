import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
      description: '버튼 스타일',
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon', 'icon-sm', 'icon-xs', 'icon-lg'],
      description: '버튼 크기',
      table: { defaultValue: { summary: 'md' } },
    },
    loading: {
      control: 'boolean',
      description: 'true 시 클릭 불가 + 점 애니메이션',
    },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/* ── 개별 variant ── */

export const Primary: Story = {
  args: { variant: 'primary', size: 'md', children: '발행하기' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', size: 'md', children: '저장하기' },
}

export const Outline: Story = {
  args: { variant: 'outline', size: 'md', children: '취소' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', size: 'md', children: '더보기' },
}

export const Destructive: Story = {
  args: { variant: 'destructive', size: 'md', children: '삭제하기' },
}

/* ── Loading 상태 ── */

export const PrimaryLoading: Story = {
  name: 'Loading: Primary',
  args: { variant: 'primary', size: 'md', loading: true, children: '발행하기' },
}

export const SecondaryLoading: Story = {
  name: 'Loading: Secondary',
  args: { variant: 'secondary', size: 'md', loading: true, children: '저장하기' },
}

/* ── 크기 비교 ── */

export const AllSizes: Story = {
  name: '모든 Size 비교',
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="md">Medium</Button>
      <Button variant="primary" size="lg">Large</Button>
    </div>
  ),
}

/* ── 로그인 버튼 (full-width + lg) ── */

export const LoginButton: Story = {
  name: '로그인 버튼 (full-width)',
  args: {
    variant: 'primary',
    size: 'lg',
    className: 'w-full text-sm',
    children: '로그인 →',
  },
  decorators: [(Story: React.FC) => <div style={{ width: 380 }}><Story /></div>],
}

export const LoginLoading: Story = {
  name: '로그인 버튼 Loading',
  args: {
    variant: 'primary',
    size: 'lg',
    loading: true,
    className: 'w-full text-sm',
    children: '로그인 →',
  },
  decorators: [(Story: React.FC) => <div style={{ width: 380 }}><Story /></div>],
}

/* ── 다이얼로그 버튼 쌍 ── */

export const DialogButtons: Story = {
  name: '다이얼로그 버튼 (취소 + 발행)',
  render: () => (
    <div style={{ display: 'flex', gap: 8, width: 340 }}>
      <Button variant="outline" size="lg" className="flex-1">취소</Button>
      <Button variant="primary" size="lg" className="flex-1">즉시 발행</Button>
    </div>
  ),
}

export const DialogButtonsLoading: Story = {
  name: '다이얼로그 버튼 Loading',
  render: () => (
    <div style={{ display: 'flex', gap: 8, width: 340 }}>
      <Button variant="outline" size="lg" disabled className="flex-1">취소</Button>
      <Button variant="primary" size="lg" loading className="flex-1">즉시 발행</Button>
    </div>
  ),
}

/* ── 모든 variant 비교 ── */

export const AllVariants: Story = {
  name: '모든 Variant 비교',
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
}
