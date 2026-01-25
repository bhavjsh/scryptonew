import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SkillCard } from '@/components/skills/SkillCard';
import { SkillSwapNavbar } from '@/components/layout/SkillSwapNavbar';
import { useWeb3 } from '@/contexts/Web3Context';
import { 
  getAllOffers, 
  acceptSkillOffer, 
  markWorkCompleted, 
  confirmCompletion,
  SkillOffer, 
  OfferStatus 
} from '@/lib/contract';

export function Marketplace() {
  const { signer, provider, isConnected } = useWeb3();
  const [offers, setOffers] = useState<SkillOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<SkillOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch offers
  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      // Use provider if available, otherwise mock data will be returned
      const fetchedOffers = await getAllOffers(provider as any);
      setOffers(fetchedOffers);
      setFilteredOffers(fetchedOffers);
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast.error('Failed to fetch offers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [provider]);

  // Filter offers based on search and status
  useEffect(() => {
    let filtered = offers;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (offer) =>
          offer.title.toLowerCase().includes(query) ||
          offer.description.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      const statusMap: Record<string, OfferStatus> = {
        open: OfferStatus.Open,
        'in-progress': OfferStatus.InProgress,
        completed: OfferStatus.Completed,
        paid: OfferStatus.Paid,
      };
      filtered = filtered.filter((offer) => offer.status === statusMap[statusFilter]);
    }

    setFilteredOffers(filtered);
  }, [offers, searchQuery, statusFilter]);

  // Handle accept offer
  const handleAccept = async (offer: SkillOffer) => {
    if (!signer) {
      toast.error('Please connect your wallet');
      return;
    }

    const toastId = toast.loading('Waiting for MetaMask confirmation...');
    
    try {
      const tx = await acceptSkillOffer(signer, offer.id, offer.price);
      toast.loading('Transaction submitted. Waiting for confirmation...', { id: toastId });
      
      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        toast.success('Skill accepted successfully!', {
          id: toastId,
          description: `TX: ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
          action: {
            label: 'View',
            onClick: () => window.open(`https://testnet.monadexplorer.com/tx/${tx.hash}`, '_blank'),
          },
        });
      } else {
        toast.error('Transaction failed', { id: toastId });
      }
      
      fetchOffers();
    } catch (error: any) {
      if (error.code === 4001) {
        toast.error('Transaction rejected by user', { id: toastId });
      } else {
        toast.error(error.message || 'Transaction failed', { id: toastId });
      }
    }
  };

  // Handle mark completed
  const handleMarkCompleted = async (offer: SkillOffer) => {
    if (!signer) {
      toast.error('Please connect your wallet');
      return;
    }

    const toastId = toast.loading('Waiting for MetaMask confirmation...');
    
    try {
      const tx = await markWorkCompleted(signer, offer.id);
      toast.loading('Transaction submitted. Waiting for confirmation...', { id: toastId });
      
      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        toast.success('Marked as completed!', {
          id: toastId,
          description: `TX: ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
          action: {
            label: 'View',
            onClick: () => window.open(`https://testnet.monadexplorer.com/tx/${tx.hash}`, '_blank'),
          },
        });
      } else {
        toast.error('Transaction failed', { id: toastId });
      }
      
      fetchOffers();
    } catch (error: any) {
      if (error.code === 4001) {
        toast.error('Transaction rejected by user', { id: toastId });
      } else {
        toast.error(error.message || 'Transaction failed', { id: toastId });
      }
    }
  };

  // Handle confirm completion
  const handleConfirmCompletion = async (offer: SkillOffer) => {
    if (!signer) {
      toast.error('Please connect your wallet');
      return;
    }

    const toastId = toast.loading('Waiting for MetaMask confirmation...');
    
    try {
      const tx = await confirmCompletion(signer, offer.id);
      toast.loading('Transaction submitted. Waiting for confirmation...', { id: toastId });
      
      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        toast.success('Payment released successfully!', {
          id: toastId,
          description: `TX: ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
          action: {
            label: 'View',
            onClick: () => window.open(`https://testnet.monadexplorer.com/tx/${tx.hash}`, '_blank'),
          },
        });
      } else {
        toast.error('Transaction failed', { id: toastId });
      }
      
      fetchOffers();
    } catch (error: any) {
      if (error.code === 4001) {
        toast.error('Transaction rejected by user', { id: toastId });
      } else {
        toast.error(error.message || 'Transaction failed', { id: toastId });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SkillSwapNavbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Skills <span className="gradient-text">Marketplace</span>
            </h1>
            <p className="text-muted-foreground">
              Browse available skill offers or filter by status
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button variant="outline" size="icon" onClick={fetchOffers}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </motion.div>

          {/* Offers Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-xl bg-muted/50 animate-pulse"
                />
              ))}
            </div>
          ) : filteredOffers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No offers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SkillCard
                    offer={offer}
                    onAccept={handleAccept}
                    onMarkCompleted={handleMarkCompleted}
                    onConfirmCompletion={handleConfirmCompletion}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty state when no offers */}
          {!isLoading && offers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 p-8 rounded-lg bg-muted/30 border border-border/50 text-center"
            >
              <p className="text-muted-foreground">
                No skill offers available yet. Be the first to create one!
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Marketplace;
