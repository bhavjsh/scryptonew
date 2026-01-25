import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface InfoBadgeProps {
  className?: string;
  text?: string;
}

/**
 * InfoBadge Component
 * 
 * Displays contextual information about platform features.
 */
export function InfoBadge({ className, text = "Stake-Protected" }: InfoBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
      "bg-primary/10 border border-primary/30 text-primary",
      "text-xs font-medium",
      className
    )}>
      <Info className="h-3 w-3" />
      <span>{text}</span>
    </div>
  );
}

// Export with original name for backward compatibility
export { InfoBadge as DemoBadge };