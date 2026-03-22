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

  const navBtn: React.CSSProperties = {
    width: '30px', height: '30px', borderRadius: '8px',
    backgroundColor: 'transparent', border: '1px solid #EBEBEB',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#666666', flexShrink: 0,
    transition: 'all 0.1s',
  }

  return (
    <div>
      {/* Month navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          style={navBtn}
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; e.currentTarget.style.color = '#111111' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#111111', letterSpacing: '-0.01em' }}>
          {format(viewMonth, 'yyyy년 M월')}
        </span>
        <button
          style={navBtn}
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; e.currentTarget.style.color = '#111111' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: 'center', fontSize: '11px', fontWeight: '600',
              color: '#CCCCCC', padding: '4px 0', letterSpacing: '0.02em',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
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
              style={{
                height: '34px',
                borderRadius: '8px',
                border: isTodayDay && !isSel ? '1.5px solid #DDDDDD' : '1.5px solid transparent',
                backgroundColor: isSel ? '#111111' : 'transparent',
                color: isSel
                  ? '#FFFFFF'
                  : isPast || isOut
                    ? '#DDDDDD'
                    : isTodayDay
                      ? '#111111'
                      : '#333333',
                fontSize: '12.5px',
                fontWeight: isSel ? '700' : isTodayDay ? '600' : '400',
                cursor: isPast ? 'default' : 'pointer',
                fontFamily: 'inherit',
                transition: 'background-color 0.1s',
              }}
              onMouseEnter={(e) => {
                if (!isSel && !isPast) e.currentTarget.style.backgroundColor = '#F2F2F2'
              }}
              onMouseLeave={(e) => {
                if (!isSel) e.currentTarget.style.backgroundColor = 'transparent'
              }}
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

  const arrowBtn: React.CSSProperties = {
    width: '100%', height: '26px',
    backgroundColor: 'transparent',
    border: '1px solid #EBEBEB',
    borderRadius: '7px',
    cursor: 'pointer',
    color: '#BBBBBB',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.1s',
    flexShrink: 0,
  }

  function Seg({ label, value: val, onUp, onDown }: {
    label: string; value: number; onUp: () => void; onDown: () => void
  }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', flex: 1 }}>
        <button
          style={arrowBtn}
          onClick={onUp}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; e.currentTarget.style.color = '#333333'; e.currentTarget.style.borderColor = '#D5D5D5' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#BBBBBB'; e.currentTarget.style.borderColor = '#EBEBEB' }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>

        <div style={{
          width: '100%', padding: '10px 0',
          backgroundColor: '#F8F8F8',
          border: '1px solid #EBEBEB',
          borderRadius: '10px',
          textAlign: 'center',
          fontSize: '26px',
          fontWeight: '600',
          color: '#111111',
          letterSpacing: '-0.02em',
          lineHeight: '1',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {pad(val)}
        </div>

        <button
          style={arrowBtn}
          onClick={onDown}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; e.currentTarget.style.color = '#333333'; e.currentTarget.style.borderColor = '#D5D5D5' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#BBBBBB'; e.currentTarget.style.borderColor = '#EBEBEB' }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <span style={{ fontSize: '11px', fontWeight: '500', color: '#CCCCCC', letterSpacing: '0.04em' }}>
          {label}
        </span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Seg label="시" value={h} onUp={() => changeH(1)} onDown={() => changeH(-1)} />
      <div style={{ fontSize: '22px', fontWeight: '300', color: '#CCCCCC', paddingBottom: '24px', flexShrink: 0 }}>:</div>
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
      <DialogContent
        className="p-0 overflow-hidden gap-0"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #EBEBEB',
          borderRadius: '18px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          maxWidth: '400px',
        }}
      >
        {/* 헤더 */}
        <DialogHeader style={{ padding: '22px 24px 16px', borderBottom: '1px solid #F2F2F2' }}>
          <DialogTitle style={{ fontSize: '15px', fontWeight: '700', color: '#111111', letterSpacing: '-0.02em' }}>
            발행 설정
          </DialogTitle>
          <DialogDescription style={{ fontSize: '13px', color: '#AAAAAA', marginTop: '3px' }}>
            즉시 발행하거나 예약 발행 시간을 설정해요.
          </DialogDescription>
        </DialogHeader>

        {/* 모드 탭 */}
        <div style={{
          display: 'flex',
          padding: '0 24px',
          borderBottom: '1px solid #EBEBEB',
        }}>
          {([
            { value: 'immediate', label: '즉시 발행' },
            { value: 'scheduled', label: '예약 발행' },
          ] as const).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setMode(tab.value)}
              style={{
                padding: '12px 14px 11px',
                fontSize: '13px',
                fontWeight: mode === tab.value ? '600' : '500',
                color: mode === tab.value ? '#111111' : '#AAAAAA',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: mode === tab.value ? '2px solid #111111' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.12s',
                marginBottom: '-1px',
                fontFamily: 'inherit',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 본문 */}
        <div style={{ padding: '20px 24px' }}>
          {mode === 'immediate' ? (
            <div style={{
              padding: '14px 16px',
              backgroundColor: '#F8F8F8',
              borderRadius: '12px',
              border: '1px solid #EBEBEB',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '7px',
                  backgroundColor: '#111111',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '1px',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#111111', marginBottom: '3px' }}>
                    지금 바로 발행돼요
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#888888', lineHeight: '1.5' }}>
                    발행 즉시 독자에게 공개돼요.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '20px' }}>
              {/* 날짜 선택 */}
              <div style={{
                padding: '16px',
                backgroundColor: '#FAFAFA',
                border: '1px solid #EBEBEB',
                borderRadius: '12px',
                marginBottom: '12px',
              }}>
                <MiniCalendar selected={selectedDate} onSelect={setSelectedDate} />
              </div>

              {/* 시간 선택 */}
              <div style={{
                padding: '16px',
                backgroundColor: '#FAFAFA',
                border: '1px solid #EBEBEB',
                borderRadius: '12px',
              }}>
                <div style={{
                  fontSize: '11px', fontWeight: '600', color: '#BBBBBB',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  marginBottom: '14px',
                }}>
                  발행 시각
                </div>
                <TimePicker value={time} onChange={setTime} />
              </div>

              {/* 예약 미리보기 */}
              {scheduledPreview && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  marginTop: '10px', padding: '9px 14px',
                  backgroundColor: '#111111', borderRadius: '9px',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.01em' }}>
                    {scheduledPreview}에 발행돼요
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 하단 버튼 */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              style={{
                flex: 1, padding: '10px',
                fontSize: '13px', fontWeight: '600',
                color: '#666666', backgroundColor: 'transparent',
                border: '1px solid #E5E5E5', borderRadius: '9px',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              취소
            </button>
            <button
              onClick={handlePublish}
              disabled={isDisabled}
              style={{
                flex: 1, padding: '10px',
                fontSize: '13px', fontWeight: '700',
                color: '#FFFFFF',
                background: isDisabled
                  ? '#CCCCCC'
                  : 'linear-gradient(135deg, #1A1A1A 0%, #2E2E2E 100%)',
                border: 'none', borderRadius: '9px',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                boxShadow: isDisabled ? 'none' : '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.1s',
              }}
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
