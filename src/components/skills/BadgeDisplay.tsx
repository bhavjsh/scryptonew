import { UserBadge, BADGE_INFO } from '@/types/scrypto';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BadgeDisplayProps {
  badges: UserBadge[];
  size?: 'sm' | 'md' | 'lg';
  showAll?: boolean;
}

export function BadgeDisplay({ badges, size = 'md', showAll = false }: BadgeDisplayProps) {
  const displayBadges = showAll ? badges : badges.slice(0, 3);
  const remaining = badges.length - displayBadges.length;

  const sizeClasses = {
    sm: 'text-lg p-1',
    md: 'text-xl p-1.5',
    lg: 'text-2xl p-2',
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {displayBadges.map((badge, index) => {
          const info = BADGE_INFO[badge.badge_type];
          return (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  className={cn(
                    'rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 cursor-help',
                    sizeClasses[size]
                  )}
                >
                  {info?.icon || '🏅'}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="text-center">
                  <p className="font-semibold">{badge.badge_name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                  <p className="text-xs text-primary mt-1">
                    Earned {new Date(badge.earned_at).toLocaleDateString()}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
        {remaining > 0 && (
          <Badge variant="outline" className="text-xs">
            +{remaining}
          </Badge>
        )}
      </div>
    </TooltipProvider>
  );
}
