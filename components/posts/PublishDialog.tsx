'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  format, addMonths, subMonths,
  startOfMonth, endOfMonth,
  startOfWeek, endOfWeek,
  eachDayOfInterval,
  isSameMonth, isSameDay, isToday, startOfDay,
} from 'date-fns'
import { publishPost } from '@/lib/actions/posts'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface PublishDialogProps {
  postId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

type PublishMode = 'immediate' | 'scheduled'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function MiniCalendar({ selected, onSelect }: { selected?: Date; onSelect: (d: Date) => void }) {
  const [viewMonth, setViewMonth] = useState(() => selected ?? new Date())
  const today = startOfDay(new Date())

  const calDays = useMemo(() => {
    const s = startOfMonth(viewMonth)
    const e = endOfMonth(viewMonth)
    return eachDayOfInterval({
      start: startOfWeek(s, { weekStartsOn: 0 }),
      end: endOfWeek(e, { weekStartsOn: 0 }),
    })
  }, [viewMonth])

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          className="size-[30px] rounded-lg bg-transparent border border-[#EBEBEB] flex items-center justify-center cursor-pointer text-[#666666] flex-shrink-0 hover:bg-[#F5F5F5] hover:text-[#111111] transition-all"
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-[13.5px] font-semibold text-[#111111] tracking-tight">
          {format(viewMonth, 'yyyy년 M월')}
        </span>
        <button
          className="size-[30px] rounded-lg bg-transparent border border-[#EBEBEB] flex items-center justify-center cursor-pointer text-[#666666] flex-shrink-0 hover:bg-[#F5F5F5] hover:text-[#111111] transition-all"
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-semibold text-[#CCCCCC] py-1 tracking-[0.02em]"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-[3px]">
        {calDays.map((day) => {
          const isPast = day < today
          const isOut = !isSameMonth(day, viewMonth)
          const isSel = !!selected && isSameDay(day, selected)
          const isTodayDay = isToday(day)

          return (
            <button
              key={day.getTime()}
              onClick={() => !isPast && onSelect(day)}
              disabled={isPast}
              className={cn(
                'h-[34px] rounded-lg text-[12.5px] transition-colors',
                isSel && 'bg-[#111111] text-white font-bold border-[1.5px] border-transparent',
                isTodayDay && !isSel && 'font-semibold text-[#111111] border-[1.5px] border-[#DDDDDD] bg-transparent',
                (isPast || isOut) && !isSel && 'text-[#DDDDDD] cursor-default',
                !isSel && !isPast && !isOut && !isTodayDay && 'text-[#333333] hover:bg-[#F2F2F2]',
              )}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [h, m] = value.split(':').map(Number)

  function update(hours: number, minutes: number) {
    onChange(`${pad(hours)}:${pad(minutes)}`)
  }

  function changeH(delta: number) {
    update((h + delta + 24) % 24, m)
  }

  function changeM(delta: number) {
    const steps = Math.round(m / 5)
    const next = ((steps + delta) * 5 + 60) % 60
    update(h, next)
  }

  function Seg({ label, value: val, onUp, onDown }: {
    label: string; value: number; onUp: () => void; onDown: () => void
  }) {
    return (
      <div className="flex flex-col items-center gap-1.5 flex-1">
        <button
          className="w-full h-[26px] bg-transparent border border-[#EBEBEB] rounded-lg flex items-center justify-center text-[#BBBBBB] hover:bg-[#F5F5F5] hover:text-[#333333] hover:border-[#D5D5D5] transition-all flex-shrink-0"
          onClick={onUp}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>

        <div className="w-full py-2.5 bg-[#F8F8F8] border border-[#EBEBEB] rounded-[10px] text-center text-[26px] font-semibold text-[#111111] tracking-tight leading-none [font-variant-numeric:tabular-nums]">
          {pad(val)}
        </div>

        <button
          className="w-full h-[26px] bg-transparent border border-[#EBEBEB] rounded-lg flex items-center justify-center text-[#BBBBBB] hover:bg-[#F5F5F5] hover:text-[#333333] hover:border-[#D5D5D5] transition-all flex-shrink-0"
          onClick={onDown}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <span className="text-[11px] font-medium text-[#CCCCCC] tracking-[0.04em]">
          {label}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-[10px]">
      <Seg label="시" value={h} onUp={() => changeH(1)} onDown={() => changeH(-1)} />
      <div className="text-[22px] font-light text-[#CCCCCC] pb-6 flex-shrink-0">:</div>
      <Seg label="분" value={m} onUp={() => changeM(1)} onDown={() => changeM(-1)} />
    </div>
  )
}

export function PublishDialog({ postId, open, onOpenChange, onSuccess }: PublishDialogProps) {
  const router = useRouter()
  const [mode, setMode] = useState<PublishMode>('immediate')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState('09:00')
  const [isLoading, setIsLoading] = useState(false)

  async function handlePublish() {
    setIsLoading(true)
    try {
      let scheduledDate: Date | undefined

      if (mode === 'scheduled') {
        if (!selectedDate) {
          toast.error('날짜를 선택해 주세요')
          setIsLoading(false)
          return
        }
        const [hours, minutes] = time.split(':').map(Number)
        scheduledDate = new Date(selectedDate)
        scheduledDate.setHours(hours, minutes, 0, 0)

        if (scheduledDate <= new Date()) {
          toast.error('예약 시간은 현재 시간 이후여야 해요')
          setIsLoading(false)
          return
        }
      }

      const { error } = await publishPost(postId, scheduledDate)
      if (error) { toast.error(error); return }

      toast.success(mode === 'scheduled' ? '발행이 예약됐어요' : '발행됐어요')
      onSuccess?.()
      onOpenChange(false)
      router.refresh()
    } catch {
      toast.error('오류가 발생했어요')
    } finally {
      setIsLoading(false)
    }
  }

  const isDisabled = isLoading || (mode === 'scheduled' && !selectedDate)

  // 예약 시간 미리보기
  const scheduledPreview = useMemo(() => {
    if (!selectedDate) return null
    const [h, m] = time.split(':').map(Number)
    const ampm = h < 12 ? '오전' : '오후'
    const h12 = h % 12 === 0 ? 12 : h % 12
    return `${format(selectedDate, 'yyyy년 M월 d일')}  ${ampm} ${h12}:${pad(m)}`
  }, [selectedDate, time])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden gap-0 bg-white border border-[#EBEBEB] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] max-w-[400px]">
        {/* 헤더 */}
        <DialogHeader className="px-6 pt-[22px] pb-4 border-b border-[#F2F2F2]">
          <DialogTitle className="text-[15px] font-bold text-[#111111] tracking-tight">
            발행 설정
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#AAAAAA] mt-[3px]">
            즉시 발행하거나 예약 발행 시간을 설정해요.
          </DialogDescription>
        </DialogHeader>

        {/* 모드 탭 */}
        <div className="flex px-6 border-b border-[#EBEBEB]">
          {([
            { value: 'immediate', label: '즉시 발행' },
            { value: 'scheduled', label: '예약 발행' },
          ] as const).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setMode(tab.value)}
              className={cn(
                'px-3.5 pt-3 pb-[11px] text-[13px] -mb-px transition-all font-inherit',
                mode === tab.value
                  ? 'font-semibold text-[#111111] border-b-2 border-[#111111]'
                  : 'font-medium text-[#AAAAAA] border-b-2 border-transparent',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 본문 */}
        <div className="px-6 py-5">
          {mode === 'immediate' ? (
            <div className="p-4 bg-[#F8F8F8] rounded-xl border border-[#EBEBEB] mb-5">
              <div className="flex items-start gap-[10px]">
                <div className="size-7 rounded-[7px] bg-[#111111] flex items-center justify-center flex-shrink-0 mt-px">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[#111111] mb-[3px]">
                    지금 바로 발행돼요
                  </div>
                  <div className="text-[12.5px] text-[#888888] leading-[1.5]">
                    발행 즉시 독자에게 공개돼요.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-5">
              {/* 날짜 선택 */}
              <div className="p-4 bg-[#FAFAFA] border border-[#EBEBEB] rounded-xl mb-3">
                <MiniCalendar selected={selectedDate} onSelect={setSelectedDate} />
              </div>

              {/* 시간 선택 */}
              <div className="p-4 bg-[#FAFAFA] border border-[#EBEBEB] rounded-xl">
                <div className="text-[11px] font-semibold text-[#BBBBBB] uppercase tracking-[0.06em] mb-3.5">
                  발행 시각
                </div>
                <TimePicker value={time} onChange={setTime} />
              </div>

              {/* 예약 미리보기 */}
              {scheduledPreview && (
                <div className="flex items-center gap-[7px] mt-2.5 px-3.5 py-2 bg-[#111111] rounded-[9px]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-[12px] font-medium text-white/85 tracking-tight">
                    {scheduledPreview}에 발행돼요
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1 py-2.5 text-[13px] font-semibold text-[#666666] bg-transparent border border-[#E5E5E5] rounded-[9px] hover:bg-[#F5F5F5] transition-colors"
            >
              취소
            </button>
            <button
              onClick={handlePublish}
              disabled={isDisabled}
              className={cn(
                'flex-1 py-2.5 text-[13px] font-bold text-white border-none rounded-[9px]',
                isDisabled
                  ? 'bg-[#CCCCCC] cursor-not-allowed'
                  : 'bg-gradient-to-br from-[#1A1A1A] to-[#2E2E2E] shadow-[0_2px_8px_rgba(0,0,0,0.2)] cursor-pointer',
              )}
            >
              {isLoading
                ? (mode === 'scheduled' ? '예약 중...' : '발행 중...')
                : (mode === 'scheduled' ? '예약 발행' : '즉시 발행')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
