'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ── Loading dots animation (keyframe: globals.css @layer base) ── */
function LoadingDots() {
  return (
    <span className="inline-flex items-center justify-center gap-[3px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block w-[4px] h-[4px] rounded-full bg-current"
          style={{
            animation: 'dot-fade 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </span>
  )
}

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-lg border font-medium transition-all duration-150 select-none cursor-pointer disabled:cursor-not-allowed whitespace-nowrap',
  {
    variants: {
      variant: {
        /* ── 디자인 시스템 ── */
        primary: [
          'font-bold text-white border-transparent',
          'bg-gradient-to-br from-[#1A1A1A] to-[#2E2E2E]',
          'shadow-[0_2px_8px_rgba(0,0,0,0.18)]',
          'hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.22)]',
          'active:translate-y-0 active:shadow-[0_2px_8px_rgba(0,0,0,0.18)]',
          'disabled:from-[#888] disabled:to-[#888] disabled:shadow-none disabled:opacity-80',
        ],
        secondary: [
          'text-[#555] bg-[#F5F5F5] border-[#E5E5E5]',
          'hover:bg-[#EBEBEB] hover:border-[#DCDCDC]',
          'disabled:text-[#AAAAAA] disabled:bg-transparent disabled:opacity-70',
        ],
        outline: [
          'text-[#555] bg-transparent border-[#E5E5E5]',
          'hover:bg-[#F5F5F5] hover:border-[#DCDCDC]',
          'disabled:text-[#AAAAAA] disabled:opacity-60',
        ],
        ghost: [
          'border-transparent text-[#666] bg-transparent',
          'hover:bg-[#F5F5F5] hover:text-[#333]',
          'disabled:opacity-50',
        ],
        /* ── 시스템 / shadcn 호환 ── */
        destructive: [
          'border-transparent text-red-600 bg-red-50',
          'hover:bg-red-100',
          'disabled:opacity-50',
        ],
        link: [
          'border-transparent text-[#111] underline-offset-4',
          'hover:underline',
          'disabled:opacity-50',
        ],
      },
      size: {
        sm:        'h-7 px-3 text-[12px] gap-1',
        md:        'h-8 px-4 text-[13px]',
        lg:        'h-10 px-4 text-[13px]',
        /* 로그인 등 full-width tall 버튼은 size="lg" + className="w-full text-sm" */
        icon:      'size-8 rounded-md border-transparent p-0',
        'icon-xs': 'size-6 rounded border-transparent p-0',
        'icon-sm': 'size-7 rounded-md border-transparent p-0',
        'icon-lg': 'size-9 rounded-md border-transparent p-0',
        /* backwards compat */
        default:   'h-8 px-4 text-[13px]',
        xs:        'h-6 px-2 text-xs gap-1',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading = false, disabled, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={loading || disabled}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {loading ? <LoadingDots /> : children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
