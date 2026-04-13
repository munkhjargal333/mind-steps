import { QuickActionButton } from '@/features/journal'
import type { ActionConfig } from '@/core/api/types'

interface Props {
  actions: ActionConfig[]
  onSelect?: (type: any) => void
  disabled?: boolean
}

export function ActionGrid({ actions, onSelect, disabled }: Props) {
  return (
    <div className="grid grid-cols-2 gap-5 md:gap-6 w-full max-w-2xl mx-auto p-4">
      {actions.map((action) => (
        <QuickActionButton
          key={action.type}
          action={action}
          onSelect={onSelect ?? (() => {})} // 🛡 хамгаалалт
          disabled={disabled}
          variant="compact"
        />
      ))}
    </div>
  )
}


