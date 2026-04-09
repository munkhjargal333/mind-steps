import { ChevronRight, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import s from '@/components/molecules/ActionCard.module.css';

interface Props {
  label: string;
  sub: string;
  icon: LucideIcon;
  /** Tailwind text-colour token class, e.g. "text-action-stress" */
  colorClass: string;
  /** Tailwind bg token class for icon, e.g. "bg-action-stress/15" */
  iconBgClass: string;
  /** Tailwind bg token class for card, e.g. "bg-action-stress/8" */
  cardBgClass: string;
  locked?: boolean;
  onClick?: () => void;
}

export function ActionCard({
  label, sub, icon: Icon,
  colorClass, iconBgClass, cardBgClass,
  locked = false,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={locked ? undefined : onClick}
      className={[s.card, locked ? s.locked : '', cardBgClass].join(' ')}
    >
      <span className={[s.iconWrap, iconBgClass, colorClass].join(' ')}>
        <Icon size={18} />
      </span>

      <span className={s.body}>
        <span className={s.label} style={{ color: locked ? undefined : undefined }} data-color={locked ? undefined : colorClass}>
          {!locked && <span className={colorClass}>{label}</span>}
          {locked && label}
        </span>
        <span className={s.sub}>{sub}</span>
      </span>

      {locked
        ? <Lock size={13} className={s.arrow} />
        : <ChevronRight size={14} className={s.arrow} />}
    </button>
  );
}
