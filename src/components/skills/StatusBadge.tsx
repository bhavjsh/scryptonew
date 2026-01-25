import { motion } from 'framer-motion';
import { OfferStatus } from '@/lib/contract';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: OfferStatus;
  className?: string;
  animated?: boolean;
}

const statusConfig: Record<OfferStatus, { label: string; className: string }> = {
  [OfferStatus.Open]: {
    label: 'Created',
    className: 'status-created',
  },
  [OfferStatus.InProgress]: {
    label: 'Accepted',
    className: 'status-accepted',
  },
  [OfferStatus.Completed]: {
    label: 'Completed',
    className: 'status-completed',
  },
  [OfferStatus.Paid]: {
    label: 'Paid',
    className: 'status-paid',
  },
};

export function StatusBadge({ status, className, animated = true }: StatusBadgeProps) {
  const config = statusConfig[status];

  const badge = (
    <span
      className={cn(
        'status-badge',
        config.className,
        className
      )}
    >
      <span className="relative flex h-2 w-2 mr-2">
        <span className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          status === OfferStatus.Open && "bg-cyan-400",
          status === OfferStatus.InProgress && "bg-purple-400",
          status === OfferStatus.Completed && "bg-blue-400",
          status === OfferStatus.Paid && "bg-green-400",
        )} />
        <span className={cn(
          "relative inline-flex rounded-full h-2 w-2",
          status === OfferStatus.Open && "bg-cyan-400",
          status === OfferStatus.InProgress && "bg-purple-400",
          status === OfferStatus.Completed && "bg-blue-400",
          status === OfferStatus.Paid && "bg-green-400",
        )} />
      </span>
      {config.label}
    </span>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
      >
        {badge}
      </motion.div>
    );
  }

  return badge;
}
