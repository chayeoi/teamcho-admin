import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from '../Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    rows: { control: 'number' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: '내용을 입력하세요...' },
}

export const Disabled: Story = {
  args: { placeholder: '비활성화', disabled: true },
}
