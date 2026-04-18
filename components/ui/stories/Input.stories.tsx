import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '../Input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: '입력하세요...' },
}

export const Email: Story = {
  args: { type: 'email', placeholder: 'admin@example.com' },
}

export const Password: Story = {
  args: { type: 'password', placeholder: '••••••••' },
}

export const Disabled: Story = {
  args: { placeholder: '비활성화', disabled: true },
}
