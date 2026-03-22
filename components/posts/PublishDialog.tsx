'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { publishPost } from '@/lib/actions/posts'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

interface PublishDialogProps {
  postId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

type PublishMode = 'immediate' | 'scheduled'

export function PublishDialog({
  postId,
  open,
  onOpenChange,
  onSuccess,
}: PublishDialogProps) {
  const router = useRouter()
  const [mode, setMode] = useState<PublishMode>('immediate')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState('09:00')
  const [isLoading, setIsLoading] = useState(false)

  const handlePublish = async () => {
    setIsLoading(true)
    try {
      let scheduledDate: Date | undefined = undefined

      if (mode === 'scheduled') {
        if (!selectedDate) {
          toast.error('날짜를 선택해주세요')
          setIsLoading(false)
          return
        }
        const [hours, minutes] = time.split(':').map(Number)
        scheduledDate = new Date(selectedDate)
        scheduledDate.setHours(hours, minutes, 0, 0)

        if (scheduledDate <= new Date()) {
          toast.error('예약 시간은 현재 시간 이후여야 합니다')
          setIsLoading(false)
          return
        }
      }

      const { error } = await publishPost(postId, scheduledDate)

      if (error) {
        toast.error(error)
        return
      }

      toast.success(mode === 'scheduled' ? '발행이 예약되었습니다' : '발행되었습니다')
      onSuccess?.()
      onOpenChange(false)
      router.refresh()
    } catch {
      toast.error('오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border-[#262626] text-white p-0 overflow-hidden max-w-sm">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-white text-base font-semibold">
            발행 설정
          </DialogTitle>
          <DialogDescription className="text-[#888] text-sm">
            즉시 발행하거나 예약 발행 시간을 설정하세요.
          </DialogDescription>
        </DialogHeader>

        {/* Mode tabs */}
        <div className="flex border-b border-[#262626] px-6">
          <button
            onClick={() => setMode('immediate')}
            className={`pb-3 pr-6 text-sm font-medium transition-colors border-b-2 ${
              mode === 'immediate'
                ? 'text-[#E8D5B0] border-[#E8D5B0]'
                : 'text-[#666] border-transparent hover:text-[#999]'
            }`}
          >
            즉시 발행
          </button>
          <button
            onClick={() => setMode('scheduled')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              mode === 'scheduled'
                ? 'text-[#E8D5B0] border-[#E8D5B0]'
                : 'text-[#666] border-transparent hover:text-[#999]'
            }`}
          >
            예약 발행
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {mode === 'immediate' ? (
            <p className="text-[#888] text-sm">
              지금 즉시 글이 발행됩니다. 발행 후 독자에게 공개됩니다.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-[#888] text-sm mb-3">날짜 선택</p>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    classNames={{
                      root: 'bg-[#0F0F0F] rounded-lg p-2',
                      month_caption: 'text-white',
                      caption_label: 'text-white text-sm font-medium',
                      weekday: 'text-[#555]',
                      day: 'text-[#aaa]',
                      today: 'text-[#E8D5B0] bg-[#1a1a1a]',
                      outside: 'text-[#3a3a3a]',
                      disabled: 'text-[#333] opacity-50',
                    }}
                  />
                </div>
                {selectedDate && (
                  <p className="text-[#E8D5B0] text-xs mt-2 text-center">
                    {format(selectedDate, 'yyyy년 MM월 dd일')}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[#888] text-sm block mb-2">
                  시간 (HH:MM)
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-[#333] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#555] [color-scheme:dark]"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1 text-[#666] hover:text-[#999] hover:bg-[#1a1a1a] border border-[#262626]"
            >
              취소
            </Button>

            {mode === 'immediate' ? (
              <Button
                onClick={handlePublish}
                disabled={isLoading}
                className="flex-1 bg-[#E8D5B0] text-[#0F0F0F] hover:bg-[#D4BC8A] font-medium"
              >
                {isLoading ? '발행 중...' : '즉시 발행'}
              </Button>
            ) : (
              <Button
                onClick={handlePublish}
                disabled={isLoading || !selectedDate}
                className="flex-1 bg-transparent border border-[#E8D5B0] text-[#E8D5B0] hover:bg-[#E8D5B0]/10 font-medium disabled:border-[#444] disabled:text-[#444]"
              >
                {isLoading ? '예약 중...' : '예약 발행'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
