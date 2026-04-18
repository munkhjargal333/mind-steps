'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import { Button } from '@/shared/ui'

interface DailyLimitModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade?: () => void  // байхгүй бол router.push('/upgrade') ашиглана
  userTier: 'free' | 'demo' | 'pro'
  usageCount: number
  limit: number
}

export function DailyLimitModal({
  isOpen,
  onClose,
  onUpgrade,
  userTier,
  usageCount,
  limit,
}: DailyLimitModalProps) {
  const isDemo = userTier === 'demo'

  const handleUpgrade = () => {
    onClose()
    if (onUpgrade) {
      onUpgrade()
    } else {
      // fallback — onUpgrade prop дамжаагүй үед
      window.location.href = '/upgrade'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isDemo ? 'Демо хязгаар дууссан' : 'Өдрийн хязгаар дууссан'}
          </DialogTitle>
          <DialogDescription className="pt-2">
            {isDemo
              ? `Таны демо ашиглалт дууссан. Өнөөдөр та ${usageCount}/${limit} удаа ашигласан.`
              : `Таны өдрийн үнэгүй хязгаар дууссан. Өнөөдөр та ${usageCount}/${limit} удаа ашигласан.`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {isDemo
              ? 'Демо хугацаа дууссан. Pro төлөвлөгөө рүү шилжиж бүх боломжийг ашиглаарай.'
              : 'Pro төлөвлөгөө рүү шилжиж хязгааргүй ашиглах боломжтой.'}
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Дараа оролдох
          </Button>
          <Button onClick={handleUpgrade} className="flex-1 bg-violet-500 hover:bg-violet-600">
            Pro болох
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}