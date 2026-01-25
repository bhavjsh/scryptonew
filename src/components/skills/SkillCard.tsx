import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight, Check, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { SkillOffer, OfferStatus } from '@/lib/contract';
import { useWeb3 } from '@/contexts/Web3Context';

interface SkillCardProps {
  offer: SkillOffer;
  onAccept?: (offer: SkillOffer) => Promise<void>;
  onMarkCompleted?: (offer: SkillOffer) => Promise<void>;
  onConfirmCompletion?: (offer: SkillOffer) => Promise<void>;
}

export function SkillCard({ offer, onAccept, onMarkCompleted, onConfirmCompletion }: SkillCardProps) {
  const { account, formatAddress, isConnected, isCorrectNetwork } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  
  const isProvider = account?.toLowerCase() === offer.provider.toLowerCase();
  const isBuyer = account?.toLowerCase() === offer.buyer.toLowerCase();
  const isZeroAddress = offer.buyer === '0x0000000000000000000000000000000000000000';

  const canAccept = isConnected && isCorrectNetwork && !isProvider && isZeroAddress && offer.status === OfferStatus.Open;
  const canMarkComplete = isConnected && isCorrectNetwork && isProvider && offer.status === OfferStatus.InProgress;
  const canConfirm = isConnected && isCorrectNetwork && isBuyer && offer.status === OfferStatus.Completed;

  const handleAction = async (action: ((offer: SkillOffer) => Promise<void>) | undefined) => {
    if (!action) return;
    setIsLoading(true);
    try {
      await action(offer);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col card-glow bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2">
              {offer.title}
            </h3>
            <StatusBadge status={offer.status} />
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 space-y-4">
          <p className="text-muted-foreground text-sm line-clamp-3">
            {offer.description}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{formatAddress(offer.provider)}</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold gradient-text">{offer.price}</span>
              <span className="text-muted-foreground text-sm ml-1">MON</span>
            </div>
          </div>

          {!isZeroAddress && offer.status !== OfferStatus.Open && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
              <span className="text-xs">Buyer:</span>
              <span>{formatAddress(offer.buyer)}</span>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-4 border-t border-border/50">
          {canAccept && (
            <Button 
              className="w-full gap-2" 
              onClick={() => handleAction(onAccept)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  Accept Skill
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
          
          {canMarkComplete && (
            <Button 
              className="w-full gap-2" 
              variant="secondary"
              onClick={() => handleAction(onMarkCompleted)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  Mark Completed
                  <Check className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
          
          {canConfirm && (
            <Button 
              className="w-full gap-2" 
              onClick={() => handleAction(onConfirmCompletion)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  Release Payment
                  <CheckCheck className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
          
          {!canAccept && !canMarkComplete && !canConfirm && (
            <div className="w-full text-center text-sm text-muted-foreground">
              {!isConnected ? 'Connect wallet to interact' : 
               !isCorrectNetwork ? 'Switch to Monad Testnet' :
               offer.status === OfferStatus.Paid ? 'Transaction complete' :
               'No actions available'}
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
